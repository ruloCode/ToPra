"use client";

import { useEffect, useState, useCallback } from 'react';
import { Play, Square, Clock, Trash2, ExternalLink, Timer, Hourglass } from 'lucide-react';
import { useTimerStore } from '@/lib/stores/timerStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/AuthProvider';
import { useTasks } from '@/contexts/TaskContext';
import { getFocusSessions, deleteFocusSession, createFocusSession, updateFocusSession, FocusSession } from '@/lib/focus';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const DURATION_OPTIONS = [5, 10, 15, 20, 25, 30, 45, 60];

interface TimeTrackingPanelProps {
  onClose?: () => void;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function formatTimeRange(startTime: string, endTime: string | null): string {
  const start = new Date(startTime);
  const startStr = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  if (!endTime) {
    return `${startStr} - Now`;
  }

  const end = new Date(endTime);
  const endStr = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${startStr} - ${endStr}`;
}

function groupSessionsByDay(sessions: (FocusSession & { task?: { id: string; title: string } | null })[]): Record<string, typeof sessions> {
  const groups: Record<string, typeof sessions> = {};

  sessions.forEach(session => {
    const date = new Date(session.start_time);
    const dateKey = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(session);
  });

  return groups;
}

function getDayTotal(sessions: FocusSession[]): number {
  return sessions.reduce((acc, session) => acc + (session.duration || 0), 0);
}

export function TimeTrackingPanel({ onClose }: TimeTrackingPanelProps) {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const {
    isRunning,
    mode,
    timerStartTime,
    selectedDuration,
    activeTaskId,
    activeTaskName,
    dailyGoalMinutes,
    currentSessionId,
    setIsRunning,
    setActiveTask,
    clearActiveTask,
    setCurrentSessionId,
    resetTimer,
    setMode,
    setSelectedDuration,
  } = useTimerStore();

  const [sessions, setSessions] = useState<(FocusSession & { task?: { id: string; title: string } | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayTime, setDisplayTime] = useState(0);
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [todayTotal, setTodayTotal] = useState(0);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [pendingTaskName, setPendingTaskName] = useState<string | null>(null);

  // Load sessions
  const loadSessions = useCallback(async () => {
    if (!user) return;

    try {
      const data = await getFocusSessions({ userId: user.id });
      setSessions(data as (FocusSession & { task?: { id: string; title: string } | null })[]);

      // Calculate today's total
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySessions = data.filter(s => {
        const sessionDate = new Date(s.start_time);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === today.getTime() && s.status === 'completed';
      });
      setTodayTotal(getDayTotal(todaySessions));
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Update display time
  useEffect(() => {
    if (!isRunning || !timerStartTime) {
      setDisplayTime(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSinceStart = Math.floor((now - timerStartTime) / 1000);

      if (mode === 'timer') {
        const initialSeconds = selectedDuration * 60;
        const remaining = Math.max(0, initialSeconds - elapsedSinceStart);
        setDisplayTime(remaining);
      } else {
        setDisplayTime(elapsedSinceStart);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, timerStartTime, mode, selectedDuration]);

  // Select task for timer
  const handleSelectTask = (taskId: string, taskName: string) => {
    setPendingTaskId(taskId);
    setPendingTaskName(taskName);
    setShowTaskSelector(false);
  };

  // Start timer
  const handleStart = async () => {
    if (!user || !pendingTaskId || !pendingTaskName) return;

    try {
      // Create session in Supabase
      const session = await createFocusSession({
        user_id: user.id,
        task_id: pendingTaskId,
        status: 'active',
        duration: mode === 'timer' ? selectedDuration : null,
      });

      // Update store
      setActiveTask(pendingTaskId, pendingTaskName);
      setCurrentSessionId(session.id);
      setIsRunning(true);

      // Clear pending selection
      setPendingTaskId(null);
      setPendingTaskName(null);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  // Stop timer
  const handleStop = async () => {
    if (!currentSessionId || !timerStartTime) return;

    try {
      const now = Date.now();
      const elapsedMinutes = Math.ceil((now - timerStartTime) / 1000 / 60);

      // Update session in Supabase
      await updateFocusSession(currentSessionId, {
        status: 'completed',
        end_time: new Date().toISOString(),
        duration: elapsedMinutes,
      });

      // Reset store
      resetTimer();
      clearActiveTask();

      // Reload sessions
      loadSessions();
    } catch (error) {
      console.error('Error stopping timer:', error);
    }
  };

  // Delete session
  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteFocusSession(sessionId);
      loadSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const groupedSessions = groupSessionsByDay(sessions);
  const progressPercent = Math.min((todayTotal / dailyGoalMinutes) * 100, 100);

  return (
    <div className="max-h-[70vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary-main" />
            <span className="font-semibold">Track Time</span>
          </div>
          <div className="text-sm text-text-secondary">
            <span className="font-medium">{formatDuration(todayTotal)}</span>
            <span className="text-text-disabled"> / {formatDuration(dailyGoalMinutes)}</span>
          </div>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      {/* Active Timer */}
      <div className="p-4 border-b border-border">
        {isRunning ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleStop}
                  className="h-10 w-10 rounded-full bg-error-main hover:bg-error-dark text-white"
                >
                  <Square className="h-4 w-4 fill-current" />
                </Button>
                <div>
                  <div className="font-mono text-2xl font-semibold">
                    {formatTime(displayTime)}
                  </div>
                  {activeTaskName && (
                    <div className="text-sm text-text-secondary truncate max-w-[180px]">
                      {activeTaskName}
                    </div>
                  )}
                </div>
              </div>
              {activeTaskId && (
                <Link href={`/tasks/${activeTaskId}`} onClick={onClose}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mode Toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setMode('timer')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                  mode === 'timer'
                    ? "bg-primary-main text-white"
                    : "bg-background hover:bg-secondary text-text-secondary"
                )}
              >
                <Timer className="h-4 w-4" />
                Timer
              </button>
              <button
                onClick={() => setMode('chronometer')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                  mode === 'chronometer'
                    ? "bg-primary-main text-white"
                    : "bg-background hover:bg-secondary text-text-secondary"
                )}
              >
                <Hourglass className="h-4 w-4" />
                Cronómetro
              </button>
            </div>

            {/* Duration Selector (only for timer mode) */}
            {mode === 'timer' && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-text-secondary">Duración</div>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setSelectedDuration(duration)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                        selectedDuration === duration
                          ? "bg-primary-main text-white"
                          : "bg-secondary hover:bg-secondary/80 text-text-primary"
                      )}
                    >
                      {duration}m
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Task Selector */}
            {showTaskSelector ? (
              <div className="space-y-2">
                <div className="text-sm font-medium text-text-secondary">Selecciona una tarea:</div>
                <div className="max-h-40 overflow-y-auto space-y-1 border border-border rounded-lg p-2">
                  {tasks.filter(t => t.status !== 'done').map(task => (
                    <button
                      key={task.id}
                      onClick={() => handleSelectTask(task.id, task.title)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md transition-colors text-sm truncate",
                        pendingTaskId === task.id
                          ? "bg-primary-main/10 text-primary-main"
                          : "hover:bg-accent/10"
                      )}
                    >
                      {task.title}
                    </button>
                  ))}
                  {tasks.filter(t => t.status !== 'done').length === 0 && (
                    <div className="text-sm text-text-secondary py-2 text-center">
                      No hay tareas activas
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTaskSelector(false)}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            ) : pendingTaskName ? (
              <div className="space-y-2">
                <div className="text-sm font-medium text-text-secondary">Tarea seleccionada:</div>
                <div
                  className="flex items-center justify-between px-3 py-2 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => setShowTaskSelector(true)}
                >
                  <span className="text-sm truncate">{pendingTaskName}</span>
                  <span className="text-xs text-text-secondary">Cambiar</span>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowTaskSelector(true)}
                className="w-full"
              >
                Seleccionar tarea
              </Button>
            )}

            {/* Start Button */}
            <Button
              onClick={handleStart}
              disabled={!pendingTaskId}
              className={cn(
                "w-full",
                pendingTaskId
                  ? "bg-primary-main hover:bg-primary-dark text-white"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Play className="h-4 w-4 mr-2" />
              {mode === 'timer'
                ? `Iniciar ${selectedDuration} min`
                : 'Iniciar cronómetro'
              }
            </Button>
          </div>
        )}
      </div>

      {/* Sessions History */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-text-secondary">Loading...</div>
        ) : Object.keys(groupedSessions).length === 0 ? (
          <div className="p-4 text-center text-text-secondary">
            No time tracked yet
          </div>
        ) : (
          Object.entries(groupedSessions).map(([date, daySessions]) => (
            <div key={date} className="border-b border-border last:border-b-0">
              {/* Day Header */}
              <div className="px-4 py-2 bg-background-paper/50 flex items-center justify-between">
                <span className="text-sm font-medium">{date}</span>
                <span className="text-xs text-text-secondary">
                  {formatDuration(getDayTotal(daySessions))}
                </span>
              </div>

              {/* Day Sessions */}
              {daySessions.map(session => (
                <div
                  key={session.id}
                  className="px-4 py-3 hover:bg-accent/5 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">
                        {session.task?.title || 'Untitled Task'}
                      </div>
                      <div className="text-xs text-text-secondary mt-0.5">
                        {formatTimeRange(session.start_time, session.end_time)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className={`text-sm font-medium ${
                        session.status === 'completed'
                          ? 'text-success-main'
                          : session.status === 'active'
                            ? 'text-primary-main'
                            : 'text-error-main'
                      }`}>
                        {session.status === 'active'
                          ? 'Running...'
                          : formatDuration(session.duration || 0)}
                      </span>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-error-main/10 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-error-main" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
