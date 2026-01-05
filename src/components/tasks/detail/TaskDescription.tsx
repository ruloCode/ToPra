'use client';

import { useState, useEffect, useRef } from 'react';
import { Edit2Icon, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface TaskDescriptionProps {
  description: string | null;
  onSave: (newDescription: string) => Promise<void>;
  isLoading?: boolean;
}

const MAX_COLLAPSED_HEIGHT = 200; // px

export function TaskDescription({ description, onSave, isLoading = false }: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState(description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDescriptionInput(description || '');
  }, [description]);

  // Measure content height to determine if truncation is needed
  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setNeedsTruncation(contentHeight > MAX_COLLAPSED_HEIGHT);
    }
  }, [description]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(descriptionInput);
      setIsEditing(false);
    } catch {
      setDescriptionInput(description || '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDescriptionInput(description || '');
  };

  if (isEditing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Descripcion</h2>
        </div>
        <textarea
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          className="w-full min-h-[200px] p-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-y"
          placeholder="Describe la tarea... (soporta Markdown)"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1.5 text-sm rounded-md border border-border bg-background hover:bg-secondary/50"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 text-sm rounded-md bg-accent text-white hover:bg-accent/90"
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Descripcion</h2>
        <button
          type="button"
          onClick={() => !isLoading && setIsEditing(true)}
          className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Editar descripcion"
        >
          <Edit2Icon className="h-4 w-4" />
        </button>
      </div>

      {description ? (
        <div className="relative">
          <div
            ref={contentRef}
            className={cn(
              "prose prose-sm dark:prose-invert max-w-none",
              "prose-headings:text-foreground prose-p:text-foreground/80",
              "prose-a:text-accent prose-strong:text-foreground",
              "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
              "prose-pre:bg-muted prose-pre:border prose-pre:border-border",
              "prose-ul:text-foreground/80 prose-ol:text-foreground/80",
              "prose-li:marker:text-muted-foreground",
              "transition-all duration-300 ease-in-out overflow-hidden",
              !isExpanded && needsTruncation
                ? "max-h-[200px]"
                : "max-h-[5000px]"
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {description}
            </ReactMarkdown>
          </div>

          {/* Gradient overlay */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-16",
              "bg-gradient-to-t from-background via-background/80 to-transparent",
              "pointer-events-none transition-opacity duration-300",
              !isExpanded && needsTruncation ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Show more/less button */}
          {needsTruncation && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className={cn(
                "flex items-center justify-center gap-2 w-full",
                "px-3 py-2 mt-3 rounded-md",
                "text-sm font-medium text-muted-foreground",
                "bg-secondary/30 hover:bg-secondary/50",
                "border border-border/50",
                "transition-all duration-200",
                "hover:text-foreground"
              )}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span>Ver menos</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span>Ver mas</span>
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => !isLoading && setIsEditing(true)}
          className="w-full p-4 text-sm text-muted-foreground border border-dashed border-border rounded-lg hover:border-accent/50 hover:text-foreground transition-colors text-center"
        >
          Agregar descripcion...
        </button>
      )}
    </div>
  );
}
