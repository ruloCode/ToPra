'use client';

import { Task, TaskStatus, updateTask, deleteTask } from '@/lib/tasks';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  onDelete: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async () => {
    setIsLoading(true);
    try {
      const newStatus =
        task.status === TaskStatus.COMPLETED
          ? TaskStatus.PENDING
          : TaskStatus.COMPLETED;
      await updateTask(task.id, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    setIsLoading(true);
    try {
      await deleteTask(task.id);
      onDelete();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <button
        onClick={handleStatusChange}
        disabled={isLoading}
        className={`h-6 w-6 shrink-0 rounded-full border-2 transition-colors ${
          task.status === TaskStatus.COMPLETED
            ? 'border-green-500 bg-green-500'
            : 'border-gray-300'
        } ${isLoading ? 'opacity-50' : ''}`}
      >
        {task.status === TaskStatus.COMPLETED && (
          <svg
            className="h-full w-full text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      <div className="flex-1 space-y-1">
        <h3
          className={`font-medium ${
            task.status === TaskStatus.COMPLETED
              ? 'text-gray-500 line-through'
              : 'text-gray-900'
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-gray-500">{task.description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {task.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {task.due_date && (
          <span className="text-sm text-gray-500">
            {format(
              parseISO(task.due_date),
              "d 'de' MMM",
              { locale: es }
            )}
          </span>
        )}
        <div className="flex items-center gap-1">
          {Array.from({ length: task.priority }).map((_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-yellow-400"
              title={`Priority ${task.priority}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute -right-2 -top-2 hidden space-x-2 group-hover:flex">
        <button
          onClick={() => onEdit(task)}
          disabled={isLoading}
          className="rounded-full bg-blue-500 p-1 text-white opacity-0 transition-opacity hover:bg-blue-600 group-hover:opacity-100"
          title="Edit task"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>

        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
          title="Delete task"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
} 