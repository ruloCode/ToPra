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
  const [showActions, setShowActions] = useState(false);
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-gray-100 rounded-md">
                      <MoreHorizontal className="h-4 w-4 text-text-secondary" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end"  className='bg-background'>
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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