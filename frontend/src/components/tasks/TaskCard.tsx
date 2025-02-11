'use client';

import { Task, TaskStatus, updateTask, deleteTask } from '@/lib/tasks';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { Circle, CheckCircle2, Calendar, Flag, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  onDelete: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async () => {
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

  const handleDelete = async () => {
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
      case 'trabajo':
        return 'bg-blue-100 text-blue-600';
      case 'personal':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="group flex items-start gap-3 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent/5">
      <button
        onClick={handleStatusChange}
        disabled={isLoading}
        className="mt-0.5 flex-shrink-0"
      >
        {task.status === TaskStatus.COMPLETED ? (
          <CheckCircle2 className="h-5 w-5 text-accent" />
        ) : (
          <Circle className="h-5 w-5 text-text-secondary hover:text-accent" />
        )}
      </button>

      <div className="flex flex-1 flex-col min-w-0 gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h3
              className={`text-sm font-medium break-words ${
                task.status === TaskStatus.COMPLETED
                  ? 'text-text-secondary line-through'
                  : 'text-foreground'
              }`}
            >
              {task.title}
            </h3>
            {task.due_date && (
              <div className="flex items-center gap-1 text-xs text-text-secondary">
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
                onClick={() => onEdit(task)}
                className="p-1 text-text-secondary/50 hover:text-accent hover:bg-accent/10 rounded-md transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-text-secondary/50 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}