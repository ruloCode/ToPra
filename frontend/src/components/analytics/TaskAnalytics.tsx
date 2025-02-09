"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { calculateTaskMetrics, type TaskMetrics } from '@/lib/statistics';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AnalyticsSkeleton } from './AnalyticsSkeleton';
import { CustomTooltip } from './CustomTooltip';

const COLORS = ['#10B981', '#EF4444', '#3B82F6'];

export default function TaskAnalytics() {
  const [metrics, setMetrics] = useState<TaskMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadMetrics() {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await calculateTaskMetrics(user.id);
        setMetrics(data);
      } catch (error) {
        console.error('Error loading task metrics:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadMetrics();
  }, [user]);

  if (isLoading) return <AnalyticsSkeleton />;
  if (!metrics) return null;

  const pieData = [
    { name: 'Completed', value: metrics.completedTasks },
    { name: 'Overdue', value: metrics.overdueTasks },
    { name: 'Upcoming', value: metrics.upcomingTasks },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <Card className="p-4 transition-all duration-300 hover:shadow-lg">
        <h3 className="text-lg font-semibold">Task Overview</h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="animate-in slide-in-from-left duration-500">
            <p className="text-sm text-gray-500">Completion Rate</p>
            <p className="text-2xl font-bold">{Math.round(metrics.completionRate * 100)}%</p>
            <Progress 
              value={metrics.completionRate * 100} 
              className={`mt-2 transition-all duration-500 ${
                metrics.completionRate >= 0.75 ? '[&>div]:bg-green-500' :
                metrics.completionRate >= 0.5 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
              }`}
            />
          </div>
          <div className="animate-in slide-in-from-right duration-500">
            <p className="text-sm text-gray-500">Tasks Completed</p>
            <p className="text-2xl font-bold">{metrics.completedTasks}/{metrics.totalTasks}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 transition-all duration-300 hover:shadow-lg">
          <h4 className="font-medium mb-4">Task Distribution</h4>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip title="Task Distribution" />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2 animate-in slide-in-from-bottom duration-700">
            <div className="flex items-center gap-2 text-sm">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              <span>Completed: {metrics.completedTasks}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span>Overdue: {metrics.overdueTasks}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="h-3 w-3 rounded-full bg-blue-500"></span>
              <span>Upcoming: {metrics.upcomingTasks}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-300 hover:shadow-lg">
          <h4 className="font-medium">Avg. Completion Time</h4>
          <div className="animate-in slide-in-from-right duration-500">
            <p className="mt-2 text-2xl font-bold">
              {Math.round(metrics.averageCompletionTime / 60)} hrs
            </p>
            <p className="text-sm text-gray-500">per task</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Total Active Tasks</p>
              <p className="text-lg font-semibold">
                {metrics.totalTasks - metrics.completedTasks}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}