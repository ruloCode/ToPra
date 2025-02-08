import { supabase } from './supabase';
import { FocusSession, FocusSessionStatus } from './focus';

export type TimeRange = 'day' | 'week' | 'month' | 'year' | 'all';

export interface ProductivityMetrics {
  focusTime: {
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  tasks: {
    completed: number;
    total: number;
    completionRate: number;
  };
  streaks: {
    current: number;
    longest: number;
    dailyGoalMet: boolean;
  };
  sessions: {
    total: number;
    completed: number;
    interrupted: number;
    averageLength: number;
    averageRating: number;
  };
  productivityScore: number;
}

export interface HistoricalData {
  date: string;
  focusMinutes: number;
  tasksCompleted: number;
  sessionsCompleted: number;
  productivityScore: number;
}

// Calculate productivity score based on multiple factors
function calculateProductivityScore(
  focusMinutes: number,
  tasksCompleted: number,
  sessionCompletionRate: number,
  streakDays: number
): number {
  const focusScore = Math.min(focusMinutes / 240, 1) * 40; // Max 4 hours = 40 points
  const taskScore = Math.min(tasksCompleted / 5, 1) * 30; // Max 5 tasks = 30 points
  const sessionScore = sessionCompletionRate * 20; // Max 20 points
  const streakScore = Math.min(streakDays / 7, 1) * 10; // Max 7 days = 10 points
  
  return Math.round(focusScore + taskScore + sessionScore + streakScore);
}

// Get all productivity metrics for a user
export async function getProductivityMetrics(
  userId: string,
  range: TimeRange = 'week'
): Promise<ProductivityMetrics> {
  const now = new Date();
  let startDate: Date;

  // Calculate start date based on range
  switch (range) {
    case 'day':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(0); // Beginning of time
  }

  // Get focus sessions
  const { data: sessions } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', startDate.toISOString());

  // Get tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString());

  const completedSessions = sessions?.filter(s => s.status === FocusSessionStatus.COMPLETED) || [];
  const totalFocusTime = completedSessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const averageSessionLength = completedSessions.length > 0 ? totalFocusTime / completedSessions.length : 0;
  const sessionCompletionRate = sessions?.length ? completedSessions.length / sessions.length : 0;
  
  const completedTasks = tasks?.filter(t => t.completed) || [];
  const streakData = await calculateStreak(userId);
  
  const productivityScore = calculateProductivityScore(
    totalFocusTime / 60, // Convert to minutes
    completedTasks.length,
    sessionCompletionRate,
    streakData.current
  );

  return {
    focusTime: {
      total: totalFocusTime,
      daily: totalFocusTime / 7, // Average daily focus time
      weekly: totalFocusTime,
      monthly: totalFocusTime * 4, // Estimated monthly based on current week
    },
    tasks: {
      completed: completedTasks.length,
      total: tasks?.length || 0,
      completionRate: tasks?.length ? completedTasks.length / tasks.length : 0,
    },
    streaks: streakData,
    sessions: {
      total: sessions?.length || 0,
      completed: completedSessions.length,
      interrupted: sessions?.filter(s => s.status === FocusSessionStatus.INTERRUPTED).length || 0,
      averageLength: averageSessionLength,
      averageRating: completedSessions.reduce((acc, s) => acc + (s.rating || 0), 0) / completedSessions.length || 0,
    },
    productivityScore,
  };
}

// Calculate user's current and longest streaks
async function calculateStreak(userId: string): Promise<{ current: number; longest: number; dailyGoalMet: boolean }> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

  const { data: sessions } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', FocusSessionStatus.COMPLETED)
    .gte('start_time', thirtyDaysAgo.toISOString())
    .order('start_time', { ascending: false });

  if (!sessions?.length) {
    return { current: 0, longest: 0, dailyGoalMet: false };
  }

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc: Record<string, FocusSession[]>, session: FocusSession) => {
    const date = new Date(session.start_time).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {});

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date().toDateString();
  const dailyGoalMet = (sessionsByDate[today]?.reduce((acc: number, s: FocusSession) => acc + (s.duration || 0), 0) || 0) >= 25 * 60; // 25 minutes minimum

  // Calculate current streak
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.setDate(now.getDate() - i)).toDateString();
    const daySessions = sessionsByDate[date];
    
    if (daySessions && daySessions.reduce((acc: number, s: FocusSession) => acc + (s.duration || 0), 0) >= 25 * 60) {
      currentStreak++;
    } else if (i === 0 && !dailyGoalMet) {
      // If today's goal isn't met, check if yesterday's was
      continue;
    } else {
      break;
    }
  }

  // Calculate longest streak
  (Object.values(sessionsByDate) as FocusSession[][]).forEach((daySessions: FocusSession[]) => {
    const totalDuration = daySessions.reduce((acc: number, s: FocusSession) => acc + (s.duration || 0), 0);
    if (totalDuration >= 25 * 60) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  return {
    current: currentStreak,
    longest: longestStreak,
    dailyGoalMet,
  };
}

// Get historical productivity data
export async function getHistoricalData(
  userId: string,
  range: TimeRange = 'month'
): Promise<HistoricalData[]> {
  const now = new Date();
  let startDate: Date;

  switch (range) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 30)); // Default to month
  }

  // Get focus sessions and tasks for the period
  const [sessionsResult, tasksResult] = await Promise.all([
    supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startDate.toISOString()),
    supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString()),
  ]);

  const sessions = sessionsResult.data || [];
  const tasks = tasksResult.data || [];

  // Group data by date
  const groupedData: Record<string, HistoricalData> = {};
  
  // Initialize dates
  const currentDate = new Date(startDate);
  while (currentDate <= now) {
    const dateStr = currentDate.toISOString().split('T')[0];
    groupedData[dateStr] = {
      date: dateStr,
      focusMinutes: 0,
      tasksCompleted: 0,
      sessionsCompleted: 0,
      productivityScore: 0,
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Aggregate session data
  sessions.forEach(session => {
    const dateStr = new Date(session.start_time).toISOString().split('T')[0];
    if (groupedData[dateStr]) {
      if (session.status === FocusSessionStatus.COMPLETED) {
        groupedData[dateStr].focusMinutes += (session.duration || 0) / 60;
        groupedData[dateStr].sessionsCompleted += 1;
      }
    }
  });

  // Aggregate task data
  tasks.forEach(task => {
    if (task.completed) {
      const dateStr = new Date(task.completed_at || task.updated_at).toISOString().split('T')[0];
      if (groupedData[dateStr]) {
        groupedData[dateStr].tasksCompleted += 1;
      }
    }
  });

  // Calculate productivity scores
  Object.values(groupedData).forEach(day => {
    day.productivityScore = calculateProductivityScore(
      day.focusMinutes,
      day.tasksCompleted,
      day.sessionsCompleted > 0 ? 1 : 0,
      1 // Streak is always 1 for daily calculations
    );
  });

  return Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));
} 