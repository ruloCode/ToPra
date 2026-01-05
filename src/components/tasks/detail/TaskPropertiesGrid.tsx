'use client';

import { useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Circle,
  CheckCircle2,
  Clock,
  Flag,
  Calendar,
  XIcon,
  ChevronDown,
  CheckIcon,
  Timer,
  CalendarDays,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import TagsDropdown from '@/components/tags/TagsDropdown';
import { getTagColorClasses } from '@/lib/tags';

// Status configuration
const statusConfig = {
  pending: {
    label: 'Pendiente',
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

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TaskPropertiesGridProps {
  status: string;
  priority: number;
  dueDate: string | null;
  tags: string[];
  userTags: Tag[];
  totalFocusTime: number;
  createdAt: string;
  isUpdating: boolean;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: number) => void;
  onDueDateChange: (date: string | null) => void;
  onTagsChange: (tags: string[]) => void;
}

function formatDuration(minutes: number): string {
  if (minutes === 0) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function TaskPropertiesGrid({
  status,
  priority,
  dueDate,
  tags,
  userTags,
  totalFocusTime,
  createdAt,
  isUpdating,
  onStatusChange,
  onPriorityChange,
  onDueDateChange,
  onTagsChange,
}: TaskPropertiesGridProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-border mb-6">
      {/* Status */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Circle className="h-3 w-3" />
          Estado
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors w-full justify-between",
                statusConfig[status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-700'
              )}
              disabled={isUpdating}
            >
              <span className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", statusConfig[status as keyof typeof statusConfig]?.dotColor || 'bg-gray-400')} />
                {statusConfig[status as keyof typeof statusConfig]?.label || status}
              </span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {Object.entries(statusConfig).map(([statusKey, config]) => {
              const IconComponent = config.icon;
              return (
                <DropdownMenuItem
                  key={statusKey}
                  onClick={() => onStatusChange(statusKey)}
                  className={cn(
                    "flex items-center gap-2",
                    status === statusKey && "bg-accent/10"
                  )}
                >
                  <IconComponent className={cn("h-4 w-4", config.color.split(' ')[1])} />
                  {config.label}
                  {status === statusKey && <CheckIcon className="ml-auto h-4 w-4 text-accent" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Priority */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Flag className="h-3 w-3" />
          Prioridad
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors w-full justify-between",
                priority
                  ? priorityConfig[priority as keyof typeof priorityConfig]?.bgColor
                  : 'bg-muted',
                priority
                  ? priorityConfig[priority as keyof typeof priorityConfig]?.color
                  : 'text-muted-foreground'
              )}
              disabled={isUpdating}
            >
              <span className="flex items-center gap-2">
                <Flag className="h-3.5 w-3.5" />
                {priority
                  ? priorityConfig[priority as keyof typeof priorityConfig]?.label
                  : 'Sin prioridad'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {Object.entries(priorityConfig).map(([priorityKey, config]) => (
              <DropdownMenuItem
                key={priorityKey}
                onClick={() => onPriorityChange(Number(priorityKey))}
                className={cn(
                  "flex items-center gap-2",
                  priority === Number(priorityKey) && "bg-accent/10"
                )}
              >
                <Flag className={cn("h-4 w-4", config.color)} />
                <span className={config.color}>{config.label}</span>
                {priority === Number(priorityKey) && <CheckIcon className="ml-auto h-4 w-4 text-accent" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Due Date */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          Fecha limite
        </label>
        <div className="relative">
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer w-full justify-between",
              dueDate
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                : 'bg-muted text-muted-foreground hover:bg-secondary'
            )}
            onClick={() => dateInputRef.current?.showPicker?.()}
          >
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              {dueDate
                ? format(parseISO(dueDate), 'd MMM yyyy', { locale: es })
                : 'Sin fecha'}
            </span>
            {dueDate && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDueDateChange(null);
                }}
                className="hover:text-purple-900 dark:hover:text-purple-200 z-10"
              >
                <XIcon className="h-3 w-3" />
              </button>
            )}
          </div>
          <input
            ref={dateInputRef}
            type="date"
            value={dueDate ? dueDate.split('T')[0] : ''}
            onChange={(e) => onDueDateChange(e.target.value || null)}
            onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-accent/50" />
          Etiquetas
        </label>
        <div className="flex flex-wrap items-center gap-1">
          <TagsDropdown
            selectedTags={tags || []}
            onTagsChange={onTagsChange}
            showSelectedChips={false}
          />
          {tags && tags.length > 0 && tags.slice(0, 2).map((tagName) => {
            const tag = userTags.find((t) => t.name === tagName);
            const colorClasses = tag
              ? getTagColorClasses(tag.color)
              : { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' };
            return (
              <span
                key={tagName}
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  colorClasses.bg,
                  colorClasses.text
                )}
              >
                {tagName}
              </span>
            );
          })}
          {tags && tags.length > 2 && (
            <span className="text-xs text-muted-foreground">+{tags.length - 2}</span>
          )}
        </div>
      </div>

      {/* Focus Time */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Timer className="h-3 w-3" />
          Tiempo enfocado
        </label>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-accent/10 text-accent">
          <Timer className="h-3.5 w-3.5" />
          {formatDuration(totalFocusTime)}
        </div>
      </div>

      {/* Created Date */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <CalendarDays className="h-3 w-3" />
          Creada
        </label>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground bg-muted">
          <CalendarDays className="h-3.5 w-3.5" />
          {format(parseISO(createdAt), "d MMM yyyy", { locale: es })}
        </div>
      </div>
    </div>
  );
}
