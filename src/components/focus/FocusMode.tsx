'use client';
import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/lib/tasks';
import { useToast } from '@/components/ui/use-toast';
import { TaskSearch } from './TaskSearch';
import { useAuth } from '@/components/AuthProvider';
import { useFocusSession } from '@/contexts/FocusSessionContext';
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
  const { activeSession, startSession, completeSession, interruptSession, updateSessionTask } = useFocusSession();
  const { mode: timerMode, setMode } = useTimerStore();

  // Sync selected task from active session
  useEffect(() => {
    if (activeSession?.task_id) {
      // The task info would come from the session if we fetched it with join
      // For now, keep the local selectedTask in sync
    }
  }, [activeSession]);

  // Handle task selection
  const handleTaskSelect = useCallback(async (task: Task | null) => {
    if (!user) return;

    if (activeSession) {
      try {
        await updateSessionTask(task?.id || null);
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
  }, [activeSession, user, toast, updateSessionTask]);

  // Handle chronometer stop
  const handleChronometerStop = useCallback(async (elapsedMinutes: number) => {
    if (!user || !activeSession) return;

    try {
      await completeSession();
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
  }, [user, activeSession, toast, historyRef, completeSession]);

  // Handle timer interruption
  const handleTimerInterrupt = useCallback(async (elapsedTime: number) => {
    if (!activeSession || !user || timerMode !== 'timer') return;

    try {
      const durationInMinutes = Math.ceil(elapsedTime / 60);
      await interruptSession();
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
  }, [activeSession, user, timerMode, toast, historyRef, interruptSession]);

  // Handle timer completion
  const handleTimerComplete = useCallback(async (elapsedTime: number) => {
    if (!activeSession || !user || timerMode !== 'timer') return;

    try {
      const durationInMinutes = Math.ceil(elapsedTime / 60);
      await completeSession();
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
  }, [activeSession, user, timerMode, toast, historyRef, completeSession]);

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

    try {
      const mode = _duration > 0 ? 'timer' : 'chronometer';
      const durationInMinutes = mode === 'timer' ? Math.floor(_duration / 60) : undefined;

      await startSession({
        taskId: selectedTask?.id,
        duration: durationInMinutes,
      });

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
    }
  }, [user, selectedTask, toast, historyRef, setMode, startSession]);

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
