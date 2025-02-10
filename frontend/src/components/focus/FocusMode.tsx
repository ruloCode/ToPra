'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Task } from '@/lib/tasks';
import { useToast } from '@/components/ui/use-toast';
import { TaskSearch } from './TaskSearch';
import { useAuth } from '@/components/AuthProvider';
import { createFocusSession, updateFocusSession, FocusSessionStatus, getFocusSessions } from '@/lib/focus';
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

  // Separar la carga inicial y el manejo de errores
  useEffect(() => {
    const loadActiveSession = async () => {
      if (!user) return;
      try {
        const sessions = await getFocusSessions({ 
          userId: user.id,
          status: FocusSessionStatus.ACTIVE 
        });
        const activeSession = sessions[0];
        
        // Solo actualizar el estado si realmente hay una sesión activa
        if (activeSession?.id && activeSession.id !== currentSessionId) {
          setCurrentSessionId(activeSession.id);
          setSelectedTask(activeSession.task || null);
          setTimerMode(activeSession.duration ? 'timer' : 'chronometer');
        }
      } catch (error) {
        console.error('Error loading active session:', error);
      }
    };
    
    loadActiveSession();
  }, [user, currentSessionId]);

  // Handle task selection
  const handleTaskSelect = useCallback(async (task: Task | null) => {
    if (!user) return;

    if (currentSessionId) {
      try {
        await updateFocusSession(currentSessionId, {
          task_id: task?.id || null
        });
        setSelectedTask(task);
        toast({
          title: task ? "Tarea actualizada" : "Tarea removida",
          description: task ? "Se ha vinculado una nueva tarea a la sesión" : "Se ha desvinculado la tarea de la sesión",
        });
      } catch (error) {
        console.error('Error updating session task:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar la tarea de la sesión",
          variant: "destructive",
        });
      }
    } else {
      setSelectedTask(task);
    }
  }, [currentSessionId, user, toast]);

  // Handle chronometer stop
  const handleChronometerStop = useCallback(async (elapsedMinutes: number) => {
    if (!user || !currentSessionId) return;

    try {
      await updateFocusSession(currentSessionId, {
        status: FocusSessionStatus.COMPLETED,
        end_time: new Date().toISOString(),
        duration: elapsedMinutes, // Aquí guardamos los minutos que vienen del cronómetro
      });

      setCurrentSessionId(null);
      await historyRef.current?.reloadSessions();

      toast({
        title: "¡Bien hecho!",
        description: `Has completado una sesión de ${elapsedMinutes} minutos.`,
      });
    } catch (error) {
      console.error('Error al finalizar la sesión:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la sesión.",
        variant: "destructive",
      });
    }
  }, [user, currentSessionId, toast, historyRef]);

  // Handle timer interruption - solo para el temporizador
  const handleTimerInterrupt = useCallback(async (elapsedTime: number) => {
    if (!currentSessionId || !user || timerMode !== 'timer') return;

    try {
      const durationInMinutes = Math.ceil(elapsedTime / 60);
      await updateFocusSession(currentSessionId, {
        status: FocusSessionStatus.INTERRUPTED,
        end_time: new Date().toISOString(),
        duration: durationInMinutes > 0 ? durationInMinutes : null,
      });

      setCurrentSessionId(null);
      // Actualizar el historial
      await historyRef.current?.reloadSessions();
      toast({
        title: "Sesión interrumpida",
        description: `Has completado ${durationInMinutes} minutos de enfoque.`,
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
      const durationInMinutes = Math.ceil(elapsedTime / 60);
      await updateFocusSession(currentSessionId, {
        status: FocusSessionStatus.COMPLETED,
        end_time: new Date().toISOString(),
        duration: durationInMinutes,
      });

      setCurrentSessionId(null);
      // Actualizar el historial
      await historyRef.current?.reloadSessions();
      toast({
        title: "¡Felicidades!",
        description: `Has completado ${durationInMinutes} minutos de enfoque.`,
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

    if (isCreatingSession.current) return;
    isCreatingSession.current = true;

    try {
      const sessions = await getFocusSessions({ 
        userId: user.id,
        status: FocusSessionStatus.ACTIVE 
      });
      
      if (sessions[0]?.id) {
        // Finalizar la sesión activa anterior
        const startTime = new Date(sessions[0].start_time).getTime();
        const elapsedMinutes = Math.floor((Date.now() - startTime) / (1000 * 60));
        
        await updateFocusSession(sessions[0].id, {
          status: FocusSessionStatus.INTERRUPTED,
          end_time: new Date().toISOString(),
          duration: elapsedMinutes || null,
        });
      }

      const mode = _duration > 0 ? 'timer' : 'chronometer';
      const durationInMinutes = mode === 'timer' ? Math.floor(_duration / 60) : null;
      
      const session = await createFocusSession({
        user_id: user.id,
        task_id: selectedTask?.id || null,
        duration: durationInMinutes,
        status: FocusSessionStatus.ACTIVE,
      });

      if (!session?.id) return;

      setCurrentSessionId(session.id);
      setTimerMode(mode);
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
  }, [user, selectedTask, toast, historyRef]);

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
    <div className="w-full max-w-xl mx-auto px-2 sm:px-4 py-2 sm:py-6">
      <div className="w-full bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="space-y-2 sm:space-y-4">
          <div className="p-2 sm:p-4 border-b">
            <h2 className="text-sm sm:text-base lg:text-lg font-medium mb-2">Seleccionar Tarea (opcional)</h2>
            <TaskSearch
              selectedTask={selectedTask}
              onTaskSelect={handleTaskSelect}
            />
          </div>

          <div className="p-2 sm:p-4 max-w-[85vw] ">
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