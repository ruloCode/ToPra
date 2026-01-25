'use client';

import { useRef, useEffect } from 'react';
import { Mic, MicOff, Square, Pause, Play, X, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDuration, MAX_RECORDING_DURATION } from '@/types/voiceMemo';
import { RecordingState } from '@/types/voiceMemo';

interface VoiceMemoRecorderProps {
  recording: RecordingState;
  isSupported: boolean;
  isTranscribing: boolean;
  transcriptionProgress: string;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function VoiceMemoRecorder({
  recording,
  isSupported,
  isTranscribing,
  transcriptionProgress,
  onStart,
  onStop,
  onPause,
  onResume,
  onCancel,
  onSave,
}: VoiceMemoRecorderProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressPercent = (recording.duration / MAX_RECORDING_DURATION) * 100;

  // Play preview when stopped
  useEffect(() => {
    if (recording.status === 'stopped' && recording.audioUrl && audioRef.current) {
      audioRef.current.src = recording.audioUrl;
    }
  }, [recording.status, recording.audioUrl]);

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm">
        <MicOff className="h-4 w-4" />
        <span>Tu navegador no soporta grabación de audio</span>
      </div>
    );
  }

  // Idle state - show record button
  if (recording.status === 'idle') {
    return (
      <button
        type="button"
        onClick={onStart}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all',
          'bg-accent hover:bg-accent/90 text-accent-foreground',
          'shadow-sm hover:shadow-md'
        )}
      >
        <Mic className="h-4 w-4" />
        <span className="font-medium">Grabar nota de voz</span>
      </button>
    );
  }

  // Recording or paused state
  if (recording.status === 'recording' || recording.status === 'paused') {
    return (
      <div className="space-y-3 p-4 bg-secondary/50 rounded-lg border border-border">
        {/* Recording indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'h-3 w-3 rounded-full',
                recording.status === 'recording'
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-yellow-500'
              )}
            />
            <span className="text-sm font-medium text-foreground">
              {recording.status === 'recording' ? 'Grabando...' : 'Pausado'}
            </span>
          </div>

          <div className="text-lg font-mono text-foreground">
            {formatDuration(recording.duration)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-accent transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0:00</span>
          <span>Máx {formatDuration(MAX_RECORDING_DURATION)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {/* Cancel */}
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
            title="Cancelar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Pause/Resume */}
          <button
            type="button"
            onClick={recording.status === 'recording' ? onPause : onResume}
            className="p-3 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
            title={recording.status === 'recording' ? 'Pausar' : 'Continuar'}
          >
            {recording.status === 'recording' ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>

          {/* Stop */}
          <button
            type="button"
            onClick={onStop}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            title="Detener"
          >
            <Square className="h-5 w-5 fill-current" />
          </button>
        </div>
      </div>
    );
  }

  // Stopped state - preview and save
  if (recording.status === 'stopped') {
    return (
      <div className="space-y-4 p-4 bg-secondary/50 rounded-lg border border-border">
        {/* Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Vista previa</span>
            <span className="text-sm text-muted-foreground">
              {formatDuration(recording.duration)}
            </span>
          </div>

          <audio
            ref={audioRef}
            controls
            className="w-full h-10"
            style={{
              backgroundColor: 'var(--secondary)',
              borderRadius: '0.5rem',
            }}
          />
        </div>

        {/* Transcription progress */}
        {isTranscribing && (
          <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
            <span className="text-sm text-accent">{transcriptionProgress}</span>
          </div>
        )}

        {/* Actions */}
        {!isTranscribing && (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
            >
              Descartar
            </button>

            <button
              type="button"
              onClick={onSave}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors',
                'bg-accent hover:bg-accent/90 text-accent-foreground'
              )}
            >
              <Save className="h-4 w-4" />
              Guardar y transcribir
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
