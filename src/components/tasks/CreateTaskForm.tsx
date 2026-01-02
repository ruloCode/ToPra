'use client';

import { useState, useEffect, useRef } from 'react';
import { createTask, updateTask, Task } from '@/lib/tasks';
import { useAuth } from '@/components/AuthProvider';
import { format, parseISO, startOfDay, addHours } from 'date-fns';
import { es } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Circle,
  Clock,
  CheckCircle2,
  Calendar,
  Flag,
  ChevronDown,
  FileText,
  X,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TagsDropdown from '@/components/tags/TagsDropdown';
import { useTags } from '@/contexts/TagContext';
import { getTagColorClasses } from '@/lib/tags';

interface CreateTaskFormProps {
  initialTask?: Partial<Task>;
  onSuccess: () => void;
  onCancel?: () => void;
}

// Status configuration
const statusConfig = {
  pending: {
    label: 'Por hacer',
    icon: Circle,
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    dotColor: 'bg-gray-400',
  },
  in_progress: {
    label: 'En progreso',
    icon: Clock,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    dotColor: 'bg-blue-500',
  },
  completed: {
    label: 'Completada',
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    dotColor: 'bg-green-500',
  },
} as const;

// Priority configuration
const priorityConfig = {
  1: {
    label: 'Baja',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
  },
  2: {
    label: 'Media',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  3: {
    label: 'Alta',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  4: {
    label: 'Urgente',
    color: 'text-red-500',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
} as const;


export default function CreateTaskForm({
  initialTask,
  onSuccess,
  onCancel,
}: CreateTaskFormProps) {
  const { user } = useAuth();
  const { tags: userTags } = useTags();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState(!!initialTask?.description);
  const [showPreview, setShowPreview] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: number;
    status: 'pending' | 'in_progress' | 'completed';
    due_date: string;
    tags: string[];
  }>({
    title: '',
    description: '',
    priority: 2,
    status: 'pending',
    due_date: '',
    tags: [],
  });

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        priority: initialTask.priority || 2,
        status: (initialTask.status as 'pending' | 'in_progress' | 'completed') || 'pending',
        due_date: initialTask.due_date
          ? format(parseISO(initialTask.due_date), 'yyyy-MM-dd')
          : '',
        tags: initialTask.tags || [],
      });
      if (initialTask.description) {
        setShowDescription(true);
      }
    }
  }, [initialTask]);

  useEffect(() => {
    // Focus title input on mount
    titleInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError(null);

    const taskData = {
      user_id: user.id,
      title: formData.title,
      description: formData.description || null,
      priority: formData.priority,
      status: formData.status,
      due_date: formData.due_date
        ? addHours(startOfDay(new Date(formData.due_date)), 12).toISOString()
        : null,
      tags: formData.tags,
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
          ? 'Error al actualizar la tarea. Intenta de nuevo.'
          : 'Error al crear la tarea. Intenta de nuevo.'
      );
      console.error('Error saving task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input - Large, no label, placeholder style */}
      <div className="relative">
        <input
          ref={titleInputRef}
          type="text"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          required
          className="w-full text-lg font-medium bg-transparent border-0 border-b-2 border-transparent focus:border-accent px-0 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 transition-colors"
          placeholder="Nombre de la tarea..."
        />
      </div>

      {/* Description - Collapsible */}
      <div className="space-y-2">
        {!showDescription ? (
          <button
            type="button"
            onClick={() => setShowDescription(true)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Agregar descripción</span>
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Descripción</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  {showPreview ? 'Editar' : 'Vista previa'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDescription(false);
                    setFormData((prev) => ({ ...prev, description: '' }));
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {showPreview ? (
              <div className="p-3 border border-border rounded-lg min-h-[80px] bg-muted/30 prose prose-sm dark:prose-invert max-w-none">
                {formData.description ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {formData.description}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground">Sin descripción</p>
                )}
              </div>
            ) : (
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
                className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none transition-colors"
                placeholder="Describe la tarea... (Markdown soportado)"
              />
            )}
          </div>
        )}
      </div>

      {/* Metadata Chips - Inline horizontal */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Chip */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors hover:opacity-80',
                statusConfig[formData.status as keyof typeof statusConfig]?.color
              )}
            >
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  statusConfig[formData.status as keyof typeof statusConfig]?.dotColor
                )}
              />
              {statusConfig[formData.status as keyof typeof statusConfig]?.label}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {Object.entries(statusConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setFormData((prev) => ({ ...prev, status: key as 'pending' | 'in_progress' | 'completed' }))}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Icon className="h-4 w-4" />
                  <span>{config.label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Due Date Chip */}
        <div className="relative">
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors pointer-events-none',
              formData.due_date
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Calendar className="h-3.5 w-3.5" />
            {formData.due_date
              ? format(parseISO(formData.due_date), 'd MMM', { locale: es })
              : 'Fecha'}
            {formData.due_date && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setFormData((prev) => ({ ...prev, due_date: '' }));
                }}
                className="hover:text-purple-900 dark:hover:text-purple-200 pointer-events-auto z-10"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))}
            onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* Priority Chip */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors hover:opacity-80',
                priorityConfig[formData.priority as keyof typeof priorityConfig]?.bgColor,
                priorityConfig[formData.priority as keyof typeof priorityConfig]?.color
              )}
            >
              <Flag className="h-3.5 w-3.5" />
              {priorityConfig[formData.priority as keyof typeof priorityConfig]?.label}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
            {Object.entries(priorityConfig).map(([key, config]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setFormData((prev) => ({ ...prev, priority: parseInt(key) }))}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Flag className={cn('h-4 w-4', config.color)} />
                <span>{config.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tags Dropdown */}
        <TagsDropdown
          selectedTags={formData.tags}
          onTagsChange={handleTagsChange}
          showSelectedChips={false}
        />

        {/* More Options */}
        <button
          type="button"
          className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Selected Tags Display */}
      {formData.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {formData.tags.map((tagName) => {
            const tag = userTags.find((t) => t.name === tagName);
            const colorClasses = tag
              ? getTagColorClasses(tag.color)
              : getTagColorClasses('blue');
            return (
              <span
                key={tagName}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                  colorClasses.bg,
                  colorClasses.text
                )}
              >
                {tagName}
                <button
                  type="button"
                  onClick={() => handleTagsChange(formData.tags.filter((t) => t !== tagName))}
                  className="hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-4 pb-2 border-t border-border">
        <button
          type="submit"
          disabled={isLoading || !formData.title.trim()}
          className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading
            ? initialTask?.id
              ? 'Guardando...'
              : 'Creando...'
            : initialTask?.id
            ? 'Guardar'
            : 'Crear tarea'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
