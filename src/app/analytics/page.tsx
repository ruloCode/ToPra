'use client';

import ProductivityDashboard from '@/components/analytics/ProductivityDashboard';
import TaskAnalytics from '@/components/analytics/TaskAnalytics';
import { Suspense } from 'react';

export default function AnalyticsPage() {
  return (
    <main className="main-content min-h-screen bg-background px-4 py-6 md:px-8">
      <div className="mx-auto md:max-w-[60vw]">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="mt-2 text-sm text-muted-foreground">Track your progress and productivity metrics</p>
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
          <p>Data is updated in real-time. Last refreshed: {new Date().toLocaleString()}</p>
        </footer>
      </div>
    </main>
  );
}