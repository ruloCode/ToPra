import { supabase } from './supabase';
import { Comment, CreateCommentInput } from '@/types/comments';

/**
 * Get all comments for a specific task
 */
export async function getCommentsByTaskId(taskId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }

  return data || [];
}

/**
 * Create a new comment
 */
export async function createComment(input: CreateCommentInput): Promise<Comment> {
  if (!input.user_id) {
    throw new Error('user_id is required');
  }
  if (!input.task_id) {
    throw new Error('task_id is required');
  }
  if (!input.content.trim()) {
    throw new Error('content is required');
  }

  const { data, error } = await supabase
    .from('comments')
    .insert([{
      user_id: input.user_id,
      task_id: input.task_id,
      content: input.content.trim(),
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from comment creation');
  }

  return data;
}

/**
 * Update an existing comment
 */
export async function updateComment(id: string, content: string): Promise<Comment> {
  if (!content.trim()) {
    throw new Error('content is required');
  }

  const { data, error } = await supabase
    .from('comments')
    .update({
      content: content.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating comment:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from comment update');
  }

  return data;
}

/**
 * Delete a comment
 */
export async function deleteComment(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }

  return true;
}
