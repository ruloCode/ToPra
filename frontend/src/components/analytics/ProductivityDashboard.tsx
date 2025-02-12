"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getProductivityMetrics, type ProductivityMetrics, type TimeRange } from '@/lib/statistics';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { AnalyticsSkeleton } from './AnalyticsSkeleton';
import { toast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function ProductivityDashboard() {
  const [metrics, setMetrics] = useState<ProductivityMetrics | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function loadMetrics() {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await getProductivityMetrics(user.id, timeRange);
        if (mounted) {
          setMetrics(data);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred while loading metrics';
        console.error('Error loading metrics:', message);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Error loading metrics",
            description: message
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadMetrics();

    return () => {
      mounted = false;
    };
  }, [user, timeRange]);

  if (isLoading) return <AnalyticsSkeleton />;
  if (!metrics) return null;



  const getRangeLabel = () => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    
    const startDate = new Date(now);
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    startDate.setHours(0, 0, 0, 0);

    return `${startDate.toLocaleDateString()} - ${now.toLocaleDateString()}`;
  };

  const getRangeTitle = () => {
    switch (timeRange) {
      case 'week':
        return 'Last 7 Days';
      case 'month':
        return 'Last 30 Days';
      case 'year':
        return 'Last 365 Days';
      default:
        return 'Last 7 Days';
    }
  };

  return (
    <div className="transition-opacity duration-300 ease-in-out">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Productivity Overview</h2>
            <p className="text-sm text-muted-foreground">{getRangeTitle()}</p>
          </div>
          <Select
            value={timeRange}
            onValueChange={(value: TimeRange) => setTimeRange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="year">Last 365 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground/80">{getRangeLabel()}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
     

        <Card className="p-4 transition-all duration-300 hover:shadow-lg dark:border-[#28282F]">
          <h3 className="text-lg font-semibold text-foreground">Daily Task Streak</h3>
          <div className="mt-2">
            <p className="text-2xl font-bold text-foreground animate-in slide-in-from-bottom duration-500">
              {metrics.streaks.current} days
            </p>
            <p className="text-sm text-muted-foreground">Current Task Streak</p>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Longest Streak</p>
              <p className="text-lg font-semibold text-foreground">{metrics.streaks.longest} days</p>
            </div>
            {metrics.streaks.dailyGoalMet && (
              <p className="mt-2 text-sm text-green-500 animate-pulse">You completed a task today! 🎯</p>
            )}
          </div>
        </Card>

        <Card className="p-4 transition-all duration-300 hover:shadow-lg dark:border-[#28282F]">
          <h3 className="text-lg font-semibold text-foreground">Productivity Score</h3>
          <div className="mt-2">
            <p className="text-2xl font-bold text-foreground animate-in slide-in-from-bottom duration-500">
              {metrics.productivityScore}
            </p>
            <p className="text-sm text-muted-foreground">Total Points</p>
            <Progress 
              value={Math.min(100, (metrics.productivityScore / 10))} 
              className={`mt-2 transition-all duration-500 ${
                metrics.productivityScore >= 100 ? '[&>div]:bg-green-500' :
                metrics.productivityScore >= 50 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
              }`}
            />
            <div className="mt-4 space-y-3 text-sm text-muted-foreground bg-card/50 p-3 rounded-lg border border-border/50 backdrop-blur-sm">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <span className="text-primary">📊</span> Points System
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2 group transition-colors duration-200 hover:bg-background/50 p-2 rounded-md">
                  <span className="text-green-400 dark:text-green-300">✅</span>
                  <div>
                    <p className="text-foreground font-medium">Task Points</p>
                    <ul className="text-xs text-muted-foreground/80 space-y-1 mt-1">
                      <li>• High Priority Task = 3 points</li>
                      <li>• Medium Priority Task = 2 points</li>
                      <li>• Low Priority Task = 1 point</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start gap-2 group transition-colors duration-200 hover:bg-background/50 p-2 rounded-md">
                  <span className="text-blue-400 dark:text-blue-300">🕒</span>
                  <div>
                    <p className="text-foreground font-medium">Focus Time Points</p>
                    <ul className="text-xs text-muted-foreground/80 space-y-1 mt-1">
                      <li>• 0.25 points per minute</li>
                      <li>• Only completed sessions count</li>
                      <li className="text-xs italic mt-1">Example: 1 hour focus = 15 points</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-300 hover:shadow-lg dark:border-[#28282F]">
          <h3 className="text-lg font-semibold text-foreground">Focus Sessions</h3>
          <div className="mt-2">
            <p className="text-2xl font-bold text-foreground animate-in slide-in-from-bottom duration-500">
              {metrics.sessions.completed}
            </p>
            <p className="text-sm text-muted-foreground">Completed Sessions</p>
            <div className="mt-4 space-y-2">
            
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-lg font-semibold text-foreground">
                  {Math.round((metrics.sessions.completed / metrics.sessions.total) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}