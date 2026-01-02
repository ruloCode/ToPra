'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Circle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
  {
    variants: {
      status: {
        pending: 'bg-muted text-muted-foreground',
        in_progress: 'bg-info-light text-info-foreground',
        completed: 'bg-success-light text-success-foreground',
        overdue: 'bg-error-light text-error-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        default: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      status: 'pending',
      size: 'default',
    },
  }
);

// Status bar colors for the left indicator
export const statusBarColors = {
  pending: 'bg-muted-foreground',
  in_progress: 'bg-info',
  completed: 'bg-success',
  overdue: 'bg-error',
} as const;

const statusIcons = {
  pending: Circle,
  in_progress: Clock,
  completed: CheckCircle2,
  overdue: AlertCircle,
} as const;

const statusLabels = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completada',
  overdue: 'Vencida',
} as const;

export type StatusType = keyof typeof statusLabels;

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  status: StatusType;
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  size,
  showIcon = true,
  showLabel = true,
  className,
}: StatusBadgeProps) {
  const Icon = statusIcons[status];

  return (
    <span className={cn(statusBadgeVariants({ status, size }), className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {showLabel && <span>{statusLabels[status]}</span>}
    </span>
  );
}

// Status bar component for card left indicator
interface StatusBarProps {
  status: StatusType;
  className?: string;
}

export function StatusBar({ status, className }: StatusBarProps) {
  return (
    <div
      className={cn(
        'absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-colors',
        statusBarColors[status],
        className
      )}
    />
  );
}

export { statusBadgeVariants };
