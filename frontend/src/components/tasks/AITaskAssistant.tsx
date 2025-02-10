'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/lib/tasks';
import { analyzePriority, suggestNextTask } from '@/lib/ai';

interface AITaskAssistantProps {
  tasks: Task[];
  onPriorityUpdate?: (taskId: string, priority: number) => void;
}

export default function AITaskAssistant({ tasks, onPriorityUpdate }: AITaskAssistantProps) {
  const [suggestedTask, setSuggestedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const loadSuggestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextTask = await suggestNextTask(tasks);
      setSuggestedTask(nextTask);
    } catch (err) {
      setError('Error al cargar sugerencias');
      console.error('Error loading suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [tasks]);

  useEffect(() => {
    if (tasks.length > 0) {
      loadSuggestions();
    }
  }, [tasks, loadSuggestions]);

  const handleAnalyzePriority = async (task: Task) => {
    setIsLoading(true);
    try {
      const analysis = await analyzePriority(task);
      if (analysis.suggestedPriority !== task.priority) {
        const shouldUpdate = window.confirm(
          `AI sugiere cambiar la prioridad de ${task.priority} a ${analysis.suggestedPriority}.\n\nRazón: ${analysis.reasoning}\n\n¿Deseas actualizar la prioridad?`
        );
        if (shouldUpdate && onPriorityUpdate) {
          onPriorityUpdate(task.id, analysis.suggestedPriority);
        }
      }
    } catch (err) {
      setError('Error al analizar la prioridad');
      console.error('Error analyzing priority:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed left-4 top-4 z-10 rounded-lg border bg-white p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
          <span className="text-xs text-gray-500">Analizando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed left-4 top-4 z-10 rounded-lg border border-red-200 bg-red-50 p-2">
        <p className="text-xs text-red-600">{error}</p>
        <button
          onClick={loadSuggestions}
          className="mt-1 text-xs text-red-600 hover:text-red-500"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="fixed left-4 top-4 z-10">
      <div 
        className={`rounded-lg border bg-white shadow-sm transition-all duration-200 ${
          isExpanded ? 'w-64 p-4' : 'w-auto p-2'
        }`}
      >
        {isExpanded ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Asistente IA</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {suggestedTask && (
              <div className="mt-3">
                <p className="text-xs text-gray-500">Sugerencia:</p>
                <div className="mt-1 rounded-md bg-gray-50 p-2">
                  <div className="text-sm font-medium text-gray-900">{suggestedTask.title}</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleAnalyzePriority(suggestedTask)}
                      className="rounded bg-indigo-600 px-2 py-1 text-xs text-white hover:bg-indigo-700"
                    >
                      Analizar Prioridad
                    </button>
                    <button
                      onClick={loadSuggestions}
                      className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 rounded-md p-1 text-gray-600 hover:text-gray-900"
            title="Asistente IA"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            {suggestedTask && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}