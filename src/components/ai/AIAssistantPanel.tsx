'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send } from 'lucide-react';
import { Task } from '@/lib/tasks';
import { AIChat, AIChatHandle } from './AIChat';
import { AISuggestionChips } from './AISuggestionChips';
import { AIQuestionSuggestions } from './AIQuestionSuggestions';
import { cn } from '@/lib/utils';

interface AIAssistantPanelProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onApplySubtasks?: (subtasks: { title: string; priority: number }[]) => void;
  onApplySuggestions?: (suggestions: { priority?: number; tags?: string[] }) => void;
}

export function AIAssistantPanel({
  task,
  isOpen,
  onClose,
  onApplySubtasks,
  onApplySuggestions,
}: AIAssistantPanelProps) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [suggestedSubtasks, setSuggestedSubtasks] = useState<{ title: string; priority: number }[]>([]);
  const [suggestions, setSuggestions] = useState<{ priority?: number; tags?: string[]; reasoning?: string } | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const chatRef = useRef<AIChatHandle>(null);

  // Send pending message after chat mounts
  useEffect(() => {
    if (pendingMessage && hasInteracted && chatRef.current) {
      chatRef.current.sendMessage(pendingMessage);
      setPendingMessage(null);
    }
  }, [pendingMessage, hasInteracted]);

  const handleGenerateSubtasks = async () => {
    setHasInteracted(true);
    setIsGeneratingSubtasks(true);
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
      setSuggestedSubtasks(data.subtasks || []);
    } catch (error) {
      console.error('Error generating subtasks:', error);
    } finally {
      setIsGeneratingSubtasks(false);
    }
  };

  const handleGenerateSuggestions = async () => {
    setHasInteracted(true);
    setIsGeneratingSuggestions(true);
    try {
      const response = await fetch('/api/ai/suggest', {
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

      if (!response.ok) throw new Error('Failed to generate suggestions');

      const data = await response.json();
      setSuggestions(data.suggestion || null);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const handleApplySubtasks = () => {
    if (onApplySubtasks && suggestedSubtasks.length > 0) {
      onApplySubtasks(suggestedSubtasks);
      setSuggestedSubtasks([]);
    }
  };

  const handleApplySuggestions = () => {
    if (onApplySuggestions && suggestions) {
      onApplySuggestions({
        priority: suggestions.priority,
        tags: suggestions.tags,
      });
      setSuggestions(null);
    }
  };

  const handleQuestionClick = (question: string) => {
    setHasInteracted(true);
    setPendingMessage(question);
  };

  const handleChatStart = () => {
    setHasInteracted(true);
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed right-0 top-0 h-full w-[380px] bg-background-paper border-l border-border shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h2 className="font-semibold text-foreground">Cerebro IA</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Welcome Message - Only show before interaction */}
      {!hasInteracted && (
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm text-text-secondary">
            Hola! Soy tu asistente de productividad. Puedo ayudarte con la tarea &ldquo;{task.title}&rdquo;. Preguntame lo que necesites.
          </p>
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Question Suggestions */}
        <AIQuestionSuggestions task={task} onQuestionClick={handleQuestionClick} />

        {/* Feature Cards (Quick Actions) */}
        <div className="border-t border-border">
          <AISuggestionChips
            onGenerateSubtasks={handleGenerateSubtasks}
            onGenerateSuggestions={handleGenerateSuggestions}
            isLoadingSubtasks={isGeneratingSubtasks}
            isLoadingSuggestions={isGeneratingSuggestions}
          />
        </div>

        {/* Subtasks Suggestions - Show after generating */}
        {suggestedSubtasks.length > 0 && (
          <div className="p-4 border-t border-border bg-purple-50/50 dark:bg-purple-950/20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">Subtareas sugeridas</p>
              <button
                onClick={handleApplySubtasks}
                className="text-xs px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                Crear todas
              </button>
            </div>
            <ul className="space-y-2">
              {suggestedSubtasks.map((subtask, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-foreground bg-background/50 p-2 rounded"
                >
                  <span className={cn(
                    "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                    subtask.priority === 4 && "bg-red-500",
                    subtask.priority === 3 && "bg-orange-500",
                    subtask.priority === 2 && "bg-yellow-500",
                    subtask.priority === 1 && "bg-green-500",
                  )} />
                  <span>{subtask.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Property Suggestions - Show after generating */}
        {suggestions && (
          <div className="p-4 border-t border-border bg-blue-50/50 dark:bg-blue-950/20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">Propiedades sugeridas</p>
              <button
                onClick={handleApplySuggestions}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Aplicar
              </button>
            </div>
            <div className="space-y-2 text-sm">
              {suggestions.priority && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Prioridad:</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    suggestions.priority === 4 && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                    suggestions.priority === 3 && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                    suggestions.priority === 2 && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                    suggestions.priority === 1 && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                  )}>
                    {suggestions.priority === 4 ? 'Urgente' : suggestions.priority === 3 ? 'Alta' : suggestions.priority === 2 ? 'Media' : 'Baja'}
                  </span>
                </div>
              )}
              {suggestions.tags && suggestions.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-muted-foreground">Tags:</span>
                  {suggestions.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {suggestions.reasoning && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  {suggestions.reasoning}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Chat Messages - Show when there are messages */}
        {hasInteracted && (
          <div className="border-t border-border">
            <AIChat ref={chatRef} task={task} onChatStart={handleChatStart} showInput={false} />
          </div>
        )}
      </div>

      {/* Input - Always visible at bottom */}
      <div className="p-3 border-t border-border">
        <div className="relative">
          <div className="flex items-center gap-2 bg-background rounded-xl px-4 py-3 border border-border">
            <input
              type="text"
              placeholder="Dile a la IA qué hacer"
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  handleQuestionClick(e.currentTarget.value.trim());
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              type="button"
              className="p-1.5 rounded-md bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:opacity-90 transition-opacity"
              onClick={(e) => {
                const input = e.currentTarget.parentElement?.querySelector('input');
                if (input && input.value.trim()) {
                  handleQuestionClick(input.value.trim());
                  input.value = '';
                }
              }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          {/* Gradient bottom border */}
          <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 rounded-full" />
        </div>
      </div>
    </aside>
  );
}
