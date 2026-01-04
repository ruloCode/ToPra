import { supabase } from './supabase';
import {
  Subtask,
  CreateSubtaskInput,
  UpdateSubtaskInput,
  SubtaskStatusEnum,
} from '@/types/subtasks';

/**
 * Get all subtasks for a specific task
 */
export async function getSubtasksByTaskId(taskId: string): Promise<Subtask[]> {
  const { data, error } = await supabase
    .from('subtasks')
    .select('*')
    .eq('task_id', taskId)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching subtasks:', error);
    throw error;
  }

  return data || [];
}

/**
 * Create a new subtask
 */
export async function createSubtask(input: CreateSubtaskInput): Promise<Subtask> {
  if (!input.user_id) {
    throw new Error('user_id is required');
  }
  if (!input.task_id) {
    throw new Error('task_id is required');
  }
  if (!input.title.trim()) {
    throw new Error('title is required');
  }

  // Get max position for this task
  const { data: existing } = await supabase
    .from('subtasks')
    .select('position')
    .eq('task_id', input.task_id)
    .order('position', { ascending: false })
    .limit(1);

  const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

  const { data, error } = await supabase
    .from('subtasks')
    .insert([
      {
        user_id: input.user_id,
        task_id: input.task_id,
        title: input.title.trim(),
        priority: input.priority || 2,
        position: input.position ?? nextPosition,
        ai_generated: input.ai_generated || false,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating subtask:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from subtask creation');
  }

  return data;
}

/**
 * Create multiple subtasks at once (for AI suggestions)
 */
export async function createSubtasksBatch(
  userId: string,
  taskId: string,
  subtasks: { title: string; priority: number }[],
  aiGenerated: boolean = false
): Promise<Subtask[]> {
  if (!userId) {
    throw new Error('userId is required');
  }
  if (!taskId) {
    throw new Error('taskId is required');
  }
  if (!subtasks.length) {
    return [];
  }

  // Get max position for this task
  const { data: existing } = await supabase
    .from('subtasks')
    .select('position')
    .eq('task_id', taskId)
    .order('position', { ascending: false })
    .limit(1);

  const startPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

  const toInsert = subtasks.map((st, index) => ({
    user_id: userId,
    task_id: taskId,
    title: st.title.trim(),
    priority: st.priority,
    position: startPosition + index,
    ai_generated: aiGenerated,
  }));

  const { data, error } = await supabase
    .from('subtasks')
    .insert(toInsert)
    .select();

  if (error) {
    console.error('Error creating subtasks batch:', error);
    throw error;
  }

  return data || [];
}

/**
 * Update a subtask
 */
export async function updateSubtask(
  id: string,
  updates: UpdateSubtaskInput
): Promise<Subtask> {
  const updateData: Record<string, unknown> = { ...updates };

  // Set completed_at when marking as completed
  if (updates.status === SubtaskStatusEnum.COMPLETED && !updates.completed_at) {
    updateData.completed_at = new Date().toISOString();
  } else if (updates.status && updates.status !== SubtaskStatusEnum.COMPLETED) {
    updateData.completed_at = null;
  }

  const { data, error } = await supabase
    .from('subtasks')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating subtask:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from subtask update');
  }

  return data;
}

/**
 * Delete a subtask
 */
export async function deleteSubtask(id: string): Promise<boolean> {
  const { error } = await supabase.from('subtasks').delete().eq('id', id);

  if (error) {
    console.error('Error deleting subtask:', error);
    throw error;
  }

  return true;
}

/**
 * Toggle subtask completion status
 */
export async function toggleSubtaskStatus(
  id: string,
  currentStatus: string
): Promise<Subtask> {
  const newStatus =
    currentStatus === SubtaskStatusEnum.COMPLETED
      ? SubtaskStatusEnum.PENDING
      : SubtaskStatusEnum.COMPLETED;

  return updateSubtask(id, { status: newStatus });
}

/**
 * Reorder subtasks (for drag-and-drop)
 */
export async function reorderSubtasks(
  taskId: string,
  subtaskIds: string[]
): Promise<void> {
  const updates = subtaskIds.map((id, index) => ({
    id,
    position: index,
  }));

  for (const update of updates) {
    await supabase
      .from('subtasks')
      .update({ position: update.position })
      .eq('id', update.id);
  }
}

/**
 * Get subtask completion stats for a task
 */
export async function getSubtaskStats(
  taskId: string
): Promise<{ total: number; completed: number }> {
  const { data, error } = await supabase
    .from('subtasks')
    .select('status')
    .eq('task_id', taskId);

  if (error) {
    console.error('Error fetching subtask stats:', error);
    throw error;
  }

  const total = data?.length || 0;
  const completed =
    data?.filter((s) => s.status === SubtaskStatusEnum.COMPLETED).length || 0;

  return { total, completed };
}
