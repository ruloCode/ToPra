'use client';

import { useState, useEffect, useCallback } from 'react';
import { Comment } from '@/types/comments';
import {
  getCommentsByTaskId,
  createComment,
  deleteComment as deleteCommentApi,
} from '@/lib/comments';
import { useToast } from '@/components/ui/use-toast';

interface UseCommentsReturn {
  comments: Comment[];
  isLoading: boolean;
  error: Error | null;
  addComment: (content: string) => Promise<void>;
  removeComment: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useComments(taskId: string, userId: string | undefined): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchComments = useCallback(async () => {
    if (!taskId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getCommentsByTaskId(taskId);
      setComments(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al cargar comentarios');
      setError(error);
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = useCallback(async (content: string) => {
    if (!userId || !taskId) {
      toast({
        title: 'Error',
        description: 'No se pudo agregar el comentario',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newComment = await createComment({
        user_id: userId,
        task_id: taskId,
        content,
      });

      // Add to the beginning of the list (most recent first)
      setComments(prev => [newComment, ...prev]);

      toast({
        title: 'Comentario agregado',
        description: 'Tu comentario ha sido guardado',
      });
    } catch (err) {
      console.error('Error creating comment:', err);
      toast({
        title: 'Error',
        description: 'No se pudo agregar el comentario',
        variant: 'destructive',
      });
      throw err;
    }
  }, [userId, taskId, toast]);

  const removeComment = useCallback(async (id: string) => {
    try {
      await deleteCommentApi(id);

      // Remove from local state
      setComments(prev => prev.filter(c => c.id !== id));

      toast({
        title: 'Comentario eliminado',
        description: 'El comentario ha sido eliminado',
      });
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el comentario',
        variant: 'destructive',
      });
      throw err;
    }
  }, [toast]);

  return {
    comments,
    isLoading,
    error,
    addComment,
    removeComment,
    refresh: fetchComments,
  };
}
