import { useEffect, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon, RefreshCwIcon, Maximize2Icon, Minimize2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTimerStore } from '@/lib/stores/timerStore';

interface FocusTimerProps {
  defaultDuration?: number;
  onComplete?: (duration: number) => void;
  onStart?: (duration: number) => void;
  onInterrupt?: (elapsedTime: number) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onChronometerStop?: (elapsedTime: number) => void;
}

const AVAILABLE_DURATIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

export function FocusTimer({
  onComplete,
  onStart,
  onInterrupt,
  isFullscreen,
  onToggleFullscreen,
  onChronometerStop
}: FocusTimerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [mounted, setMounted] = useState(false);

  const {
    mode,
    isRunning,
    timeInSeconds,
    selectedDuration,
    chronometerTime,
    isStarting,
    countdown,
    timerStartTime,
    setMode,
    setIsRunning,
    setTimeInSeconds,
    setSelectedDuration,
    setChronometerTime,
    setIsStarting,
    setCountdown,
    resetTimer,
    syncTimerState,
    setLastSyncTime,
    setTimerStartTime
  } = useTimerStore();

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const handleDurationChange = useCallback((duration: number) => {
    if (!isRunning && !isStarting && mode === 'timer') {
      setSelectedDuration(duration);
    }
  }, [isRunning, isStarting, mode, setSelectedDuration]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setStartX(touch.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const x = touch.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const startCountdown = useCallback(() => {
    if (mode === 'timer' && timeInSeconds === 0) {
      setTimeInSeconds(selectedDuration * 60);
    }
    setIsStarting(true);
    setCountdown(3);
  }, [mode, timeInSeconds, selectedDuration, setTimeInSeconds, setIsStarting, setCountdown]);

  const cancelCountdown = useCallback(() => {
    setIsStarting(false);
    setCountdown(0);
  }, [setIsStarting, setCountdown]);

  const handleReset = useCallback(() => {
    if (isRunning && mode === 'timer') {
      onInterrupt?.(selectedDuration * 60 - timeInSeconds);
    }
    resetTimer();
  }, [isRunning, mode, selectedDuration, timeInSeconds, onInterrupt, resetTimer]);

  // Efecto para la cuenta regresiva inicial
  useEffect(() => {
    if (!isStarting || countdown === 0) return;

    const interval = setInterval(() => {
      if (countdown <= 1) {
        setIsStarting(false);
        setIsRunning(true);
        setCountdown(0);
        if (mode === 'timer') {
          onStart?.(selectedDuration * 60);
        } else {
          onStart?.(0);
        }
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarting, countdown, mode, selectedDuration, setIsStarting, setIsRunning, setCountdown, onStart]);

  // Efecto principal del timer - usa timerStartTime del store para consistencia
  useEffect(() => {
    if (!isRunning) return;

    // Si no hay timerStartTime, establecerlo ahora (nuevo timer)
    const effectiveStartTime = timerStartTime || Date.now();
    if (!timerStartTime) {
      setTimerStartTime(effectiveStartTime);
    }
    setLastSyncTime(Date.now());

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - effectiveStartTime) / 1000);

      if (mode === 'timer') {
        const remaining = Math.max(0, selectedDuration * 60 - elapsed);
        setTimeInSeconds(remaining);

        if (remaining === 0) {
          setIsRunning(false);
          onComplete?.(selectedDuration * 60);
        }
      } else {
        setChronometerTime(elapsed);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [
    isRunning,
    mode,
    selectedDuration,
    timerStartTime,
    setTimeInSeconds,
    setChronometerTime,
    setLastSyncTime,
    setTimerStartTime,
    setIsRunning,
    onComplete
  ]);

  // Control del timer
  const toggleTimer = useCallback(() => {
    if (mode === 'chronometer') {
      if (isRunning) {
        setIsRunning(false);
        const minutesElapsed = Math.max(1, Math.ceil(chronometerTime / 60));
        onChronometerStop?.(minutesElapsed);
        setChronometerTime(0);
      } else {
        startCountdown();
      }
    } else {
      if (isRunning) {
        setIsRunning(false);
        if (timeInSeconds > 0) {
          onInterrupt?.(selectedDuration * 60 - timeInSeconds);
        }
      } else if (!isStarting) {
        startCountdown();
      }
    }
  }, [
    mode,
    isRunning,
    isStarting,
    chronometerTime,
    timeInSeconds,
    selectedDuration,
    setIsRunning,
    setChronometerTime,
    onChronometerStop,
    onInterrupt,
    startCountdown
  ]);

  // 4. All useEffect declarations
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        syncTimerState();
      } else {
        setLastSyncTime(Date.now());
      }
    };

    const handleBlur = () => {
      syncTimerState();
    };

    const handleFocus = () => {
      setLastSyncTime(Date.now());
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [syncTimerState, setLastSyncTime]);

  // 5. Render loading state if not mounted
  if (!mounted) {
    return (
      <div className="p-2 sm:p-3 md:p-4 flex items-center justify-center">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 font-mono opacity-50">
          00:00
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-3 md:p-4" data-mode={mode}>
      <div className="flex justify-between items-center mb-3 sm:mb-4 relative">
        <div className="flex justify-stretch space-x-1 sm:space-x-2">
          <Button
            variant={mode === 'timer' ? 'default' : 'outline'}
            onClick={() => {
              if (!isRunning) {
                setMode('timer');
                resetTimer();
              }
            }}
            className="w-20 sm:w-24 md:w-28 text-xs sm:text-sm px-1 sm:px-2"
            size="sm"
            disabled={isRunning}
          >
            Temporizador
          </Button>
          <Button
            variant={mode === 'chronometer' ? 'default' : 'outline'}
            onClick={() => {
              if (!isRunning) {
                setMode('chronometer');
                resetTimer();
              }
            }}
            className="w-20 sm:w-24 md:w-28 text-xs sm:text-sm px-1 sm:px-2"
            size="sm"
            disabled={isRunning}
          >
            Cronómetro
          </Button>
        </div>
        {onToggleFullscreen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFullscreen}
            className="ml-1 sm:ml-2"
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? (
              <Minimize2Icon className="h-4 w-4" />
            ) : (
              <Maximize2Icon className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {mode === 'timer' && !isRunning && (
        <div className="mb-3 sm:mb-4">
          <h3 className="text-center text-xs sm:text-sm text-muted-foreground mb-2">
            Duración
          </h3>
          <div className="relative w-full max-w-md mx-auto">
            <div 
              className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex space-x-2 px-2 py-2 min-w-max">
                {AVAILABLE_DURATIONS.map((duration) => (
                  <Button
                    key={duration}
                    variant={selectedDuration === duration ? "default" : "ghost"}
                    onClick={() => handleDurationChange(duration)}
                    className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full p-0 flex-shrink-0 text-xs sm:text-sm",
                      selectedDuration === duration && "bg-primary text-primary-foreground"
                    )}
                  >
                    {duration}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        {isStarting && countdown > 0 ? (
          <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-mono">
                {countdown}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                {countdown === 3 ? "Listo..." : countdown === 2 ? "Preparado..." : "¡Ya!"}
              </p>
            </div>
            <Button
              onClick={cancelCountdown}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
            >
              Cancelar ({countdown})
            </Button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 font-mono">
              {mode === 'timer' ? formatTime(timeInSeconds) : formatTime(chronometerTime)}
            </h3>
            {mode === 'chronometer' && !isRunning && chronometerTime > 0 && (
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Tiempo total: {formatTime(chronometerTime)}
              </p>
            )}
          </>
        )}

        <div className="flex justify-center space-x-2 sm:space-x-3">
          <Button
            onClick={toggleTimer}
            variant={isRunning ? "destructive" : "default"}
            size="default"
            className={cn(
              "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full p-0",
              isRunning && "bg-destructive hover:bg-destructive/90",
              !isRunning && "bg-primary hover:bg-primary/90"
            )}
            disabled={isStarting}
          >
            {isRunning ? (
              <PauseIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            ) : (
              <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            )}
          </Button>
          {!isRunning && mode === 'timer' && (
            <Button
              onClick={handleReset}
              variant="outline"
              size="default"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full p-0"
              disabled={isStarting}
            >
              <RefreshCwIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Button>
          )}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .cursor-grab {
          cursor: grab;
        }
        .cursor-grabbing {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
}