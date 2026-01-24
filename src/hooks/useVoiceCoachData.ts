'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { useFocusSession } from '@/contexts/FocusSessionContext';
import { useTimerStore } from '@/lib/stores/timerStore';
import { useAuth } from '@/components/AuthProvider';
import { Task } from '@/lib/tasks';
import { Subtask } from '@/types/subtasks';
import { getSubtasksByTaskId } from '@/lib/subtasks';
import {
  getDailyProgress,
  getWeeklyStats,
  getTodaySessions,
  getProductivityStreak,
  SessionSummary,
  DailyProgress,
  WeeklyStats,
  ProductivityStreak,
} from '@/lib/voiceCoachStats';

export interface VoiceCoachData {
  timer: {
    isRunning: boolean;
    mode: 'timer' | 'chronometer';
    remainingTime: string;
    elapsedSeconds: number;
    selectedDuration: number;
    activeTaskName: string | null;
    activeTaskId: string | null;
  };
  tasks: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    todayDue: TaskSummary[];
    overdue: TaskSummary[];
    highPriority: TaskSummary[];
    recentlyCompleted: TaskSummary[];
    allPending: TaskSummary[]; // Up to 20 pending tasks with IDs for reference
  };
  subtasks: {
    activeTaskSubtasks: SubtaskSummary[];
  };
  sessions: {
    hasActiveSession: boolean;
    activeSessionTaskId: string | null;
    activeSessionId: string | null;
    todaySessions: SessionSummary[];
  };
  stats: {
    todayFocusMinutes: number;
    dailyProgressPercent: number;
    tasksCompletedToday: number;
    weeklyFocusMinutes: number;
    weekOverWeekChange: number;
    currentStreak: number;
  };
  user: {
    dailyGoalMinutes: number;
  };
}

export interface SubtaskSummary {
  id: string;
  title: string;
  status: string;
  priority: number;
}

// Simplified task structure for context (to reduce token usage)
export interface TaskSummary {
  id: string;
  shortId: string; // First 8 chars for voice reference
  title: string;
  priority: number;
  status: string;
  dueDate: string | null;
  tags: string[];
  description?: string | null;
}

function taskToSummary(task: Task): TaskSummary {
  return {
    id: task.id,
    shortId: task.id.substring(0, 8),
    title: task.title,
    priority: task.priority,
    status: task.status,
    dueDate: task.due_date,
    tags: task.tags || [],
    description: task.description,
  };
}

function subtaskToSummary(subtask: Subtask): SubtaskSummary {
  return {
    id: subtask.id,
    title: subtask.title,
    status: subtask.status,
    priority: subtask.priority,
  };
}

