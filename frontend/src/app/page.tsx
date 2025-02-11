'use client';

import { useAuth } from '@/components/AuthProvider';
import Auth from '@/components/Auth';
import { format } from 'date-fns';
import { Task, TaskStatus, getTasks } from '@/lib/tasks';
import { useCallback, useEffect, useState } from 'react';
import TaskList from '@/components/tasks/TaskList';
import TaskStats from '@/components/tasks/TaskStats';
import { useTaskModal } from '@/contexts/TaskModalContext';
import { loadUserSettings } from '@/lib/settings';

export default function Home() {
  const { user, isLoading } = useAuth();
  const { openCreateTaskModal } = useTaskModal();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const today = new Date();
  
  const userSettings = user ? loadUserSettings(user.id) : null;
  const displayName = userSettings?.profile.displayName;

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingTasks(true);
    try {
      const allTasks = await getTasks({ userId: user.id });
      // Filter tasks: only pending tasks due today or overdue
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const todayTasks = allTasks.filter(task => {
        // Only include pending tasks
        if (task.status === TaskStatus.COMPLETED) return false;
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate <= todayEnd;
      });

      // Sort tasks by priority
      todayTasks.sort((a, b) => {
        return (b.priority || 0) - (a.priority || 0);
      });

      setTasks(todayTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoadingTasks(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

  const handleAddTask = () => {
    openCreateTaskModal(fetchTasks);
  };

  const handleEditTask = (task: Task) => {
    openCreateTaskModal(fetchTasks, task);
  };

  return (
    <main className="main-content min-h-screen bg-background px-4 py-6 md:px-8">
      <div className="mx-auto md:max-w-[60vw]">
        <div className="mb-8">
          {displayName ? (
            <h1 className="date-header text-xl text-primary mb-2">
              Hi, {displayName}!
              Let&apos;s make things happen!
            </h1>
          ) : (
            <h1 className="date-header">Today</h1>
          )}
        
          <p className="text-sm text-muted-foreground">
            {format(today, "EEEE, MMMM d")}
          </p>
        </div>

        <div className="grid gap-6">
          {/* Quick Stats */}
          <TaskStats tasks={tasks} todayOnly={true} />

          {/* Tasks Section */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-header">Tasks for Today</h2>
              <button
                onClick={handleAddTask}
                 className="rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90 transition-colors"
              >
                Add Task
              </button>
            </div>

            {isLoadingTasks ? (
              <div className="flex h-40 items-center justify-center">
                <div className="text-muted-foreground">Loading tasks...</div>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onUpdate={fetchTasks}
                onDelete={fetchTasks}
                onEdit={handleEditTask}
                emptyMessage="No tasks for today"
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
