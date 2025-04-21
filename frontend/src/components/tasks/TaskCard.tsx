'use client';

import { Task, TaskStatus, updateTask, deleteTask } from '@/lib/tasks';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { Circle, CheckCircle2, Calendar, Flag, Pencil, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import Link from 'next/link';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  onDelete: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir navegación
    e.stopPropagation(); // Evitar propagación del evento
    
    setIsLoading(true);
    try {
      const newStatus =
        task.status === TaskStatus.COMPLETED
          ? TaskStatus.PENDING
          : TaskStatus.COMPLETED;
      
      const updates = {
        status: newStatus,
        completed_at: newStatus === TaskStatus.COMPLETED ? new Date().toISOString() : null
      };
      
      await updateTask(task.id, updates);
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
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir navegación
    e.stopPropagation(); // Evitar propagación del evento
    
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
    e.preventDefault(); // Prevenir navegación
    e.stopPropagation(); // Evitar propagación del evento
    onEdit(task);
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 4: return 'text-red-600';
      case 3: return 'text-orange-500';
      case 2: return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'personal':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-400/20 dark:text-yellow-400 dark:hover:bg-yellow-400/30';
      case 'trabajo':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-400/20 dark:text-blue-400 dark:hover:bg-blue-400/30';
      case 'urgente':
        return 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-400/20 dark:text-red-400 dark:hover:bg-red-400/30';
      case 'importante':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-400/20 dark:text-purple-400 dark:hover:bg-purple-400/30';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-400/20 dark:text-gray-400 dark:hover:bg-gray-400/30';
    }
  };

  return (
    <div className={`group relative rounded-xl border bg-card transition-colors hover:bg-accent/5 dark:border-[#28282F] ${task.status === TaskStatus.COMPLETED ? 'opacity-75' : ''}`}>
      <Link href={`/tasks/${task.id}`} className="flex items-center gap-2 p-4 cursor-pointer">
        <button
          onClick={handleStatusChange}
          disabled={isLoading}
          className="mt-0.5 flex-shrink-0"
        >
          {task.status === TaskStatus.COMPLETED ? (
            <CheckCircle2 className="h-5 w-5 text-accent" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground hover:text-accent" />
          )}
        </button>

        <div className="flex flex-1 flex-col min-w-0 gap-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <h3
                className={`text-sm font-medium break-words ${
                  task.status === TaskStatus.COMPLETED
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground'
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-xs text-muted-foreground break-words ${
                  task.status === TaskStatus.COMPLETED ? 'line-through' : ''
                }`}>
                  {task.description}
                </p>
              )}
              {task.due_date && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {format(parseISO(task.due_date), "d MMM", { locale: es })}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {task.priority > 1 && (
                <Flag className={`h-4 w-4 flex-shrink-0 ${getPriorityColor(task.priority)}`} />
              )}

              <div className="flex items-center gap-1">
                <button
                  onClick={handleEdit}
                  className="p-1 text-muted-foreground/50 hover:text-accent hover:bg-accent/10 rounded-md transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 text-muted-foreground/50 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors cursor-default ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}