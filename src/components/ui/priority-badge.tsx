'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';

const priorityBadgeVariants = cva(
  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors',
  {
    variants: {
      priority: {
        1: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        2: 'bg-info-light text-info-foreground',
        3: 'bg-warning-light text-warning-foreground',
        4: 'bg-error-light text-error-foreground',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-[10px]',
        default: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: {
      priority: 1,
      size: 'default',
    },
  }
);

// Priority icon colors for standalone use
export const priorityIconColors = {
  1: 'text-priority-low',
  2: 'text-priority-medium',
  3: 'text-priority-high',
  4: 'text-priority-urgent',
} as const;

const priorityLabels = {
  1: 'Baja',
  2: 'Media',
  3: 'Alta',
  4: 'Urgente',
} as const;

export type PriorityLevel = 1 | 2 | 3 | 4;

interface PriorityBadgeProps extends Omit<VariantProps<typeof priorityBadgeVariants>, 'priority'> {
  priority: PriorityLevel;
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function PriorityBadge({
  priority,
  size,
  showIcon = true,
  showLabel = true,
  className,
}: PriorityBadgeProps) {
  // Don't render anything for lowest priority unless explicitly showing label
  if (priority === 1 && !showLabel) {
    return null;
  }

  return (
    <span className={cn(priorityBadgeVariants({ priority, size }), className)}>
      {showIcon && <Flag className="h-3 w-3" />}
      {showLabel && <span>{priorityLabels[priority]}</span>}
    </span>
  );
}

// Priority icon only component
interface PriorityIconProps {
  priority: PriorityLevel;
  className?: string;
}

export function PriorityIcon({ priority, className }: PriorityIconProps) {
  // Don't show icon for lowest priority
  if (priority === 1) {
    return null;
  }

  return (
    <Flag
      className={cn(
        'h-4 w-4 flex-shrink-0',
        priorityIconColors[priority],
        className
      )}
    />
  );
}

export { priorityBadgeVariants };
