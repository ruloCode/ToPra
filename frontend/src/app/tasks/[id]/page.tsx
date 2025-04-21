'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Task, TaskStatus, getTaskById, updateTask, deleteTask } from '@/lib/tasks';
import { useAuth } from '@/components/AuthProvider';
import Auth from '@/components/Auth';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Circle, CheckCircle2, Trash2, ArrowLeft, Clock, TimerIcon, XIcon, CheckCircleIcon, AlertCircleIcon, PlayIcon, Edit2Icon, CheckIcon } from 'lucide-react';
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

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
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
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [isSavingTags, setIsSavingTags] = useState(false);

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
  }, [user, id]);

  useEffect(() => {
    if (task) {
      setDescriptionInput(task.description || '');
      setTitleInput(task.title || '');
      setTagsInput(task.tags?.join(', ') || '');
    }
  }, [task]);

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

  const fetchFocusSessions = async () => {
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
  };

  const checkActiveSession = async () => {
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

  const handleSaveTags = async () => {
    if (!task) return;
    
    setIsSavingTags(true);
    try {
      const tags = tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
      
      const updates = { tags };
      
      await updateTask(task.id, updates);
      setTask({ ...task, ...updates });
      setIsEditingTags(false);
      
      toast({
        title: 'Etiquetas actualizadas',
        description: 'Las etiquetas de la tarea han sido actualizadas',
      });
    } catch (error) {
      console.error('Error updating task tags:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron actualizar las etiquetas',
        variant: 'destructive',
      });
    } finally {
      setIsSavingTags(false);
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
              <div className="space-y-1 flex-1">
                {isEditingTitle ? (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        className="text-2xl font-bold w-full border-b border-border bg-transparent focus:border-accent outline-none p-1"
                        placeholder="Título de la tarea"
                      />
                    </div>
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
                  <div 
                    className="group relative" 
                    onClick={() => !isEditingTitle && setIsEditingTitle(true)}
                  >
                    <h1 className="text-2xl font-bold text-foreground group-hover:pr-7">{task.title}</h1>
                    <button
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-secondary/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingTitle(true);
                      }}
                    >
                      <Edit2Icon className="h-4 w-4 text-muted-foreground/70" />
                    </button>
                  </div>
                )}
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

                <button
                  onClick={toggleFocusTimer}
                  disabled={isUpdating || task.status === TaskStatus.COMPLETED}
                  className={`px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-colors ${
                    task.status === TaskStatus.COMPLETED ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="flex items-center">
                    {showFocusTimer ? (
                      <>
                        <XIcon className="mr-1 h-4 w-4" />
                        Ocultar timer
                      </>
                    ) : (
                      <>
                        <TimerIcon className="mr-1 h-4 w-4" />
                        Iniciar sesión de enfoque
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {showFocusTimer && (
              <div className="bg-card p-6 rounded-lg border dark:border-[#28282F] mb-6">
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

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-foreground">Descripción</h2>
                    <button
                      onClick={() => setIsEditingDescription(!isEditingDescription)}
                      className="p-1 text-muted-foreground/70 hover:text-accent hover:bg-accent/10 rounded-full transition-colors"
                    >
                      <Edit2Icon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {isEditingDescription ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <textarea
                          value={descriptionInput}
                          onChange={(e) => setDescriptionInput(e.target.value)}
                          rows={5}
                          className="w-full p-3 border border-border rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none"
                          placeholder="Añade una descripción utilizando Markdown"
                        />
                    
                      </div>
                      
                      {/* Vista previa */}
                      
                      
                      <div className="flex justify-between items-center">
                       
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingDescription(false);
                              setDescriptionInput(task?.description || '');
                            }}
                            className="px-3 py-1 text-sm rounded-md border border-border bg-background hover:bg-secondary/50"
                            disabled={isSavingDescription}
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveDescription}
                            className="px-3 py-1 text-sm rounded-md bg-accent text-white hover:bg-accent/90 flex items-center gap-1"
                            disabled={isSavingDescription}
                          >
                            {isSavingDescription ? 'Guardando...' : (
                              <>
                                <CheckIcon className="h-3 w-3" />
                                Guardar
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    task?.description ? (
                      <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert border border-transparent p-3 rounded-md hover:border-border/30 transition-colors">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {task.description}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div 
                        className="border border-dashed border-border rounded-md p-3 text-muted-foreground text-center hover:bg-card/50 transition-colors cursor-pointer"
                        onClick={() => setIsEditingDescription(true)}
                      >
                        Haz clic para añadir una descripción
                      </div>
                    )
                  )}
                </div>

                {task.tags && task.tags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-medium text-foreground">Etiquetas</h2>
                      <button
                        onClick={() => setIsEditingTags(!isEditingTags)}
                        className="p-1 text-muted-foreground/70 hover:text-accent hover:bg-accent/10 rounded-full transition-colors"
                      >
                        <Edit2Icon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {isEditingTags ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          className="w-full p-2 border border-border rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                          placeholder="Etiquetas separadas por comas (ej: personal, trabajo, urgente)"
                        />
                        
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingTags(false);
                              setTagsInput(task.tags?.join(', ') || '');
                            }}
                            className="px-3 py-1 text-sm rounded-md border border-border bg-background hover:bg-secondary/50"
                            disabled={isSavingTags}
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveTags}
                            className="px-3 py-1 text-sm rounded-md bg-accent text-white hover:bg-accent/90 flex items-center gap-1"
                            disabled={isSavingTags}
                          >
                            {isSavingTags ? 'Guardando...' : (
                              <>
                                <CheckIcon className="h-3 w-3" />
                                Guardar
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
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
                    )}
                  </div>
                )}

                {(!task.tags || task.tags.length === 0) && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-medium text-foreground">Etiquetas</h2>
                    </div>
                    
                    {isEditingTags ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          className="w-full p-2 border border-border rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                          placeholder="Etiquetas separadas por comas (ej: personal, trabajo, urgente)"
                        />
                        
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingTags(false);
                              setTagsInput('');
                            }}
                            className="px-3 py-1 text-sm rounded-md border border-border bg-background hover:bg-secondary/50"
                            disabled={isSavingTags}
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveTags}
                            className="px-3 py-1 text-sm rounded-md bg-accent text-white hover:bg-accent/90 flex items-center gap-1"
                            disabled={isSavingTags}
                          >
                            {isSavingTags ? 'Guardando...' : (
                              <>
                                <CheckIcon className="h-3 w-3" />
                                Guardar
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="border border-dashed border-border rounded-md p-3 text-muted-foreground text-center hover:bg-card/50 transition-colors cursor-pointer"
                        onClick={() => setIsEditingTags(true)}
                      >
                        Haz clic para añadir etiquetas
                      </div>
                    )}
                  </div>
                )}

                {/* Historial de sesiones de enfoque */}
                <div className="space-y-4 bg-card rounded-lg border p-4 dark:border-[#28282F]">
                  <h2 className="text-lg font-medium text-foreground">Historial de enfoque</h2>
                  
                  {isLoadingSessions ? (
                    <div className="py-4 text-center text-muted-foreground">
                      Cargando sesiones...
                    </div>
                  ) : focusSessions.length === 0 ? (
                    <div className="py-4 text-center text-muted-foreground">
                      No hay sesiones de enfoque para esta tarea
                    </div>
                  ) : (
                    <>
                      {/* Resumen de tiempo */}
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-4">
                        <div className="bg-background/50 p-2 rounded-md">
                          <div className="text-xs text-muted-foreground">Tiempo total</div>
                          <div className="text-foreground font-semibold">{formatSessionDuration(totalFocusTime)}</div>
                        </div>
                        <div className="bg-background/50 p-2 rounded-md">
                          <div className="text-xs text-muted-foreground">Sesiones</div>
                          <div className="text-foreground font-semibold">{focusSessions.length}</div>
                        </div>
                        <div className="bg-background/50 p-2 rounded-md">
                          <div className="text-xs text-muted-foreground">Completadas</div>
                          <div className="text-foreground font-semibold">{completedSessions}</div>
                        </div>
                        <div className="bg-background/50 p-2 rounded-md">
                          <div className="text-xs text-muted-foreground">Interrumpidas</div>
                          <div className="text-foreground font-semibold">{interruptedSessions}</div>
                        </div>
                      </div>

                      {/* Lista de sesiones */}
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                        {focusSessions.map(session => {
                          const statusInfo = getSessionStatusInfo(session.status);
                          const startTime = new Date(session.start_time);
                          const formattedDate = format(startTime, "d MMM yyyy, HH:mm", { locale: es });
                          
                          return (
                            <div 
                              key={session.id} 
                              className="p-3 bg-background/75 rounded-md border border-border/50 hover:border-border transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-1">
                                    {statusInfo.icon}
                                    <span className={`text-sm font-medium ${statusInfo.className}`}>
                                      {statusInfo.label}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {formattedDate}
                                  </div>
                                </div>
                                <div className="text-sm font-medium">
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