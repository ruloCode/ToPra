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
        <div className="text-lg">Loading...</div>
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
    <main className="main-content min-h-screen bg-[#fafafa] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
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
                
                <div className="inline-flex items-center bg-gray-100/50 p-0.5 rounded-lg gap-0.5">
                  <button
                    onClick={() => setFilter('all')}
                    className={`min-w-[90px] px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200 inline-flex items-center justify-center gap-1.5 ${
                      filter === 'all' 
                        ? 'bg-white text-accent shadow-sm ring-1 ring-accent/20' 
                        : 'text-text-secondary hover:text-accent/90 hover:bg-white/50'
                    }`}
                  >
                    <ListFilter className="h-3.5 w-3.5" />
                    All
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`min-w-[90px] px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200 inline-flex items-center justify-center gap-1.5 ${
                      filter === 'pending' 
                        ? 'bg-white text-accent shadow-sm ring-1 ring-accent/20' 
                        : 'text-text-secondary hover:text-accent/90 hover:bg-white/50'
                    }`}
                  >
                    <ListTodo className="h-3.5 w-3.5" />
                    Pending
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`min-w-[90px] px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200 inline-flex items-center justify-center gap-1.5 ${
                      filter === 'completed' 
                        ? 'bg-white text-accent shadow-sm ring-1 ring-accent/20' 
                        : 'text-text-secondary hover:text-accent/90 hover:bg-white/50'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completed
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddTask}
                className="rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90"
              >
                Add Task
              </button>
            </div>

            {tasksLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="text-text-secondary">Loading tasks...</div>
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onUpdate={refreshTasks}
                onDelete={refreshTasks}
                onEdit={handleEditTask}
                emptyMessage={`No ${filter === 'all' ? '' : filter} tasks yet`}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
