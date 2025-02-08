"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ListTodo,
  Target,
  Settings,
  Plus,
} from 'lucide-react';

export const BottomNav = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navigation = [
    { name: 'Today', href: '/', icon: Home },
    { name: 'Tasks', href: '/tasks', icon: ListTodo },
    { name: 'Focus', href: '/focus', icon: Target },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  // Dividir la navegación en dos grupos para el botón central
  const leftNav = navigation.slice(0, 2);
  const rightNav = navigation.slice(2);

  return (
    <nav className="bottom-nav">
      <div className="nav-group">
        {leftNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="nav-group-center">
        <button className="fab">
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
              className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
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