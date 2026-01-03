'use client';

import { ReactNode } from 'react';

interface TaskDetailLayoutProps {
  mainContent: ReactNode;
  sidebarContent: ReactNode;
}

export function TaskDetailLayout({ mainContent, sidebarContent }: TaskDetailLayoutProps) {
  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="h-full lg:grid lg:grid-cols-[1fr_380px]">
        {/* Main Content Column */}
        <main className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            {mainContent}
          </div>
        </main>

        {/* Activity Sidebar - Hidden on mobile */}
        <aside className="hidden lg:flex lg:flex-col h-full border-l border-border bg-card/50 overflow-hidden">
          {sidebarContent}
        </aside>
      </div>
    </div>
  );
}
