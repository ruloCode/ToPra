'use client';

import { useState } from 'react';
import { Circle, CheckCircle2, Trash2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Subtask } from '@/types/subtasks';

interface SubtaskItemProps {
  subtask: Subtask;
  onToggleStatus: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Subtask>) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  1: 'text-gray-400',
  2: 'text-blue-500',
  3: 'text-orange-500',
  4: 'text-red-500',
};

export function SubtaskItem({
  subtask,
  onToggleStatus,
  onUpdate,
  onDelete,
}: SubtaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtask.title);
  const isCompleted = subtask.status === 'completed';

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== subtask.title) {
      onUpdate(subtask.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditTitle(subtask.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-3 p-2 rounded-md transition-colors',
        'hover:bg-secondary/50',
        isCompleted && 'opacity-60'
      )}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggleStatus(subtask.id)}
        className="flex-shrink-0"
      >
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle
            className={cn(
              'h-5 w-5',
              priorityColors[subtask.priority as keyof typeof priorityColors]
            )}
          />
        )}
      </button>

      {/* Title */}
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-b border-accent focus:outline-none text-sm"
          autoFocus
        />
      ) : (
        <span
          className={cn(
            'flex-1 text-sm cursor-pointer',
            isCompleted && 'line-through text-muted-foreground'
          )}
          onClick={() => setIsEditing(true)}
        >
          {subtask.title}
        </span>
      )}

      {/* AI badge */}
      {subtask.ai_generated && (
        <span title="Generada por IA">
          <Sparkles className="h-3 w-3 text-purple-400" />
        </span>
      )}

      {/* Delete button */}
      <button
        type="button"
        onClick={() => onDelete(subtask.id)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
    </div>
  );
}
