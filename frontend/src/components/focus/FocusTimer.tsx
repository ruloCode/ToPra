import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon, RefreshCwIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TimerMode = 'timer' | 'chronometer';

interface FocusTimerProps {
  defaultDuration?: number; // in minutes
  onComplete?: (duration: number) => void;
  onStart?: (duration: number) => void;
  onInterrupt?: (elapsedTime: number) => void;
}

const AVAILABLE_DURATIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

export function FocusTimer({
  defaultDuration = 25,
  onComplete,
  onStart,
  onInterrupt
}: FocusTimerProps) {
  const [mode, setMode] = useState<TimerMode>('timer');
  const [selectedDuration, setSelectedDuration] = useState(defaultDuration);
  const [timeInSeconds, setTimeInSeconds] = useState(defaultDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [chronometerTime, setChronometerTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
    if (isRunning) {
      setIsRunning(false);
      if (mode === 'timer') {
        if (timeInSeconds > 0) {
          onInterrupt?.(selectedDuration * 60 - timeInSeconds);
        }
      } else {
        onComplete?.(chronometerTime);
      }
    } else if (!isStarting) {
      if (mode === 'chronometer' && chronometerTime > 0) {
        setChronometerTime(0);
        startCountdown();
      } else {
        startCountdown();
      }
    }
  }, [isRunning, isStarting, mode, selectedDuration, timeInSeconds, chronometerTime, onInterrupt, onComplete, startCountdown]);

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
  }, [isRunning, mode, selectedDuration, timeInSeconds, onInterrupt]);

  return (
    <div className="p-3 sm:p-4 md:p-6" data-mode={mode}>
      <div className="flex justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
        <Button
          variant={mode === 'timer' ? 'default' : 'outline'}
          onClick={() => {
            if (!isRunning) {
              setMode('timer');
              resetTimer();
            }
          }}
          className="w-24 sm:w-28 md:w-32 text-xs sm:text-sm md:text-base px-1 sm:px-2"
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
          className="w-24 sm:w-28 md:w-32 text-xs sm:text-sm md:text-base px-1 sm:px-2"
          size="sm"
          disabled={isRunning}
        >
          Cronómetro
        </Button>
      </div>

      {mode === 'timer' && !isRunning && (
        <div className="mb-4 sm:mb-6">
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
            >
              <div className="flex space-x-2 px-2 sm:px-4 py-2 min-w-max">
                {AVAILABLE_DURATIONS.map((duration) => (
                  <Button
                    key={duration}
                    variant={selectedDuration === duration ? "default" : "ghost"}
                    onClick={() => handleDurationChange(duration)}
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full p-0 flex-shrink-0 text-xs sm:text-sm md:text-base",
                      selectedDuration === duration && "bg-primary text-primary-foreground"
                    )}
                  >
                    {duration}
                  </Button>
                ))}
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
        </div>
      )}

      <div className="text-center">
        {countdown !== null ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-3xl sm:text-4xl md:text-6xl font-bold font-mono">
                {countdown}
              </h3>
              <p className="text-lg text-muted-foreground">
                {countdown === 3 ? "En sus marcas..." : countdown === 2 ? "Listos..." : "¡Ya!"}
              </p>
            </div>
            <Button
              onClick={cancelCountdown}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              Cancelar ({countdown})
            </Button>
          </div>
        ) : (
          <>
            <h3 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 font-mono">
              {mode === 'timer' ? formatTime(timeInSeconds) : formatTime(chronometerTime)}
            </h3>
            {mode === 'chronometer' && !isRunning && chronometerTime > 0 && (
              <p className="text-sm text-muted-foreground mb-4">
                Tiempo registrado: {formatTime(chronometerTime)}
              </p>
            )}
          </>
        )}

        <div className="flex justify-center space-x-3 sm:space-x-4">
          <Button
            onClick={toggleTimer}
            variant="default"
            size="default"
            className={cn(
              "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full p-0",
              isRunning ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
            )}
            disabled={isStarting}
          >
            {isRunning ? (
              <PauseIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            ) : mode === 'chronometer' && chronometerTime > 0 ? (
              <RefreshCwIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            ) : (
              <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            )}
          </Button>
          {mode === 'timer' && !isRunning && (
            <Button
              onClick={resetTimer}
              variant="outline"
              size="default"
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full p-0"
              disabled={isStarting}
            >
              <RefreshCwIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 