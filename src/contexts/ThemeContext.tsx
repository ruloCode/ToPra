'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type ThemeContextType = {
  isDark: boolean
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Leer tema guardado o usar preferencia del sistema
    const savedTheme = localStorage.getItem('theme')
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialIsDark = savedTheme ? savedTheme === 'dark' : systemIsDark
    
    setIsDark(initialIsDark)
    document.documentElement.classList.toggle('dark', initialIsDark)

    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const theme = localStorage.getItem('theme')
      if (theme === 'system') {
        setIsDark(e.matches)
        document.documentElement.classList.toggle('dark', e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    const newState = !isDark
    setIsDark(newState)
    document.documentElement.classList.toggle('dark', newState)
    localStorage.setItem('theme', newState ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}