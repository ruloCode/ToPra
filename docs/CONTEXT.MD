# Productivity Focus App Specification

This document provides a detailed explanation of the app's flow and features for a productivity app designed to help users focus on one task at a time. It outlines the user journey from the welcome screen through task management, focus mode, and session completion, ensuring clarity for developers during implementation.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [App Flow](#app-flow)
4. [Detailed Features](#detailed-features)
   - [Welcome Screen](#welcome-screen)
   - [User Authentication](#user-authentication)
   - [Dashboard](#dashboard)
   - [Task Management](#task-management)
   - [Focus Mode](#focus-mode)
   - [Session Completion & Progress](#session-completion--progress)
5. [User Interface & Experience](#user-interface--experience)
6. [Backend & Integration Considerations](#backend--integration-considerations)
7. [Database Schema](#database-schema)
8. [Folder Structure](#folder-structure)
9. [Conclusion](#conclusion)

---

## Overview

The **Productivity Focus App** is designed to help users maintain concentration by focusing on one task at a time. The app incorporates AI-driven task management and prioritization alongside a dedicated focus mode to maximize productivity.

**Key Features:**
- **Clean, Minimalistic UI:** A clutter-free welcome screen and intuitive navigation.
- **AI-Enhanced Task Management:** Tasks are automatically prioritized using DeepSeek, and new tasks can be added via quick-add or an interactive AI chat.
- **Focus Mode:** A dedicated session with a timer to help users work without distractions.
- **Progress Tracking:** Detailed session summaries allow users to monitor progress and adjust their workflow.

---

## Tech Stack

- **Frontend:**  
  - Framework: **Next.js 15**
  - Language: **TypeScript**
- **Backend/Database:**  
  - **Supabase** for user authentication, PostgreSQL database management, and real-time updates.
- **AI Processing:**  
  - **DeepSeek** for natural language processing, task extraction, and prioritization.
- **Additional Tools (Optional):**
  - State Management (if required): Consider Zustand or another lightweight solution.
  - Styling: Tailwind CSS can be used for rapid UI development and maintaining a consistent design language.

---

## App Flow

1. **Launch & Welcome Screen**
   - The user opens the app and is greeted by a clean, minimalistic welcome screen.

2. **Sign-Up / Email Authentication**
   - The user signs up using their email and password.
   - On successful sign-up, the user is redirected to the main dashboard.
   - Authentication is managed through Supabase's authentication services.

3. **Dashboard**
   - The main dashboard displays the user's tasks sorted by AI-determined priority.
   - Users can view, add, or update tasks directly from this screen.

4. **Task Management**
   - **Quick-Add Feature:** Allows rapid entry of new tasks.
   - **Chat with AI:** An interactive chat interface that lets users add tasks using natural language input. DeepSeek processes the input to extract task details and priorities.

5. **Focus Mode**
   - Users can enter Focus Mode by tapping a clearly visible button on the dashboard.
   - A countdown timer starts, creating a distraction-free session.
   - Visual indicators (e.g., progress bars) show the remaining time.

6. **Session Completion & Progress**
   - Once the timer ends, a summary screen displays:
     - Total time spent in focus.
     - Number of tasks completed.
     - Additional productivity metrics (e.g., streaks or session ratings).
   - Users can then choose to start a new session or take a break.

---

## Detailed Features

### Welcome Screen
- **Design:**
  - Minimalistic layout with a prominent app logo and name.
- **Primary Action:**
  - "Get Started" or "Sign Up" button to initiate the registration process.

### User Authentication
- **Sign-Up Process:**
  - Users register with their email and password.
  - Include basic validation (email format, password strength).
- **Post-Registration:**
  - Successful registration logs the user in and redirects them to the dashboard.
- **Security:**
  - Ensure secure communication (HTTPS) and proper data storage using Supabase best practices.

### Dashboard
- **Task List:**
  - Displays tasks sorted by AI-assigned priority.
  - Each task includes title, description, due date, and priority level.
- **Navigation:**
  - Options to access Focus Mode, Profile, and Settings.
- **Interactivity:**
  - Clicking on a task opens details for editing or marking it as complete.

### Task Management
- **Quick-Add Feature:**
  - A dedicated input field for fast task creation with minimal required information.
- **Chat with AI:**
  - Interactive chat interface that accepts natural language input.
  - DeepSeek processes user input to identify and create or update tasks.
  - Optionally, include confirmation dialogs or suggestions before finalizing tasks.

### Focus Mode
- **Activation:**
  - Accessible via a button on the dashboard.
  - Option to set a custom timer duration or use preset intervals (e.g., 25-minute Pomodoro sessions).
- **Timer:**
  - Countdown timer with visual progress indicators.
- **Distraction Minimization:**
  - Option to disable notifications or other non-essential features during the focus session.

### Session Completion & Progress
- **Completion Screen:**
  - Displays summary details upon session completion, including time spent and tasks completed.
  - Additional productivity metrics (e.g., streaks, session ratings).
- **User Options:**
  - Option to start a new focus session or take a break.
- **Feedback Integration:**
  - Allow users to provide session feedback to further refine AI prioritization and task management.

---

## User Interface & Experience

- **Consistency:**
  - A unified color scheme, typography, and iconography throughout the app.
- **Responsiveness:**
  - Optimized for various devices including smartphones, tablets, and desktops.
- **Simplicity:**
  - Clean, uncluttered design to minimize cognitive load and enhance focus.
- **Accessibility:**
  - Ensure adherence to accessibility guidelines (e.g., color contrast, scalable text, screen reader support).

---

## Backend & Integration Considerations

- **API Development:**
  - Utilize Supabase for developing secure APIs for authentication, task management, and session tracking.
  - Consider RESTful or GraphQL approaches for flexible data handling.
- **Database Management:**
  - Leverage Supabase's PostgreSQL database for storing user data, tasks, and session records.
- **Real-Time Updates:**
  - Use Supabase's real-time capabilities (e.g., WebSockets) for live updates on task status and session timers.
- **AI Integration:**
  - Integrate DeepSeek for processing natural language inputs, extracting task details, and prioritizing tasks.
  - Ensure the AI service adapts based on user feedback and evolving task priorities.
- **Frontend Implementation:**
  - Build the frontend with Next.js 15 using TypeScript to ensure type safety and efficient development.
  - Use additional tools (e.g., Zustand, Tailwind CSS) as needed to manage state and style the application.

---

## Database Schema

### Tables

1. **users**
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     email VARCHAR(255) UNIQUE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     last_login TIMESTAMP WITH TIME ZONE,
     settings JSONB DEFAULT '{}'::jsonb
   );
   ```

2. **tasks**
   ```sql
   CREATE TABLE tasks (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     priority INTEGER NOT NULL DEFAULT 0,
     due_date TIMESTAMP WITH TIME ZONE,
     status VARCHAR(50) DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     ai_metadata JSONB DEFAULT '{}'::jsonb,
     tags TEXT[]
   );
   ```

3. **focus_sessions**
   ```sql
   CREATE TABLE focus_sessions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
     start_time TIMESTAMP WITH TIME ZONE NOT NULL,
     end_time TIMESTAMP WITH TIME ZONE,
     duration INTEGER, -- in seconds
     status VARCHAR(50) DEFAULT 'in_progress',
     notes TEXT,
     rating INTEGER CHECK (rating >= 1 AND rating <= 5)
   );
   ```

4. **task_history**
   ```sql
   CREATE TABLE task_history (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     action VARCHAR(50) NOT NULL,
     previous_state JSONB,
     new_state JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Indexes
```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);

-- Tasks table indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Focus sessions indexes
CREATE INDEX idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX idx_focus_sessions_task_id ON focus_sessions(task_id);
CREATE INDEX idx_focus_sessions_start_time ON focus_sessions(start_time);

-- Task history indexes
CREATE INDEX idx_task_history_task_id ON task_history(task_id);
CREATE INDEX idx_task_history_user_id ON task_history(user_id);
```

### Triggers
```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## Folder Structure

```
frontend/
├── .env                    # Environment variables
├── .env.example           # Example environment variables
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── public/               # Static assets
│   ├── images/
│   └── icons/
├── src/
│   ├── app/              # Next.js 15 app directory
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   ├── error.tsx     # Error handling
│   │   ├── loading.tsx   # Loading states
│   │   └── (routes)/     # Route groups
│   │       ├── dashboard/
│   │       ├── focus/
│   │       └── settings/
│   ├── components/       # Reusable components
│   │   ├── auth/        # Authentication components
│   │   ├── tasks/       # Task-related components
│   │   ├── focus/       # Focus mode components
│   │   ├── ui/          # UI components
│   │   └── layout/      # Layout components
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   └── useFocus.ts
│   ├── lib/             # Utility libraries
│   │   ├── supabase.ts  # Supabase client
│   │   ├── deepseek.ts  # DeepSeek AI integration
│   │   └── utils.ts     # Helper functions
│   ├── styles/          # Global styles
│   │   └── globals.css
│   ├── types/           # TypeScript type definitions
│   │   ├── database.ts
│   │   ├── api.ts
│   │   └── common.ts
│   └── config/          # Configuration files
│       ├── constants.ts
│       └── theme.ts
├── tests/               # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── docs/               # Documentation
    ├── CONTEXT.MD
    └── API.md
```

---

## Conclusion

This specification outlines the key components and user journey for the Productivity Focus App. By following this detailed flow—from the welcome screen, through user authentication and task management, to focus mode and progress tracking—developers can implement a cohesive solution that empowers users to maintain focus and enhance their productivity. The app leverages Next.js 15 with TypeScript on the frontend, Supabase for backend and database management, and DeepSeek for AI processing.

---

*End of Specification*
