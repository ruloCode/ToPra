'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  VoiceMemo,
  RecordingState,
  MAX_RECORDING_DURATION,
  formatDuration,
} from '@/types/voiceMemo';
import {
  getVoiceMemosByTaskId,
  uploadVoiceMemo,
  deleteVoiceMemo as deleteVoiceMemoApi,
  getVoiceMemoUrl,
  updateVoiceMemoTranscription,
} from '@/lib/voiceMemos';
import { useToast } from '@/components/ui/use-toast';

interface UseVoiceMemoReturn {
  // Recording state
  recording: RecordingState;
  isSupported: boolean;

  // Recording controls
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  cancelRecording: () => void;

  // Voice memos list
  voiceMemos: VoiceMemo[];
  isLoading: boolean;

  // Actions
  saveAndTranscribe: () => Promise<VoiceMemo | null>;
  deleteMemo: (id: string) => Promise<void>;
  playMemo: (memo: VoiceMemo) => Promise<void>;
  refresh: () => Promise<void>;

  // Transcription
  isTranscribing: boolean;
  transcriptionProgress: string;
}

export function useVoiceMemo(
  taskId: string,
  userId: string | undefined
): UseVoiceMemoReturn {
  const { toast } = useToast();

  // Recording state
  const [recording, setRecording] = useState<RecordingState>({
    status: 'idle',
    duration: 0,
    audioBlob: null,
    audioUrl: null,
    error: null,
  });
  const [isSupported, setIsSupported] = useState(true);

  // Voice memos list
  const [voiceMemos, setVoiceMemos] = useState<VoiceMemo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Transcription
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState('');

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check browser support
  useEffect(() => {
    const checkSupport = () => {
      if (typeof window === 'undefined') return;

      const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const hasMediaRecorder = typeof MediaRecorder !== 'undefined';

      setIsSupported(hasMediaDevices && hasMediaRecorder);
    };

    checkSupport();
  }, []);

  // Fetch voice memos
  const fetchVoiceMemos = useCallback(async () => {
    if (!taskId) return;

    setIsLoading(true);
    try {
      const data = await getVoiceMemosByTaskId(taskId);
      setVoiceMemos(data);
    } catch (err) {
      console.error('Error fetching voice memos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchVoiceMemos();
  }, [fetchVoiceMemos]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recording.audioUrl) {
        URL.revokeObjectURL(recording.audioUrl);
      }
    };
  }, [recording.audioUrl]);

  // Start recording
  const startRecording = useCallback(async () => {
    if (!isSupported) {
      toast({
        title: 'No soportado',
        description: 'Tu navegador no soporta grabación de audio',
        variant: 'destructive',
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      // Determine best format
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);

        setRecording(prev => ({
          ...prev,
          status: 'stopped',
          audioBlob,
          audioUrl,
        }));

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second

      // Start timer
      let duration = 0;
      timerRef.current = setInterval(() => {
        duration += 1;
        setRecording(prev => ({ ...prev, duration }));

        // Auto-stop at max duration
        if (duration >= MAX_RECORDING_DURATION) {
          stopRecording();
          toast({
            title: 'Límite alcanzado',
            description: `Grabación detenida al alcanzar ${formatDuration(MAX_RECORDING_DURATION)}`,
          });
        }
      }, 1000);

      setRecording({
        status: 'recording',
        duration: 0,
        audioBlob: null,
        audioUrl: null,
        error: null,
      });

    } catch (err) {
      console.error('Error starting recording:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar grabación';

      setRecording(prev => ({
        ...prev,
        status: 'idle',
        error: errorMessage,
      }));

      toast({
        title: 'Error',
        description: 'No se pudo acceder al micrófono. Verifica los permisos.',
        variant: 'destructive',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported, toast]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      setRecording(prev => ({ ...prev, status: 'paused' }));
    }
  }, []);

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();

      timerRef.current = setInterval(() => {
        setRecording(prev => {
          const newDuration = prev.duration + 1;
          if (newDuration >= MAX_RECORDING_DURATION) {
            stopRecording();
          }
          return { ...prev, duration: newDuration };
        });
      }, 1000);

      setRecording(prev => ({ ...prev, status: 'recording' }));
    }
  }, [stopRecording]);

  // Cancel recording
  const cancelRecording = useCallback(() => {
    stopRecording();

    if (recording.audioUrl) {
      URL.revokeObjectURL(recording.audioUrl);
    }

    setRecording({
      status: 'idle',
      duration: 0,
      audioBlob: null,
      audioUrl: null,
      error: null,
    });
  }, [stopRecording, recording.audioUrl]);

  // Save and transcribe
  const saveAndTranscribe = useCallback(async (): Promise<VoiceMemo | null> => {
    if (!recording.audioBlob || !userId) {
      toast({
        title: 'Error',
        description: 'No hay audio para guardar',
        variant: 'destructive',
      });
      return null;
    }

    setIsTranscribing(true);
    setTranscriptionProgress('Subiendo audio...');

    try {
      // Upload voice memo
      const memo = await uploadVoiceMemo({
        user_id: userId,
        task_id: taskId,
        audioBlob: recording.audioBlob,
        duration_seconds: recording.duration,
        language: 'es',
      });

      // Add to list immediately
      setVoiceMemos(prev => [memo, ...prev]);

      // Reset recording state
      if (recording.audioUrl) {
        URL.revokeObjectURL(recording.audioUrl);
      }
      setRecording({
        status: 'idle',
        duration: 0,
        audioBlob: null,
        audioUrl: null,
        error: null,
      });

      toast({
        title: 'Audio guardado',
        description: 'Transcribiendo...',
      });

      // Transcribe
      setTranscriptionProgress('Transcribiendo audio...');

      const formData = new FormData();
      formData.append('audio', recording.audioBlob, 'recording.webm');
      formData.append('memoId', memo.id);
      formData.append('language', 'es');

      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error en la transcripción');
      }

      const result = await response.json();

      // Update memo with transcription
      const updatedMemo = await updateVoiceMemoTranscription(
        memo.id,
        result.transcription,
        result.summary
      );

      // Update in list
      setVoiceMemos(prev =>
        prev.map(m => (m.id === memo.id ? updatedMemo : m))
      );

      toast({
        title: 'Transcripción completada',
        description: 'Tu nota de voz ha sido transcrita',
      });

      return updatedMemo;

    } catch (err) {
      console.error('Error saving/transcribing:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      return null;
    } finally {
      setIsTranscribing(false);
      setTranscriptionProgress('');
    }
  }, [recording, userId, taskId, toast]);

  // Delete memo
  const deleteMemo = useCallback(async (id: string) => {
    try {
      await deleteVoiceMemoApi(id);
      setVoiceMemos(prev => prev.filter(m => m.id !== id));

      toast({
        title: 'Nota eliminada',
        description: 'La nota de voz ha sido eliminada',
      });
    } catch (err) {
      console.error('Error deleting memo:', err);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la nota de voz',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Play memo
  const playMemo = useCallback(async (memo: VoiceMemo) => {
    try {
      const url = await getVoiceMemoUrl(memo.storage_path);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error('Error playing memo:', err);
      toast({
        title: 'Error',
        description: 'No se pudo reproducir el audio',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return {
    recording,
    isSupported,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    voiceMemos,
    isLoading,
    saveAndTranscribe,
    deleteMemo,
    playMemo,
    refresh: fetchVoiceMemos,
    isTranscribing,
    transcriptionProgress,
  };
}
