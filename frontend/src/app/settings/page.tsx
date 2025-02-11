'use client'

import UserSettings from '@/components/analytics/UserSettings';
import { Suspense } from 'react';
import { useTheme } from '@/hooks/useTheme'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="mx-auto max-w-4xl p-4 text-text-secondary">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-background-paper rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Dark Mode</h2>
            <p className="text-text-secondary text-sm">Switch between light and dark theme</p>
          </div>
          <Switch 
            checked={isDark}
            onCheckedChange={toggleTheme}
          />
        </div>
      </div>

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