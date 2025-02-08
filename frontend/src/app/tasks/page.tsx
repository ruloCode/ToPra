'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Auth from '@/components/Auth';
import TaskList from '@/components/tasks/TaskList';
import TaskStats from '@/components/tasks/TaskStats';
import CreateTaskForm from '@/components/tasks/CreateTaskForm';
import QuickAddTask from '@/components/tasks/QuickAddTask';
import AITaskAssistant from '@/components/tasks/AITaskAssistant';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Task, getTasks, updateTask } from '@/lib/tasks';

export default function TasksPage() {
  const { user, isLoading } = useAuth();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const today = new Date();

  useEffect(() => {
    if (user) {
      getTasks({ userId: user.id }).then(setTasks);
    }
  }, [user, refreshTasks]);

  const handleTaskUpdate = () => {
    setRefreshTasks(prev => prev + 1);
  };

  const handlePriorityUpdate = async (taskId: string, priority: number) => {
    try {
      await updateTask(taskId, { priority });
      handleTaskUpdate();
    } catch (error) {
      console.error('Error updating task priority:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="mt-1 text-sm text-gray-500">
              {format(today, "EEEE, d 'de' MMMM", { locale: es })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateTask(true)}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              New Task
            </button>
          </div>
        </div>

        <div className="mb-8">
          <TaskStats tasks={tasks} />
        </div>

        <div className="mb-8">
          <AITaskAssistant tasks={tasks} onPriorityUpdate={handlePriorityUpdate} />
        </div>

        {showCreateTask ? (
          <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              Create New Task
            </h2>
            <CreateTaskForm
              onSuccess={() => {
                setShowCreateTask(false);
                handleTaskUpdate();
              }}
              onCancel={() => setShowCreateTask(false)}
            />
          </div>
        ) : null}

        <TaskList key={refreshTasks} onTasksChange={setTasks} />
        <QuickAddTask onSuccess={handleTaskUpdate} />
      </div>
    </main>
  );
} 