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
  onCancel,
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
          ? 'Error al actualizar la tarea. Por favor, intenta de nuevo.'
          : 'Error al crear la tarea. Por favor, intenta de nuevo.'
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-foreground"
        >
          Título
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Título de la tarea"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-foreground"
        >
          Descripción
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Descripción de la tarea"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-foreground"
          >
            Prioridad
          </label>
          <select
            name="priority"
            id="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="1">Baja</option>
            <option value="2">Media</option>
            <option value="3">Alta</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="due_date"
            className="block text-sm font-medium text-foreground"
          >
            Fecha límite
          </label>
          <input
            type="date"
            name="due_date"
            id="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-foreground"
        >
          Etiquetas
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
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
              className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-600 hover:bg-yellow-200"
            >
              + personal
            </button>
            <button
              type="button"
              onClick={() => {
                const currentTags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
                const tag = "trabajo";
                if (!currentTags.includes(tag)) {
                  const newTags = [...currentTags, tag];
                  setFormData(prev => ({ ...prev, tags: newTags.join(', ') }));
                }
              }}
              className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600 hover:bg-blue-200"
            >
              + trabajo
            </button>
          </div>
          <input
            type="text"
            name="tags"
            id="tags"
            value={formData.tags}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Etiquetas separadas por comas"
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
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:bg-accent/70"
        >
          {isLoading
            ? initialTask
              ? 'Actualizando...'
              : 'Creando...'
            : initialTask
            ? 'Actualizar'
            : 'Crear'}
        </button>
      </div>
    </form>
  );
}