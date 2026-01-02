'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Task, TaskStatus, getTaskById, updateTask, deleteTask } from '@/lib/tasks';
import { useAuth } from '@/components/AuthProvider';
import Auth from '@/components/Auth';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Circle, CheckCircle2, Trash2, Clock, TimerIcon, XIcon, CheckCircleIcon, AlertCircleIcon, PlayIcon, Edit2Icon, CheckIcon, Calendar, Flag, ChevronDown, ChevronRight, MoreHorizontal, ChevronUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTags } from '@/contexts/TagContext';
import { getTagColorClasses } from '@/lib/tags';
import TagsDropdown from '@/components/tags/TagsDropdown';
import { useToast } from '@/components/ui/use-toast';
import { FocusTimer } from '@/components/focus/FocusTimer';
import { createFocusSession, updateFocusSession, FocusSessionStatus, getFocusSessions } from '@/lib/focus';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


// Definir el tipo para las sesiones de enfoque con información de tarea
type FocusSessionWithTask = {
  id: string;
  user_id: string;
  task_id: string | null;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  status: string;
  notes: string | null;
  rating: number | null;
  created_at?: string;
  updated_at?: string;
  task?: {
    id: string;
    title: string;
    description: string | null;
  } | null;
};

// Status configuration
const statusConfig = {
  pending: {
    label: 'Pendiente',
    icon: Circle,
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    dotColor: 'bg-gray-400',
  },
  in_progress: {
    label: 'En progreso',
    icon: Clock,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    dotColor: 'bg-blue-500',
  },
  completed: {
    label: 'Completada',
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    dotColor: 'bg-green-500',
  },
} as const;

