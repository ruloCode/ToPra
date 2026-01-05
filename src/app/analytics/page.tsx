'use client';

import ProductivityDashboard from '@/components/analytics/ProductivityDashboard';
import TaskAnalytics from '@/components/analytics/TaskAnalytics';
import { Suspense, useState, useEffect } from 'react';

export default function AnalyticsPage() {
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  useEffect(() => {
    setLastRefreshed(new Date().toLocaleString());
  }, []);

  return (
    <main className="main-content min-h-screen bg-background px-4 py-6 md:px-8">
      <div className="mx-auto md:max-w-[60vw]">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Estadísticas</h1>
          <p className="mt-2 text-sm text-muted-foreground">Rastrea tu progreso y métricas de productividad</p>
        </header>
        
        <div className="grid gap-8">
           {/* Task completion analytics */}
           <section>
            <Suspense fallback={
              <div className="h-[500px] animate-pulse rounded-lg bg-secondary/50"></div>
            }>
              <TaskAnalytics />
            </Suspense>
          </section>
          {/* Main productivity metrics */}
          <section>
            <Suspense fallback={
              <div className="h-96 animate-pulse rounded-lg bg-secondary/50"></div>
            }>
              <ProductivityDashboard />
            </Suspense>
          </section>
         
      

         
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Los datos se actualizan en tiempo real. Última actualización: {lastRefreshed || '...'}</p>
        </footer>
      </div>
    </main>
  );
}