'use client'

import UserSettings from '@/components/analytics/UserSettings';
import { Suspense } from 'react';

export default function SettingsPage() {

  return (
    <div className="mx-auto md:max-w-[60vw] p-4 text-text-secondary">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
    

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