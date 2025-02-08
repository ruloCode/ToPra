'use client';

import { Task, TaskStatus, updateTask, deleteTask } from '@/lib/tasks';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { Circle, CheckCircle2, Calendar, Flag, MoreHorizontal } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  onDelete: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

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

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 4: return 'text-red-600';
      case 3: return 'text-orange-500';
      case 2: return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div 
      className="task-item group w-full max-w-full overflow-hidden rounded-lg border border-border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={handleStatusChange}
          disabled={isLoading}
          className="flex-shrink-0"
        >
          {task.status === TaskStatus.COMPLETED ? (
            <CheckCircle2 className="h-5 w-5 text-accent" />
          ) : (
            <Circle className="h-5 w-5 text-text-secondary hover:text-accent" />
          )}
        </button>

        <div className="flex flex-1 flex-col min-w-0 gap-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-sm font-medium break-words ${
                task.status === TaskStatus.COMPLETED
                  ? 'text-text-secondary line-through'
                  : 'text-foreground'
              }`}
            >
              {task.title}
            </h3>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {task.due_date && (
                <div className="flex items-center gap-1 text-xs text-text-secondary whitespace-nowrap">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(parseISO(task.due_date), "d MMM", { locale: es })}
                  </span>
                </div>
              )}
              
              {task.priority > 1 && (
                <Flag className={`h-4 w-4 flex-shrink-0 ${getPriorityColor(task.priority)}`} />
              )}

              <div className={`transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
                <button
                  onClick={() => onEdit(task)}
                  className="p-1 hover:bg-gray-100 rounded-md"
                >
                  <MoreHorizontal className="h-4 w-4 text-text-secondary" />
                </button>
              </div>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-text-secondary break-words">
              {task.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 