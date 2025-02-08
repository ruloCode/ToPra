'use client';

import { useAuth } from '@/components/AuthProvider';
import { useTaskModal } from '@/contexts/TaskModalContext';
import Link from 'next/link';
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
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const { openCreateTaskModal } = useTaskModal();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  const navigation = [
    { name: 'Today', href: '/', icon: Home },
    { name: 'Tasks', href: '/tasks', icon: ListTodo },
    { name: 'Focus', href: '/focus', icon: Target },
  
  ];

  const secondaryNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    // Update main content margin
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.toggle('sidebar-expanded');
      mainContent.classList.toggle('sidebar-collapsed');
    }
  };

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button 
        onClick={toggleSidebar}
        className="sidebar-toggle"
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      <div className="flex h-full flex-col gap-y-5 overflow-y-auto px-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-xl font-bold text-accent">
            {isExpanded ? 'To-Pra' : 'TP'}
          </h1>
        </div>
        
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                        title={!isExpanded ? item.name : undefined}
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
                className="flex w-full items-center gap-2 rounded-lg bg-accent/10 px-4 py-2 text-accent hover:bg-accent/20"
                title={!isExpanded ? 'Add Task' : undefined}
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
                      title={!isExpanded ? item.name : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="nav-text">{item.name}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => signOut()}
                  className="nav-link w-full text-left hover:bg-red-50 hover:text-red-600"
                  title={!isExpanded ? 'Log out' : undefined}
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