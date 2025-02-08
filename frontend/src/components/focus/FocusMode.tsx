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
}

export function FocusMode({ task: initialTask, defaultDuration = 25 }: FocusModeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(initialTask || null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Handle timer completion
  const handleTimerComplete = useCallback(async () => {
    if (currentSessionId && user) {
      try {
        await updateFocusSession(currentSessionId, {
          status: FocusSessionStatus.COMPLETED,
          end_time: new Date().toISOString(),
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
  const handleTimerStart = useCallback(async () => {
    if (user) {
      try {
        const session = await createFocusSession({
          user_id: user.id,
          task_id: selectedTask?.id || null,
          start_time: new Date().toISOString(),
          status: FocusSessionStatus.ACTIVE,
          duration: defaultDuration * 60, // Convert to seconds
        });
        setCurrentSessionId(session.id);
      } catch (error) {
        console.error('Error creating focus session:', error);
        toast({
          title: "Error",
          description: "No se pudo iniciar la sesión de enfoque.",
          variant: "destructive",
        });
      }
    }
  }, [user, selectedTask, defaultDuration, toast]);

  // Handle timer interruption
  const handleTimerInterrupt = useCallback(async () => {
    if (currentSessionId && user) {
      try {
        await updateFocusSession(currentSessionId, {
          status: FocusSessionStatus.INTERRUPTED,
          end_time: new Date().toISOString(),
        });
        setCurrentSessionId(null);
      } catch (error) {
        console.error('Error interrupting focus session:', error);
      }
    }
  }, [currentSessionId, user]);

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
        handleTimerInterrupt();
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