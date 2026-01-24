'use client';

import { useAuth } from '@/components/AuthProvider';
import Auth from '@/components/Auth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Task, TaskStatus } from '@/lib/tasks';
import { useMemo } from 'react';
import TaskList from '@/components/tasks/TaskList';
import TaskStats from '@/components/tasks/TaskStats';
import { useTaskModal } from '@/contexts/TaskModalContext';
import { loadUserSettings } from '@/lib/settings';
import { useTasks } from '@/contexts/TaskContext';

export default function Home() {
  const { user, isLoading } = useAuth();
  const { openCreateTaskModal } = useTaskModal();
  const { tasks: allTasks, isLoading: isLoadingTasks, refreshTasks } = useTasks();
  const today = new Date();

  const userSettings = user ? loadUserSettings(user.id) : null;
  const displayName = userSettings?.profile.displayName;

  // Filtrar tareas localmente: pendientes + completadas hoy
  const tasks = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return allTasks.filter((task: Task) => {
      if (task.status === TaskStatus.COMPLETED) {
        const completedDate = new Date(task.updated_at);
        return completedDate >= todayStart && completedDate <= todayEnd;
      }
      // Incluir todas las tareas pendientes
      return task.status === TaskStatus.PENDING;
    });
  }, [allTasks]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const handleAddTask = () => {
    openCreateTaskModal(refreshTasks);
  };

  const handleEditTask = (task: Task) => {
    openCreateTaskModal(refreshTasks, task);
  };

  return (
    <main className="main-content min-h-screen bg-background px-4 py-6 md:px-8">
      <div className="mx-auto md:max-w-[60vw]">
        <div className="mb-8">
          {displayName ? (
            <h1 className="date-header text-xl text-primary mb-2">
              ¡Hola, {displayName}!
              ¡Hagamos que las cosas sucedan!
            </h1>
          ) : (
            <h1 className="date-header">Hoy</h1>
          )}
        
          <p className="text-sm text-muted-foreground">
            {format(today, "EEEE, d 'de' MMMM", { locale: es })}
          </p>
        </div>

        <div className="grid gap-6">
          {/* Quick Stats */}
          <TaskStats tasks={tasks} todayOnly={true} />

          {/* Tasks Section */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-header">Tareas para hoy</h2>
              <button
                onClick={handleAddTask}
                 className="rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90 transition-colors"
              >
                Agregar tarea
              </button>
            </div>

            {isLoadingTasks ? (
              <div className="flex h-40 items-center justify-center">
                <div className="text-muted-foreground">Cargando tareas...</div>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onUpdate={refreshTasks}
                onDelete={refreshTasks}
                onEdit={handleEditTask}
                emptyMessage="No hay tareas para hoy"
                todayOnly={true}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
