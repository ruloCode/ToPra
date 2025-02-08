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
        end_time: null,
        duration: null,
        status: FocusSessionStatus.ACTIVE,
        notes: null,
        rating: null
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
    <div className="w-full max-w-2xl p-8 rounded-lg bg-card text-card-foreground shadow-lg">
      <div className="space-y-6">
        {task && (
          <div className="text-xl font-semibold text-primary">{task.title}</div>
        )}
        <Timer
          duration={defaultDuration}
          onComplete={() => {
            // ... existing code ...
          }}
        />
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={toggleFullscreen}
            className="bg-primary-foreground hover:bg-primary/90"
          >
            {isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}
          </Button>
        </div>
      </div>
    </div>
  );
} 