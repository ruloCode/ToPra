'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (tasks.length > 0) {
      loadSuggestions();
    }
  }, [tasks]);

  const loadSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextTask = await suggestNextTask(tasks);
      setSuggestedTask(nextTask);
    } catch (err) {
      setError('Failed to load AI suggestions');
      console.error('Error loading suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzePriority = async (task: Task) => {
    setIsLoading(true);
    try {
      const analysis = await analyzePriority(task);
      if (analysis.suggestedPriority !== task.priority) {
        const shouldUpdate = window.confirm(
          `AI suggests changing priority from ${task.priority} to ${analysis.suggestedPriority}.\n\nReasoning: ${analysis.reasoning}\n\nWould you like to update the priority?`
        );
        if (shouldUpdate && onPriorityUpdate) {
          onPriorityUpdate(task.id, analysis.suggestedPriority);
        }
      }
    } catch (err) {
      setError('Failed to analyze task priority');
      console.error('Error analyzing priority:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-sm text-gray-500">AI is thinking...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={loadSuggestions}
          className="mt-2 text-sm text-red-600 hover:text-red-500"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {suggestedTask && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-900">AI Suggestion</h3>
          <p className="mt-1 text-sm text-gray-500">
            Based on your current tasks, I suggest working on:
          </p>
          <div className="mt-3 rounded-md bg-gray-50 p-3">
            <div className="font-medium text-gray-900">{suggestedTask.title}</div>
            {suggestedTask.description && (
              <p className="mt-1 text-sm text-gray-500">{suggestedTask.description}</p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => handleAnalyzePriority(suggestedTask)}
                className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Analyze Priority
              </button>
              <button
                onClick={loadSuggestions}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Get Another Suggestion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 