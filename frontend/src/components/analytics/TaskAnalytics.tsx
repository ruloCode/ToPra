"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { calculateTaskMetrics, type TaskMetrics } from '@/lib/statistics';
import { AnalyticsSkeleton } from './AnalyticsSkeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300',
  '#6b486b', '#98abc5', '#8a89a6', '#7b6888'
];

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
        console.log('Metrics loaded:', data); // Para debug
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

  // Transformar los datos para el gráfico de torta y filtrar etiquetas vacías
  const labelData = Object.entries(metrics.labelDistribution || {})
    .filter(([name]) => name && name.trim() !== '')
    .map(([name, value]) => ({
      name,
      value,
      percentage: ((value / metrics.totalTasks) * 100).toFixed(1)
    }));

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

      {labelData.length > 0 && (
        <Card className="p-4 transition-all duration-300 hover:shadow-lg dark:border-[#28282F]">
          <h3 className="text-lg font-semibold text-foreground mb-4">Task Labels Distribution</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={labelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {labelData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} tasks`, name]} 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}