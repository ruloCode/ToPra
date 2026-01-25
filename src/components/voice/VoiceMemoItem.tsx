'use client';

import { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Trash2,
  ChevronDown,
  ChevronRight,
  FileAudio,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceMemo, formatDuration, formatAudioSize } from '@/types/voiceMemo';
import { getVoiceMemoUrl } from '@/lib/voiceMemos';

interface VoiceMemoItemProps {
  memo: VoiceMemo;
  onDelete: (id: string) => void;
}

export function VoiceMemoItem({ memo, onDelete }: VoiceMemoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoading(true);

      // Get signed URL if not already loaded
      if (!audioRef.current.src) {
        const url = await getVoiceMemoUrl(memo.storage_path);
        audioRef.current.src = url;
      }

      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Error playing audio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleDelete = () => {
    if (confirm('¿Eliminar esta nota de voz?')) {
      onDelete(memo.id);
    }
  };

  const formattedDate = new Date(memo.created_at).toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const progress = (currentTime / memo.duration_seconds) * 100;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPause={() => setIsPlaying(false)}
      />

      {/* Main row */}
      <div className="flex items-center gap-3 p-3">
        {/* Play button */}
        <button
          type="button"
          onClick={handlePlay}
          disabled={isLoading}
          className={cn(
            'flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-colors',
            isPlaying
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary hover:bg-secondary/80 text-foreground'
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <FileAudio className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium text-foreground truncate">
              {memo.transcription_summary || 'Nota de voz'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span>{formatDuration(memo.duration_seconds)}</span>
            <span>·</span>
            <span>{formatAudioSize(memo.file_size)}</span>
            <span>·</span>
            <span>{formattedDate}</span>

            {/* Status indicator */}
            {memo.transcription_status === 'processing' && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1 text-accent">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Transcribiendo
                </span>
              </>
            )}
            {memo.transcription_status === 'failed' && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1 text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  Error
                </span>
              </>
            )}
          </div>

          {/* Progress bar when playing */}
          {(isPlaying || currentTime > 0) && (
            <div className="relative h-1 bg-muted rounded-full mt-2 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-accent transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {memo.transcription && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
              title="Ver transcripción"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded transcription */}
      {isExpanded && memo.transcription && (
        <div className="border-t border-border p-3 bg-secondary/30">
          <div className="space-y-2">
            {memo.transcription_summary && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Resumen
                </span>
                <p className="text-sm text-foreground mt-1">
                  {memo.transcription_summary}
                </p>
              </div>
            )}

            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Transcripción completa
              </span>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                {memo.transcription}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
