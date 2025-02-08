'use client';

import { Task, TaskStatus } from '@/lib/tasks';
import { Calendar, CheckCircle2, Target } from 'lucide-react';

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const completedTasks = tasks.filter(
    (task) => task.status === TaskStatus.COMPLETED
  ).length;

  const totalTasks = tasks.length;
  const upcomingTasks = tasks.filter(
    (task) => task.status === TaskStatus.PENDING && task.due_date
  ).length;

  // Calculate focus time (example calculation - adjust based on your needs)
  const focusTime = tasks.reduce((total) => {
    return total + 10;
  }, 0);

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
        <div className="rounded-full bg-[#fff3f2] p-2">
          <CheckCircle2 className="h-5 w-5 text-accent" />
        </div>
        <div>
          <p className="text-sm text-text-secondary">Completed</p>
          <p className="text-lg font-semibold">
            {completedTasks}/{totalTasks}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
        <div className="rounded-full bg-[#edf6ff] p-2">
          <Target className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <p className="text-sm text-text-secondary">Focus Time</p>
          <p className="text-lg font-semibold">{formatFocusTime(focusTime)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
        <div className="rounded-full bg-[#fff8e7] p-2">
          <Calendar className="h-5 w-5 text-yellow-500" />
        </div>
        <div>
          <p className="text-sm text-text-secondary">Upcoming</p>
          <p className="text-lg font-semibold">
            {upcomingTasks} {upcomingTasks === 1 ? 'task' : 'tasks'}
          </p>
        </div>
      </div>
    </div>
  );
} 