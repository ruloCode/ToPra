import UserSettings from '@/components/analytics/UserSettings';
import { Suspense } from 'react';

export default function SettingsPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
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