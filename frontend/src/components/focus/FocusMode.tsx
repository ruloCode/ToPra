'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/lib/tasks';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Timer } from './Timer';

interface FocusModeProps {
  task?: Task;
  defaultDuration?: number; // in minutes
}

export function FocusMode({  defaultDuration = 25 }: FocusModeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
 
  
  const { toast } = useToast();

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    toast({
      title: "¡Tiempo completado!",
      description: "Has completado tu sesión de enfoque.",
    });
    // You can add more completion logic here if needed
  }, [toast]);

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

  // Complete the focus session

  // Interrupt the focus session
 
  return (
    <div className="w-full max-w-2xl p-8 rounded-lg bg-card text-card-foreground shadow-lg">
      <div className="space-y-6">
       
        <Timer
          duration={defaultDuration}
          onComplete={handleTimerComplete}
          showControls={true}
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