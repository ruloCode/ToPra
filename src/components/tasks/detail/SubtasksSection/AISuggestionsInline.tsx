'use client';

import { Sparkles, Flag, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubtaskSuggestion } from '@/types/subtasks';

interface AISuggestionsInlineProps {
  suggestions: SubtaskSuggestion[];
  onClose: () => void;
  onApply: (suggestions: SubtaskSuggestion[]) => void;
  onUpdateSuggestion: (index: number, updates: Partial<SubtaskSuggestion>) => void;
}

const priorityConfig = {
  1: { label: 'Baja', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
  2: { label: 'Media', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  3: { label: 'Alta', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  4: { label: 'Urgente', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
};

export function AISuggestionsInline({
  suggestions,
  onClose,
  onApply,
  onUpdateSuggestion,
}: AISuggestionsInlineProps) {
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
    <div className="rounded-lg border-2 border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-950/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span className="font-medium text-purple-700 dark:text-purple-300">
            Sugerencias de IA
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 rounded"
        >
          <X className="h-4 w-4 text-purple-500" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Select all */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {selectedCount} de {suggestions.length} seleccionadas
          </span>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
          >
            {suggestions.every((s) => s.selected !== false)
              ? 'Deseleccionar todas'
              : 'Seleccionar todas'}
          </button>
        </div>

        {/* Suggestions list */}
        <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                suggestion.selected !== false
                  ? 'border-purple-300 dark:border-purple-700 bg-white dark:bg-purple-950/80'
                  : 'border-border bg-muted/30 dark:bg-gray-900/50 opacity-60'
              )}
            >
              {/* Checkbox */}
              <button
                type="button"
                onClick={() =>
                  onUpdateSuggestion(index, { selected: suggestion.selected === false })
                }
                className={cn(
                  'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                  suggestion.selected !== false
                    ? 'border-purple-500 bg-purple-500 text-white'
                    : 'border-muted-foreground'
                )}
              >
                {suggestion.selected !== false && <Check className="h-3 w-3" />}
              </button>

              {/* Editable title */}
              <input
                type="text"
                value={suggestion.title}
                onChange={(e) => onUpdateSuggestion(index, { title: e.target.value })}
                className="flex-1 bg-transparent text-sm text-foreground focus:outline-none"
              />

              {/* Priority badge */}
              <span
                className={cn(
                  'flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1',
                  priorityConfig[suggestion.priority as keyof typeof priorityConfig].bg,
                  priorityConfig[suggestion.priority as keyof typeof priorityConfig].color
                )}
              >
                <Flag className="h-3 w-3" />
                {priorityConfig[suggestion.priority as keyof typeof priorityConfig].label}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-purple-200 dark:border-purple-800">
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
            className="px-4 py-2 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Crear {selectedCount} subtarea{selectedCount !== 1 && 's'}
          </button>
        </div>
      </div>
    </div>
  );
}
