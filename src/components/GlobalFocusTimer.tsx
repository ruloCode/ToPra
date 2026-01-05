'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Timer, Pause, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useFocusSession } from '@/contexts/FocusSessionContext';
import { getFocusSessions, FocusSession } from '@/lib/focus';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface GlobalFocusTimerProps {
  expanded?: boolean;
}

interface SessionWithTask extends FocusSession {
  task?: {
    id: string;
    title: string;
    description?: string | null;
  } | null;
}

export default function GlobalFocusTimer({ expanded = true }: GlobalFocusTimerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { activeSession, interruptSession } = useFocusSession();

  const [displayTime, setDisplayTime] = useState('00:00');
  const [todaySessions, setTodaySessions] = useState<SessionWithTask[]>([]);
  const [totalTodayMinutes, setTotalTodayMinutes] = useState(0);
  const [currentTaskName, setCurrentTaskName] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Calculate and update display time from active session
  useEffect(() => {
    if (!activeSession) {
      setDisplayTime('00:00');
      return;
    }

    const startTime = new Date(activeSession.start_time).getTime();

    const updateTime = () => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);

      let seconds: number;
      if (activeSession.duration) {
        // Timer mode - count down
        const initialSeconds = activeSession.duration * 60;
        seconds = Math.max(0, initialSeconds - elapsedSeconds);
      } else {
        // Chronometer mode - count up
        seconds = elapsedSeconds;
      }

      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      setDisplayTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  // Fetch today's sessions when dropdown opens
  const fetchTodaySessions = useCallback(async () => {
    if (!user?.id) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const sessions = await getFocusSessions({
        userId: user.id,
        startDate: today,
        endDate: tomorrow,
      });

      setTodaySessions(sessions as SessionWithTask[]);

      // Calculate total minutes from completed sessions
      const totalMinutes = sessions
        .filter(s => s.status === 'completed')
        .reduce((acc, s) => acc + (s.duration || 0), 0);
      setTotalTodayMinutes(totalMinutes);

      // Find current session's task name
      if (activeSession) {
        const currentSession = sessions.find(s => s.id === activeSession.id);
        if (currentSession?.task) {
          setCurrentTaskName(currentSession.task.title);
        } else {
          setCurrentTaskName(null);
        }
      }
    } catch (error) {
      console.error('Error fetching today sessions:', error);
    }
  }, [user?.id, activeSession]);

  useEffect(() => {
    if (isOpen) {
      fetchTodaySessions();
    }
  }, [isOpen, fetchTodaySessions]);

  // Also fetch when active session changes to update current task name
  useEffect(() => {
    if (activeSession) {
      fetchTodaySessions();
    } else {
      setCurrentTaskName(null);
    }
  }, [activeSession, fetchTodaySessions]);

  const handlePause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await interruptSession();
    router.push('/focus');
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Don't show if no active session
  if (!activeSession) {
    return null;
  }

  return (
    <div className="px-2 mb-3">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={`
              w-full flex items-center gap-2 p-2 rounded-lg
              bg-primary-main/10 hover:bg-primary-main/20
              border border-primary-main/20
              transition-colors cursor-pointer
              ${expanded ? 'justify-start' : 'justify-center'}
            `}
            title={!expanded ? `Enfoque: ${displayTime}` : undefined}
          >
            <div className="relative">
              <Timer className="h-5 w-5 text-primary-main flex-shrink-0" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            </div>

            {expanded && (
              <>
                <span className="font-mono text-sm font-semibold text-primary-main">
                  {displayTime}
                </span>
                {currentTaskName && (
                  <span className="text-xs text-text-secondary truncate max-w-[80px]">
                    {currentTaskName}
                  </span>
                )}
              </>
            )}

{expanded && (
              <button
                onClick={handlePause}
                className="p-1 rounded-md bg-red-500/20 hover:bg-red-500/30 transition-colors ml-auto"
                title="Pausar temporizador"
              >
                <Pause className="h-3.5 w-3.5 text-red-500" />
              </button>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          side="right"
          sideOffset={8}
          className="w-72"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-text-secondary" />
              <span className="text-sm font-medium">Tiempo de enfoque</span>
            </div>
            <span className="text-xs text-text-secondary">
              Hoy: {formatDuration(totalTodayMinutes)}
            </span>
          </div>

          <DropdownMenuSeparator />

          {/* Active Timer */}
          <div className="px-3 py-3 bg-primary-main/5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-2xl font-bold text-primary-main">
                {displayTime}
              </span>
              <button
                onClick={handlePause}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/20 hover:bg-red-500/30 transition-colors"
              >
                <Pause className="h-3.5 w-3.5 text-red-500" />
                <span className="text-xs text-red-500 font-medium">Pausar</span>
              </button>
            </div>
            {currentTaskName && (
              <p className="text-sm text-text-secondary truncate">
                {currentTaskName}
              </p>
            )}
            <p className="text-xs text-text-secondary mt-1">
              Iniciado a las {formatTime(activeSession.start_time)}
            </p>
          </div>
          <DropdownMenuSeparator />

          {/* Today's Sessions */}
          {todaySessions.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs text-text-secondary">
                Sesiones de hoy
              </DropdownMenuLabel>
              <div className="max-h-48 overflow-y-auto">
                {todaySessions
                  .filter(s => s.status === 'completed')
                  .slice(0, 5)
                  .map((session) => (
                    <DropdownMenuItem
                      key={session.id}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-sm truncate max-w-[180px]">
                        {session.task?.title || 'Sin tarea'}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {formatDuration(session.duration || 0)}
                      </span>
                    </DropdownMenuItem>
                  ))}
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Go to Focus */}
          <DropdownMenuItem asChild>
            <Link
              href="/focus"
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="text-sm font-medium">Ir a Enfoque</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
