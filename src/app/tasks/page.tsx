"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Auth from "@/components/Auth";
import TaskList from "@/components/tasks/TaskList";
import TaskStats from "@/components/tasks/TaskStats";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Task, TaskStatus } from "@/lib/tasks";
import { useTaskModal } from "@/contexts/TaskModalContext";
import { useTasks } from "@/contexts/TaskContext";
import { ListTodo, CheckCircle2, ListFilter } from 'lucide-react';

export default function TasksPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { openCreateTaskModal } = useTaskModal();
  const { tasks, isLoading: tasksLoading, refreshTasks } = useTasks();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const today = new Date();

  useEffect(() => {
    if (user) {
      refreshTasks();
    }
  }, [user, refreshTasks]);

  if (authLoading) {
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

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending':
        return task.status === TaskStatus.PENDING;
      case 'completed':
        return task.status === TaskStatus.COMPLETED;
      default:
        return true;
    }
  });

  return (
    <main className="main-content min-h-screen bg-background px-4 py-6 md:px-8">
      <div className="mx-auto md:max-w-[60vw]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Todas las tareas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
           
          {format(today, "EEEE, d 'de' MMMM", { locale: es })}
          </p>
        </div>

        <div className="grid gap-6">
          {/* Quick Stats */}
          <TaskStats tasks={tasks} todayOnly={false} />

          {/* Tasks Section */}
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center bg-secondary/50 p-0.5 rounded-lg gap-0.5 dark:bg-[#28282F]">
                  <button
                    onClick={() => setFilter('all')}
                    className={`min-w-[90px] px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200 inline-flex items-center justify-center gap-1.5 ${
                      filter === 'all' 
                        ? 'bg-background text-accent shadow-sm ring-1 ring-accent/20 dark:bg-[#1C1C24]' 
                        : 'text-muted-foreground hover:bg-background/50 hover:text-accent dark:text-muted-foreground dark:hover:text-accent dark:hover:bg-[#1C1C24]'
                    }`}
                  >
                    <ListFilter className="h-3.5 w-3.5" />
                    Todas
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`min-w-[90px] px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200 inline-flex items-center justify-center gap-1.5 ${
                      filter === 'pending' 
                        ? 'bg-background text-accent shadow-sm ring-1 ring-accent/20 dark:bg-[#1C1C24]' 
                        : 'text-muted-foreground hover:bg-background/50 hover:text-accent dark:text-muted-foreground dark:hover:text-accent dark:hover:bg-[#1C1C24]'
                    }`}
                  >
                    <ListTodo className="h-3.5 w-3.5" />
                    Pendientes
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`min-w-[90px] px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200 inline-flex items-center justify-center gap-1.5 ${
                      filter === 'completed' 
                        ? 'bg-background text-accent shadow-sm ring-1 ring-accent/20 dark:bg-[#1C1C24]' 
                        : 'text-muted-foreground hover:bg-background/50 hover:text-accent dark:text-muted-foreground dark:hover:text-accent dark:hover:bg-[#1C1C24]'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completadas
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddTask}
                className="rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90 transition-colors"
              >
                Agregar tarea
              </button>
            </div>

            {tasksLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="text-muted-foreground">Cargando tareas...</div>
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onUpdate={refreshTasks}
                onDelete={refreshTasks}
                onEdit={handleEditTask}
                emptyMessage={filter === 'all' ? 'No hay tareas aún' : filter === 'pending' ? 'No hay tareas pendientes' : 'No hay tareas completadas'}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
