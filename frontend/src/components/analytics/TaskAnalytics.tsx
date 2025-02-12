"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { calculateTaskMetrics, type TaskMetrics } from '@/lib/statistics';
import { AnalyticsSkeleton } from './AnalyticsSkeleton';


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



  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <Card className="p-4 transition-all duration-300 hover:shadow-lg dark:border-[#28282F]">
        <h3 className="text-lg font-semibold text-foreground">Task Overview</h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="animate-in slide-in-from-left duration-500">
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <p className="text-2xl font-bold text-foreground">{Math.round(metrics.completionRate * 100)}%</p>
            <Progress 
              value={metrics.completionRate * 100} 
              className={`mt-2 transition-all duration-500 ${
                metrics.completionRate >= 0.75 ? '[&>div]:bg-green-500' :
                metrics.completionRate >= 0.5 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
              }`}
            />
          </div>
          <div className="animate-in slide-in-from-right duration-500">
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
            <p className="text-2xl font-bold text-foreground">{metrics.completedTasks}/{metrics.totalTasks}</p>
          </div>
        </div>
      </Card>

   
    </div>
  );
}