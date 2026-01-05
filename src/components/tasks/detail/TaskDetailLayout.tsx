'use client';

import { ReactNode, useEffect, useState } from 'react';

interface TaskDetailLayoutProps {
  mainContent: ReactNode;
  sidebarContent: ReactNode;
}

export function TaskDetailLayout({ mainContent, sidebarContent }: TaskDetailLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    // Check initial sidebar state
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      setSidebarExpanded(sidebar.classList.contains('expanded'));
    }

    // Listen for sidebar toggle changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          setSidebarExpanded(target.classList.contains('expanded'));
        }
      });
    });

    if (sidebar) {
      observer.observe(sidebar, { attributes: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="h-screen bg-background-default transition-all duration-300 ease-in-out md:ml-[var(--sidebar-width)]"
      style={{
        marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768
          ? (sidebarExpanded ? 'var(--sidebar-width)' : 'var(--sidebar-width-collapsed)')
          : '0'
      }}
    >
      <div className="h-full flex">
        {/* Main Content Column - Scrollable */}
        <main className="flex-1 h-full overflow-y-auto bg-background-default">
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            {mainContent}
          </div>
        </main>

        {/* Activity Sidebar - Fixed height, hidden on mobile */}
        <aside className="hidden lg:flex lg:flex-col w-[380px] h-full border-l border-border bg-background-paper flex-shrink-0">
          {sidebarContent}
        </aside>
      </div>
    </div>
  );
}