function isOverdue(task: Task): boolean {
  if (!task.due_date || task.status === 'completed') return false;
  const dueDate = new Date(task.due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
}

function isDueToday(task: Task): boolean {
  if (!task.due_date || task.status === 'completed') return false;
  const dueDate = new Date(task.due_date);
  const today = new Date();
  return (
    dueDate.getFullYear() === today.getFullYear() &&
    dueDate.getMonth() === today.getMonth() &&
    dueDate.getDate() === today.getDate()
  );
}

function isHighPriority(task: Task): boolean {
  // Priority 3 or 4 (high/urgent)
  return task.priority >= 3 && task.status !== 'completed';
}

export function useVoiceCoachData(): VoiceCoachData {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const { activeSession } = useFocusSession();
  const timerStore = useTimerStore();

  // State for async data
  const [activeTaskSubtasks, setActiveTaskSubtasks] = useState<SubtaskSummary[]>([]);
  const [todaySessions, setTodaySessions] = useState<SessionSummary[]>([]);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [streak, setStreak] = useState<ProductivityStreak | null>(null);

  // Fetch subtasks for active task
  const fetchSubtasks = useCallback(async (taskId: string) => {
    try {
      const subtasks = await getSubtasksByTaskId(taskId);
      setActiveTaskSubtasks(subtasks.map(subtaskToSummary));
    } catch (error) {
      console.error('Error fetching subtasks for voice coach:', error);
      setActiveTaskSubtasks([]);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async (userId: string, dailyGoalMinutes: number) => {
    try {
      const [daily, weekly, sessions, streakData] = await Promise.all([
        getDailyProgress(userId, dailyGoalMinutes),
        getWeeklyStats(userId),
        getTodaySessions(userId),
        getProductivityStreak(userId),
      ]);

      setDailyProgress(daily);
      setWeeklyStats(weekly);
      setTodaySessions(sessions);
      setStreak(streakData);
    } catch (error) {
      console.error('Error fetching stats for voice coach:', error);
    }
  }, []);

  // Fetch subtasks when active task changes
  useEffect(() => {
    const activeTaskId = timerStore.activeTaskId || activeSession?.task_id;
    if (activeTaskId) {
      fetchSubtasks(activeTaskId);
    } else {
      setActiveTaskSubtasks([]);
    }
  }, [timerStore.activeTaskId, activeSession?.task_id, fetchSubtasks]);

  // Fetch stats on mount and periodically
  useEffect(() => {
    if (user?.id) {
      fetchStats(user.id, timerStore.dailyGoalMinutes);

      // Refresh stats every 2 minutes
      const interval = setInterval(() => {
        fetchStats(user.id, timerStore.dailyGoalMinutes);
      }, 120000);

      return () => clearInterval(interval);
    }
  }, [user?.id, timerStore.dailyGoalMinutes, fetchStats]);

  const voiceCoachData = useMemo<VoiceCoachData>(() => {
    // Filter and categorize tasks
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    const overdueTasks = tasks
      .filter(isOverdue)
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
      .slice(0, 5);

    const todayDueTasks = tasks
      .filter(isDueToday)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5);

    const highPriorityTasks = tasks
      .filter(isHighPriority)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5);

    // Get recently completed (last 3)
    const recentlyCompletedTasks = completedTasks
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 3);

    // Get all pending tasks (up to 20) for voice reference
    const allPendingTasks = [...pendingTasks, ...inProgressTasks]
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 20);

    return {
      timer: {
        isRunning: timerStore.isRunning,
        mode: timerStore.mode,
        remainingTime: timerStore.getFormattedTime(),
        elapsedSeconds: timerStore.getElapsedSeconds(),
        selectedDuration: timerStore.selectedDuration,
        activeTaskName: timerStore.activeTaskName,
        activeTaskId: timerStore.activeTaskId,
      },
      tasks: {
        total: tasks.length,
        pending: pendingTasks.length,
        inProgress: inProgressTasks.length,
        completed: completedTasks.length,
        todayDue: todayDueTasks.map(taskToSummary),
        overdue: overdueTasks.map(taskToSummary),
        highPriority: highPriorityTasks.map(taskToSummary),
        recentlyCompleted: recentlyCompletedTasks.map(taskToSummary),
        allPending: allPendingTasks.map(taskToSummary),
      },
      subtasks: {
        activeTaskSubtasks,
      },
      sessions: {
        hasActiveSession: !!activeSession,
        activeSessionTaskId: activeSession?.task_id || null,
        activeSessionId: activeSession?.id || null,
        todaySessions,
      },
      stats: {
        todayFocusMinutes: dailyProgress?.todayFocusMinutes || 0,
        dailyProgressPercent: dailyProgress?.dailyProgressPercent || 0,
        tasksCompletedToday: dailyProgress?.tasksCompletedToday || 0,
        weeklyFocusMinutes: weeklyStats?.weeklyFocusMinutes || 0,
        weekOverWeekChange: weeklyStats?.weekOverWeekChange || 0,
        currentStreak: streak?.currentStreak || 0,
      },
      user: {
        dailyGoalMinutes: timerStore.dailyGoalMinutes,
      },
    };
  }, [
    tasks,
    activeSession,
    timerStore,
    activeTaskSubtasks,
    todaySessions,
    dailyProgress,
    weeklyStats,
    streak,
  ]);

  return voiceCoachData;
}
