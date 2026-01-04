'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send, User, Loader2, Sparkles } from 'lucide-react';
import { Task } from '@/lib/tasks';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  task: Task;
  onChatStart?: () => void;
  className?: string;
  showInput?: boolean;
}

export interface AIChatHandle {
  sendMessage: (message: string) => void;
  hasMessages: () => boolean;
}

export const AIChat = forwardRef<AIChatHandle, AIChatProps>(({
  task,
  onChatStart,
  className,
  showInput = true,
}, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Notify parent that chat has started
    onChatStart?.();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          taskContext: {
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            tags: task.tags,
            due_date: task.due_date,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Error al comunicarse con AI');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = (Date.now() + 1).toString();

      // Add empty assistant message
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          assistantContent += decoder.decode(value, { stream: true });
          setMessages(prev =>
            prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
          );
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    sendMessage,
    hasMessages: () => messages.length > 0,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages - Scrollable area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2",
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                message.role === 'user'
                  ? "bg-accent text-white"
                  : "bg-gradient-to-br from-pink-500 to-orange-400"
              )}
            >
              {message.role === 'user' ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-white" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                message.role === 'user'
                  ? "bg-accent text-white"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-orange-400">
              <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
            </div>
            <div className="bg-secondary rounded-lg px-3 py-2">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-xs text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded">
            Error: {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed at bottom */}
      {showInput && (
        <div className="border-t border-border p-3">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <div className="flex items-center gap-2 bg-background rounded-xl px-4 py-3 border border-border">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tell AI what to do next"
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[24px] max-h-[80px]"
                  style={{
                    height: 'auto',
                    overflowY: input.split('\n').length > 2 ? 'auto' : 'hidden',
                  }}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-1.5 rounded-md bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              {/* Gradient bottom border */}
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 rounded-full" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
});

AIChat.displayName = 'AIChat';
