'use client';

import { Task, TaskStatus, updateTask, deleteTask } from '@/lib/tasks';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { Circle, CheckCircle2, Calendar, Pencil, Trash2, Play } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { StatusBar, type StatusType } from '@/components/ui/status-badge';
import { PriorityIcon, type PriorityLevel } from '@/components/ui/priority-badge';
import { useTags } from '@/contexts/TagContext';
import { getTagColorClasses } from '@/lib/tags';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  onDelete: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();
  const { tags: userTags } = useTags();

  // Determine the status type for styling
  const getStatusType = (): StatusType => {
    if (task.status === TaskStatus.COMPLETED) return 'completed';
    if (task.status === TaskStatus.IN_PROGRESS) return 'in_progress';
    if (task.due_date && isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date))) {
      return 'overdue';
    }
    return 'pending';
  };

  const statusType = getStatusType();

  const handleStatusChange = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

    // Trigger completion animation
    if (task.status !== TaskStatus.COMPLETED) {
      setIsCompleting(true);
    }

    try {
      const newStatus =
        task.status === TaskStatus.COMPLETED
          ? TaskStatus.PENDING
          : TaskStatus.COMPLETED;

      await updateTask(task.id, { status: newStatus });

      // Wait for animation to finish before updating
      if (newStatus === TaskStatus.COMPLETED) {
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      onUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la tarea",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsCompleting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;

    setIsLoading(true);
    try {
      await deleteTask(task.id);
      toast({
        title: "Tarea eliminada",
        description: "La tarea ha sido eliminada correctamente",
      });
      onDelete();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la tarea",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(task);
  };

  const handleStartFocus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/focus?taskId=${task.id}`;
  };

  const isOverdue = statusType === 'overdue';
  const isCompleted = task.status === TaskStatus.COMPLETED;

  return (
    <div
      className={cn(
        'group relative rounded-xl border bg-card overflow-hidden',
        'transition-all duration-200 ease-out',
        'hover:shadow-md hover:-translate-y-0.5',
        'dark:border-[#28282F]',
        isCompleting && 'animate-task-complete',
        isCompleted && 'opacity-60'
      )}
    >
      {/* Status indicator bar */}
      <StatusBar status={statusType} />

      <Link
        href={`/tasks/${task.id}`}
        className="flex items-start gap-3 p-4 pl-5 cursor-pointer"
      >
        {/* Checkbox */}
        <button
          onClick={handleStatusChange}
          disabled={isLoading}
          className={cn(
            'mt-0.5 flex-shrink-0 transition-transform duration-200',
            'hover:scale-110 active:scale-95',
            isLoading && 'opacity-50'
          )}
          aria-label={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <Circle className={cn(
              'h-5 w-5 transition-colors',
              isOverdue ? 'text-error' : 'text-muted-foreground hover:text-accent'
            )} />
          )}
        </button>

        {/* Content */}
        <div className="flex flex-1 flex-col min-w-0 gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              {/* Title */}
              <h3
                className={cn(
                  'text-sm font-medium break-words leading-tight',
                  isCompleted
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground'
                )}
              >
                {task.title}
              </h3>

              {/* Description preview */}
              {task.description && (
                <p className={cn(
                  'text-xs text-muted-foreground break-words line-clamp-1',
                  isCompleted && 'line-through'
                )}>
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions - visible on hover */}
            <div className={cn(
              'flex items-center gap-1 flex-shrink-0',
              'opacity-0 group-hover:opacity-100',
              'transition-opacity duration-150'
            )}>
              {/* Start Focus button */}
              {!isCompleted && (
                <button
                  onClick={handleStartFocus}
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    'text-muted-foreground/50 hover:text-accent hover:bg-accent/10'
                  )}
                  title="Iniciar sesión de focus"
                >
                  <Play className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={handleEdit}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  'text-muted-foreground/50 hover:text-accent hover:bg-accent/10'
                )}
                title="Editar tarea"
              >
                <Pencil className="h-4 w-4" />
              </button>

              <button
                onClick={handleDelete}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  'text-muted-foreground/50 hover:text-error hover:bg-error/10'
                )}
                title="Eliminar tarea"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Meta info row */}
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            {/* Due date */}
            {task.due_date && (
              <div className={cn(
                'flex items-center gap-1 text-xs',
                isOverdue && !isCompleted
                  ? 'text-error font-medium'
                  : 'text-muted-foreground'
              )}>
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {format(parseISO(task.due_date), "d MMM", { locale: es })}
                </span>
              </div>
            )}

            {/* Priority indicator */}
            <PriorityIcon priority={task.priority as PriorityLevel} />

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {task.tags.slice(0, 3).map((tagName, index) => {
                  const tag = userTags.find((t) => t.name === tagName);
                  const colorClasses = tag
                    ? getTagColorClasses(tag.color)
                    : getTagColorClasses('blue');
                  return (
                    <span
                      key={index}
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5',
                        'text-[10px] font-medium transition-colors cursor-default',
                        colorClasses.bg,
                        colorClasses.text
                      )}
                    >
                      {tagName}
                    </span>
                  );
                })}
                {task.tags.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{task.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
