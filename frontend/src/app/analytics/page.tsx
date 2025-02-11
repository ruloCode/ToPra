import ProductivityDashboard from '@/components/analytics/ProductivityDashboard';
import HistoricalStats from '@/components/analytics/HistoricalStats';
import TaskAnalytics from '@/components/analytics/TaskAnalytics';
import { Suspense } from 'react';

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-8 max-w-7xl">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-500 mt-2">Track your progress and productivity metrics</p>
        </div>
        {/* <div className="w-full sm:w-auto">
          <ExportData />
        </div> */}
      </header>
      
      <div className="grid gap-8">
        {/* Main productivity metrics */}
        <section>
          <Suspense fallback={
            <div className="animate-pulse bg-gray-100 rounded-lg h-96"></div>
          }>
            <ProductivityDashboard />
          </Suspense>
        </section>

       

        {/* Historical data visualization */}
        <section>
          <Suspense fallback={
            <div className="animate-pulse bg-gray-100 rounded-lg h-[400px]"></div>
          }>
            <HistoricalStats />
          </Suspense>
        </section>

        {/* Task completion analytics */}
        <section>
          <Suspense fallback={
            <div className="animate-pulse bg-gray-100 rounded-lg h-[500px]"></div>
          }>
            <TaskAnalytics />
          </Suspense>
        </section>
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>Data is updated in real-time. Last refreshed: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
}