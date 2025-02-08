'use client';

import { useAuth } from '@/components/AuthProvider';
import Auth from '@/components/Auth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Home() {
  const { user, isLoading } = useAuth();
  const today = new Date();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            {format(today, "EEEE, d 'de' MMMM", { locale: es })}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Welcome Section */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">
              Welcome back, {user.email}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Here&apos;s an overview of your productivity today.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <a
                href="/tasks"
                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                View Tasks
              </a>
              <a
                href="/focus"
                className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Start Focus Session
              </a>
            </div>
          </div>

          {/* Coming Soon Sections */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">AI Assistant</h2>
            <p className="mt-2 text-sm text-gray-500">
              Coming soon: Get AI-powered suggestions for task prioritization and management.
            </p>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">Analytics</h2>
            <p className="mt-2 text-sm text-gray-500">
              Coming soon: View detailed insights about your productivity and focus sessions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
