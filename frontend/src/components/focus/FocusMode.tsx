'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/lib/tasks';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { TaskSearch } from './TaskSearch';
import { useAuth } from '@/components/AuthProvider';
import { createFocusSession, updateFocusSession, FocusSessionStatus } from '@/lib/focus';
import { FocusTimer } from './FocusTimer';

interface FocusModeProps {
  task?: Task;
  defaultDuration?: number; // in minutes
  onSessionChange?: () => void; // Callback para actualizar la lista
}

export function FocusMode({ 
  task: initialTask, 
  defaultDuration = 25,
  onSessionChange 
}: FocusModeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(initialTask || null);
  const [timerMode, setTimerMode] = useState<'timer' | 'chronometer'>('timer');
  const { toast } = useToast();
  const { user } = useAuth();

  // Notificar cambios en las sesiones
  const notifySessionChange = useCallback(() => {
    onSessionChange?.();
  }, [onSessionChange]);

  // Handle timer interruption (solo para temporizador)
  const handleTimerInterrupt = useCallback(async (elapsedTime: number) => {
    if (!currentSessionId || !user || timerMode !== 'timer') return;

    try {
      await updateFocusSession(currentSessionId, {
        status: FocusSessionStatus.INTERRUPTED,
        end_time: new Date().toISOString(),
        duration: elapsedTime > 0 ? elapsedTime : null,
      });

      setCurrentSessionId(null);
      notifySessionChange();
      
      toast({
        title: "Sesión interrumpida",
        description: "Has pausado tu sesión de enfoque.",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo interrumpir la sesión correctamente.",
        variant: "destructive",
      });
    }
  }, [currentSessionId, user, timerMode, toast, notifySessionChange]);

  // Handle timer completion
  const handleTimerComplete = useCallback(async (duration: number) => {
    if (!currentSessionId || !user) return;

    try {
      await updateFocusSession(currentSessionId, {
        status: FocusSessionStatus.COMPLETED,
        end_time: new Date().toISOString(),
        duration: duration > 0 ? duration : null,
      });

      setCurrentSessionId(null);
      notifySessionChange();
      
      toast({
        title: "¡Tiempo completado!",
        description: timerMode === 'timer' 
          ? "Has completado tu sesión de enfoque programada."
          : "Has completado tu sesión de enfoque libre.",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo guardar la sesión completada.",
        variant: "destructive",
      });
    }
  }, [currentSessionId, user, timerMode, toast, notifySessionChange]);

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
      notifySessionChange();
      
      toast({
        title: "Sesión iniciada",
        description: mode === 'timer' 
          ? "Tu sesión de enfoque programada ha comenzado."
          : "Tu sesión de enfoque libre ha comenzado.",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo iniciar la sesión de enfoque.",
        variant: "destructive",
      });
    }
  }, [user, selectedTask, toast, notifySessionChange]);

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
    <div className="w-full bg-card rounded-lg shadow-lg overflow-hidden">
      <div className="space-y-4 sm:space-y-6">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-base sm:text-lg font-medium mb-2">Seleccionar Tarea (opcional)</h2>
          <TaskSearch onTaskSelect={setSelectedTask} selectedTask={selectedTask} />
        </div>
        
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <FocusTimer
            defaultDuration={defaultDuration}
            onComplete={handleTimerComplete}
            onStart={handleTimerStart}
            onInterrupt={handleTimerInterrupt}
          />
          
          <div className="mt-4 sm:mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={toggleFullscreen}
              className="w-full sm:w-auto text-sm sm:text-base"
              size="sm"
            >
              {isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 