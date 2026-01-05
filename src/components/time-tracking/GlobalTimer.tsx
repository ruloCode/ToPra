"use client";

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useTimerStore } from '@/lib/stores/timerStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TimeTrackingPanel } from './TimeTrackingPanel';
import { useAuth } from '@/components/AuthProvider';

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function GlobalTimer() {
  const { user } = useAuth();
  const {
    isRunning,
    mode,
    timeInSeconds,
    chronometerTime,
    timerStartTime,
    activeTaskName,
    syncTimerState,
  } = useTimerStore();

  const [displayTime, setDisplayTime] = useState(0);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync timer state on mount
  useEffect(() => {
    syncTimerState();
  }, [syncTimerState]);

  // Update display time every 100ms when running
  useEffect(() => {
    if (!isRunning || !timerStartTime) {
      if (mode === 'timer') {
        setDisplayTime(timeInSeconds);
      } else {
        setDisplayTime(chronometerTime);
      }
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSinceStart = Math.floor((now - timerStartTime) / 1000);

      if (mode === 'timer') {
        const selectedDuration = useTimerStore.getState().selectedDuration;
        const initialSeconds = selectedDuration * 60;
        const remaining = Math.max(0, initialSeconds - elapsedSinceStart);
        setDisplayTime(remaining);
      } else {
        setDisplayTime(elapsedSinceStart);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, timerStartTime, mode, timeInSeconds, chronometerTime]);

  // Don't show if user is not logged in
  if (!user) return null;

  // Show timer button in navbar (desktop) when timer is running
  const NavbarTimer = () => {
    if (!isRunning) return null;

    return (
      <div className="hidden md:block fixed top-4 right-20 z-[100]">
        <DropdownMenu open={isNavbarOpen} onOpenChange={setIsNavbarOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="bg-primary-main hover:bg-primary-dark text-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 animate-pulse"
            >
              <Clock className="h-4 w-4" />
              <span className="font-mono font-semibold">{formatTime(displayTime)}</span>
              {activeTaskName && (
                <span className="max-w-[120px] truncate text-xs opacity-80">
                  {activeTaskName}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 p-0 bg-background-default dark:bg-background-paper shadow-xl rounded-lg border border-border"
            sideOffset={8}
          >
            <TimeTrackingPanel onClose={() => setIsNavbarOpen(false)} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  // Floating action button for mobile
  const FloatingTimer = () => {
    return (
      <div className="md:hidden fixed bottom-20 right-4 z-[100]">
        <DropdownMenu open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className={`rounded-full shadow-lg h-14 ${
                isRunning
                  ? 'bg-primary-main hover:bg-primary-dark animate-pulse w-auto px-4'
                  : 'bg-primary-main hover:bg-primary-dark w-14'
              }`}
            >
              {isRunning ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-white" />
                  <span className="font-mono font-semibold text-white">
                    {formatTime(displayTime)}
                  </span>
                </div>
              ) : (
                <Clock className="h-6 w-6 text-white" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="top"
            className="w-[calc(100vw-32px)] max-w-md p-0 bg-background-default dark:bg-background-paper shadow-xl rounded-lg border border-border"
            sideOffset={8}
          >
            <TimeTrackingPanel onClose={() => setIsMobileOpen(false)} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <>
      <NavbarTimer />
      <FloatingTimer />
    </>
  );
}
