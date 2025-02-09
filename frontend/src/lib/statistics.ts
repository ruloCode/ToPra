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

export interface TaskMetrics {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  overdueTasks: number;
  upcomingTasks: number;
  averageCompletionTime: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
  progress: number;
  target: number;
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

  try {
    // Get focus sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startDate.toISOString());

    if (sessionsError) throw new Error(`Error fetching sessions: ${sessionsError.message}`);

    // Get tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (tasksError) throw new Error(`Error fetching tasks: ${tasksError.message}`);

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

    const metrics = {
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

    // After calculating metrics, check and update achievements
    const achievements = [
      {
        id: 'focus-master',
        target: 10,
        progress: metrics.sessions.completed,
        shouldUnlock: metrics.sessions.completed >= 10
      },
      {
        id: 'productivity-streak',
        target: 5,
        progress: metrics.streaks.current,
        shouldUnlock: metrics.streaks.current >= 5
      },
      {
        id: 'task-champion',
        target: 20,
        progress: metrics.tasks.completed,
        shouldUnlock: metrics.tasks.completed >= 20
      },
      {
        id: 'consistency-king',
        target: 80,
        progress: Math.round(metrics.tasks.completionRate * 100),
        shouldUnlock: metrics.tasks.completionRate >= 0.8
      },
      {
        id: 'productivity-expert',
        target: 90,
        progress: metrics.productivityScore,
        shouldUnlock: metrics.productivityScore >= 90
      }
    ];

    // Update achievements in parallel
    await Promise.all(achievements.map(async (achievement) => {
      try {
        if (achievement.shouldUnlock) {
          await unlockAchievement(userId, achievement.id, achievement.progress);
        } else {
          await updateAchievementProgress(userId, achievement.id, achievement.progress);
        }
      } catch (error) {
        console.error(`Error updating achievement ${achievement.id}:`, error);
      }
    }));

    return metrics;
  } catch (error) {
    throw new Error(`Failed to get productivity metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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
  const startDate = getStartDateForRange(range);

  // Get focus sessions in date range
  const { data: sessions } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', startDate.toISOString())
    .lte('end_time', now.toISOString());

  // Get completed tasks in date range - corregido para incluir todos los estados posibles de completado
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .gte('completed_at', startDate.toISOString())
    .lte('completed_at', now.toISOString())
    .or('status.eq.completed,status.eq.COMPLETED'); // Incluir ambas variantes de estado completado

  console.log('Tasks found:', tasks?.length || 0); // Debugging

  // Group data by date
  const dailyData = new Map<string, HistoricalData>();
  const dateArray = getDatesInRange(startDate, now);

  // Initialize all dates
  dateArray.forEach(date => {
    const dateStr = date.toISOString().split('T')[0];
    dailyData.set(dateStr, {
      date: dateStr,
      focusMinutes: 0,
      tasksCompleted: 0,
      sessionsCompleted: 0,
      productivityScore: 0
    });
  });

  // Aggregate session data
  sessions?.forEach(session => {
    const dateStr = new Date(session.start_time).toISOString().split('T')[0];
    const data = dailyData.get(dateStr);
    if (data) {
      data.focusMinutes += (session.duration || 0) / 60;
      data.sessionsCompleted += session.status === 'completed' ? 1 : 0;
    }
  });

  // Aggregate task data - mejorado para manejar diferentes formatos de fecha
  tasks?.forEach(task => {
    if (task.completed_at) {
      try {
        const dateStr = new Date(task.completed_at).toISOString().split('T')[0];
        const data = dailyData.get(dateStr);
        if (data) {
          data.tasksCompleted += 1;
          console.log('Added completed task for date:', dateStr); // Debugging
          data.productivityScore = calculateProductivityScore(
            data.focusMinutes,
            data.tasksCompleted,
            data.sessionsCompleted > 0 ? 1 : 0,
            1
          );
        }
      } catch (error) {
        console.error('Error processing task completion date:', error);
      }
    }
  });

  return Array.from(dailyData.values());
}

function getStartDateForRange(range: TimeRange): Date {
  const now = new Date();
  switch (range) {
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    case 'year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(now.setDate(now.getDate() - 7));
  }
}

function getDatesInRange(start: Date, end: Date): Date[] {
  const dates = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export async function calculateTaskMetrics(userId: string): Promise<TaskMetrics> {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  const now = new Date();
  const completedTasks = tasks.filter(t => 
    (t.status === 'completed' || t.status === 'COMPLETED') && t.completed_at
  ).length;
  
  const totalTasks = tasks.length;
  const overdueTasks = tasks.filter(t => 
    t.status !== 'completed' && 
    t.status !== 'COMPLETED' && 
    t.due_date && 
    new Date(t.due_date) < now
  ).length;
  
  const upcomingTasks = tasks.filter(t => 
    t.status !== 'completed' && 
    t.status !== 'COMPLETED' && 
    t.due_date && 
    new Date(t.due_date) >= now
  ).length;

  // Calculate average completion time for completed tasks
  const completedTasksWithDates = tasks.filter(t => 
    (t.status === 'completed' || t.status === 'COMPLETED') && 
    t.completed_at && 
    t.created_at
  );
  
  const avgCompletionTime = completedTasksWithDates.reduce((acc, task) => {
    const completionTime = new Date(task.completed_at).getTime() - new Date(task.created_at).getTime();
    return acc + (completionTime / (1000 * 60)); // Convert to minutes
  }, 0) / (completedTasksWithDates.length || 1);

  console.log('Task Metrics:', { // Debugging
    totalTasks,
    completedTasks,
    completionRate: totalTasks ? completedTasks / totalTasks : 0,
    overdueTasks,
    upcomingTasks,
    avgCompletionTime
  });

  return {
    totalTasks,
    completedTasks,
    completionRate: totalTasks ? completedTasks / totalTasks : 0,
    overdueTasks,
    upcomingTasks,
    averageCompletionTime: avgCompletionTime
  };
}

export async function getUnlockedAchievements(userId: string): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

export async function unlockAchievement(userId: string, achievementId: string, progress: number) {
  const { error } = await supabase
    .from('achievements')
    .upsert({
      user_id: userId,
      achievement_id: achievementId,
      unlocked_at: new Date().toISOString(),
      progress
    });

  if (error) throw error;
}

export async function updateAchievementProgress(userId: string, achievementId: string, progress: number) {
  const { error } = await supabase
    .from('achievements')
    .update({ progress })
    .eq('user_id', userId)
    .eq('achievement_id', achievementId);

  if (error) throw error;
}