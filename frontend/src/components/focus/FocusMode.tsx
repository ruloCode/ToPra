'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/lib/tasks';
import { createFocusSession, updateFocusSession, FocusSessionStatus } from '@/lib/focus';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Timer } from './Timer';

interface FocusModeProps {
  task?: Task;
  defaultDuration?: number; // in minutes
}

export function FocusMode({ task, defaultDuration = 25 }: FocusModeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [breakTime, setBreakTime] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

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

  // Start a new focus session
  const startSession = useCallback(async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para usar el modo de enfoque',
        variant: 'destructive',
      });
      return;
    }

    try {
      const session = await createFocusSession({
        user_id: user.id,
        task_id: task?.id || null,
        start_time: new Date().toISOString(),
        status: FocusSessionStatus.ACTIVE,
      });

      setSessionId(session.id);
      await toggleFullscreen();
    } catch (error) {
      console.error('Error starting focus session:', {
        error,
        user_id: user.id,
        task_id: task?.id,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      toast({
        title: 'Error',
        description: error instanceof Error 
          ? `No se pudo iniciar la sesión de enfoque: ${error.message}`
          : 'No se pudo iniciar la sesión de enfoque',
        variant: 'destructive',
      });
    }
  }, [user, task, toggleFullscreen, toast]);

  // Complete the focus session
  const completeSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      await updateFocusSession(sessionId, {
        end_time: new Date().toISOString(),
        status: FocusSessionStatus.COMPLETED,
        duration: defaultDuration * 60, // Convert minutes to seconds
      });

      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      setBreakTime(true);
    } catch (error) {
      console.error('Error completing focus session:', error);
      toast({
        title: 'Error',
        description: 'No se pudo completar la sesión de enfoque',
        variant: 'destructive',
      });
    }
  }, [sessionId, defaultDuration, toast]);

  // Interrupt the focus session
  const interruptSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      await updateFocusSession(sessionId, {
        end_time: new Date().toISOString(),
        status: FocusSessionStatus.INTERRUPTED,
        duration: defaultDuration * 60, // Convert minutes to seconds
      });

      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      router.push('/tasks');
    } catch (error) {
      console.error('Error interrupting focus session:', error);
      toast({
        title: 'Error',
        description: 'No se pudo interrumpir la sesión de enfoque',
        variant: 'destructive',
      });
    }
  }, [sessionId, defaultDuration, router, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-900 p-4">
      <div className="w-full max-w-md space-y-8">
        {!sessionId ? (
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Modo Enfoque</h1>
            {task && (
              <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{task.title}</h2>
                {task.description && <p className="mt-2 text-slate-600 dark:text-slate-300">{task.description}</p>}
              </div>
            )}
            <Button onClick={startSession} size="lg" className="w-full bg-primary hover:bg-primary/90">
              Iniciar Sesión de Enfoque
            </Button>
          </div>
        ) : breakTime ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">¡Tiempo de Descanso!</h2>
            <Timer
              duration={5}
              onComplete={() => router.push('/tasks')}
              showControls={false}
            />
            <Button onClick={() => router.push('/tasks')} variant="outline" className="border-slate-200 dark:border-slate-700">
              Volver a Tareas
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <Timer
              duration={defaultDuration}
              onComplete={completeSession}
              showControls={true}
            />
            <div className="flex gap-4">
              <Button onClick={interruptSession} variant="destructive" className="flex-1">
                Interrumpir
              </Button>
              <Button 
                onClick={toggleFullscreen} 
                variant="outline" 
                className="flex-1 border-slate-200 dark:border-slate-700"
              >
                {isFullscreen ? 'Salir Pantalla Completa' : 'Pantalla Completa'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 