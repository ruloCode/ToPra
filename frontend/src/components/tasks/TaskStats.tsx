'use client';

import { Task, TaskStatus } from '@/lib/tasks';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
  const pendingTasks = tasks.filter(task => task.status === TaskStatus.PENDING).length;
  const inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  
  const priorityDistribution = {
    high: tasks.filter(task => task.priority === 3).length,
    medium: tasks.filter(task => task.priority === 2).length,
    low: tasks.filter(task => task.priority === 1).length,
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueTodayTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  }).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Tasks */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{totalTasks}</p>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <span className="mr-1.5 h-2.5 w-2.5 rounded-full bg-gray-400"></span>
          {completedTasks} completed
        </div>
      </div>

      {/* Due Today */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Due Today</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{dueTodayTasks}</p>
        <div className="mt-2 text-sm text-gray-500">
          {format(today, "EEEE, d 'de' MMMM", { locale: es })}
        </div>
      </div>

      {/* Task Status */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Task Status</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{pendingTasks}</p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-1.5 h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
            {pendingTasks} pending
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-1.5 h-2.5 w-2.5 rounded-full bg-blue-400"></span>
            {inProgressTasks} in progress
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-1.5 h-2.5 w-2.5 rounded-full bg-green-400"></span>
            {completedTasks} completed
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Priority Distribution</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{priorityDistribution.high}</p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center text-sm text-gray-500">
            <div className="mr-1.5 flex">
              {[1,2,3].map(dot => (
                <span key={dot} className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
              ))}
            </div>
            {priorityDistribution.high} high priority
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <div className="mr-1.5 flex">
              {[1,2].map(dot => (
                <span key={dot} className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
              ))}
            </div>
            {priorityDistribution.medium} medium priority
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <div className="mr-1.5 flex">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
            </div>
            {priorityDistribution.low} low priority
          </div>
        </div>
      </div>
    </div>
  );
} 