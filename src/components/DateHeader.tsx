import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateHeaderProps {
  date?: Date;
  taskCount?: number;
}

export const DateHeader: React.FC<DateHeaderProps> = ({ 
  date = new Date(),
  taskCount
}) => {
  // Format the date using the es locale and explicit 24-hour format
  const formattedDate = format(date, 'MMM d', { locale: es });
  const formattedDay = format(date, 'EEEE', { locale: es });

  return (
    <header className="sticky top-0 bg-background/80 backdrop-blur-sm px-4 py-3 z-10">
      <h1>Today</h1>
      <div className="flex items-center gap-2 text-text-secondary">
        <time className="date-header">
          {formattedDate} · {formattedDay}
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