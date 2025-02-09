'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Task } from '@/lib/tasks';
import { useToast } from '@/components/ui/use-toast';
import { TaskSearch } from './TaskSearch';
import { useAuth } from '@/components/AuthProvider';
import { createFocusSession, updateFocusSession, FocusSessionStatus } from '@/lib/focus';
import { FocusTimer } from './FocusTimer';
import type { FocusHistoryRef } from './FocusHistory';

interface FocusModeProps {
  task?: Task;
  defaultDuration?: number;
  historyRef: React.RefObject<FocusHistoryRef>;
}

export function FocusMode({
  task: initialTask,
  defaultDuration = 25,
  historyRef,
}: FocusModeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(initialTask || null);
  const [timerMode, setTimerMode] = useState<'timer' | 'chronometer'>('timer');
  const { toast } = useToast();
  const { user } = useAuth();
  const isCreatingSession = useRef(false);

  // Handle task selection
  const handleTaskSelect = useCallback((task: Task | null) => {
    if (!currentSessionId) {
      setSelectedTask(task);
    }
  }, [currentSessionId]);

  // Handle chronometer stop
  const handleChronometerStop = useCallback(async (elapsedTime: number) => {
    if (!currentSessionId || !user || timerMode !== 'chronometer') return;

    try {
      await updateFocusSession(currentSessionId, {
        status: FocusSessionStatus.COMPLETED,
        end_time: new Date().toISOString(),
        duration: elapsedTime,
      });

      setCurrentSessionId(null);
      await historyRef.current?.reloadSessions();
      toast({
        title: "¡Sesión finalizada!",
        description: `Has completado ${Math.floor(elapsedTime / 60)} minutos de enfoque.`,
      });
    } catch (error) {
      console.error('Error completing session:', error);
      toast({
        title: "Error",
        description: "No se pudo finalizar la sesión correctamente.",
        variant: "destructive",
      });
    }
  }, [currentSessionId, user, timerMode, toast, historyRef]);

  // Handle timer interruption - solo para el temporizador
  const handleTimerInterrupt = useCallback(async (elapsedTime: number) => {
    if (!currentSessionId || !user || timerMode !== 'timer') return;

    try {
      await updateFocusSession(currentSessionId, {
        status: FocusSessionStatus.INTERRUPTED,
        end_time: new Date().toISOString(),
        duration: elapsedTime > 0 ? elapsedTime : null,
      });

      setCurrentSessionId(null);
      // Actualizar el historial
      await historyRef.current?.reloadSessions();
      toast({
        title: "Sesión interrumpida",
        description: "Has pausado tu sesión de enfoque.",
      });
    } catch (error) {
      console.error('Error interrupting session:', error);
      toast({
        title: "Error",
        description: "No se pudo interrumpir la sesión correctamente.",
        variant: "destructive",
      });
    }
  }, [currentSessionId, user, timerMode, toast, historyRef]);

  // Handle timer completion
  const handleTimerComplete = useCallback(async (elapsedTime: number) => {
    if (!currentSessionId || !user || timerMode !== 'timer') return;

    try {
      await updateFocusSession(currentSessionId, {
        status: FocusSessionStatus.COMPLETED,
        end_time: new Date().toISOString(),
        duration: elapsedTime,
      });

      setCurrentSessionId(null);
      // Actualizar el historial
      await historyRef.current?.reloadSessions();
      toast({
        title: "¡Felicidades!",
        description: "Has completado tu sesión de enfoque.",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo completar la sesión correctamente.",
        variant: "destructive",
      });
    }
  }, [currentSessionId, user, timerMode, toast, historyRef]);

  // Handle timer start
  const handleTimerStart = useCallback(async (_duration: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para registrar tu tiempo de enfoque.",
        variant: "destructive",
      });
      return;
    }

    if (currentSessionId) {
      toast({
        title: "Error",
        description: "Ya hay una sesión activa.",
        variant: "destructive",
      });
      return;
    }

    // Prevenir múltiples creaciones de sesión
    if (isCreatingSession.current) {
      return;
    }

    isCreatingSession.current = true;

    try {
      const mode = _duration > 0 ? 'timer' : 'chronometer';
      const session = await createFocusSession({
        user_id: user.id,
        task_id: selectedTask?.id || null,
        duration: mode === 'timer' ? _duration : null,
        status: FocusSessionStatus.ACTIVE,
      });

      if (!session?.id) return;

      setCurrentSessionId(session.id);
      setTimerMode(mode);
      // Actualizar el historial
      await historyRef.current?.reloadSessions();
      toast({
        title: "Sesión iniciada",
        description: mode === 'timer' 
          ? "Tu sesión de enfoque programada ha comenzado."
          : "Tu sesión de enfoque libre ha comenzado.",
      });
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar la sesión de enfoque.",
        variant: "destructive",
      });
    } finally {
      isCreatingSession.current = false;
    }
  }, [user, selectedTask, currentSessionId, toast, historyRef]);

  // Update selected task when initial task changes
  useEffect(() => {
    setSelectedTask(initialTask || null);
  }, [initialTask]);

  // Handle fullscreen changes
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo activar el modo pantalla completa',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="space-y-8">
      <div className="w-full bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="space-y-4 sm:space-y-6">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-base sm:text-lg font-medium mb-2">Seleccionar Tarea (opcional)</h2>
            <TaskSearch
              selectedTask={selectedTask}
              onTaskSelect={handleTaskSelect}
            />
          </div>

          <div className="p-4 sm:p-6">
            <FocusTimer
              defaultDuration={defaultDuration}
              onStart={handleTimerStart}
              onInterrupt={handleTimerInterrupt}
              onComplete={handleTimerComplete}
              onChronometerStop={handleChronometerStop}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}