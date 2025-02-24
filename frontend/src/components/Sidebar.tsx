'use client';

import { useAuth } from '@/components/AuthProvider';
import { useTaskModal } from '@/contexts/TaskModalContext';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  Target,
  ListTodo,
  Settings,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
  BarChart,
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const { user, signOut } = useAuth();
  const { openCreateTaskModal } = useTaskModal();
  const { isDark } = useTheme();
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  const navigation = [
    { name: 'Today', href: '/', icon: Home },
    { name: 'Tasks', href: '/tasks', icon: ListTodo },
    { name: 'Focus', href: '/focus', icon: Target },
    { name: 'Analytics', href: '/analytics', icon: BarChart },
  ];

  const secondaryNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  // Update main content margin when sidebar state changes
  const toggleSidebar = () => {
    setExpanded(!expanded);
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.toggle('sidebar-expanded');
      mainContent.classList.toggle('sidebar-collapsed');
    }
  };

  return (
    <aside className={`sidebar px-2 ${expanded ? 'expanded' : 'collapsed'}`}>
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle bg-white dark:bg-zinc-900 dark:text-white dark:border-[#28282F]"
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      <div className="flex h-full w-full flex-col gap-y-5 overflow-hidden justify-center">
        <div className="flex h-16 shrink-0 items-center justify-center">
          <Image
            src={isDark ? '/logos/logo_topra_dark.png' : '/logos/logo_topa_ light.png'}
            alt="To-Pra Logo"
            width={expanded ? 128 : 32}
            height={32}
            className={`h-10 ${expanded ? 'w-auto' : 'w-10'}`}
          />
        </div>
        
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list"     >  
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                        title={!expanded ? item.name : undefined}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="nav-text">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            <li>
              <button 
                onClick={() => openCreateTaskModal()}
                className="nav-link w-full hover:bg-accent/10"
                title={!expanded ? 'Add Task' : undefined}
              >
                <Plus className="h-5 w-5 flex-shrink-0" />
                <span className="nav-text">Add Task</span>
              </button>
            </li>

            <li className="mt-auto">
              <div className="space-y-1">
                {secondaryNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                      title={!expanded ? item.name : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="nav-text">
                        {item.name}
                        {item.name === 'Settings' && !expanded && (
                          <span className="ml-2 text-xs px-1 rounded-full bg-accent/10">
                            {isDark ? '🌙' : '☀️'}
                          </span>
                        )}
                      </span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => signOut()}
                  className="nav-link w-full text-left hover:text-red-500"
                  title={!expanded ? 'Log out' : undefined}
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span className="nav-text">Log out</span>
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}