'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import {
  FocusSession,
  FocusSessionStatus,
  createFocusSession,
  updateFocusSession,
  getFocusSessions
} from '@/lib/focus';
import { useTimerStore } from '@/lib/stores/timerStore';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface FocusSessionContextType {
  activeSession: FocusSession | null;
  isLoading: boolean;
  startSession: (options?: { taskId?: string; duration?: number }) => Promise<FocusSession | null>;
  completeSession: () => Promise<void>;
  interruptSession: () => Promise<void>;
  updateSessionTask: (taskId: string | null) => Promise<void>;
}

const FocusSessionContext = createContext<FocusSessionContextType | undefined>(undefined);

export function FocusSessionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Get timer store actions
  const {
    setIsRunning,
    setCurrentSessionId,
    setTimerStartTime,
    setTimeInSeconds,
    setChronometerTime,
    setSelectedDuration,
    resetTimer,
  } = useTimerStore();

  // Sync timer store from active session
  const syncTimerFromSession = useCallback((session: FocusSession | null) => {
    if (!session) {
      setIsRunning(false);
      setCurrentSessionId(null);
      setTimerStartTime(null);
      return;
    }

    const startTime = new Date(session.start_time).getTime();
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);

    setCurrentSessionId(session.id);
    setTimerStartTime(startTime);

    if (session.duration) {
      // Timer mode
      const remainingSeconds = Math.max(0, session.duration * 60 - elapsedSeconds);
      setSelectedDuration(session.duration);
      setTimeInSeconds(remainingSeconds);

      // If time has expired, complete the session
      if (remainingSeconds === 0 && session.status === 'active') {
        completeSession();
        return;
      }
    } else {
      // Chronometer mode
      setChronometerTime(elapsedSeconds);
    }

    setIsRunning(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsRunning, setCurrentSessionId, setTimerStartTime, setTimeInSeconds, setChronometerTime, setSelectedDuration]);

  // Load active session on mount
  const loadActiveSession = useCallback(async () => {
    if (!user) {
      setActiveSession(null);
      setIsLoading(false);
      return;
    }

    try {
      const sessions = await getFocusSessions({
        userId: user.id,
        status: FocusSessionStatus.ACTIVE,
      });

      const active = sessions[0] || null;
      setActiveSession(active);
      syncTimerFromSession(active);
    } catch (error) {
      console.error('Error loading active session:', error);
      setActiveSession(null);
    } finally {
      setIsLoading(false);
    }
  }, [user, syncTimerFromSession]);

  // Handle Realtime changes
  const handleRealtimeChange = useCallback((
    payload: RealtimePostgresChangesPayload<FocusSession>
  ) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    if (eventType === 'INSERT') {
      const session = newRecord as FocusSession;
      if (session.status === 'active') {
        setActiveSession(session);
        syncTimerFromSession(session);
      }
    } else if (eventType === 'UPDATE') {
      const session = newRecord as FocusSession;
      if (session.status === 'active') {
        setActiveSession(session);
        syncTimerFromSession(session);
      } else if (session.status === 'completed' || session.status === 'interrupted') {
        // Session was completed or interrupted (possibly from another device)
        setActiveSession(null);
        syncTimerFromSession(null);
      }
    } else if (eventType === 'DELETE') {
      const deleted = oldRecord as FocusSession;
      if (activeSession?.id === deleted.id) {
        setActiveSession(null);
        syncTimerFromSession(null);
      }
    }
  }, [activeSession?.id, syncTimerFromSession]);

  // Set up Realtime subscription
  useEffect(() => {
    if (!user) return;

    // Load initial session
    loadActiveSession();

    // Subscribe to Realtime changes
    const channel = supabase
      .channel(`focus-sessions-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'focus_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        handleRealtimeChange
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user, loadActiveSession, handleRealtimeChange]);

  // Start a new focus session
  const startSession = useCallback(async (options?: { taskId?: string; duration?: number }) => {
    if (!user) return null;

    try {
      // If there's an active session, interrupt it first
      if (activeSession) {
        await interruptSession();
      }

      const session = await createFocusSession({
        user_id: user.id,
        task_id: options?.taskId || null,
        duration: options?.duration || null,
        status: FocusSessionStatus.ACTIVE,
      });

      setActiveSession(session);
      syncTimerFromSession(session);
      return session;
    } catch (error) {
      console.error('Error starting session:', error);
      return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeSession, syncTimerFromSession]);

  // Complete the current session
  const completeSession = useCallback(async () => {
    if (!activeSession) return;

    try {
      const endTime = new Date().toISOString();
      const startTime = new Date(activeSession.start_time).getTime();
      const durationMinutes = Math.ceil((Date.now() - startTime) / 60000);

      await updateFocusSession(activeSession.id, {
        status: FocusSessionStatus.COMPLETED,
        end_time: endTime,
        duration: durationMinutes,
      });

      setActiveSession(null);
      resetTimer();
    } catch (error) {
      console.error('Error completing session:', error);
    }
  }, [activeSession, resetTimer]);

  // Interrupt the current session
  const interruptSession = useCallback(async () => {
    if (!activeSession) return;

    try {
      const endTime = new Date().toISOString();
      const startTime = new Date(activeSession.start_time).getTime();
      const durationMinutes = Math.ceil((Date.now() - startTime) / 60000);

      await updateFocusSession(activeSession.id, {
        status: FocusSessionStatus.INTERRUPTED,
        end_time: endTime,
        duration: durationMinutes,
      });

      setActiveSession(null);
      resetTimer();
    } catch (error) {
      console.error('Error interrupting session:', error);
    }
  }, [activeSession, resetTimer]);

  // Update the task associated with the current session
  const updateSessionTask = useCallback(async (taskId: string | null) => {
    if (!activeSession) return;

    try {
      await updateFocusSession(activeSession.id, {
        task_id: taskId,
      });

      setActiveSession(prev => prev ? { ...prev, task_id: taskId } : null);
    } catch (error) {
      console.error('Error updating session task:', error);
    }
  }, [activeSession]);

  return (
    <FocusSessionContext.Provider
      value={{
        activeSession,
        isLoading,
        startSession,
        completeSession,
        interruptSession,
        updateSessionTask,
      }}
    >
      {children}
    </FocusSessionContext.Provider>
  );
}

export function useFocusSession() {
  const context = useContext(FocusSessionContext);
  if (context === undefined) {
    throw new Error('useFocusSession must be used within a FocusSessionProvider');
  }
  return context;
}
