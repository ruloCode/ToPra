export interface VoiceMemo {
  id: string;
  user_id: string;
  task_id: string | null;
  file_name: string;
  file_size: number;
  duration_seconds: number;
  mime_type: string;
  storage_path: string;
  transcription: string | null;
  transcription_summary: string | null;
  transcription_status: TranscriptionStatus;
  transcription_error: string | null;
  language: string;
  created_at: string;
  updated_at: string;
}

export type TranscriptionStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface CreateVoiceMemoInput {
  user_id: string;
  task_id?: string;
  audioBlob: Blob;
  duration_seconds: number;
  language?: string;
}

export interface TranscriptionResult {
  transcription: string;
  summary: string;
  language: string;
}

// Recording state management
export interface RecordingState {
  status: 'idle' | 'recording' | 'paused' | 'stopped';
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
}

// Voice memo limits
export const MAX_RECORDING_DURATION = 300; // 5 minutes
export const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25MB
export const SUPPORTED_AUDIO_TYPES = ['audio/webm', 'audio/mp4', 'audio/wav', 'audio/mpeg'] as const;

// Helper to format duration
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Helper to format file size
export function formatAudioSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
