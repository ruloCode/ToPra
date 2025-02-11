"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getHistoricalData, type HistoricalData, type TimeRange } from '@/lib/statistics';
import { Card } from '../ui/card';
import { AnalyticsSkeleton } from './AnalyticsSkeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';

export default function HistoricalStats() {
  const [data, setData] = useState<HistoricalData[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setIsLoading(true);
      try {
        const histData = await getHistoricalData(user.id, timeRange);
        setData(histData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } catch (error) {
        console.error('Error loading historical data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user, timeRange]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return timeRange === 'week' 
      ? date.toLocaleDateString(undefined, { weekday: 'short' })
      : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  if (isLoading) return <AnalyticsSkeleton />;

  return (
    <Card className="p-4 transition-all duration-300 hover:shadow-lg dark:border-[#28282F]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Historical Progress</h3>
        <Select
          value={timeRange}
          onValueChange={(value: TimeRange) => setTimeRange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="year">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              minTickGap={30}
              className="text-muted-foreground text-xs"
            />
            <YAxis yAxisId="left" className="text-muted-foreground text-xs" />
            <YAxis yAxisId="right" orientation="right" className="text-muted-foreground text-xs" />
            <Tooltip content={<CustomTooltip title="Daily Progress" />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="tasksCompleted"
              name="Tasks Completed"
              stroke="var(--accent)"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sessionsCompleted"
              name="Focus Sessions"
              stroke="#82ca9d"
              strokeWidth={2}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="productivityScore"
              name="Productivity Score"
              stroke="#ffc658"
              strokeWidth={2}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}