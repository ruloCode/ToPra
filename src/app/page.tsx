'use client';

import { useAuth } from '@/components/AuthProvider';
import Auth from '@/components/Auth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Incluir todas las tareas pendientes y las completadas de hoy
      const filteredTasks = allTasks.filter(task => {
        if (task.status === TaskStatus.COMPLETED) {
          const completedDate = new Date(task.updated_at);
          return completedDate >= todayStart && completedDate <= todayEnd;
        }
        // Incluir todas las tareas pendientes
        return task.status === TaskStatus.PENDING;
      });

      setTasks(filteredTasks);
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
        <div className="text-lg">Cargando...</div>
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
                onUpdate={fetchTasks}
                onDelete={fetchTasks}
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
