import { supabase } from './supabase';
import { FocusSessionStatus } from './focus';

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
  labelDistribution: { [key: string]: number };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
  progress: number;
  target: number;
}

// Calculate productivity score based on task priority and focus sessions
function calculateProductivityScore(
  completedTasks: Array<{ priority?: string | null }>,
  focusSessions: Array<{ duration: number; status: string }>
): number {
  // Calculate points from completed tasks based on priority
  const taskPoints = completedTasks.reduce((total, task) => {
    const priority = typeof task.priority === 'string' ? task.priority.toLowerCase() : 'low';
    switch (priority) {
      case 'high':
        return total + 3;
      case 'medium':
        return total + 2;
      case 'low':
      default:
        return total + 1;
    }
  }, 0);

  // Calculate points from completed focus sessions
  const focusPoints = focusSessions
    .filter(session => session.status === 'COMPLETED') // Only count completed sessions
    .reduce((total, session) => {
      const minutes = (session.duration || 0) / 60; // Convert seconds to minutes
      return total + (minutes * 0.25);
    }, 0);

  return Math.round(taskPoints + focusPoints);
}

// Get all productivity metrics for a user
export async function getProductivityMetrics(
  userId: string,
  range: TimeRange = 'week'
): Promise<ProductivityMetrics> {
  // Get current date at start of day in local timezone
  const now = new Date();
  now.setHours(23, 59, 59, 999); // End of current day
  const startDate = new Date();
  
  // Calculate start date based on range, keeping timezone
  switch (range) {
    case 'day':
      startDate.setHours(0, 0, 0, 0); // Start of current day
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
  }

  try {
    // Get focus sessions within date range with precise timestamps
    const { data: sessions, error: sessionsError } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startDate.toISOString())
      .lte('start_time', now.toISOString());

    if (sessionsError) throw new Error(`Error fetching sessions: ${sessionsError.message}`);

    // Get completed tasks within date range with precise timestamps
    const { data: completedTasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .or('status.eq.completed,status.eq.COMPLETED')
      .gte('completed_at', startDate.toISOString())
      .lte('completed_at', now.toISOString());

    // Get all tasks for completion rate calculation
    const { data: allTasks, error: allTasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .lte('created_at', now.toISOString());

    if (tasksError || allTasksError) throw new Error(`Error fetching tasks: ${tasksError?.message || allTasksError?.message}`);

    // Calculate time differences in milliseconds
    const rangeDuration = now.getTime() - startDate.getTime();
    const daysInRange = Math.ceil(rangeDuration / (1000 * 60 * 60 * 24));

    // Calculate metrics based on filtered data and actual time range
    const completedSessions = sessions?.filter(s => s.status === FocusSessionStatus.COMPLETED) || [];
    const totalFocusTime = completedSessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    const averageSessionLength = completedSessions.length > 0 ? totalFocusTime / completedSessions.length : 0;

    const metrics = {
      focusTime: {
        total: totalFocusTime,
        daily: totalFocusTime / daysInRange,
        weekly: range === 'week' ? totalFocusTime : (totalFocusTime / daysInRange) * 7,
        monthly: range === 'month' ? totalFocusTime : (totalFocusTime / daysInRange) * 30,
      },
      tasks: {
        completed: completedTasks?.length || 0,
        total: allTasks?.length || 0,
        completionRate: allTasks?.length ? (completedTasks?.length || 0) / allTasks.length : 0,
      },
      streaks: await calculateStreak(userId),
      sessions: {
        total: sessions?.length || 0,
        completed: completedSessions.length,
        interrupted: sessions?.filter(s => s.status === FocusSessionStatus.INTERRUPTED).length || 0,
        averageLength: averageSessionLength,
        averageRating: completedSessions.reduce((acc, s) => acc + (s.rating || 0), 0) / completedSessions.length || 0,
      },
      productivityScore: calculateProductivityScore(
        completedTasks || [],
        sessions || []
      ),
    };

    // After calculating metrics, check and update achievements
    const achievements = [
      {
        id: 'focus-master',
        target: 750, // 50 hours of focus time = 3000 minutes * 0.25 points = 750 points
        progress: completedSessions.reduce((acc, s) => acc + ((s.duration || 0) / 60 * 0.25), 0),
        shouldUnlock: completedSessions.reduce((acc, s) => acc + ((s.duration || 0) / 60 * 0.25), 0) >= 750
      },
      {
        id: 'task-champion',
        target: 50, // Equivalent to ~17 high priority tasks or combination of priorities
        progress: completedTasks.reduce((acc, task) => {
          const priority = typeof task.priority === 'string' ? task.priority.toLowerCase() : 'low';
          const priorityPoints = priority === 'high' ? 3 :
                               priority === 'medium' ? 2 : 1;
          return acc + priorityPoints;
        }, 0),
        shouldUnlock: completedTasks.reduce((acc, task) => {
          const priority = typeof task.priority === 'string' ? task.priority.toLowerCase() : 'low';
          const priorityPoints = priority === 'high' ? 3 :
                               priority === 'medium' ? 2 : 1;
          return acc + priorityPoints;
        }, 0) >= 50
      },
      {
        id: 'consistency-king',
        target: 80,
        progress: Math.round(metrics.tasks.completionRate * 100),
        shouldUnlock: metrics.tasks.completionRate >= 0.8
      },
      {
        id: 'productivity-expert',
        target: 1000, // Challenging combination of focus time and completed tasks
        progress: metrics.productivityScore,
        shouldUnlock: metrics.productivityScore >= 1000
      }
    ];

    

    return metrics;
  } catch (error) {
    throw new Error(`Failed to get productivity metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Calculate user's current and longest streaks
async function calculateStreak(userId: string): Promise<{ current: number; longest: number; dailyGoalMet: boolean }> {
  const now = new Date();
  const { data: tasks } = await supabase
    .from('tasks')
    .select('completed_at, status')
    .eq('user_id', userId)
    .or('status.eq.completed,status.eq.COMPLETED')
    .order('completed_at', { ascending: false });

  if (!tasks) return { current: 0, longest: 0, dailyGoalMet: false };

  // Group completed tasks by date
  const tasksByDate = tasks.reduce((acc: { [key: string]: number }, task) => {
    if (task.completed_at) {
      const date = new Date(task.completed_at).toDateString();
      acc[date] = (acc[date] || 0) + 1;
    }
    return acc;
  }, {});

  // Calculate current streak
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date().toDateString();
  const dailyGoalMet = Boolean(tasksByDate[today]); // True if at least one task was completed today

  // Calculate current streak
  for (let i = 0; i < 30; i++) { // Check last 30 days
    const date = new Date(new Date().setDate(now.getDate() - i)).toDateString();
    if (tasksByDate[date]) {
      currentStreak++;
    } else if (i === 0 && !dailyGoalMet) {
      // If no tasks completed today, check if yesterday had any
      continue;
    } else {
      break;
    }
  }

  // Calculate longest streak
  Object.values(tasksByDate).forEach((tasksCompleted) => {
    if (tasksCompleted > 0) {
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
  // Get current date at end of day in local timezone
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  
  // Calculate start date based on range, keeping timezone
  const startDate = new Date();
  switch (range) {
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
  }

  // Get focus sessions in date range with precise timestamps
  const { data: sessions } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', startDate.toISOString())
    .lte('start_time', now.toISOString());

  // Get completed tasks in date range with precise timestamps
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .gte('completed_at', startDate.toISOString())
    .lte('completed_at', now.toISOString())
    .or('status.eq.completed,status.eq.COMPLETED');

  // Group data by date
  const dailyData = new Map<string, HistoricalData>();
  const dateArray = getDatesInRange(startDate, now);

  // Initialize all dates in range
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

  // Aggregate focus session data (only completed sessions)
  sessions?.forEach(session => {
    if (session.status === 'COMPLETED') {
      const sessionDate = new Date(session.start_time);
      const dateStr = sessionDate.toISOString().split('T')[0];
      const data = dailyData.get(dateStr);
      if (data) {
        const minutes = (session.duration || 0) / 60;
        data.focusMinutes += minutes;
        data.sessionsCompleted += 1;
        data.productivityScore += minutes * 0.25;
      }
    }
  });

  // Aggregate task data with priority points
  tasks?.forEach(task => {
    if (task.completed_at) {
      try {
        const completionDate = new Date(task.completed_at);
        const dateStr = completionDate.toISOString().split('T')[0];
        const data = dailyData.get(dateStr);
        if (data) {
          data.tasksCompleted += 1;
          const priority = typeof task.priority === 'string' ? task.priority.toLowerCase() : 'low';
          const priorityPoints = priority === 'high' ? 3 :
                               priority === 'medium' ? 2 : 1;
          data.productivityScore += priorityPoints;
        }
      } catch (error) {
        console.error('Error processing task completion date:', error);
      }
    }
  });

  return Array.from(dailyData.values());
}

function getDatesInRange(start: Date, end: Date): Date[] {
  const dates = [];
  const currentDate = new Date(start);
  
  // Ensure we're working with dates at the start of their respective days
  currentDate.setHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setHours(23, 59, 59, 999);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
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

  // Calculate label distribution
  const labelDistribution = tasks.reduce((acc, task) => {
    const tags = Array.isArray(task.tags) ? task.tags : [];
    tags.forEach((tag: string) => {
      if (tag && typeof tag === 'string') {
        acc[tag] = (acc[tag] || 0) + 1;
      }
    });
    return acc;
  }, {} as { [key: string]: number });

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

  return {
    totalTasks,
    completedTasks,
    completionRate: totalTasks ? completedTasks / totalTasks : 0,
    overdueTasks,
    upcomingTasks,
    averageCompletionTime: avgCompletionTime,
    labelDistribution
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