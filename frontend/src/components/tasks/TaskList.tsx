'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/lib/tasks';
import TaskCard from './TaskCard';
import CreateTaskForm from './CreateTaskForm';

interface TaskListProps {
  tasks: Task[];
  onUpdate: () => void;
  onDelete: () => void;
  onEdit: (task: Task) => void;
  emptyMessage?: string;
}

export default function TaskList({
  tasks: initialTasks,
  onUpdate,
  onDelete,
  onEdit,
  emptyMessage = 'No tasks found'
}: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate'>('priority');
  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);

  useEffect(() => {
    setTasks(initialTasks || []);
  }, [initialTasks]);

  const sortedTasks = tasks.sort((a, b) => {
    if (sortBy === 'priority') {
      return (b.priority || 0) - (a.priority || 0);
    } else {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
  });

  if (!tasks || tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-text-secondary bg-white p-8 text-center">
        <p className="text-text-secondary">{emptyMessage}</p>
        <button className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90">
          Add Task
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-4 sm:px-6 md:px-8">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-sm font-medium text-text-secondary">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'priority' | 'dueDate')}
            className="w-full sm:w-auto rounded-md border border-border bg-white px-3 py-2 text-sm text-text-secondary"
          >
            <option value="priority">Sort by priority</option>
            <option value="dueDate">Sort by due date</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {editingTask && (
          <div className="mb-8 rounded-lg border bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              Edit Task
            </h2>
            <CreateTaskForm
              initialTask={editingTask}
              onSuccess={() => {
                setEditingTask(null);
                onUpdate();
              }}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        )}

        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
} 