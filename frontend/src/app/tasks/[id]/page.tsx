'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Task, TaskStatus, getTaskById, updateTask, deleteTask } from '@/lib/tasks';
import { useAuth } from '@/components/AuthProvider';
import Auth from '@/components/Auth';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Circle, CheckCircle2, Pencil, Trash2, ArrowLeft, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTaskModal } from '@/contexts/TaskModalContext';
import Link from 'next/link';

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previousPath, setPreviousPath] = useState('/tasks');
  const { toast } = useToast();
  const { openCreateTaskModal } = useTaskModal();

  useEffect(() => {
    if (user && id) {
      fetchTask();
      
      // Determinar la ruta previa para el botón "volver"
      if (typeof window !== 'undefined') {
        const referrer = document.referrer;
        if (referrer.includes('/tasks')) {
          setPreviousPath('/tasks');
        } else if (referrer.endsWith('/') || referrer.endsWith('/home') || referrer.includes('localhost') || referrer.includes(window.location.host)) {
          setPreviousPath('/');
        }
      }
    }
  }, [user, id]);

  const fetchTask = async () => {
    setIsLoading(true);
    try {
      const taskData = await getTaskById(id as string);
      setTask(taskData);
    } catch (error) {
      console.error('Error fetching task:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la tarea',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!task) return;
    
    setIsUpdating(true);
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
      setTask({ ...task, ...updates });
      
      toast({
        title: newStatus === TaskStatus.COMPLETED ? 'Tarea completada' : 'Tarea pendiente',
        description: newStatus === TaskStatus.COMPLETED 
          ? 'La tarea ha sido marcada como completada' 
          : 'La tarea ha sido marcada como pendiente',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado de la tarea',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
    
    setIsUpdating(true);
    try {
      await deleteTask(task.id);
      toast({
        title: 'Tarea eliminada',
        description: 'La tarea ha sido eliminada correctamente',
      });
      router.push(previousPath);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la tarea',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => {
    if (!task) return;
    
    openCreateTaskModal(() => {
      fetchTask();
    }, task);
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 4: return 'text-red-600';
      case 3: return 'text-orange-500';
      case 2: return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 4: return 'Alta';
      case 3: return 'Media-Alta';
      case 2: return 'Media';
      default: return 'Baja';
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

  const backLinkText = previousPath === '/' ? 'Volver a la página principal' : 'Volver a la lista de tareas';

  return (
    <main className="main-content min-h-screen bg-background px-4 py-6 md:px-8">
      <div className="mx-auto md:max-w-[60vw]">
        <Link
          href={previousPath}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {backLinkText}
        </Link>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-muted-foreground">Cargando tarea...</div>
          </div>
        ) : !task ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-lg text-muted-foreground mb-4">La tarea no existe o fue eliminada</div>
            <Link
              href={previousPath}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              {previousPath === '/' ? 'Ir a la página principal' : 'Ver todas las tareas'}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">{task.title}</h1>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Creada el {format(parseISO(task.created_at), "d MMM yyyy", { locale: es })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStatusChange}
                  disabled={isUpdating}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    task.status === TaskStatus.COMPLETED
                      ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-400/20 dark:text-green-400 dark:hover:bg-green-400/30'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-400/20 dark:text-blue-400 dark:hover:bg-blue-400/30'
                  }`}
                >
                  {task.status === TaskStatus.COMPLETED ? (
                    <span className="flex items-center">
                      <Circle className="mr-1 h-4 w-4" />
                      Marcar como pendiente
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Marcar como completada
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                {task.description && (
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium text-foreground">Descripción</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>
                  </div>
                )}

                {task.tags && task.tags.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium text-foreground">Etiquetas</h2>
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors cursor-default ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-card rounded-lg border p-4 dark:border-[#28282F]">
                  <h2 className="text-lg font-medium text-foreground mb-4">Detalles</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado</span>
                      <span className={`font-medium ${
                        task.status === TaskStatus.COMPLETED
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {task.status === TaskStatus.COMPLETED ? 'Completada' : 'Pendiente'}
                      </span>
                    </div>

                    {task.priority && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prioridad</span>
                        <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                          {getPriorityText(task.priority)}
                        </span>
                      </div>
                    )}

                    {task.due_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha límite</span>
                        <span className="font-medium">
                          {format(parseISO(task.due_date), "d MMM yyyy", { locale: es })}
                        </span>
                      </div>
                    )}

                    {task.updated_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Última actualización</span>
                        <span className="font-medium">
                          {format(parseISO(task.updated_at), "d MMM yyyy", { locale: es })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <Pencil className="mr-1 h-4 w-4" />
                    Editar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-400/20 dark:text-red-400 dark:hover:bg-red-400/30"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 