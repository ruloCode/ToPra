import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        'toast-progress': 'toast-progress linear forwards',
      },
      keyframes: {
        'toast-progress': {
          from: { transform: 'scaleX(1)' },
          to: { transform: 'scaleX(0)' },
        },
      },
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
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        // Semantic Colors
        success: {
          DEFAULT: 'var(--success)',
          light: 'var(--success-light)',
          foreground: 'var(--success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          light: 'var(--warning-light)',
          foreground: 'var(--warning-foreground)',
        },
        error: {
          DEFAULT: 'var(--error)',
          light: 'var(--error-light)',
          foreground: 'var(--error-foreground)',
        },
        info: {
          DEFAULT: 'var(--info)',
          light: 'var(--info-light)',
          foreground: 'var(--info-foreground)',
        },
        // Priority Colors
        priority: {
          low: 'var(--priority-low)',
          medium: 'var(--priority-medium)',
          high: 'var(--priority-high)',
          urgent: 'var(--priority-urgent)',
        },
        // UI Components
        border: 'var(--border)',
        foreground: 'var(--text-primary)',
        popover: {
          DEFAULT: 'var(--background-default)',
          foreground: 'var(--text-primary)',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'var(--text-primary)',
            a: {
              color: 'var(--accent)',
              '&:hover': {
                color: 'var(--accent-foreground)',
              },
            },
            strong: {
              color: 'var(--text-primary)',
            },
            h1: {
              color: 'var(--text-primary)',
            },
            h2: {
              color: 'var(--text-primary)',
            },
            h3: {
              color: 'var(--text-primary)',
            },
            h4: {
              color: 'var(--text-primary)',
            },
            code: {
              color: 'var(--text-primary)',
              backgroundColor: 'var(--muted)',
              borderRadius: '0.25rem',
              padding: '0.15rem 0.3rem',
            },
            blockquote: {
              borderLeftColor: 'var(--muted)',
              color: 'var(--text-secondary)',
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
}

export default config;
