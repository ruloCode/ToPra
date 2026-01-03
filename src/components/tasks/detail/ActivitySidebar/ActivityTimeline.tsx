'use client';

import { useMemo } from 'react';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';
import { ActivityItem } from './ActivityItem';
import { Comment } from '@/types/comments';

type FocusSessionWithTask = {
  id: string;
  user_id: string;
  task_id: string | null;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  status: string;
  notes: string | null;
  rating: number | null;
  created_at?: string;
  updated_at?: string;
  task?: {
    id: string;
    title: string;
    description: string | null;
  } | null;
};

export type TimelineItem =
  | { type: 'focus_session'; data: FocusSessionWithTask; timestamp: string }
  | { type: 'comment'; data: Comment; timestamp: string };

interface ActivityTimelineProps {
  focusSessions: FocusSessionWithTask[];
  comments: Comment[];
  onDeleteComment: (id: string) => Promise<void>;
  isLoadingSessions: boolean;
  isLoadingComments: boolean;
}

function formatDateHeader(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Hoy';
  if (isYesterday(date)) return 'Ayer';
  return format(date, "d 'de' MMMM", { locale: es });
}

function groupByDate(items: TimelineItem[]): Map<string, TimelineItem[]> {
  const groups = new Map<string, TimelineItem[]>();

  items.forEach(item => {
    const dateKey = format(parseISO(item.timestamp), 'yyyy-MM-dd');
    const existing = groups.get(dateKey) || [];
    groups.set(dateKey, [...existing, item]);
  });

  return groups;
}

export function ActivityTimeline({
  focusSessions,
  comments,
  onDeleteComment,
  isLoadingSessions,
  isLoadingComments,
}: ActivityTimelineProps) {
  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [
      ...focusSessions.map(session => ({
        type: 'focus_session' as const,
        data: session,
        timestamp: session.start_time,
      })),
      ...comments.map(comment => ({
        type: 'comment' as const,
        data: comment,
        timestamp: comment.created_at,
      })),
    ];

    // Sort by timestamp descending (most recent first)
    return items.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [focusSessions, comments]);

  const groupedItems = useMemo(() => groupByDate(timelineItems), [timelineItems]);

  if (isLoadingSessions || isLoadingComments) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-24 mb-3" />
            <div className="space-y-3">
              <div className="h-16 bg-muted rounded" />
              <div className="h-16 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (timelineItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p className="text-sm">No hay actividad todavia</p>
        <p className="text-xs mt-1">Las sesiones de enfoque y comentarios apareceran aqui</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {Array.from(groupedItems.entries()).map(([dateKey, items]) => (
        <div key={dateKey}>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            {formatDateHeader(items[0].timestamp)}
          </h3>
          <div className="space-y-3">
            {items.map(item => (
              <ActivityItem
                key={item.type === 'comment' ? `comment-${item.data.id}` : `session-${item.data.id}`}
                item={item}
                onDeleteComment={onDeleteComment}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
