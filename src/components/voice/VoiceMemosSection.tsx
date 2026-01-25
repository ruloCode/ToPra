'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Mic, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceMemo, RecordingState } from '@/types/voiceMemo';
import { VoiceMemoRecorder } from './VoiceMemoRecorder';
import { VoiceMemoItem } from './VoiceMemoItem';

interface VoiceMemosSectionProps {
  // Recording
  recording: RecordingState;
  isSupported: boolean;
  isTranscribing: boolean;
  transcriptionProgress: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onCancelRecording: () => void;
  onSaveRecording: () => void;

  // Voice memos list
  voiceMemos: VoiceMemo[];
  isLoading: boolean;
  onDeleteMemo: (id: string) => void;
}

export function VoiceMemosSection({
  recording,
  isSupported,
  isTranscribing,
  transcriptionProgress,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onCancelRecording,
  onSaveRecording,
  voiceMemos,
  isLoading,
  onDeleteMemo,
}: VoiceMemosSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const memoCount = voiceMemos.length;
  const totalDuration = voiceMemos.reduce((acc, m) => acc + m.duration_seconds, 0);

  const formatTotalDuration = () => {
    if (totalDuration < 60) return `${Math.round(totalDuration)}s`;
    const mins = Math.floor(totalDuration / 60);
    const secs = Math.round(totalDuration % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="mt-6 border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-secondary/50 transition-colors',
          isExpanded && 'border-b border-border'
        )}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <Mic className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">Notas de voz</span>
          {memoCount > 0 && (
            <span className="text-sm text-muted-foreground">({memoCount})</span>
          )}
        </div>

        {memoCount > 0 && (
          <div className="text-xs text-muted-foreground">
            Duración total: {formatTotalDuration()}
          </div>
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 bg-card/50 space-y-4">
          {/* Recorder */}
          <VoiceMemoRecorder
            recording={recording}
            isSupported={isSupported}
            isTranscribing={isTranscribing}
            transcriptionProgress={transcriptionProgress}
            onStart={onStartRecording}
            onStop={onStopRecording}
            onPause={onPauseRecording}
            onResume={onResumeRecording}
            onCancel={onCancelRecording}
            onSave={onSaveRecording}
          />

          {/* Voice memos list */}
          {isLoading ? (
            <div className="py-4 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            </div>
          ) : voiceMemos.length > 0 ? (
            <div className="space-y-2">
              {voiceMemos.map((memo) => (
                <VoiceMemoItem
                  key={memo.id}
                  memo={memo}
                  onDelete={onDeleteMemo}
                />
              ))}
            </div>
          ) : recording.status === 'idle' ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay notas de voz. Graba una nota para capturar ideas rápidamente.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
