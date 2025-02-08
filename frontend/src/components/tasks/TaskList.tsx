'use client';

import { useEffect, useState, useCallback } from 'react';
import { Task, getTasks, subscribeToTasks } from '@/lib/tasks';
import TaskCard from './TaskCard';
import { useAuth } from '@/components/AuthProvider';
import CreateTaskForm from './CreateTaskForm';

interface TaskListProps {
  onTasksChange?: (tasks: Task[]) => void;
}

export default function TaskList({ onTasksChange }: TaskListProps) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const updateTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    onTasksChange?.(newTasks);
  }, [onTasksChange]);

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      const data = await getTasks({ userId: user.id });
      updateTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Set up real-time subscription
    if (user) {
      const subscription = subscribeToTasks(user.id, (payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        
        setTasks(currentTasks => {
          let updatedTasks = currentTasks;
          switch (eventType) {
            case 'INSERT':
              updatedTasks = [newRecord, ...currentTasks];
              break;
            case 'DELETE':
              updatedTasks = currentTasks.filter(task => task.id !== oldRecord.id);
              break;
            case 'UPDATE':
              updatedTasks = currentTasks.map(task => 
                task.id === newRecord.id ? newRecord : task
              );
              break;
          }
          updateTasks(updatedTasks);
          return updatedTasks;
        });
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, updateTasks]);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <p>{error}</p>
        <button
          onClick={fetchTasks}
          className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
        >
          Try again
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-gray-500">No tasks yet</p>
        <p className="mt-1 text-sm text-gray-400">
          Create a new task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {editingTask && (
        <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Edit Task
          </h2>
          <CreateTaskForm
            initialTask={editingTask}
            onSuccess={() => {
              setEditingTask(null);
            }}
            onCancel={() => setEditingTask(null)}
          />
        </div>
      )}

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={fetchTasks}
          onDelete={fetchTasks}
          onEdit={setEditingTask}
        />
      ))}
    </div>
  );
} 