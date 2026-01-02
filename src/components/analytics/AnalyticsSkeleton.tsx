'use client';

import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

interface AnalyticsSkeletonProps {
  /**
   * Whether to show the shimmer animation
   * @default true
   */
  animate?: boolean;
}

export function AnalyticsSkeleton({ animate = true }: AnalyticsSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <Card
            key={i}
            className={cn(
              'p-4 animate-fade-in',
              'dark:border-[#28282F]'
            )}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="space-y-3">
              {/* Icon and label row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton animate={animate} className="h-8 w-8 rounded-lg" />
                  <Skeleton animate={animate} className="h-4 w-20" />
                </div>
              </div>
              {/* Value */}
              <Skeleton animate={animate} className="h-8 w-1/2" />
              {/* Progress bar */}
              <Skeleton animate={animate} className="h-2 w-full rounded-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Skeleton for the timeline component
export function TimelineSkeleton({ animate = true }: AnalyticsSkeletonProps) {
  return (
    <Card className={cn('p-4', 'dark:border-[#28282F]')}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton animate={animate} className="h-5 w-32" />
          <Skeleton animate={animate} className="h-4 w-20" />
        </div>

        {/* Timeline bars */}
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton animate={animate} className="h-4 w-12" />
              <Skeleton
                animate={animate}
                className="h-6 rounded"
                style={{ width: `${Math.random() * 50 + 30}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// Skeleton for chart components
export function ChartSkeleton({ animate = true }: AnalyticsSkeletonProps) {
  return (
    <Card className={cn('p-4', 'dark:border-[#28282F]')}>
      <div className="space-y-4">
        {/* Header */}
        <Skeleton animate={animate} className="h-5 w-40" />

        {/* Chart area placeholder */}
        <div className="h-48 flex items-end justify-between gap-2 pt-4">
          {[...Array(7)].map((_, i) => (
            <Skeleton
              key={i}
              animate={animate}
              className="flex-1 rounded-t"
              style={{ height: `${Math.random() * 60 + 20}%` }}
            />
          ))}
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} animate={animate} className="h-3 w-8" />
          ))}
        </div>
      </div>
    </Card>
  );
}

// Complete analytics page skeleton
export function AnalyticsPageSkeleton({ animate = true }: AnalyticsSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <Skeleton animate={animate} className="h-8 w-48" />

      {/* Stats cards */}
      <AnalyticsSkeleton animate={animate} />

      {/* Charts row */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartSkeleton animate={animate} />
        <TimelineSkeleton animate={animate} />
      </div>
    </div>
  );
}
