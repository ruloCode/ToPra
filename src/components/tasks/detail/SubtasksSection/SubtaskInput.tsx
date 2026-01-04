'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SubtaskInputProps {
  onAdd: (title: string, priority?: number) => Promise<void>;
  onCancel: () => void;
}

const priorities = [
  { value: 1, label: 'Baja', color: 'text-gray-500' },
  { value: 2, label: 'Media', color: 'text-blue-500' },
  { value: 3, label: 'Alta', color: 'text-orange-500' },
  { value: 4, label: 'Urgente', color: 'text-red-500' },
];

export function SubtaskInput({ onAdd, onCancel }: SubtaskInputProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(title.trim(), priority);
      setTitle('');
      setPriority(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const currentPriority = priorities.find((p) => p.value === priority)!;

  return (
    <div className="flex items-center gap-2 p-2 bg-background rounded-lg border border-border">
      {/* Priority selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'p-1.5 rounded hover:bg-secondary',
              currentPriority.color
            )}
          >
            <Flag className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {priorities.map((p) => (
            <DropdownMenuItem
              key={p.value}
              onClick={() => setPriority(p.value)}
              className={cn('flex items-center gap-2', p.color)}
            >
              <Flag className="h-4 w-4" />
              {p.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Title input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nombre de la subtarea..."
        className="flex-1 bg-transparent text-sm focus:outline-none"
        autoFocus
      />

      {/* Action buttons */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-2 py-1 text-xs rounded hover:bg-secondary text-muted-foreground"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!title.trim() || isSubmitting}
          className={cn(
            'px-2 py-1 text-xs rounded bg-accent text-white',
            'hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}
