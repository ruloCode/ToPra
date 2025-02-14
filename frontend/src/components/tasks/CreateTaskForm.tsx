'use client';

import { useState, useEffect } from 'react';
import { createTask, updateTask, TaskStatus, Task } from '@/lib/tasks';
import { useAuth } from '@/components/AuthProvider';
import { format, parseISO, startOfDay, addHours } from 'date-fns';

interface CreateTaskFormProps {
  initialTask?: Partial<Task>;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateTaskForm({
  initialTask,
  onSuccess,
}: CreateTaskFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '1',
    due_date: format(new Date(), 'yyyy-MM-dd'),
    tags: '',
  });

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        priority: initialTask.priority?.toString() || '2',
        due_date: initialTask.due_date ? format(parseISO(initialTask.due_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        tags: initialTask.tags?.join(', ') || '',
      });
    }
  }, [initialTask]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError(null);

    const taskData = {
      user_id: user.id,
      title: formData.title,
      description: formData.description || null,
      priority: parseInt(formData.priority),
      due_date: formData.due_date 
        ? addHours(startOfDay(new Date(formData.due_date)), 12).toISOString()
        : null,
      status: initialTask?.status || TaskStatus.PENDING,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      ai_metadata: initialTask?.ai_metadata || {},
    };

    try {
      if (initialTask?.id) {
        await updateTask(initialTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      onSuccess();
    } catch (err) {
      setError(
        initialTask?.id
          ? 'Error updating task. Please try again.'
          : 'Error creating task. Please try again.'
      );
      console.error('Error saving task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-background dark:bg-background-paper p-4 rounded-lg">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-foreground"
        >
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:bg-background-paper dark:border-[#28282F]"
          placeholder="Task title"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-foreground"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:bg-background-paper dark:border-[#28282F]"
          placeholder="Task description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-foreground"
          >
            Priority
          </label>
          <select
            name="priority"
            id="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:bg-background-paper dark:border-[#28282F]"
          >
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="due_date"
            className="block text-sm font-medium text-foreground"
          >
            Due Date
          </label>
          <input
            type="date"
            name="due_date"
            id="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:bg-background-paper dark:border-[#28282F]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-foreground"
        >
          Tags
        </label>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
              <div key={tag} className="inline-flex items-center rounded-full bg-background-paper px-2 py-0.5 text-xs border border-border">
                {tag}
                <button
                  type="button"
                  onClick={() => {
                    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t !== tag);
                    setFormData(prev => ({ ...prev, tags: currentTags.join(', ') }));
                  }}
                  className="ml-1 text-text-secondary hover:text-destructive"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const currentTags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
                const tag = "personal";
                if (!currentTags.includes(tag)) {
                  const newTags = [...currentTags, tag];
                  setFormData(prev => ({ ...prev, tags: newTags.join(', ') }));
                }
              }}
              className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-500/5 px-2 py-0.5 text-xs text-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-500/10"
            >
              + personal
            </button>
            <button
              type="button"
              onClick={() => {
                const currentTags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
                const tag = "work";
                if (!currentTags.includes(tag)) {
                  const newTags = [...currentTags, tag];
                  setFormData(prev => ({ ...prev, tags: newTags.join(', ') }));
                }
              }}
              className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-500/5 px-2 py-0.5 text-xs text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-500/10"
            >
              + work
            </button>
          </div>
          <input
            type="text"
            name="tags"
            id="tags"
            value={formData.tags}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && e.currentTarget.selectionStart === 0 && formData.tags) {
                e.preventDefault();
                const currentTags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
                if (currentTags.length > 0) {
                  currentTags.pop();
                  setFormData(prev => ({ ...prev, tags: currentTags.join(', ') }));
                }
              }
            }}
            className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:bg-background-paper dark:border-[#28282F]"
            placeholder="Tags separated by commas"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3">
       
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full py-2 mb-2 justify-center rounded-md border border-transparent bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:bg-accent/70"
        >
          {isLoading
            ? initialTask
              ? 'Updating...'
              : 'Creating...'
            : initialTask
            ? 'Update'
            : 'Create'}
        </button>
      </div>
    </form>
  );
}