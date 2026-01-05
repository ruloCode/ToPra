'use client';

import Link from 'next/link';
import { ChevronLeft, TimerIcon, MoreHorizontal, CheckCircle2, Circle, Trash2, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TaskHeaderProps {
  taskId: string;
  taskTitle: string;
  taskStatus: string;
  showFocusTimer: boolean;
  showAI?: boolean;
  isUpdating: boolean;
  onToggleTimer: () => void;
  onToggleAI?: () => void;
  onStatusToggle: () => void;
  onDelete: () => void;
}

export function TaskHeader({
  taskId,
  taskTitle,
  taskStatus,
  showFocusTimer,
  showAI,
  isUpdating,
  onToggleTimer,
  onToggleAI,
  onStatusToggle,
  onDelete,
}: TaskHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/tasks"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Tareas</span>
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {taskTitle}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Task ID - Copyable */}
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(taskId);
          }}
          className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground rounded border border-transparent hover:border-border transition-all"
          title="Copiar ID"
        >
          <span className="font-mono">{taskId.slice(0, 8)}</span>
        </button>

        {/* AI Assistant Toggle */}
        {onToggleAI && (
          <button
            type="button"
            onClick={onToggleAI}
            className={cn(
              "p-2 rounded-md transition-colors flex items-center gap-1.5",
              showAI
                ? "bg-purple-500 text-white"
                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            )}
            title={showAI ? 'Cerrar IA' : 'Preguntar a IA'}
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:inline">Preguntar a IA</span>
          </button>
        )}

        {/* Timer Toggle */}
        <button
          type="button"
          onClick={onToggleTimer}
          className={cn(
            "p-2 rounded-md transition-colors",
            showFocusTimer
              ? "bg-accent text-white"
              : "hover:bg-secondary text-muted-foreground hover:text-foreground"
          )}
          title={showFocusTimer ? 'Ocultar timer' : 'Mostrar timer'}
        >
          <TimerIcon className="h-5 w-5" />
        </button>

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={onStatusToggle}
              disabled={isUpdating}
            >
              {taskStatus === 'completed' ? (
                <>
                  <Circle className="mr-2 h-4 w-4" />
                  Marcar como pendiente
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Marcar como completada
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar tarea
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
