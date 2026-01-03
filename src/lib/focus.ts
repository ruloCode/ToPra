import { supabase } from './supabase';
import { Database } from './supabase';

export type FocusSession = Database['public']['Tables']['focus_sessions']['Row'];

export type FocusSessionStatus = 'active' | 'completed' | 'interrupted';

export const FocusSessionStatus = {
  ACTIVE: 'active' as const,
  COMPLETED: 'completed' as const,
  INTERRUPTED: 'interrupted' as const,
} as const;

export type CreateFocusSessionInput = {
  user_id: string;
  task_id?: string | null;
  start_time?: string;
  end_time?: string | null;
  duration?: number | null;
  status?: FocusSessionStatus;
  notes?: string | null;
  rating?: number | null;
};

export type UpdateFocusSessionInput = Partial<Omit<FocusSession, 'id' | 'created_at' | 'updated_at'>>;

// Create a new focus session
export async function createFocusSession(session: CreateFocusSessionInput): Promise<FocusSession> {
  if (!session.user_id) {
    throw new Error('user_id is required');
  }

  // No necesitamos validar start_time ni status porque tienen valores por defecto en la BD
  const { data, error } = await supabase
    .from('focus_sessions')
    .insert([{
      user_id: session.user_id,
      task_id: session.task_id || null,
      duration: session.duration || null,
      notes: session.notes || null,
      rating: session.rating || null,
      // Dejamos que la BD maneje los valores por defecto para start_time y status
    }])
    .select()
    .single();

  if (error) {
    console.error('Supabase error creating focus session:', {
      error,
      errorMessage: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from focus session creation');
  }

  return data;
}

interface GetFocusSessionsParams {
  userId: string;
  status?: FocusSessionStatus;
  startDate?: Date;
  endDate?: Date;
}

export async function getFocusSessions({ userId, status, startDate, endDate }: GetFocusSessionsParams) {
  let query = supabase
    .from('focus_sessions')
    .select(`
      *,
      task:tasks(id, title, description)
    `)
    .eq('user_id', userId);

  if (status) {
    query = query.eq('status', status);
  }
  if (startDate) {
    query = query.gte('start_time', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('end_time', endDate.toISOString());
  }

  const { data, error } = await query.order('start_time', { ascending: false });
  if (error) throw error;
  return data;
}

// Get a single focus session by ID
export async function getFocusSessionById(sessionId: string) {
  const { data, error } = await supabase
    .from('focus_sessions')
    .select(`
      *,
      task:tasks(id, title, description)
    `)
    .eq('id', sessionId)
    .single();

  if (error) throw error;
  return data;
}

// Update a focus session
export async function updateFocusSession(sessionId: string, updates: UpdateFocusSessionInput) {
  const { data, error } = await supabase
    .from('focus_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a focus session
export async function deleteFocusSession(sessionId: string) {
  const { error } = await supabase
    .from('focus_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
  return true;
}

// Get focus session statistics
export async function getFocusSessionStats(userId: string, startDate?: Date, endDate?: Date) {
  let query = supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', FocusSessionStatus.COMPLETED);

  if (startDate) {
    query = query.gte('start_time', startDate.toISOString());
  }

  if (endDate) {
    query = query.lte('end_time', endDate.toISOString());
  }

  const { data, error } = await query;

  if (error) throw error;

  const stats = {
    totalSessions: data.length,
    totalDuration: data.reduce((acc, session) => acc + (session.duration || 0), 0),
    averageRating: data.reduce((acc, session) => acc + (session.rating || 0), 0) / data.length || 0,
    completedSessions: data.filter(session => session.status === FocusSessionStatus.COMPLETED).length,
    interruptedSessions: data.filter(session => session.status === FocusSessionStatus.INTERRUPTED).length,
  };

  return stats;
}