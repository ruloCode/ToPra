'use client';

import { useState } from 'react';
import { MessageSquare, Clock } from 'lucide-react';
import { ActivityTimeline } from './ActivityTimeline';
import { CommentForm } from './CommentForm';
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

interface ActivitySidebarProps {
  taskId: string;
  focusSessions: FocusSessionWithTask[];
  comments: Comment[];
  onAddComment: (content: string) => Promise<void>;
  onDeleteComment: (id: string) => Promise<void>;
  isLoadingSessions: boolean;
  isLoadingComments: boolean;
}

export function ActivitySidebar({
  focusSessions,
  comments,
  onAddComment,
  onDeleteComment,
  isLoadingSessions,
  isLoadingComments,
}: ActivitySidebarProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (content: string) => {
    setIsSubmitting(true);
    try {
      await onAddComment(content);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalFocusTime = focusSessions.reduce((acc, session) => {
    return acc + (session.duration || 0);
  }, 0);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Comment Form - Fixed at top */}
      <div className="flex-shrink-0 border-b border-border p-4 bg-card/80 backdrop-blur-sm">
        <CommentForm
          onSubmit={handleSubmitComment}
          isLoading={isSubmitting}
        />
      </div>

      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
        <h2 className="text-base font-semibold text-foreground">Historial</h2>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDuration(totalFocusTime)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{comments.length}</span>
          </div>
        </div>
      </div>

      {/* Timeline - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <ActivityTimeline
          focusSessions={focusSessions}
          comments={comments}
          onDeleteComment={onDeleteComment}
          isLoadingSessions={isLoadingSessions}
          isLoadingComments={isLoadingComments}
        />
      </div>
    </div>
  );
}
