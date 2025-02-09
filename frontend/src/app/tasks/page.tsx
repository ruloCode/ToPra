"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import Auth from "@/components/Auth";
import TaskList from "@/components/tasks/TaskList";
import TaskStats from "@/components/tasks/TaskStats";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Task } from "@/lib/tasks";
import { useTaskModal } from "@/contexts/TaskModalContext";
import { useTasks } from "@/contexts/TaskContext";

export default function TasksPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { openCreateTaskModal } = useTaskModal();
  const { tasks, isLoading: tasksLoading, refreshTasks } = useTasks();
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
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-header">Your Tasks</h2>
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
                tasks={tasks}
                onUpdate={refreshTasks}
                onDelete={refreshTasks}
                onEdit={handleEditTask}
                emptyMessage="No tasks yet"
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
