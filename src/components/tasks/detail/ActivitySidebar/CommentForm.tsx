'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
}

export function CommentForm({
  onSubmit,
  isLoading = false,
  placeholder = 'Escribe un comentario...',
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!content.trim() || isLoading) return;

    await onSubmit(content.trim());
    setContent('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Nuevo comentario
      </label>
      <div className="relative flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={2}
          className={cn(
            "flex-1 resize-none rounded-lg px-3 py-2.5",
            "border-2 border-border/50 dark:border-white/20",
            "bg-white dark:bg-white/10",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200"
          )}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
          className={cn(
            "flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center",
            "bg-accent text-white",
            "hover:bg-accent/90",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
            "transition-all duration-200"
          )}
          title="Enviar (Ctrl+Enter)"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground">
        Presiona <kbd className="px-1 py-0.5 bg-white/10 dark:bg-white/20 rounded text-[9px] font-mono">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-white/10 dark:bg-white/20 rounded text-[9px] font-mono">Enter</kbd> para enviar
      </p>
    </div>
  );
}
