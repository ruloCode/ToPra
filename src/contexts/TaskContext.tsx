'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Task, getTasks, subscribeToTasks } from '@/lib/tasks';
import { useAuth } from '@/components/AuthProvider';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshTasks = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const allTasks = await getTasks({ userId: user.id });
      setTasks(allTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load tasks automatically when user is available
  useEffect(() => {
    if (user) {
      refreshTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Only depend on user to avoid infinite loop

  // Real-time subscription for task changes
  useEffect(() => {
    if (!user) return;

    const subscription = subscribeToTasks(user.id, (payload) => {
      console.log('[TaskContext] Realtime event:', payload.eventType, payload.new?.title || payload.old?.id);

      if (payload.eventType === 'INSERT') {
        setTasks(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setTasks(prev => prev.map(t => t.id === payload.new.id ? payload.new : t));
      } else if (payload.eventType === 'DELETE') {
        setTasks(prev => prev.filter(t => t.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <TaskContext.Provider value={{ tasks, isLoading, refreshTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
} 