'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlayIcon, PauseIcon, RefreshCwIcon, SkipForwardIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export interface TimerProps {
  duration: number; // in minutes
  onComplete: () => void;
  showControls?: boolean;
}

export function Timer({ duration, onComplete, showControls = true }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false); // Changed to false so timer starts paused
  const [progress, setProgress] = useState(100);
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playSound = useCallback(() => {
    const audio = new Audio('/sounds/timer-complete.mp3');
    audio.play().catch(console.error);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress((newTime / (duration * 60)) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      playSound();
      onComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, duration, onComplete, playSound]);

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setTimeLeft(duration * 60);
    setProgress(100);
    setIsRunning(true);
  };

  const switchSession = () => {
    setIsRunning(false);
    if (sessionType === 'focus') {
      setSessionType('break');
      setTimeLeft(5 * 60); // 5 minutes break
    } else {
      setSessionType('focus');
      setTimeLeft(duration * 60);
    }
  };

  return (
    <Card className="relative p-6 max-w-sm mx-auto overflow-hidden bg-white  shadow-lg">
      {/* Progress Bar */}
      <div 
        className="absolute top-0 left-0 h-1 bg-primary transition-all duration-1000"
        style={{ width: `${progress}%` }}
      />
      
      <div className="text-center">
        <h2 className="text-lg font-medium text-slate-700  mb-2">
          {sessionType === 'focus' ? 'Sesión de Enfoque' : 'Tiempo de Descanso'}
        </h2>
        <h3 className="text-6xl font-bold mb-8 text-slate-900  tracking-tight">
          {formatTime(timeLeft)}
        </h3>
        <Progress value={progress} className="h-2 mb-6" />
        {showControls && (
          <div className="flex justify-center space-x-4">
            <Button
              onClick={toggleTimer}
              variant="default"
              size="lg"
              className="w-20 bg-primary hover:bg-primary/90"
            >
              {isRunning ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              className="w-20 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <RefreshCwIcon className="h-6 w-6" />
            </Button>
            <Button
              onClick={switchSession}
              variant="outline"
              size="lg"
              className="w-20 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
              title={sessionType === 'focus' ? 'Cambiar a descanso' : 'Cambiar a enfoque'}
            >
              <SkipForwardIcon className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
} 