// Priority configuration
const priorityConfig = {
  1: {
    label: 'Baja',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
  },
  2: {
    label: 'Media',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  3: {
    label: 'Alta',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  4: {
    label: 'Urgente',
    color: 'text-red-500',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
} as const;


export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { tags: userTags } = useTags();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previousPath, setPreviousPath] = useState('/tasks');
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [focusSessions, setFocusSessions] = useState<FocusSessionWithTask[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const isCreatingSession = useRef(false);
  const { toast } = useToast();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isSavingDescription, setIsSavingDescription] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const fetchTask = useCallback(async () => {
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
  }, [id, toast]);

  const fetchFocusSessions = useCallback(async () => {
    if (!user || !id) return;

    setIsLoadingSessions(true);
    try {
      const sessions = await getFocusSessions({
        userId: user.id
      });

      // Filtrar las sesiones para esta tarea específica
      const taskSessions = sessions.filter(session =>
        session.task_id === id
      );

      setFocusSessions(taskSessions);
    } catch (error) {
      console.error('Error fetching focus sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [user, id]);

  const checkActiveSession = useCallback(async () => {
    if (!user) return;

    try {
      const sessions = await getFocusSessions({
        userId: user.id,
        status: FocusSessionStatus.ACTIVE
      });

      const activeSession = sessions[0];

      if (activeSession) {
        setCurrentSessionId(activeSession.id);
        if (activeSession.task_id === id) {
          setShowFocusTimer(true);
        }
      }
    } catch (error) {
      console.error('Error checking active session:', error);
    }
  }, [user, id]);

  useEffect(() => {
    if (user && id) {
      fetchTask();
      checkActiveSession();
      fetchFocusSessions();

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
  }, [user, id, fetchTask, checkActiveSession, fetchFocusSessions]);

  useEffect(() => {
    if (task) {
      setDescriptionInput(task.description || '');
      setTitleInput(task.title || '');
    }
  }, [task]);

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

  const toggleFocusTimer = () => {
    setShowFocusTimer(!showFocusTimer);
  };

  const handleFocusStart = async (duration: number) => {
    if (!user || !task) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para iniciar una sesión de enfoque.",
        variant: "destructive",
      });
      return;
    }

    if (isCreatingSession.current) return;
    isCreatingSession.current = true;

    try {
      // Si ya hay una sesión activa, la interrumpimos
      if (currentSessionId) {
        await updateFocusSession(currentSessionId, {
          status: FocusSessionStatus.INTERRUPTED,
          end_time: new Date().toISOString(),
        });
      }

      // Creamos una nueva sesión
      const session = await createFocusSession({
        user_id: user.id,
        task_id: task.id,
        duration: duration > 0 ? Math.floor(duration / 60) : null,
        status: FocusSessionStatus.ACTIVE,
      });

      if (session.id) {
        setCurrentSessionId(session.id);
        toast({
          title: "Sesión iniciada",
          description: duration > 0 
            ? "Tu sesión de enfoque programada ha comenzado."
            : "Tu sesión de enfoque libre ha comenzado.",
        });
      }
    } catch (error) {
      console.error('Error al iniciar la sesión de enfoque:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar la sesión de enfoque.",
        variant: "destructive",
      });
    } finally {
      isCreatingSession.current = false;
    }
  };

  const handleFocusComplete = async (duration: number) => {
    if (!currentSessionId) return;

    try {
      await updateFocusSession(currentSessionId, {
        status: FocusSessionStatus.COMPLETED,
        end_time: new Date().toISOString(),
        duration: Math.floor(duration / 60),
      });

      setCurrentSessionId(null);
      // Refrescar la lista de sesiones
      fetchFocusSessions();
      
      toast({
        title: "¡Felicidades!",
        description: "Has completado tu sesión de enfoque exitosamente.",
      });
    } catch (error) {
      console.error('Error al completar la sesión de enfoque:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la sesión de enfoque.",
        variant: "destructive",
      });
    }
  };

  const handleFocusInterrupt = async (elapsedTime: number) => {
    if (!currentSessionId) return;

    try {
      await updateFocusSession(currentSessionId, {
        status: FocusSessionStatus.INTERRUPTED,
        end_time: new Date().toISOString(),
        duration: Math.floor(elapsedTime / 60),
      });

      setCurrentSessionId(null);
      // Refrescar la lista de sesiones
      fetchFocusSessions();
      
      toast({
        title: "Sesión interrumpida",
        description: "La sesión de enfoque ha sido interrumpida.",
      });
    } catch (error) {
      console.error('Error al interrumpir la sesión de enfoque:', error);
      toast({
        title: "Error",
        description: "No se pudo interrumpir la sesión de enfoque.",
        variant: "destructive",
      });
    }
  };

  const handleChronometerStop = async (minutesElapsed: number) => {
    if (!currentSessionId) return;

    try {
      await updateFocusSession(currentSessionId, {
        status: FocusSessionStatus.COMPLETED,
        end_time: new Date().toISOString(),
        duration: minutesElapsed,
      });

      setCurrentSessionId(null);
      // Refrescar la lista de sesiones
      fetchFocusSessions();
      
      toast({
        title: "Sesión completada",
        description: `Has completado una sesión de ${minutesElapsed} minutos.`,
      });
    } catch (error) {
      console.error('Error al finalizar el cronómetro:', error);
      toast({
        title: "Error",
        description: "No se pudo finalizar la sesión de enfoque.",
        variant: "destructive",
      });
    }
  };

  const getSessionStatusInfo = (status: string) => {
    switch (status) {
      case FocusSessionStatus.COMPLETED:
        return {
          icon: <CheckCircleIcon className="h-4 w-4 text-green-500" />,
          label: 'Completada',
          className: 'text-green-600 dark:text-green-400'
        };
      case FocusSessionStatus.INTERRUPTED:
        return {
          icon: <AlertCircleIcon className="h-4 w-4 text-orange-500" />,
          label: 'Interrumpida',
          className: 'text-orange-600 dark:text-orange-400'
        };
      case FocusSessionStatus.ACTIVE:
        return {
          icon: <PlayIcon className="h-4 w-4 text-blue-500" />,
          label: 'Activa',
          className: 'text-blue-600 dark:text-blue-400'
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-gray-500" />,
          label: 'Desconocido',
          className: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const formatSessionDuration = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} h`;
    }
    
    return `${hours} h ${remainingMinutes} min`;
  };

  const handleSaveDescription = async () => {
    if (!task) return;
    
    setIsSavingDescription(true);
    try {
      const updates = {
        description: descriptionInput
      };
      
      await updateTask(task.id, updates);
      setTask({ ...task, ...updates });
      setIsEditingDescription(false);
      
      toast({
        title: 'Descripción actualizada',
        description: 'La descripción de la tarea ha sido actualizada',
      });
    } catch (error) {
      console.error('Error updating task description:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la descripción',
        variant: 'destructive',
      });
    } finally {
      setIsSavingDescription(false);
    }
  };

  const handleSaveTitle = async () => {
    if (!task || !titleInput.trim()) return;
    
    setIsSavingTitle(true);
    try {
      const updates = {
        title: titleInput.trim()
      };
      
      await updateTask(task.id, updates);
      setTask({ ...task, ...updates });
      setIsEditingTitle(false);
      
      toast({
        title: 'Título actualizado',
        description: 'El título de la tarea ha sido actualizado',
      });
    } catch (error) {
      console.error('Error updating task title:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el título',
        variant: 'destructive',
      });
    } finally {
      setIsSavingTitle(false);
    }
  };

  // Inline status change handler
  const handleInlineStatusChange = async (newStatus: string) => {
    if (!task) return;

    setIsUpdating(true);
    try {
      const updates = {
        status: newStatus,
        completed_at: newStatus === TaskStatus.COMPLETED ? new Date().toISOString() : null
      };

      await updateTask(task.id, updates);
      setTask({ ...task, ...updates });

      toast({
        title: 'Estado actualizado',
        description: `La tarea ahora está ${statusConfig[newStatus as keyof typeof statusConfig]?.label || newStatus}`,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Inline priority change handler
  const handleInlinePriorityChange = async (newPriority: number) => {
    if (!task) return;

    setIsUpdating(true);
    try {
      await updateTask(task.id, { priority: newPriority });
      setTask({ ...task, priority: newPriority });

      toast({
        title: 'Prioridad actualizada',
        description: `Prioridad cambiada a ${priorityConfig[newPriority as keyof typeof priorityConfig]?.label || 'desconocida'}`,
      });
    } catch (error) {
      console.error('Error updating task priority:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la prioridad',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Inline due date change handler
  const handleInlineDueDateChange = async (newDate: string | null) => {
    if (!task) return;

    setIsUpdating(true);
    try {
      await updateTask(task.id, { due_date: newDate });
      setTask({ ...task, due_date: newDate });

      toast({
        title: newDate ? 'Fecha actualizada' : 'Fecha eliminada',
        description: newDate
          ? `Fecha límite: ${format(parseISO(newDate), "d MMM yyyy", { locale: es })}`
          : 'Se ha eliminado la fecha límite',
      });
    } catch (error) {
      console.error('Error updating task due date:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la fecha',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Inline tags change handler
  const handleTagsChange = async (newTags: string[]) => {
    if (!task) return;

    setIsUpdating(true);
    try {
      await updateTask(task.id, { tags: newTags });
      setTask({ ...task, tags: newTags });
    } catch (error) {
      console.error('Error updating task tags:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron actualizar las etiquetas',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
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

  // Calcular el tiempo total invertido en esta tarea
  const totalFocusTime = focusSessions.reduce((total, session) => {
    return total + (session.duration || 0);
  }, 0);

  // Contar sesiones por estado
  const completedSessions = focusSessions.filter(s => s.status === FocusSessionStatus.COMPLETED).length;
  const interruptedSessions = focusSessions.filter(s => s.status === FocusSessionStatus.INTERRUPTED).length;

  return (
    <main className="main-content min-h-screen bg-background px-4 py-6 md:px-8">
      <div className="mx-auto md:max-w-[60vw]">
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
            {/* Breadcrumb + Actions Header */}
            <div className="flex items-center justify-between">
              <nav className="flex items-center gap-2 text-sm">
                <Link
                  href="/tasks"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tareas
                </Link>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium truncate max-w-[200px]">
                  {task.title}
                </span>
              </nav>

              {/* Compact Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleFocusTimer}
                  disabled={isUpdating || task.status === TaskStatus.COMPLETED}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    showFocusTimer
                      ? "bg-accent text-white"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    task.status === TaskStatus.COMPLETED && "opacity-50 cursor-not-allowed"
                  )}
                  title={showFocusTimer ? "Ocultar timer" : "Iniciar sesión de enfoque"}
                >
                  <TimerIcon className="h-5 w-5" />
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={handleStatusChange}
                      disabled={isUpdating}
                    >
                      {task.status === TaskStatus.COMPLETED ? (
                        <>
                          <Circle className="mr-2 h-4 w-4" />
                          Marcar como pendiente
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Marcar como completada
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar tarea
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Editable Title */}
            <div className="space-y-1">
              {isEditingTitle ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="text-2xl font-bold w-full border-b-2 border-accent bg-transparent outline-none p-1"
                    placeholder="Título de la tarea"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') {
                        setIsEditingTitle(false);
                        setTitleInput(task?.title || '');
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingTitle(false);
                        setTitleInput(task?.title || '');
                      }}
                      className="px-3 py-1 text-xs rounded-md border border-border bg-background hover:bg-secondary/50"
                      disabled={isSavingTitle}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveTitle}
                      className="px-3 py-1 text-xs rounded-md bg-accent text-white hover:bg-accent/90 flex items-center gap-1"
                      disabled={isSavingTitle || !titleInput.trim()}
                    >
                      {isSavingTitle ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </div>
              ) : (
                <h1
                  className="text-2xl font-bold text-foreground cursor-pointer hover:text-accent/80 transition-colors"
                  onClick={() => setIsEditingTitle(true)}
                  title="Click para editar"
                >
                  {task.title}
                </h1>
              )}
            </div>

            {/* Metadata Grid */}
            <div className="flex flex-wrap gap-3 py-3 border-y border-border">
              {/* Status Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      statusConfig[task.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-700'
                    )}
                    disabled={isUpdating}
                  >
                    <span className={cn("h-2 w-2 rounded-full", statusConfig[task.status as keyof typeof statusConfig]?.dotColor || 'bg-gray-400')} />
                    {statusConfig[task.status as keyof typeof statusConfig]?.label || task.status}
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const IconComponent = config.icon;
                    return (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleInlineStatusChange(status)}
                        className={cn(
                          "flex items-center gap-2",
                          task.status === status && "bg-accent/10"
                        )}
                      >
                        <IconComponent className={cn("h-4 w-4", config.color.split(' ')[1])} />
                        {config.label}
                        {task.status === status && <CheckIcon className="ml-auto h-4 w-4 text-accent" />}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Priority Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      task.priority
                        ? priorityConfig[task.priority as keyof typeof priorityConfig]?.bgColor
                        : 'bg-muted',
                      task.priority
                        ? priorityConfig[task.priority as keyof typeof priorityConfig]?.color
                        : 'text-muted-foreground'
                    )}
                    disabled={isUpdating}
                  >
                    <Flag className="h-3.5 w-3.5" />
                    {task.priority
                      ? priorityConfig[task.priority as keyof typeof priorityConfig]?.label
                      : 'Prioridad'}
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {Object.entries(priorityConfig).map(([priority, config]) => (
                    <DropdownMenuItem
                      key={priority}
                      onClick={() => handleInlinePriorityChange(Number(priority))}
                      className={cn(
                        "flex items-center gap-2",
                        task.priority === Number(priority) && "bg-accent/10"
                      )}
                    >
                      <Flag className={cn("h-4 w-4", config.color)} />
                      <span className={config.color}>{config.label}</span>
                      {task.priority === Number(priority) && <CheckIcon className="ml-auto h-4 w-4 text-accent" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Due Date Picker */}
              <div className="relative">
                <div
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    task.due_date
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'bg-muted text-muted-foreground hover:bg-secondary'
                  )}
                  onClick={() => dateInputRef.current?.showPicker?.()}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  {task.due_date
                    ? format(parseISO(task.due_date), 'd MMM yyyy', { locale: es })
                    : 'Fecha límite'}
                  {task.due_date && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInlineDueDateChange(null);
                      }}
                      className="hover:text-purple-900 dark:hover:text-purple-200 z-10"
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <input
                  ref={dateInputRef}
                  type="date"
                  value={task.due_date || ''}
                  onChange={(e) => handleInlineDueDateChange(e.target.value || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {/* Tags Dropdown */}
              <TagsDropdown
                selectedTags={task.tags || []}
                onTagsChange={handleTagsChange}
                showSelectedChips={false}
              />

              {/* Display selected tags as chips */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center">
                  {task.tags.map((tagName, index) => {
                    const tag = userTags.find((t) => t.name === tagName);
                    const colorClasses = tag
                      ? getTagColorClasses(tag.color)
                      : getTagColorClasses('blue');
                    return (
                      <span
                        key={index}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                          colorClasses.bg,
                          colorClasses.text
                        )}
                      >
                        {tagName}
                        <button
                          onClick={() => handleTagsChange(task.tags?.filter(t => t !== tagName) || [])}
                          className="hover:opacity-70"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Created date - subtle */}
              <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Creada {format(parseISO(task.created_at), "d MMM yyyy", { locale: es })}
              </div>
            </div>

            {/* Focus Timer */}
            {showFocusTimer && (
              <div className="bg-card p-6 rounded-lg border dark:border-[#28282F]">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-foreground">Sesión de enfoque</h2>
                  <button
                    onClick={toggleFocusTimer}
                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-md transition-colors"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
                <FocusTimer
                  onStart={handleFocusStart}
                  onComplete={handleFocusComplete}
                  onInterrupt={handleFocusInterrupt}
                  onChronometerStop={handleChronometerStop}
                />
              </div>
            )}

            {/* Description Section with Show More/Less */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-foreground">Descripción</h2>
                {!isEditingDescription && (
                  <button
                    onClick={() => setIsEditingDescription(true)}
                    className="p-1.5 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-md transition-colors"
                    title="Editar descripción"
                  >
                    <Edit2Icon className="h-4 w-4" />
                  </button>
                )}
              </div>

              {isEditingDescription ? (
                <div className="space-y-3">
                  <textarea
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    rows={8}
                    className="w-full p-3 border border-border rounded-lg bg-background focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-y min-h-[120px]"
                    placeholder="Añade una descripción utilizando Markdown..."
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingDescription(false);
                        setDescriptionInput(task?.description || '');
                      }}
                      className="px-4 py-2 text-sm rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors"
                      disabled={isSavingDescription}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDescription}
                      className="px-4 py-2 text-sm rounded-lg bg-accent text-white hover:bg-accent/90 flex items-center gap-1.5 transition-colors"
                      disabled={isSavingDescription}
                    >
                      {isSavingDescription ? (
                        'Guardando...'
                      ) : (
                        <>
                          <CheckIcon className="h-4 w-4" />
                          Guardar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : task?.description ? (
                <div className="relative">
                  <div
                    className={cn(
                      "prose prose-sm max-w-none text-text-secondary dark:prose-invert p-3 rounded-lg bg-background-paper/50 border border-transparent hover:border-border/50 transition-colors cursor-pointer overflow-hidden",
                      !showFullDescription && task.description.split('\n').length > 5 && "max-h-[180px]"
                    )}
                    onClick={() => setIsEditingDescription(true)}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {task.description}
                    </ReactMarkdown>
                  </div>
                  {task.description.split('\n').length > 5 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFullDescription(!showFullDescription);
                      }}
                      className="mt-2 flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
                    >
                      {showFullDescription ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Mostrar menos
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Mostrar más
                        </>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div
                  className="border border-dashed border-border rounded-lg p-6 text-muted-foreground text-center hover:bg-card/50 hover:border-accent/30 transition-colors cursor-pointer"
                  onClick={() => setIsEditingDescription(true)}
                >
                  <Edit2Icon className="h-5 w-5 mx-auto mb-2 opacity-50" />
                  <span>Haz clic para añadir una descripción</span>
                </div>
              )}
            </div>

            {/* Focus History */}
            <div className="space-y-4 bg-card rounded-lg border p-5 dark:border-[#28282F]">
              <h2 className="text-lg font-medium text-foreground">Historial de enfoque</h2>

              {isLoadingSessions ? (
                <div className="py-6 text-center text-muted-foreground">
                  Cargando sesiones...
                </div>
              ) : focusSessions.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  <TimerIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>No hay sesiones de enfoque para esta tarea</p>
                  {task.status !== TaskStatus.COMPLETED && (
                    <button
                      onClick={toggleFocusTimer}
                      className="mt-3 text-sm text-accent hover:text-accent/80"
                    >
                      Iniciar primera sesión
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="bg-background/50 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">Tiempo total</div>
                      <div className="text-lg font-semibold text-foreground">{formatSessionDuration(totalFocusTime)}</div>
                    </div>
                    <div className="bg-background/50 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">Sesiones</div>
                      <div className="text-lg font-semibold text-foreground">{focusSessions.length}</div>
                    </div>
                    <div className="bg-background/50 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">Completadas</div>
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">{completedSessions}</div>
                    </div>
                    <div className="bg-background/50 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">Interrumpidas</div>
                      <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">{interruptedSessions}</div>
                    </div>
                  </div>

                  {/* Sessions List */}
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {focusSessions.map(session => {
                      const statusInfo = getSessionStatusInfo(session.status);
                      const startTime = new Date(session.start_time);
                      const formattedDate = format(startTime, "d MMM yyyy, HH:mm", { locale: es });

                      return (
                        <div
                          key={session.id}
                          className="p-3 bg-background/75 rounded-lg border border-border/50 hover:border-border transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                {statusInfo.icon}
                                <span className={cn("text-sm font-medium", statusInfo.className)}>
                                  {statusInfo.label}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {formattedDate}
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                              {formatSessionDuration(session.duration)}
                            </div>
                          </div>

                          {session.notes && (
                            <div className="mt-2 text-xs text-muted-foreground border-t border-border/50 pt-2">
                              {session.notes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 