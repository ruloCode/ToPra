'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { FocusTimer } from '@/components/focus/FocusTimer';
import { cn } from '@/lib/utils';

interface TaskFocusSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  onStart: (duration: number) => void;
  onComplete: (duration: number) => void;
  onInterrupt: (elapsed: number) => void;
  onChronometerStop: (minutes: number) => void;
}

export function TaskFocusSection({
  isOpen,
  onToggle,
  onStart,
  onComplete,
  onInterrupt,
  onChronometerStop,
}: TaskFocusSectionProps) {
  return (
    <div className="mt-6 border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-secondary/50 transition-colors",
          isOpen && "border-b border-border"
        )}
      >
        <span className="font-medium text-foreground">Timer de enfoque</span>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 bg-card/50">
          <FocusTimer
            onStart={onStart}
            onComplete={onComplete}
            onInterrupt={onInterrupt}
            onChronometerStop={onChronometerStop}
          />
        </div>
      )}
    </div>
  );
}
