'use client';

import { useAuth } from '@/components/AuthProvider';
import Auth from '@/components/Auth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Task, TaskStatus, getTasks } from '@/lib/tasks';
import { useCallback, useEffect, useState } from 'react';
import TaskList from '@/components/tasks/TaskList';
import TaskStats from '@/components/tasks/TaskStats';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';

export default function Home() {
  const { user, isLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const today = new Date();

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingTasks(true);
    try {
      const allTasks = await getTasks({ userId: user.id });
      // Filter tasks due today or overdue
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const todayTasks = allTasks.filter(task => {
        if (task.status === TaskStatus.COMPLETED) return false;
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate <= todayEnd;
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

  const handleEditTask = (task: Task) => {
    setIsCreateDialogOpen(true);
  };

  return (
    <main className="main-content min-h-screen bg-[#fafafa] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="date-header">Today</h1>
          <p className="text-sm text-text-secondary">
            {format(today, "EEEE, d 'de' MMMM", { locale: es })}
          </p>
        </div>

        <div className="grid gap-6">
          {/* Quick Stats */}
          <TaskStats tasks={tasks} />

          {/* Tasks Section */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-header">Tasks for Today</h2>
              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className="rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90"
              >
                Add Task
              </button>
            </div>

            {isLoadingTasks ? (
              <div className="flex h-40 items-center justify-center">
                <div className="text-text-secondary">Loading tasks...</div>
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

      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={fetchTasks}
      />
    </main>
  );
}
