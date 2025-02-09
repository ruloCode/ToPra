import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon, RefreshCwIcon, Maximize2Icon, Minimize2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveTimerState, getTimerState, clearTimerState } from '@/lib/focus';

export type TimerMode = 'timer' | 'chronometer';

interface FocusTimerProps {
  defaultDuration?: number; // in minutes
  onComplete?: (duration: number) => void;
  onStart?: (duration: number) => void;
  onInterrupt?: (elapsedTime: number) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onChronometerStop?: (elapsedTime: number) => void;
}

const AVAILABLE_DURATIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

export function FocusTimer({
  defaultDuration = 25,
  onComplete,
  onStart,
  onInterrupt,
  isFullscreen,
  onToggleFullscreen,
  onChronometerStop
}: FocusTimerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Recuperar el estado guardado o usar valores por defecto
  const savedState = isClient ? getTimerState() : null;
  const [mode, setMode] = useState<TimerMode>(savedState?.mode || 'timer');
  const [selectedDuration, setSelectedDuration] = useState(savedState?.selectedDuration || defaultDuration);
  const [timeInSeconds, setTimeInSeconds] = useState(savedState?.timeInSeconds || defaultDuration * 60);
  const [isRunning, setIsRunning] = useState(savedState?.isRunning || false);
  const [chronometerTime, setChronometerTime] = useState(savedState?.chronometerTime || 0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  // Si había una sesión en progreso, restaurar el tiempo transcurrido
  useEffect(() => {
    if (savedState?.isRunning && savedState?.startTime) {
      const elapsedSeconds = Math.floor((Date.now() - savedState.startTime) / 1000);
      if (savedState.mode === 'chronometer') {
        setChronometerTime(prev => prev + elapsedSeconds);
      } else {
        setTimeInSeconds(prev => Math.max(0, prev - elapsedSeconds));
      }
    }
  }, [savedState?.isRunning, savedState?.startTime, savedState?.mode]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDurationChange = (duration: number) => {
    if (!isRunning && mode === 'timer') {
      setSelectedDuration(duration);
      setTimeInSeconds(duration * 60);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  // Timer mode effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && mode === 'timer' && timeInSeconds > 0) {
      interval = setInterval(() => {
        setTimeInSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.(selectedDuration * 60);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isRunning && mode === 'chronometer') {
      interval = setInterval(() => {
        setChronometerTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, mode, timeInSeconds, onComplete, selectedDuration]);

  const startCountdown = useCallback(() => {
    setIsStarting(true);
    setCountdown(3);
  }, []);

  const cancelCountdown = useCallback(() => {
    setIsStarting(false);
    setCountdown(null);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null) return null;
          if (prev === 1) {
            setIsRunning(true);
            setIsStarting(false);
            if (mode === 'timer') {
              onStart?.(selectedDuration * 60);
            } else {
              onStart?.(0);
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [countdown, mode, selectedDuration, onStart]);

  const toggleTimer = useCallback(() => {
    if (mode === 'chronometer') {
      if (isRunning) {
        setIsRunning(false);
        const minutesElapsed = Math.ceil(chronometerTime / 60);
        onChronometerStop?.(minutesElapsed);
        setChronometerTime(0);
        clearTimerState(); // Limpiar estado al detener el cronómetro
      } else {
        startCountdown();
      }
    } else {
      if (isRunning) {
        setIsRunning(false);
        if (timeInSeconds > 0) {
          onInterrupt?.(selectedDuration * 60 - timeInSeconds);
          clearTimerState(); // Limpiar estado al interrumpir
        }
      } else if (!isStarting) {
        startCountdown();
      }
    }
  }, [isRunning, isStarting, mode, selectedDuration, timeInSeconds, onInterrupt, startCountdown, chronometerTime, onChronometerStop]);

  const resetTimer = useCallback(() => {
    if (isRunning && mode === 'timer') {
      onInterrupt?.(selectedDuration * 60 - timeInSeconds);
    }
    setIsRunning(false);
    if (mode === 'timer') {
      setTimeInSeconds(selectedDuration * 60);
    } else {
      setChronometerTime(0);
    }
    clearTimerState();
  }, [isRunning, mode, selectedDuration, timeInSeconds, onInterrupt]);

  // Guardar el estado cuando cambie (solo en el cliente)
  useEffect(() => {
    if (!isClient) return;

    if (isRunning || timeInSeconds !== defaultDuration * 60 || chronometerTime > 0) {
      saveTimerState({
        mode,
        isRunning,
        timeInSeconds,
        selectedDuration,
        chronometerTime,
        startTime: Date.now()
      });
    } else {
      clearTimerState();
    }
  }, [mode, isRunning, timeInSeconds, selectedDuration, chronometerTime, defaultDuration, isClient]);

  useEffect(() => {
    if (timeInSeconds === 0 && isRunning && mode === 'timer') {
      setIsRunning(false);
      clearTimerState();
      onComplete?.(selectedDuration * 60);
    }
  }, [timeInSeconds, isRunning, mode, selectedDuration, onComplete]);

  // Efecto para manejar el beforeunload (solo en el cliente)
  useEffect(() => {
    if (!isClient) return;

    const handleBeforeUnload = () => {
      if (isRunning) {
        saveTimerState({
          mode,
          isRunning,
          timeInSeconds,
          selectedDuration,
          chronometerTime,
          startTime: Date.now()
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [mode, isRunning, timeInSeconds, selectedDuration, chronometerTime, isClient]);

  const renderChronometerButton = () => {
    let icon;
    let variant: "default" | "destructive" = "default";
    
    if (isRunning) {
      icon = <PauseIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />;
      variant = "destructive";
    } else {
      icon = <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />;
    }

    return (
      <Button
        onClick={toggleTimer}
        variant={variant}
        size="default"
        className={cn(
          "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full p-0",
          isRunning && "bg-destructive hover:bg-destructive/90",
          !isRunning && "bg-primary hover:bg-primary/90"
        )}
        disabled={isStarting}
      >
        {icon}
      </Button>
    );
  };

  return (
    <div className="p-2 sm:p-3 md:p-4" data-mode={mode}>
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <div className="flex space-x-1 sm:space-x-2">
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
            Tiempo de concentración
          </h3>
          <div className="relative w-full max-w-md mx-auto">
            <div 
              className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                setIsDragging(true);
                setStartX(touch.pageX - e.currentTarget.offsetLeft);
                setScrollLeft(e.currentTarget.scrollLeft);
              }}
              onTouchMove={(e) => {
                if (!isDragging) return;
                e.preventDefault();
                const touch = e.touches[0];
                const x = touch.pageX - e.currentTarget.offsetLeft;
                const walk = (x - startX) * 2;
                e.currentTarget.scrollLeft = scrollLeft - walk;
              }}
              onTouchEnd={() => setIsDragging(false)}
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
        {countdown !== null ? (
          <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-mono">
                {countdown}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                {countdown === 3 ? "En sus marcas..." : countdown === 2 ? "Listos..." : "¡Ya!"}
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
                Tiempo registrado: {formatTime(chronometerTime)}
              </p>
            )}
          </>
        )}

        <div className="flex justify-center space-x-2 sm:space-x-3">
          {mode === 'timer' ? (
            <>
              <Button
                onClick={toggleTimer}
                variant="default"
                size="default"
                className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full p-0",
                  isRunning ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
                )}
                disabled={isStarting}
              >
                {isRunning ? (
                  <PauseIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                ) : (
                  <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                )}
              </Button>
              {!isRunning && (
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="default"
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full p-0"
                  disabled={isStarting}
                >
                  <RefreshCwIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </Button>
              )}
            </>
          ) : (
            renderChronometerButton()
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