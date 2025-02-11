'use client';

import { useState, useRef, useEffect } from 'react';
import { Task, createTask, TaskStatus } from '@/lib/tasks';
import { getChatResponse } from '@/lib/ai';
import { useAuth } from '@/components/AuthProvider';
import { MessageCircle, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onTaskExtracted?: (taskData: Partial<Task>) => void;
  isActive?: boolean;
}

export default function ChatInterface({ onTaskExtracted, isActive = false }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input when tab becomes active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    if (!user) return;
    
    try {
      const newTask = await createTask({
        user_id: user.id,
        title: taskData.title!,
        description: taskData.description || null,
        priority: taskData.priority || 2,
        due_date: taskData.due_date || null,
        status: TaskStatus.PENDING,
        tags: taskData.tags || [],
        ai_metadata: {},
      });
      
      onTaskExtracted?.(newTask);
      
      const confirmationMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `✅ ¡He creado la tarea &ldquo;${newTask.title}&rdquo; exitosamente! ¿Necesitas algo más?`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, confirmationMessage]);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error creating task:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al crear la tarea. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const thinkingMessage: Message = {
        id: 'thinking',
        role: 'assistant',
        content: '🤔 Pensando...',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, thinkingMessage]);

      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));
      
      const response = await getChatResponse([...chatHistory, {
        role: 'user',
        content: userMessage.content,
      }]);

      // Remove thinking message
      setMessages(prev => prev.filter(m => m.id !== 'thinking'));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      if (response.extractedTask) {
        await handleCreateTask(response.extractedTask);
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => prev.filter(m => m.id !== 'thinking'));
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background dark:bg-background-paper">
      <div className="flex items-center gap-2 border-b border-border dark:border-[#28282F] p-4 flex-shrink-0">
        <div className="rounded-full bg-[#edf6ff] dark:bg-blue-500/5 p-2">
          <MessageCircle className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-sm font-medium text-foreground">AI Assistant</h2>
          <p className="text-xs text-text-secondary">
            Pregúntame sobre la gestión de tus tareas
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Bot className="h-12 w-12 mb-4 text-accent/40" />
              <h3 className="text-lg font-medium mb-2">¡Bienvenido al Asistente de Tareas!</h3>
              <p className="text-sm max-w-md">
                Puedo ayudarte a crear tareas de manera natural. Por ejemplo, escribe:
                &apos;Necesito crear una tarea para estudiar mañana&apos;
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-accent text-white'
                    : message.id === 'thinking'
                    ? 'bg-accent/10 animate-pulse'
                    : 'bg-muted text-foreground dark:bg-secondary'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.id !== 'thinking' && (
                  <span className="mt-1 block text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-border dark:border-[#28282F] p-4 bg-background dark:bg-background-paper">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Escribe tu mensaje...`}
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:bg-background-paper dark:border-[#28282F]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="inline-flex items-center rounded-md border border-transparent bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:bg-accent/70"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <div>Enviar</div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}