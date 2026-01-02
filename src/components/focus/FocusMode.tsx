'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Task } from '@/lib/tasks';
import { useToast } from '@/components/ui/use-toast';
import { TaskSearch } from './TaskSearch';
import { useAuth } from '@/components/AuthProvider';
import { createFocusSession, updateFocusSession, FocusSessionStatus, getFocusSessions } from '@/lib/focus';
import { FocusTimer } from './FocusTimer';
import { FocusHistoryRef } from '@/types/focus';
import { useTimerStore } from '@/lib/stores/timerStore';

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(initialTask || null);
  const { toast } = useToast();
  const { user } = useAuth();
  const isCreatingSession = useRef(false);
  const {
    mode: timerMode,
    setMode,
    isRunning,
    timerStartTime,
    currentSessionId,
    setCurrentSessionId,
    setIsRunning,
    setTimeInSeconds,
    setChronometerTime,
    setTimerStartTime,
    selectedDuration,
  } = useTimerStore();

  // Loading the initial state and handling errors
  useEffect(() => {
    const loadActiveSession = async () => {
      if (!user) return;
      try {
        const sessions = await getFocusSessions({
          userId: user.id,
          status: FocusSessionStatus.ACTIVE
        });
        const activeSession = sessions[0];

        if (activeSession?.id) {
          const startTime = new Date(activeSession.start_time).getTime();
          const hoursElapsed = (Date.now() - startTime) / (1000 * 60 * 60);

          // Si la sesión tiene más de 24 horas, es huérfana - marcarla como interrumpida
          if (hoursElapsed > 24) {
            await updateFocusSession(activeSession.id, {
              status: FocusSessionStatus.INTERRUPTED,
              end_time: activeSession.start_time, // end = start para sesiones huérfanas
              duration: 0
            });
            await historyRef.current?.reloadSessions();
            return;
          }

          // Restaurar sesión activa
          setCurrentSessionId(activeSession.id);
          setSelectedTask(activeSession.task || null);

          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

          if (activeSession.duration) {
            // Timer mode - calcular tiempo restante
            const remainingSeconds = Math.max(0, activeSession.duration * 60 - elapsedSeconds);
            setMode('timer');
            setTimeInSeconds(remainingSeconds);
            setTimerStartTime(startTime);

            if (remainingSeconds > 0) {
              setIsRunning(true);
            } else {
              // El timer ya terminó mientras estaba fuera
              await updateFocusSession(activeSession.id, {
                status: FocusSessionStatus.COMPLETED,
                end_time: new Date(startTime + activeSession.duration * 60 * 1000).toISOString(),
                duration: activeSession.duration
              });
              setCurrentSessionId(null);
              await historyRef.current?.reloadSessions();
            }
          } else {
            // Chronometer mode - calcular tiempo transcurrido
            setMode('chronometer');
            setChronometerTime(elapsedSeconds);
            setTimerStartTime(startTime);
            setIsRunning(true);
          }
        }
      } catch (error) {
        console.error('Error loading active session:', error);
      }
    };

    loadActiveSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Handler para finalizar sesión cuando el usuario cierra el navegador/tab
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentSessionId && isRunning && timerStartTime) {
        const elapsedMinutes = Math.max(1, Math.ceil((Date.now() - timerStartTime) / (1000 * 60)));

        // Usar sendBeacon para enviar request aunque se cierre la página
        const payload = JSON.stringify({
          status: 'interrupted',
          end_time: new Date().toISOString(),
          duration: elapsedMinutes
        });

        navigator.sendBeacon(
          `/api/focus-sessions/${currentSessionId}/finalize`,
          new Blob([payload], { type: 'application/json' })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentSessionId, isRunning, timerStartTime]);

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
          title: task ? "Task updated" : "Task removed",
          description: task ? "A new task has been linked to the session" : "The task has been unlinked from the session",
        });
      } catch (error) {
        console.error('Error updating session task:', error);
        toast({
          title: "Error",
          description: "Could not update the session task",
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
        duration: elapsedMinutes,
      });

      setCurrentSessionId(null);
      await historyRef.current?.reloadSessions();

      toast({
        title: "Well done!",
        description: `You have completed a ${elapsedMinutes}-minute session.`,
      });
    } catch (error) {
      console.error('Error finishing session:', error);
      toast({
        title: "Error",
        description: "Could not save the session.",
        variant: "destructive",
      });
    }
  }, [user, currentSessionId, toast, historyRef, setCurrentSessionId]);

  // Handle timer interruption
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
      await historyRef.current?.reloadSessions();
      toast({
        title: "Session interrupted",
        description: `You completed ${durationInMinutes} minutes of focus.`,
      });
    } catch (error) {
      console.error('Error interrupting session:', error);
      toast({
        title: "Error",
        description: "Could not interrupt the session properly.",
        variant: "destructive",
      });
    }
  }, [currentSessionId, user, timerMode, toast, historyRef, setCurrentSessionId]);

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
      await historyRef.current?.reloadSessions();
      toast({
        title: "Congratulations!",
        description: `You have completed ${durationInMinutes} minutes of focus.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not complete the session properly.",
        variant: "destructive",
      });
    }
  }, [currentSessionId, user, timerMode, toast, historyRef, setCurrentSessionId]);

  // Handle timer start
  const handleTimerStart = useCallback(async (_duration: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to record your focus time.",
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
      setMode(mode);
      await historyRef.current?.reloadSessions();
      
      toast({
        title: "Session started",
        description: mode === 'timer' 
          ? "Your scheduled focus session has started."
          : "Your free focus session has started.",
      });
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Could not start the focus session.",
        variant: "destructive",
      });
    } finally {
      isCreatingSession.current = false;
    }
  }, [user, selectedTask, toast, historyRef, setMode, setCurrentSessionId]);

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
        description: 'Could not activate fullscreen mode',
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="w-full  mx-auto px-2 sm:px-4 py-2 sm:py-6">
      <div className="w-full bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="space-y-2 sm:space-y-4">
          <div className="p-2 sm:p-4 border-b">
            <h2 className="text-sm sm:text-base lg:text-lg font-medium mb-2">Select task (optional)</h2>
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