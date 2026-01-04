'use client';

import { cn } from '@/lib/utils';

interface SubtasksProgressProps {
  completed: number;
  total: number;
  className?: string;
}

export function SubtasksProgress({
  completed,
  total,
  className,
}: SubtasksProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300 rounded-full',
            percentage === 100 ? 'bg-green-500' : 'bg-accent'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{percentage}%</span>
    </div>
  );
}
