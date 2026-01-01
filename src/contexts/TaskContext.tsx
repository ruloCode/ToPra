'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Task, getTasks } from '@/lib/tasks';
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