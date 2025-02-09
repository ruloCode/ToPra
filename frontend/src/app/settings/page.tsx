import UserSettings from '@/components/analytics/UserSettings';
import { Suspense } from 'react';

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-8 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-2">Customize your app experience and preferences</p>
      </header>

      <Suspense fallback={
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 w-1/4 bg-gray-200 rounded mb-4"></div>
              <div className="h-32 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      }>
        <UserSettings />
      </Suspense>
    </div>
  );
}