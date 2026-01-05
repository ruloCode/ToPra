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
import { useTimerStore } from '@/lib/stores/timerStore';

export const BottomNav = () => {
  const pathname = usePathname();
  const { openCreateTaskModal } = useTaskModal();
  const { refreshTasks } = useTasks();
  const { user } = useAuth();
  const isTimerRunning = useTimerStore((state) => state.isRunning);

  if (!user) return null;

  const navigation = [
    { name: 'Hoy', href: '/', icon: Home },
    { name: 'Tareas', href: '/tasks', icon: ListTodo },
    { name: 'Enfoque', href: '/focus', icon: Target },
    { name: 'Estadísticas', href: '/analytics', icon: BarChart },
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
          aria-label="Agregar nueva tarea"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <div className="nav-group">
        {rightNav.map((item) => {
          const Icon = item.icon;
          const isFocus = item.name === 'Focus';
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-link ${isActive(item.href) ? '!active' : ''}`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {isFocus && isTimerRunning && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse border-2 border-background-default" />
                )}
              </div>
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;