'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Task } from '@/lib/tasks';

interface AIQuestionSuggestionsProps {
  task: Task;
  onQuestionClick: (question: string) => void;
}

export function AIQuestionSuggestions({ task, onQuestionClick }: AIQuestionSuggestionsProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai/questions', {
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

        if (!response.ok) throw new Error('Failed to generate questions');

        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('No se pudieron generar preguntas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [task.id]); // Re-fetch when task changes

  const visibleQuestions = isExpanded ? questions : questions.slice(0, 3);
  const hasMoreQuestions = questions.length > 3;

  if (error) {
    return null; // Don't show section if there's an error
  }

  return (
    <div className="px-4 py-3">
      <p className="text-xs text-muted-foreground mb-2">Pregunta sobre tu tarea</p>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-5 bg-secondary/50 rounded animate-pulse"
              style={{ width: `${80 - i * 10}%` }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {visibleQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(question)}
              className="flex items-start gap-2 w-full text-left text-sm text-text-secondary hover:text-text-primary transition-colors group py-1"
            >
              <ArrowRight className="h-4 w-4 text-pink-500 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
              <span className="line-clamp-2">{question}</span>
            </button>
          ))}

          {hasMoreQuestions && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs text-pink-500 hover:text-pink-600 mt-2 transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Mostrar menos
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Mostrar más
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
