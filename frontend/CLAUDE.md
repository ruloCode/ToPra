# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ToPra (To-Pra) is a productivity focus app built with Next.js 15 that helps users manage tasks and focus on one task at a time. It combines task management with a Pomodoro-style focus timer.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database/Auth**: Supabase (PostgreSQL + Auth)
- **State Management**: Zustand (for timer state)
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: Radix UI primitives

### Key Directories

```
src/
├── app/                    # Next.js App Router pages
│   ├── tasks/[id]/        # Dynamic task detail page
│   ├── focus/             # Focus mode/timer page
│   ├── analytics/         # Productivity analytics
│   └── settings/          # User settings
├── components/
│   ├── tasks/             # Task CRUD components
│   ├── focus/             # Timer and focus session components
│   ├── analytics/         # Charts and statistics
│   └── ui/                # Reusable UI primitives (shadcn/ui style)
├── contexts/              # React contexts (Auth, Task, Theme, Modal)
├── lib/
│   ├── supabase.ts        # Supabase client + Database types
│   ├── tasks.ts           # Task CRUD operations
│   ├── focus.ts           # Focus session operations
│   └── stores/timerStore.ts  # Zustand timer state (persisted to localStorage)
└── types/                 # TypeScript definitions
```

### Data Flow

1. **Authentication**: `AuthProvider` wraps the app, uses Supabase Auth, exposes `useAuth()` hook
2. **Tasks**: `TaskContext` provides task state, `lib/tasks.ts` contains Supabase CRUD operations
3. **Focus Sessions**: Timer state in Zustand store (`timerStore.ts`), session data persisted to Supabase via `lib/focus.ts`
4. **Theme**: CSS variables defined in `globals.css`, toggled via `ThemeContext`

### Database Tables

- `users` - User accounts with settings (JSONB)
- `tasks` - Tasks with priority, status, due_date, tags, ai_metadata
- `focus_sessions` - Timer sessions linked to tasks (status: active/completed/interrupted)

### Theming

Dark mode uses CSS class strategy (`darkMode: 'class'` in Tailwind). Colors are CSS variables (e.g., `--primary-main`, `--background-default`) defined in `globals.css` and consumed via Tailwind classes.

### Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
