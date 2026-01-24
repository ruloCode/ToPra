import { supabase } from './supabase';
import { FocusSession, FocusSessionStatus } from './focus';

export interface DailyProgress {
  todayFocusMinutes: number;
  dailyGoalMinutes: number;
  dailyProgressPercent: number;
  sessionsToday: number;
  tasksCompletedToday: number;
}

export interface WeeklyStats {
  weeklyFocusMinutes: number;
  weeklySessionsCount: number;
  averageSessionDuration: number;
  lastWeekFocusMinutes: number;
  weekOverWeekChange: number; // percentage change
}

export interface SessionSummary {
  id: string;
  taskTitle: string | null;
  duration: number;
  startTime: string;
  rating: number | null;
  status: string;
}

export interface ProductivityStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

/**
 * Get today's start and end timestamps
 */
function getTodayBounds(): { startOfDay: Date; endOfDay: Date } {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
}

/**
 * Get this week's start (Monday) and end (Sunday) timestamps
 */
function getWeekBounds(weeksAgo: number = 0): { startOfWeek: Date; endOfWeek: Date } {
  const now = new Date();
  const currentDay = now.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + mondayOffset - (weeksAgo * 7));
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
}

/**
 * Get daily focus progress for a user
 */
export async function getDailyProgress(
  userId: string,
  dailyGoalMinutes: number
): Promise<DailyProgress> {
  const { startOfDay, endOfDay } = getTodayBounds();

  // Get today's completed sessions
  const { data: sessions, error: sessionsError } = await supabase
    .from('focus_sessions')
    .select('duration')
    .eq('user_id', userId)
    .eq('status', FocusSessionStatus.COMPLETED)
    .gte('start_time', startOfDay.toISOString())
    .lte('start_time', endOfDay.toISOString());

  if (sessionsError) {
    console.error('Error fetching daily sessions:', sessionsError);
    throw sessionsError;
  }

  // Get today's completed tasks
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .gte('updated_at', startOfDay.toISOString())
    .lte('updated_at', endOfDay.toISOString());

  if (tasksError) {
    console.error('Error fetching daily tasks:', tasksError);
    throw tasksError;
  }

  const todayFocusMinutes = sessions?.reduce((acc, s) => acc + (s.duration || 0), 0) || 0;
  const dailyProgressPercent = dailyGoalMinutes > 0
    ? Math.min(Math.round((todayFocusMinutes / dailyGoalMinutes) * 100), 100)
    : 0;

  return {
    todayFocusMinutes,
    dailyGoalMinutes,
    dailyProgressPercent,
    sessionsToday: sessions?.length || 0,
    tasksCompletedToday: tasks?.length || 0,
  };
}

/**
 * Get weekly statistics with comparison to last week
 */
export async function getWeeklyStats(userId: string): Promise<WeeklyStats> {
  const thisWeek = getWeekBounds(0);
  const lastWeek = getWeekBounds(1);

  // This week's sessions
  const { data: thisWeekSessions, error: thisWeekError } = await supabase
    .from('focus_sessions')
    .select('duration')
    .eq('user_id', userId)
    .eq('status', FocusSessionStatus.COMPLETED)
    .gte('start_time', thisWeek.startOfWeek.toISOString())
    .lte('start_time', thisWeek.endOfWeek.toISOString());

  if (thisWeekError) {
    console.error('Error fetching this week sessions:', thisWeekError);
    throw thisWeekError;
  }

  // Last week's sessions
  const { data: lastWeekSessions, error: lastWeekError } = await supabase
    .from('focus_sessions')
    .select('duration')
    .eq('user_id', userId)
    .eq('status', FocusSessionStatus.COMPLETED)
    .gte('start_time', lastWeek.startOfWeek.toISOString())
    .lte('start_time', lastWeek.endOfWeek.toISOString());

  if (lastWeekError) {
    console.error('Error fetching last week sessions:', lastWeekError);
    throw lastWeekError;
  }

  const weeklyFocusMinutes = thisWeekSessions?.reduce((acc, s) => acc + (s.duration || 0), 0) || 0;
  const lastWeekFocusMinutes = lastWeekSessions?.reduce((acc, s) => acc + (s.duration || 0), 0) || 0;
  const weeklySessionsCount = thisWeekSessions?.length || 0;

  const averageSessionDuration = weeklySessionsCount > 0
    ? Math.round(weeklyFocusMinutes / weeklySessionsCount)
    : 0;

  const weekOverWeekChange = lastWeekFocusMinutes > 0
    ? Math.round(((weeklyFocusMinutes - lastWeekFocusMinutes) / lastWeekFocusMinutes) * 100)
    : weeklyFocusMinutes > 0 ? 100 : 0;

  return {
    weeklyFocusMinutes,
    weeklySessionsCount,
    averageSessionDuration,
    lastWeekFocusMinutes,
    weekOverWeekChange,
  };
}

