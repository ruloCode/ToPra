'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to show the shimmer animation
   * @default true
   */
  animate?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, animate = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md bg-muted relative overflow-hidden',
          animate && [
            'before:absolute before:inset-0',
            'before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
            'before:bg-[length:200%_100%]',
            'before:animate-shimmer',
          ],
          className
        )}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

// Pre-built skeleton shapes
const SkeletonCircle = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & { size?: number | string }
>(({ className, size = 40, ...props }, ref) => {
  const sizeStyle = typeof size === 'number' ? `${size}px` : size;
  return (
    <Skeleton
      ref={ref}
      className={cn('rounded-full', className)}
      style={{ width: sizeStyle, height: sizeStyle }}
      {...props}
    />
  );
});
SkeletonCircle.displayName = 'SkeletonCircle';

const SkeletonText = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & { lines?: number; lastLineWidth?: string }
>(({ className, lines = 1, lastLineWidth = '75%', ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-4"
          style={{
            width: index === lines - 1 && lines > 1 ? lastLineWidth : '100%',
          }}
        />
      ))}
    </div>
  );
});
SkeletonText.displayName = 'SkeletonText';

const SkeletonButton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Skeleton
        ref={ref}
        className={cn('h-9 w-24 rounded-md', className)}
        {...props}
      />
    );
  }
);
SkeletonButton.displayName = 'SkeletonButton';

const SkeletonAvatar = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & { size?: 'sm' | 'md' | 'lg' }
>(({ className, size = 'md', ...props }, ref) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };
  return (
    <Skeleton
      ref={ref}
      className={cn('rounded-full', sizes[size], className)}
      {...props}
    />
  );
});
SkeletonAvatar.displayName = 'SkeletonAvatar';

export {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  SkeletonButton,
  SkeletonAvatar,
};
