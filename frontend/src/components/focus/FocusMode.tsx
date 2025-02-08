'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/lib/tasks';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { TaskSearch } from './TaskSearch';
import { useAuth } from '@/components/AuthProvider';
import { createFocusSession, updateFocusSession, FocusSessionStatus } from '@/lib/focus';
import { FocusTimer } from './FocusTimer';
import { PostgrestError } from '@supabase/supabase-js';

interface FocusModeProps {
  task?: Task;
  defaultDuration?: number; // in minutes
}

export function FocusMode({ task: initialTask, defaultDuration = 25 }: FocusModeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(initialTask || null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Handle timer completion
  const handleTimerComplete = useCallback(async (duration: number) => {
    if (currentSessionId && user) {
      try {
        await updateFocusSession(currentSessionId, {
          status: FocusSessionStatus.COMPLETED,
          end_time: new Date().toISOString(),
          duration: duration || null,
        });
        
        toast({
          title: "¡Tiempo completado!",
          description: "Has completado tu sesión de enfoque.",
        });
      } catch (error) {
        console.error('Error updating focus session:', error);
        toast({
          title: "Error",
          description: "No se pudo guardar la sesión completada.",
          variant: "destructive",
        });
      }
    }
  }, [currentSessionId, user, toast]);

  // Handle timer start
  const handleTimerStart = useCallback(async (duration: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para registrar tu tiempo de enfoque.",
        variant: "destructive",
      });
      return;
    }

    try {
      const sessionData = {
        user_id: user.id,
        task_id: selectedTask?.id || null,
        duration: duration || null,
        // Dejamos que la BD maneje los valores por defecto
      };

      console.log('Creating focus session with data:', sessionData);
      const session = await createFocusSession(sessionData);
      console.log('Focus session created:', session);

      if (session?.id) {
        setCurrentSessionId(session.id);
        toast({
          title: "Sesión iniciada",
          description: "Tu sesión de enfoque ha comenzado.",
        });
      } else {
        throw new Error('No se recibió ID de sesión');
      }
    } catch (error) {
      const pgError = error as PostgrestError;
      console.error('Error creating focus session:', {
        error: pgError,
        message: pgError?.message,
        details: pgError?.details,
        user_id: user.id,
        task_id: selectedTask?.id,
        duration
      });
      toast({
        title: "Error",
        description: pgError?.message || "No se pudo iniciar la sesión de enfoque. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  }, [user, selectedTask, toast]);

  // Handle timer interruption
  const handleTimerInterrupt = useCallback(async (elapsedTime: number) => {
    if (!currentSessionId || !user) return;

    try {
      const updateData = {
        status: FocusSessionStatus.INTERRUPTED,
        end_time: new Date().toISOString(),
        duration: elapsedTime || null,
      };

      console.log('Interrupting session with data:', { sessionId: currentSessionId, ...updateData });
      await updateFocusSession(currentSessionId, updateData);
      setCurrentSessionId(null);
    } catch (error) {
      const pgError = error as PostgrestError;
      console.error('Error interrupting focus session:', {
        error: pgError,
        message: pgError?.message,
        sessionId: currentSessionId,
        elapsedTime
      });
      toast({
        title: "Error",
        description: pgError?.message || "No se pudo interrumpir la sesión correctamente.",
        variant: "destructive",
      });
    }
  }, [currentSessionId, user, toast]);

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
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentSessionId) {
        handleTimerInterrupt(0);
      }
    };
  }, [currentSessionId, handleTimerInterrupt]);

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