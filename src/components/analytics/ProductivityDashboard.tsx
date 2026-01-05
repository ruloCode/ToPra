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
        const message = error instanceof Error ? error.message : 'Ocurrió un error al cargar las métricas';
        console.error('Error loading metrics:', message);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Error al cargar métricas",
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
        return 'Últimos 7 días';
      case 'month':
        return 'Últimos 30 días';
      case 'year':
        return 'Últimos 365 días';
      default:
        return 'Últimos 7 días';
    }
  };

  return (
    <div className="transition-opacity duration-300 ease-in-out">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Resumen de productividad</h2>
            <p className="text-sm text-muted-foreground">{getRangeTitle()}</p>
          </div>
          <Select
            value={timeRange}
            onValueChange={(value: TimeRange) => setTimeRange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar rango" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="week">Últimos 7 días</SelectItem>
              <SelectItem value="month">Últimos 30 días</SelectItem>
              <SelectItem value="year">Últimos 365 días</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground/80">{getRangeLabel()}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
     

        <Card className="p-4 transition-all duration-300 hover:shadow-lg dark:border-[#28282F]">
          <h3 className="text-lg font-semibold text-foreground">Racha de tareas diarias</h3>
          <div className="mt-2">
            <p className="text-2xl font-bold text-foreground animate-in slide-in-from-bottom duration-500">
              {metrics.streaks.current} días
            </p>
            <p className="text-sm text-muted-foreground">Racha actual de tareas</p>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Racha más larga</p>
              <p className="text-lg font-semibold text-foreground">{metrics.streaks.longest} días</p>
            </div>
            {metrics.streaks.dailyGoalMet && (
              <p className="mt-2 text-sm text-green-500 animate-pulse">¡Completaste una tarea hoy! 🎯</p>
            )}
          </div>
        </Card>

        <Card className="p-4 transition-all duration-300 hover:shadow-lg dark:border-[#28282F]">
          <h3 className="text-lg font-semibold text-foreground">Puntuación de productividad</h3>
          <div className="mt-2">
            <p className="text-2xl font-bold text-foreground animate-in slide-in-from-bottom duration-500">
              {metrics.productivityScore}
            </p>
            <p className="text-sm text-muted-foreground">Puntos totales</p>
            <Progress 
              value={Math.min(100, (metrics.productivityScore / 10))} 
              className={`mt-2 transition-all duration-500 ${
                metrics.productivityScore >= 100 ? '[&>div]:bg-green-500' :
                metrics.productivityScore >= 50 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
              }`}
            />
            <div className="mt-4 space-y-3 text-sm text-muted-foreground bg-card/50 p-3 rounded-lg border border-border/50 backdrop-blur-sm">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <span className="text-primary">📊</span> Sistema de puntos
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2 group transition-colors duration-200 hover:bg-background/50 p-2 rounded-md">
                  <span className="text-green-400 dark:text-green-300">✅</span>
                  <div>
                    <p className="text-foreground font-medium">Puntos por tarea</p>
                    <ul className="text-xs text-muted-foreground/80 space-y-1 mt-1">
                      <li>• Tarea de alta prioridad = 3 puntos</li>
                      <li>• Tarea de prioridad media = 2 puntos</li>
                      <li>• Tarea de baja prioridad = 1 punto</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start gap-2 group transition-colors duration-200 hover:bg-background/50 p-2 rounded-md">
                  <span className="text-blue-400 dark:text-blue-300">🕒</span>
                  <div>
                    <p className="text-foreground font-medium">Puntos por tiempo de enfoque</p>
                    <ul className="text-xs text-muted-foreground/80 space-y-1 mt-1">
                      <li>• 0.25 puntos por minuto</li>
                      <li>• Solo cuentan las sesiones completadas</li>
                      <li className="text-xs italic mt-1">Ejemplo: 1 hora de enfoque = 15 puntos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-300 hover:shadow-lg dark:border-[#28282F]">
          <h3 className="text-lg font-semibold text-foreground">Sesiones de enfoque</h3>
          <div className="mt-2">
            <p className="text-2xl font-bold text-foreground animate-in slide-in-from-bottom duration-500">
              {metrics.sessions.completed}
            </p>
            <p className="text-sm text-muted-foreground">Sesiones completadas</p>
            <div className="mt-4 space-y-2">
            
              <div>
                <p className="text-sm text-muted-foreground">Tasa de completitud</p>
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