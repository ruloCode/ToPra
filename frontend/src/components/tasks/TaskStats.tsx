'use client';

import { Task, TaskStatus } from '@/lib/tasks';
import { Calendar, CheckCircle2, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFocusSessions, type FocusSession } from '@/lib/focus';
import { useAuth } from '@/components/AuthProvider';

interface TaskStatsProps {
  tasks: Task[];
  todayOnly?: boolean;
}

export default function TaskStats({ tasks, todayOnly = false }: TaskStatsProps) {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const { user } = useAuth();
  
  const completedTasks = tasks.filter(
    (task) => task.status === TaskStatus.COMPLETED
  ).length;

  const totalTasks = tasks.length;
  const upcomingTasks = tasks.filter(
    (task) => task.status === TaskStatus.PENDING && task.due_date
  ).length;

  useEffect(() => {
    if (user) {
      getFocusSessions({ userId: user.id })
        .then(setSessions)
        .catch(console.error);
    }
  }, [user]);

  // Calculate total focus time from completed sessions
  const focusTime = sessions.reduce((total, session) => {
    if (!session.duration || session.status !== 'completed') return total;
    
    if (todayOnly) {
      const sessionDate = new Date(session.start_time);
      const today = new Date();
      
      // Check if the session is from today
      const isToday = sessionDate.getDate() === today.getDate() &&
                      sessionDate.getMonth() === today.getMonth() &&
                      sessionDate.getFullYear() === today.getFullYear();

      return isToday ? total + session.duration : total;
    }
    
    return total + session.duration;
  }, 0);

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.round((minutes - Math.floor(minutes)) * 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (mins > 0) parts.push(`${mins}m`);
    if (secs > 0) parts.push(`${secs}s`);
    
    return parts.length > 0 ? parts.join(' ') : '0s';
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