'use client';

import { useState, useEffect, useCallback } from 'react';
import { Subtask, SubtaskSuggestion } from '@/types/subtasks';
import {
  getSubtasksByTaskId,
  createSubtask,
  createSubtasksBatch,
  updateSubtask,
  deleteSubtask as deleteSubtaskApi,
  toggleSubtaskStatus,
} from '@/lib/subtasks';
import { useToast } from '@/components/ui/use-toast';

interface UseSubtasksReturn {
  subtasks: Subtask[];
  isLoading: boolean;
  error: Error | null;
  addSubtask: (title: string, priority?: number) => Promise<void>;
  addSubtasksFromAI: (suggestions: SubtaskSuggestion[]) => Promise<void>;
  updateSubtaskItem: (id: string, updates: Partial<Subtask>) => Promise<void>;
  removeSubtask: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  completedCount: number;
  totalCount: number;
}

export function useSubtasks(
  taskId: string,
  userId: string | undefined
): UseSubtasksReturn {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchSubtasks = useCallback(async () => {
    if (!taskId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getSubtasksByTaskId(taskId);
      setSubtasks(data);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Error al cargar subtareas');
      setError(error);
      console.error('Error fetching subtasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchSubtasks();
  }, [fetchSubtasks]);

  const addSubtask = useCallback(
    async (title: string, priority: number = 2) => {
      if (!userId || !taskId) {
        toast({
          title: 'Error',
          description: 'No se pudo agregar la subtarea',
          variant: 'destructive',
        });
        return;
      }

      try {
        const newSubtask = await createSubtask({
          user_id: userId,
          task_id: taskId,
          title,
          priority,
        });

        setSubtasks((prev) => [...prev, newSubtask]);

        toast({
          title: 'Subtarea agregada',
          description: 'La subtarea ha sido creada',
        });
      } catch (err) {
        console.error('Error creating subtask:', err);
        toast({
          title: 'Error',
          description: 'No se pudo crear la subtarea',
          variant: 'destructive',
        });
        throw err;
      }
    },
    [userId, taskId, toast]
  );

  const addSubtasksFromAI = useCallback(
    async (suggestions: SubtaskSuggestion[]) => {
      if (!userId || !taskId) {
        toast({
          title: 'Error',
          description: 'No se pudieron agregar las subtareas',
          variant: 'destructive',
        });
        return;
      }

      const selectedSuggestions = suggestions.filter((s) => s.selected !== false);
      if (selectedSuggestions.length === 0) return;

      try {
        const newSubtasks = await createSubtasksBatch(
          userId,
          taskId,
          selectedSuggestions,
          true // ai_generated = true
        );

        setSubtasks((prev) => [...prev, ...newSubtasks]);

        toast({
          title: 'Subtareas creadas',
          description: `Se crearon ${newSubtasks.length} subtareas`,
        });
      } catch (err) {
        console.error('Error creating subtasks from AI:', err);
        toast({
          title: 'Error',
          description: 'No se pudieron crear las subtareas',
          variant: 'destructive',
        });
        throw err;
      }
    },
    [userId, taskId, toast]
  );

  const updateSubtaskItem = useCallback(
    async (id: string, updates: Partial<Subtask>) => {
      try {
        const updated = await updateSubtask(id, updates);
        setSubtasks((prev) => prev.map((s) => (s.id === id ? updated : s)));
      } catch (err) {
        console.error('Error updating subtask:', err);
        toast({
          title: 'Error',
          description: 'No se pudo actualizar la subtarea',
          variant: 'destructive',
        });
        throw err;
      }
    },
    [toast]
  );

  const removeSubtask = useCallback(
    async (id: string) => {
      try {
        await deleteSubtaskApi(id);
        setSubtasks((prev) => prev.filter((s) => s.id !== id));

        toast({
          title: 'Subtarea eliminada',
          description: 'La subtarea ha sido eliminada',
        });
      } catch (err) {
        console.error('Error deleting subtask:', err);
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la subtarea',
          variant: 'destructive',
        });
        throw err;
      }
    },
    [toast]
  );

  const toggleStatus = useCallback(
    async (id: string) => {
      const subtask = subtasks.find((s) => s.id === id);
      if (!subtask) return;

      try {
        const updated = await toggleSubtaskStatus(id, subtask.status);
        setSubtasks((prev) => prev.map((s) => (s.id === id ? updated : s)));
      } catch (err) {
        console.error('Error toggling subtask status:', err);
        toast({
          title: 'Error',
          description: 'No se pudo actualizar el estado',
          variant: 'destructive',
        });
        throw err;
      }
    },
    [subtasks, toast]
  );

  const completedCount = subtasks.filter((s) => s.status === 'completed').length;
  const totalCount = subtasks.length;

  return {
    subtasks,
    isLoading,
    error,
    addSubtask,
    addSubtasksFromAI,
    updateSubtaskItem,
    removeSubtask,
    toggleStatus,
    refresh: fetchSubtasks,
    completedCount,
    totalCount,
  };
}
