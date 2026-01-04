'use client';

import { useEffect, useState, useRef, useCallback, Fragment } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Task, TaskStatus, getTaskById, updateTask, deleteTask } from '@/lib/tasks';
import { useAuth } from '@/components/AuthProvider';
import Auth from '@/components/Auth';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { useTags } from '@/contexts/TagContext';
import { useToast } from '@/components/ui/use-toast';
import { createFocusSession, updateFocusSession, FocusSessionStatus, getFocusSessions } from '@/lib/focus';
import { useComments } from '@/hooks/useComments';
import { useSubtasks } from '@/hooks/useSubtasks';

// Import new components
import {
  TaskDetailLayout,
  TaskHeader,
  TaskTitle,
  TaskPropertiesGrid,
  TaskDescription,
  SubtasksSection,
  TaskFocusSection,
  ActivitySidebar,
} from '@/components/tasks/detail';
import { AIAssistantPanel } from '@/components/ai';

// Type for focus sessions with task info
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
  const { tags: userTags } = useTags();
  const { toast } = useToast();

  // Task state
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Focus state
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [focusSessions, setFocusSessions] = useState<FocusSessionWithTask[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const isCreatingSession = useRef(false);

  // AI state
  const [showAI, setShowAI] = useState(false);

  // Comments hook
  const {
    comments,
    isLoading: isLoadingComments,
    addComment,
    removeComment,
  } = useComments(id as string, user?.id);

  // Subtasks hook
  const {
    subtasks,
    isLoading: isLoadingSubtasks,
    addSubtask,
    addSubtasksFromAI,
    updateSubtaskItem,
    removeSubtask,
    toggleStatus: toggleSubtaskStatus,
    completedCount,
    totalCount,
  } = useSubtasks(id as string, user?.id);

  // Fetch task
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

  // Fetch focus sessions
  const fetchFocusSessions = useCallback(async () => {
    if (!user || !id) return;

    setIsLoadingSessions(true);
    try {
      const sessions = await getFocusSessions({ userId: user.id });
      const taskSessions = sessions.filter(session => session.task_id === id);
      setFocusSessions(taskSessions);
    } catch (error) {
      console.error('Error fetching focus sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [user, id]);

  // Check active session
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
    }
  }, [user, id, fetchTask, checkActiveSession, fetchFocusSessions]);

  // Handlers
  const handleStatusToggle = async () => {
    if (!task) return;

    setIsUpdating(true);
    try {
      const newStatus = task.status === TaskStatus.COMPLETED
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
    if (!window.confirm('¿Estas seguro de que quieres eliminar esta tarea?')) return;

    setIsUpdating(true);
    try {
      await deleteTask(task.id);
      toast({
        title: 'Tarea eliminada',
        description: 'La tarea ha sido eliminada correctamente',
      });
      router.push('/tasks');
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

  const handleTitleSave = async (newTitle: string) => {
    if (!task) return;

    setIsUpdating(true);
    try {
      await updateTask(task.id, { title: newTitle });
      setTask({ ...task, title: newTitle });
      toast({
        title: 'Titulo actualizado',
        description: 'El titulo de la tarea ha sido actualizado',
      });
    } catch (error) {
      console.error('Error updating task title:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el titulo',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDescriptionSave = async (newDescription: string) => {
    if (!task) return;

    setIsUpdating(true);
    try {
      await updateTask(task.id, { description: newDescription });
      setTask({ ...task, description: newDescription });
      toast({
        title: 'Descripcion actualizada',
        description: 'La descripcion de la tarea ha sido actualizada',
      });
    } catch (error) {
      console.error('Error updating task description:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la descripcion',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
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
        description: `La tarea ahora esta ${newStatus === 'completed' ? 'completada' : newStatus === 'in_progress' ? 'en progreso' : 'pendiente'}`,
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

  const handlePriorityChange = async (newPriority: number) => {
    if (!task) return;

    setIsUpdating(true);
    try {
      await updateTask(task.id, { priority: newPriority });
      setTask({ ...task, priority: newPriority });

      const labels = { 1: 'Baja', 2: 'Media', 3: 'Alta', 4: 'Urgente' };
      toast({
        title: 'Prioridad actualizada',
        description: `Prioridad cambiada a ${labels[newPriority as keyof typeof labels] || 'desconocida'}`,
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

  const handleDueDateChange = async (newDate: string | null) => {
    if (!task) return;

    setIsUpdating(true);
    try {
      await updateTask(task.id, { due_date: newDate });
      setTask({ ...task, due_date: newDate });

      toast({
        title: newDate ? 'Fecha actualizada' : 'Fecha eliminada',
        description: newDate
          ? `Fecha limite: ${format(parseISO(newDate), "d MMM yyyy", { locale: es })}`
          : 'Se ha eliminado la fecha limite',
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

  // Focus session handlers
  const handleFocusStart = async (duration: number) => {
    if (!user || !task) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para iniciar una sesion de enfoque.",
        variant: "destructive",
      });
      return;
    }

    if (isCreatingSession.current) return;
    isCreatingSession.current = true;

    try {
      if (currentSessionId) {
        await updateFocusSession(currentSessionId, {
          status: FocusSessionStatus.INTERRUPTED,
          end_time: new Date().toISOString(),
        });
      }

      const session = await createFocusSession({
        user_id: user.id,
        task_id: task.id,
        duration: duration > 0 ? Math.floor(duration / 60) : null,
        status: FocusSessionStatus.ACTIVE,
      });

      if (session.id) {
        setCurrentSessionId(session.id);
        toast({
          title: "Sesion iniciada",
          description: duration > 0
            ? "Tu sesion de enfoque programada ha comenzado."
            : "Tu sesion de enfoque libre ha comenzado.",
        });
      }
    } catch (error) {
      console.error('Error al iniciar la sesion de enfoque:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar la sesion de enfoque.",
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
      fetchFocusSessions();

      toast({
        title: "Felicidades!",
        description: "Has completado tu sesion de enfoque exitosamente.",
      });
    } catch (error) {
      console.error('Error al completar la sesion de enfoque:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la sesion de enfoque.",
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
      fetchFocusSessions();

      toast({
        title: "Sesion interrumpida",
        description: "La sesion de enfoque ha sido interrumpida.",
      });
    } catch (error) {
      console.error('Error al interrumpir la sesion de enfoque:', error);
      toast({
        title: "Error",
        description: "No se pudo interrumpir la sesion de enfoque.",
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
      fetchFocusSessions();

      toast({
        title: "Sesion completada",
        description: `Has completado una sesion de ${minutesElapsed} minutos.`,
      });
    } catch (error) {
      console.error('Error al finalizar el cronometro:', error);
      toast({
        title: "Error",
        description: "No se pudo finalizar la sesion de enfoque.",
        variant: "destructive",
      });
    }
  };

  // Calculate total focus time
  const totalFocusTime = focusSessions.reduce((total, session) => {
    return total + (session.duration || 0);
  }, 0);

  // Loading state
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Auth required
  if (!user) {
    return <Auth />;
  }

  // Task loading or not found
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-muted-foreground">Cargando tarea...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="text-lg text-muted-foreground mb-4">La tarea no existe o fue eliminada</div>
        <Link
          href="/tasks"
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          Ver todas las tareas
        </Link>
      </div>
    );
  }

  return (
    <>
    <TaskDetailLayout
      mainContent={
        <div className="space-y-6">
          <TaskHeader
            taskId={task.id}
            taskTitle={task.title}
            taskStatus={task.status}
            showFocusTimer={showFocusTimer}
            showAI={showAI}
            isUpdating={isUpdating}
            onToggleTimer={() => setShowFocusTimer(!showFocusTimer)}
            onToggleAI={() => setShowAI(!showAI)}
            onStatusToggle={handleStatusToggle}
            onDelete={handleDelete}
          />

          <TaskTitle
            title={task.title}
            onSave={handleTitleSave}
            isLoading={isUpdating}
          />

          <TaskPropertiesGrid
            status={task.status}
            priority={task.priority}
            dueDate={task.due_date}
            tags={task.tags || []}
            userTags={userTags}
            totalFocusTime={totalFocusTime}
            createdAt={task.created_at}
            isUpdating={isUpdating}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            onDueDateChange={handleDueDateChange}
            onTagsChange={handleTagsChange}
          />

          <TaskDescription
            description={task.description}
            onSave={handleDescriptionSave}
            isLoading={isUpdating}
          />

          <SubtasksSection
            task={task}
            subtasks={subtasks}
            isLoading={isLoadingSubtasks}
            completedCount={completedCount}
            totalCount={totalCount}
            onAddSubtask={addSubtask}
            onAddFromAI={addSubtasksFromAI}
            onToggleStatus={toggleSubtaskStatus}
            onUpdateSubtask={updateSubtaskItem}
            onDeleteSubtask={removeSubtask}
          />

          <TaskFocusSection
            isOpen={showFocusTimer}
            onToggle={() => setShowFocusTimer(!showFocusTimer)}
            onStart={handleFocusStart}
            onComplete={handleFocusComplete}
            onInterrupt={handleFocusInterrupt}
            onChronometerStop={handleChronometerStop}
          />
        </div>
      }
      sidebarContent={
        <ActivitySidebar
          taskId={task.id}
          focusSessions={focusSessions}
          comments={comments}
          onAddComment={addComment}
          onDeleteComment={removeComment}
          isLoadingSessions={isLoadingSessions}
          isLoadingComments={isLoadingComments}
        />
      }
    />

    {/* AI Assistant Panel */}
    <AIAssistantPanel
      task={task}
      isOpen={showAI}
      onClose={() => setShowAI(false)}
      onApplySuggestions={async (suggestions) => {
        if (suggestions.priority) {
          await handlePriorityChange(suggestions.priority);
        }
        if (suggestions.tags && suggestions.tags.length > 0) {
          const newTags = [...new Set([...(task.tags || []), ...suggestions.tags])];
          await handleTagsChange(newTags);
        }
      }}
    />
  </>
  );
}
