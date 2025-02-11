"use client";
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Aplicar tema
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = 
      theme === 'dark' || 
      (theme === 'system' && prefersDark);

    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}