import { supabase } from './supabase';

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export type CreateTagInput = {
  user_id: string;
  name: string;
  color?: string;
};

export type UpdateTagInput = {
  name?: string;
  color?: string;
};

// Available tag colors with their Tailwind classes
export const TAG_COLORS = [
  { name: 'blue', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  { name: 'yellow', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' },
  { name: 'green', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
  { name: 'red', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
  { name: 'purple', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', dot: 'bg-purple-500' },
  { name: 'teal', bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-400', dot: 'bg-teal-500' },
  { name: 'orange', bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' },
  { name: 'pink', bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400', dot: 'bg-pink-500' },
] as const;

export type TagColorName = typeof TAG_COLORS[number]['name'];

/**
 * Get color classes for a tag color name
 */
export function getTagColorClasses(colorName: string) {
  const color = TAG_COLORS.find((c) => c.name === colorName);
  return color || TAG_COLORS[0]; // Default to blue
}

/**
 * Get all tags for a user
 */
export async function getUserTags(userId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }

  return data || [];
}

/**
 * Create a new tag
 */
export async function createTag(tag: CreateTagInput): Promise<Tag> {
  const { data, error } = await supabase
    .from('tags')
    .insert([{ ...tag, color: tag.color || 'blue' }])
    .select()
    .single();

  if (error) {
    console.error('Error creating tag:', error);
    throw error;
  }

  return data;
}

/**
 * Update an existing tag
 */
export async function updateTag(tagId: string, updates: UpdateTagInput): Promise<Tag> {
  const { data, error } = await supabase
    .from('tags')
    .update(updates)
    .eq('id', tagId)
    .select()
    .single();

  if (error) {
    console.error('Error updating tag:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a tag
 */
export async function deleteTag(tagId: string): Promise<void> {
  const { error } = await supabase.from('tags').delete().eq('id', tagId);

  if (error) {
    console.error('Error deleting tag:', error);
    throw error;
  }
}
