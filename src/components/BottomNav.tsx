"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ListTodo,
  Target,
  BarChart,
  Plus,
} from 'lucide-react';
import { useTaskModal } from '@/contexts/TaskModalContext';
import { useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/components/AuthProvider';

export const BottomNav = () => {
  const pathname = usePathname();
  const { openCreateTaskModal } = useTaskModal();
  const { refreshTasks } = useTasks();
  const { user } = useAuth();

  if (!user) return null;

  const navigation = [
    { name: 'Today', href: '/', icon: Home },
    { name: 'Tasks', href: '/tasks', icon: ListTodo },
    { name: 'Focus', href: '/focus', icon: Target },
    { name: 'Analytics', href: '/analytics', icon: BarChart },
  ];

  const leftNav = navigation.slice(0, 2);
  const rightNav = navigation.slice(2);

  const handleAddTask = () => {
    openCreateTaskModal(refreshTasks);
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bottom-nav">
      <div className="nav-group">
        {leftNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-link ${isActive(item.href) ? '!active' : ''}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="nav-group-center">
        <button 
          onClick={handleAddTask}
          className="fab"
          aria-label="Add new task"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <div className="nav-group">
        {rightNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-link ${isActive(item.href) ? '!active' : ''}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;