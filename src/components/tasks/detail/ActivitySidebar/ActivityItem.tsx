'use client';

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, CheckCircle2, XCircle, PlayCircle, Trash2 } from 'lucide-react';
import { TimelineItem } from './ActivityTimeline';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  item: TimelineItem;
  onDeleteComment: (id: string) => Promise<void>;
}

const sessionStatusConfig = {
  completed: {
    icon: CheckCircle2,
    label: 'Completada',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  interrupted: {
    icon: XCircle,
    label: 'Interrumpida',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  active: {
    icon: PlayCircle,
    label: 'Activa',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
} as const;

function formatDuration(minutes: number | null): string {
  if (!minutes) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function ActivityItem({ item, onDeleteComment }: ActivityItemProps) {
  if (item.type === 'focus_session') {
    const session = item.data;
    const status = session.status as keyof typeof sessionStatusConfig;
    const config = sessionStatusConfig[status] || sessionStatusConfig.completed;
    const IconComponent = config.icon;

    return (
      <div className="flex gap-3 p-3 rounded-lg bg-card border border-border">
        <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", config.bgColor)}>
          <Clock className={cn("h-4 w-4", config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground">
              Sesion de enfoque
            </span>
            <span className="text-xs text-muted-foreground">
              {format(parseISO(session.start_time), 'HH:mm', { locale: es })}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full", config.bgColor, config.color)}>
              <IconComponent className="h-3 w-3" />
              {config.label}
            </span>
            {session.duration && (
              <span className="text-xs text-muted-foreground">
                {formatDuration(session.duration)}
              </span>
            )}
          </div>
          {session.notes && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {session.notes}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Comment item
  const comment = item.data;

  return (
    <div className="group flex gap-3 p-3 rounded-lg bg-card border border-border hover:border-border/80 transition-colors">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
        <span className="text-sm font-medium text-accent">Tu</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-foreground">Comentario</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {format(parseISO(comment.created_at), 'HH:mm', { locale: es })}
            </span>
            <button
              type="button"
              onClick={() => onDeleteComment(comment.id)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
              title="Eliminar comentario"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <p className="text-sm text-foreground/80 mt-1 whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
