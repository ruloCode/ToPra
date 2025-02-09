"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getProductivityMetrics, type ProductivityMetrics, type TimeRange } from '@/lib/statistics';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalyticsSkeleton } from './AnalyticsSkeleton';
import { toast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CustomTooltip } from './CustomTooltip';

export default function ProductivityDashboard() {
  const [metrics, setMetrics] = useState<ProductivityMetrics | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadMetrics() {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await getProductivityMetrics(user.id, timeRange);
        setMetrics(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred while loading metrics';
        console.error('Error loading metrics:', message);
        toast({
          variant: "destructive",
          title: "Error loading metrics",
          description: message
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadMetrics();
  }, [user, timeRange]);

  if (isLoading) return <AnalyticsSkeleton />;
  if (!metrics) return null;

  const focusTimeData = [
    { name: 'Daily', time: metrics.focusTime.daily / 60 },
    { name: 'Weekly', time: metrics.focusTime.weekly / 60 },
    { name: 'Monthly', time: metrics.focusTime.monthly / 60 },
  ];

  return (
    <div className="transition-opacity duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Productivity Overview</h2>
        <Select
          value={timeRange}
          onValueChange={(value: TimeRange) => setTimeRange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Past Week</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
            <SelectItem value="year">Past Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Focus Time Distribution</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip title="Focus Time" />} />
                <Bar 
                  dataKey="time" 
                  name="Hours" 
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold">Task Completion</h3>
          <div className="mt-2">
            <p className="text-2xl font-bold animate-in slide-in-from-bottom duration-500">
              {Math.round(metrics.tasks.completionRate * 100)}%
            </p>
            <p className="text-sm text-gray-500">Completion Rate</p>
            <Progress 
              value={metrics.tasks.completionRate * 100} 
              className={`mt-2 transition-all duration-500 ${
                metrics.tasks.completionRate >= 0.75 ? '[&>div]:bg-green-500' :
                metrics.tasks.completionRate >= 0.5 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
              }`}
            />
          </div>
        </Card>

        {/* Remaining cards with hover and transition effects */}
        <Card className="p-4 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold">Streaks</h3>
          <div className="mt-2">
            <p className="text-2xl font-bold animate-in slide-in-from-bottom duration-500">
              {metrics.streaks.current} days
            </p>
            <p className="text-sm text-gray-500">Current Streak</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Longest Streak</p>
              <p className="text-lg font-semibold">{metrics.streaks.longest} days</p>
            </div>
            {metrics.streaks.dailyGoalMet && (
              <p className="mt-2 text-sm text-green-500 animate-pulse">Today&apos;s goal met! 🎯</p>
            )}
          </div>
        </Card>

        <Card className="p-4 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold">Productivity Score</h3>
          <div className="mt-2">
            <p className="text-2xl font-bold animate-in slide-in-from-bottom duration-500">
              {metrics.productivityScore}
            </p>
            <p className="text-sm text-gray-500">Out of 100</p>
            <Progress 
              value={metrics.productivityScore} 
              className={`mt-2 transition-all duration-500 ${
                metrics.productivityScore >= 75 ? '[&>div]:bg-green-500' :
                metrics.productivityScore >= 50 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
              }`}
            />
          </div>
        </Card>

        <Card className="p-4 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold">Focus Sessions</h3>
          <div className="mt-2">
            <p className="text-2xl font-bold animate-in slide-in-from-bottom duration-500">
              {metrics.sessions.completed}
            </p>
            <p className="text-sm text-gray-500">Completed Sessions</p>
            <div className="mt-4 space-y-2">
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-lg font-semibold">
                  {metrics.sessions.averageRating.toFixed(1)}/5 ⭐
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-lg font-semibold">
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