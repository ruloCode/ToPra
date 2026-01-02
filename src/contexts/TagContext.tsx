'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Tag, getUserTags, createTag as createTagApi, updateTag as updateTagApi, deleteTag as deleteTagApi, CreateTagInput, UpdateTagInput } from '@/lib/tags';
import { useAuth } from '@/components/AuthProvider';

interface TagContextType {
  tags: Tag[];
  isLoading: boolean;
  refreshTags: () => Promise<void>;
  createTag: (name: string, color?: string) => Promise<Tag>;
  updateTag: (tagId: string, updates: UpdateTagInput) => Promise<Tag>;
  deleteTag: (tagId: string) => Promise<void>;
  getTagByName: (name: string) => Tag | undefined;
}

const TagContext = createContext<TagContextType | undefined>(undefined);

export function TagProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshTags = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userTags = await getUserTags(user.id);
      setTags(userTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load tags when user changes
  useEffect(() => {
    if (user) {
      refreshTags();
    } else {
      setTags([]);
    }
  }, [user, refreshTags]);

  const createTag = useCallback(async (name: string, color?: string): Promise<Tag> => {
    if (!user) throw new Error('User not authenticated');

    const newTag = await createTagApi({
      user_id: user.id,
      name: name.toLowerCase().trim(),
      color: color || 'blue',
    });

    setTags(prev => [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name)));
    return newTag;
  }, [user]);

  const updateTag = useCallback(async (tagId: string, updates: UpdateTagInput): Promise<Tag> => {
    const updatedTag = await updateTagApi(tagId, {
      ...updates,
      name: updates.name?.toLowerCase().trim(),
    });

    setTags(prev =>
      prev.map(t => t.id === tagId ? updatedTag : t)
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    return updatedTag;
  }, []);

  const deleteTag = useCallback(async (tagId: string): Promise<void> => {
    await deleteTagApi(tagId);
    setTags(prev => prev.filter(t => t.id !== tagId));
  }, []);

  const getTagByName = useCallback((name: string): Tag | undefined => {
    return tags.find(t => t.name.toLowerCase() === name.toLowerCase());
  }, [tags]);

  return (
    <TagContext.Provider value={{
      tags,
      isLoading,
      refreshTags,
      createTag,
      updateTag,
      deleteTag,
      getTagByName
    }}>
      {children}
    </TagContext.Provider>
  );
}

export function useTags() {
  const context = useContext(TagContext);
  if (context === undefined) {
    throw new Error('useTags must be used within a TagProvider');
  }
  return context;
}
