import React from 'react';
import { format } from 'date-fns';

interface DateHeaderProps {
  date?: Date;
  taskCount?: number;
}

export const DateHeader: React.FC<DateHeaderProps> = ({ 
  date = new Date(),
  taskCount
}) => {
  return (
    <header className="sticky top-0 bg-background/80 backdrop-blur-sm px-4 py-3 z-10">
      <h1>Today</h1>
      <div className="flex items-center gap-2 text-text-secondary">
        <time className="date-header">
          {format(date, 'MMM d')} · {format(date, 'EEEE')}
        </time>
        {taskCount !== undefined && (
          <>
            <span>·</span>
            <span className="text-sm">{taskCount} tasks</span>
          </>
        )}
      </div>
    </header>
  );
};

export default DateHeader; 