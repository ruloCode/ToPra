'use client';

import { Sparkles, Flag, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubtaskSuggestion } from '@/types/subtasks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AISuggestionsModalProps {
  isOpen: boolean;
  suggestions: SubtaskSuggestion[];
  onClose: () => void;
  onApply: (suggestions: SubtaskSuggestion[]) => void;
  onUpdateSuggestion: (
    index: number,
    updates: Partial<SubtaskSuggestion>
  ) => void;
}

const priorityConfig = {
  1: {
    label: 'Baja',
    color: 'text-gray-500',
    bg: 'bg-gray-100 dark:bg-gray-800',
  },
  2: {
    label: 'Media',
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  3: {
    label: 'Alta',
    color: 'text-orange-500',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
  },
  4: {
    label: 'Urgente',
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-900/30',
  },
};

export function AISuggestionsModal({
  isOpen,
  suggestions,
  onClose,
  onApply,
  onUpdateSuggestion,
}: AISuggestionsModalProps) {
  const selectedCount = suggestions.filter((s) => s.selected !== false).length;

  const handleSelectAll = () => {
    const allSelected = suggestions.every((s) => s.selected !== false);
    suggestions.forEach((_, index) => {
      onUpdateSuggestion(index, { selected: !allSelected });
    });
  };

  const handleApply = () => {
    onApply(suggestions.filter((s) => s.selected !== false));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            Subtareas sugeridas por IA
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Select all */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {selectedCount} de {suggestions.length} seleccionadas
            </span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-accent hover:text-accent/80"
            >
              {suggestions.every((s) => s.selected !== false)
                ? 'Deseleccionar todas'
                : 'Seleccionar todas'}
            </button>
          </div>

          {/* Suggestions list */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                  suggestion.selected !== false
                    ? 'border-accent/50 bg-accent/5'
                    : 'border-border bg-background'
                )}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSuggestion(index, {
                      selected: suggestion.selected === false,
                    })
                  }
                  className={cn(
                    'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                    suggestion.selected !== false
                      ? 'border-accent bg-accent text-white'
                      : 'border-muted-foreground'
                  )}
                >
                  {suggestion.selected !== false && (
                    <Check className="h-3 w-3" />
                  )}
                </button>

                {/* Editable title */}
                <input
                  type="text"
                  value={suggestion.title}
                  onChange={(e) =>
                    onUpdateSuggestion(index, { title: e.target.value })
                  }
                  className="flex-1 bg-transparent text-sm focus:outline-none focus:border-b focus:border-accent"
                />

                {/* Priority badge */}
                <span
                  className={cn(
                    'flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1',
                    priorityConfig[
                      suggestion.priority as keyof typeof priorityConfig
                    ].bg,
                    priorityConfig[
                      suggestion.priority as keyof typeof priorityConfig
                    ].color
                  )}
                >
                  <Flag className="h-3 w-3" />
                  {
                    priorityConfig[
                      suggestion.priority as keyof typeof priorityConfig
                    ].label
                  }
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md hover:bg-secondary"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={selectedCount === 0}
              className={cn(
                'px-4 py-2 text-sm rounded-md bg-accent text-white',
                'hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              Crear {selectedCount} subtarea{selectedCount !== 1 && 's'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
