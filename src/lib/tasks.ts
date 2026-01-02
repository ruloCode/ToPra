import { supabase } from './supabase';
import { Database } from './supabase';

export type Task = Database['public']['Tables']['tasks']['Row'];

export type CreateTaskInput = Omit<Task, 'id' | 'created_at' | 'updated_at'>;
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>;

export const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];

// Create a new task
export async function createTask(task: CreateTaskInput) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get tasks with optional filters
export async function getTasks(filters?: {
  userId: string;
  status?: TaskStatusType;
  priority?: number;
  tags?: string[];
}) {
  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', filters?.userId);

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get a single task by ID
export async function getTaskById(taskId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (error) throw error;
  return data;
}

// Update a task
export async function updateTask(taskId: string, updates: UpdateTaskInput) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a task
export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
  return true;
}

// Subscribe to task changes for a user
export function subscribeToTasks(
  userId: string,
  callback: (payload: {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    old: Partial<Task>;
    new: Task;
   }) => void
) {
  return supabase
    .channel(`tasks_${userId}`)
    .on(
      'postgres_changes' as 'system',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback as any
    )
    .subscribe();
}

// Search tasks by title
export async function searchTasks(userId: string, searchQuery: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .ilike('title', `%${searchQuery}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
} 