/**
 * Get today's session summaries
 */
export async function getTodaySessions(userId: string): Promise<SessionSummary[]> {
  const { startOfDay, endOfDay } = getTodayBounds();

  const { data, error } = await supabase
    .from('focus_sessions')
    .select(`
      id,
      duration,
      start_time,
      rating,
      status,
      task:tasks(title)
    `)
    .eq('user_id', userId)
    .gte('start_time', startOfDay.toISOString())
    .lte('start_time', endOfDay.toISOString())
    .order('start_time', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching today sessions:', error);
    throw error;
  }

  return (data || []).map(session => {
    // Handle the joined task - it can be an object or array depending on the query
    const task = session.task as { title: string } | { title: string }[] | null;
    const taskTitle = Array.isArray(task) ? task[0]?.title : task?.title;

    return {
      id: session.id,
      taskTitle: taskTitle || null,
      duration: session.duration || 0,
      startTime: session.start_time,
      rating: session.rating,
      status: session.status,
    };
  });
}

/**
 * Calculate productivity streak (consecutive days with completed sessions)
 */
export async function getProductivityStreak(userId: string): Promise<ProductivityStreak> {
  // Get all completed sessions ordered by date
  const { data, error } = await supabase
    .from('focus_sessions')
    .select('start_time')
    .eq('user_id', userId)
    .eq('status', FocusSessionStatus.COMPLETED)
    .order('start_time', { ascending: false });

  if (error) {
    console.error('Error fetching sessions for streak:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
    };
  }

  // Group sessions by date
  const sessionDates = new Set<string>();
  data.forEach(session => {
    const date = new Date(session.start_time).toISOString().split('T')[0];
    sessionDates.add(date);
  });

  const sortedDates = Array.from(sessionDates).sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = sortedDates[0] === today ? today : yesterday;

  // Only count streak if user was active today or yesterday
  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    for (const date of sortedDates) {
      if (date === checkDate) {
        currentStreak++;
        // Move to previous day
        const prevDate = new Date(checkDate);
        prevDate.setDate(prevDate.getDate() - 1);
        checkDate = prevDate.toISOString().split('T')[0];
      } else if (date < checkDate) {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = new Date(sortedDates[i]);
    const next = new Date(sortedDates[i + 1]);
    const diffDays = Math.floor((current.getTime() - next.getTime()) / 86400000);

    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    currentStreak,
    longestStreak,
    lastActiveDate: sortedDates[0] || null,
  };
}

/**
 * Rate a focus session
 */
export async function rateSession(sessionId: string, rating: number): Promise<FocusSession> {
  const clampedRating = Math.min(Math.max(Math.round(rating), 1), 5);

  const { data, error } = await supabase
    .from('focus_sessions')
    .update({ rating: clampedRating })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error rating session:', error);
    throw error;
  }

  return data;
}

/**
 * Add a note to a focus session
 */
export async function addSessionNote(sessionId: string, note: string): Promise<FocusSession> {
  // First get existing notes
  const { data: existing, error: fetchError } = await supabase
    .from('focus_sessions')
    .select('notes')
    .eq('id', sessionId)
    .single();

  if (fetchError) {
    console.error('Error fetching session:', fetchError);
    throw fetchError;
  }

  // Append to existing notes or create new
  const existingNotes = existing?.notes || '';
  const newNotes = existingNotes
    ? `${existingNotes}\n---\n${note}`
    : note;

  const { data, error } = await supabase
    .from('focus_sessions')
    .update({ notes: newNotes.trim() })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error adding session note:', error);
    throw error;
  }

  return data;
}
