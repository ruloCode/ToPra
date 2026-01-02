'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';

interface TaskCardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to show the shimmer animation
   * @default true
   */
  animate?: boolean;
}

export function TaskCardSkeleton({ animate = true, className, ...props }: TaskCardSkeletonProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border bg-card overflow-hidden',
        'dark:border-[#28282F]',
        className
      )}
      {...props}
    >
      {/* Status bar skeleton */}
      <Skeleton
        animate={animate}
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
      />

      <div className="flex items-start gap-3 p-4 pl-5">
        {/* Checkbox skeleton */}
        <SkeletonCircle size={20} animate={animate} className="mt-0.5 flex-shrink-0" />

        {/* Content */}
        <div className="flex flex-1 flex-col min-w-0 gap-2">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1.5">
              {/* Title */}
              <Skeleton animate={animate} className="h-4 w-3/4" />
              {/* Description preview */}
              <Skeleton animate={animate} className="h-3 w-1/2" />
            </div>
          </div>

          {/* Meta info row */}
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            {/* Due date */}
            <Skeleton animate={animate} className="h-4 w-16 rounded" />
            {/* Priority */}
            <Skeleton animate={animate} className="h-4 w-4 rounded" />
            {/* Tags */}
            <div className="flex gap-1.5">
              <Skeleton animate={animate} className="h-5 w-14 rounded-full" />
              <Skeleton animate={animate} className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TaskListSkeletonProps {
  /**
   * Number of skeleton cards to show
   * @default 5
   */
  count?: number;
  /**
   * Whether to show the shimmer animation
   * @default true
   */
  animate?: boolean;
  className?: string;
}

export function TaskListSkeleton({ count = 5, animate = true, className }: TaskListSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <TaskCardSkeleton
          key={index}
          animate={animate}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  );
}

// Compact version for smaller spaces
export function TaskCardSkeletonCompact({ animate = true, className }: TaskCardSkeletonProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg border bg-card overflow-hidden',
        'dark:border-[#28282F]',
        className
      )}
    >
      <Skeleton
        animate={animate}
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
      />

      <div className="flex items-center gap-2 p-3 pl-4">
        <SkeletonCircle size={16} animate={animate} className="flex-shrink-0" />
        <Skeleton animate={animate} className="h-3.5 flex-1" />
        <Skeleton animate={animate} className="h-4 w-12 rounded" />
      </div>
    </div>
  );
}
