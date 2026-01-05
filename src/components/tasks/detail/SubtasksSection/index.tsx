'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Subtask, SubtaskSuggestion } from '@/types/subtasks';
import { SubtasksList } from './SubtasksList';
import { SubtaskInput } from './SubtaskInput';
import { AISuggestionsInline } from './AISuggestionsInline';
import { SubtasksProgress } from './SubtasksProgress';

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: number;
  status: string;
  tags: string[];
}

interface SubtasksSectionProps {
  task: Task;
  subtasks: Subtask[];
  isLoading: boolean;
  completedCount: number;
  totalCount: number;
  onAddSubtask: (title: string, priority?: number) => Promise<void>;
  onAddFromAI: (suggestions: SubtaskSuggestion[]) => Promise<void>;
  onToggleStatus: (id: string) => Promise<void>;
  onUpdateSubtask: (id: string, updates: Partial<Subtask>) => Promise<void>;
  onDeleteSubtask: (id: string) => Promise<void>;
}

export function SubtasksSection({
  task,
  subtasks,
  isLoading,
  completedCount,
  totalCount,
  onAddSubtask,
  onAddFromAI,
  onToggleStatus,
  onUpdateSubtask,
  onDeleteSubtask,
}: SubtasksSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<SubtaskSuggestion[]>([]);

  const handleGenerateAISuggestions = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/ai/subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: {
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            tags: task.tags,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to generate subtasks');

      const data = await response.json();
      // Add selected: true to all suggestions by default
      const suggestions = (data.subtasks || []).map((s: SubtaskSuggestion) => ({
        ...s,
        selected: true,
      }));
      setAISuggestions(suggestions);
      setShowAISuggestions(true);
    } catch (error) {
      console.error('Error generating AI subtasks:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleApplyAISuggestions = async (suggestions: SubtaskSuggestion[]) => {
    await onAddFromAI(suggestions);
    setShowAISuggestions(false);
    setAISuggestions([]);
  };

  const handleCloseAISuggestions = () => {
    setShowAISuggestions(false);
    setAISuggestions([]);
  };

  return (
    <div className="mt-6 border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-secondary/50 transition-colors',
          isExpanded && 'border-b border-border'
        )}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-medium text-foreground">Subtareas</span>
          {totalCount > 0 && (
            <span className="text-sm text-muted-foreground">
              ({completedCount}/{totalCount})
            </span>
          )}
        </div>

        {totalCount > 0 && (
          <SubtasksProgress completed={completedCount} total={totalCount} />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 bg-card/50 space-y-4">
          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
                'bg-secondary hover:bg-secondary/80 text-foreground'
              )}
            >
              <Plus className="h-4 w-4" />
              Agregar subtarea
            </button>

            <button
              type="button"
              onClick={handleGenerateAISuggestions}
              disabled={isGeneratingAI}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
                'bg-purple-100 hover:bg-purple-200 text-purple-700',
                'dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:text-purple-400',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isGeneratingAI ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Sugerir subtareas
            </button>
          </div>

          {/* Manual input form */}
          {showAddForm && (
            <SubtaskInput
              onAdd={onAddSubtask}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {/* AI Suggestions inline */}
          {showAISuggestions && aiSuggestions.length > 0 && (
            <AISuggestionsInline
              suggestions={aiSuggestions}
              onClose={handleCloseAISuggestions}
              onApply={handleApplyAISuggestions}
              onUpdateSuggestion={(index, updates) => {
                setAISuggestions((prev) =>
                  prev.map((s, i) => (i === index ? { ...s, ...updates } : s))
                );
              }}
            />
          )}

          {/* Subtasks list */}
          {isLoading ? (
            <div className="py-4 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            </div>
          ) : subtasks.length > 0 ? (
            <SubtasksList
              subtasks={subtasks}
              onToggleStatus={onToggleStatus}
              onUpdate={onUpdateSubtask}
              onDelete={onDeleteSubtask}
            />
          ) : (
            !showAddForm && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay subtareas. Agrega una manualmente o genera sugerencias
                con IA.
              </p>
            )
          )}
        </div>
      )}

    </div>
  );
}
