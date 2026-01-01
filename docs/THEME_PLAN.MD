# Theme Implementation Plan for Next.js 15 with Tailwind CSS

## 1. Project Structure

```
src/
├── styles/
│   ├── globals.css       # CSS variables and base styles
│   └── ThemeProvider.tsx
├── hooks/
│   └── useTheme.ts
└── tailwind.config.js    # Tailwind configuration
```

## 2. Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: 'var(--primary-main)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
          contrast: 'var(--primary-contrast)'
        },
        background: {
          default: 'var(--background-default)',
          paper: 'var(--background-paper)',
          elevated: 'var(--background-elevated)'
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          disabled: 'var(--text-disabled)'
        }
      }
    }
  }
}
```

## 3. Global CSS Variables

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Base colors */
  --primary-main: #6C5CE7;
  --primary-light: #A8A5FF;
  --primary-dark: #4834D4;
  --primary-contrast: #FFFFFF;

  /* Light theme */
  --background-default: #FFFFFF;
  --background-paper: #F7F7F7;
  --text-primary: #1A1A1A;
}

.dark {
  /* Dark theme */
  --background-default: #121212;
  --background-paper: #1E1E1E;
  --text-primary: #FFFFFF;
}
```

## 4. Theme Provider

```typescript
// ThemeProvider.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type ThemeContextType = {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {}
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialIsDark = savedTheme ? savedTheme === 'dark' : systemIsDark
    
    setIsDark(initialIsDark)
    document.documentElement.classList.toggle('dark', initialIsDark)
  }, [])

  const toggleTheme = () => {
    const newState = !isDark
    setIsDark(newState)
    localStorage.setItem('theme', newState ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newState)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

## 5. Theme Hook

```typescript
// useTheme.ts
import { useContext } from 'react'
import { ThemeContext } from '@/styles/ThemeProvider'

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
```

## 6. Usage Example

```tsx
'use client'

import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <div className="bg-background-default text-text-primary p-4">
      <button
        onClick={toggleTheme}
        className="bg-primary-main text-primary-contrast px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
      >
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  )
}
```

## 7. Implementation Advantages

- **Improved Performance**: Tailwind generates static CSS classes
- **Consistent Design System**: Use of CSS variables for coherence
- **Native Dark Mode**: Direct integration with Tailwind's dark mode system
- **Type Safety**: IDE autocompletion for compatible classes
- **Production Optimization**: Automatic purging of unused classes



### Add Smooth Theme Transitions

```css
/* globals.css */
* {
  transition: background-color 0.2s ease, color 0.1s ease;
}
```





## 9. Important Notes

- All Tailwind classes must use defined CSS variables
- Avoid hardcoded color values in components
- Always use utility classes to maintain consistency
- Use dark: prefix only when necessary
- Keep CSS variables and Tailwind configuration synchronized