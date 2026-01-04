'use client';

import { Loader2, ListTodo, Wand2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AISuggestionChipsProps {
  onGenerateSubtasks: () => void;
  onGenerateSuggestions: () => void;
  isLoadingSubtasks?: boolean;
  isLoadingSuggestions?: boolean;
}

interface FeatureCardProps {
  onClick: () => void;
  isLoading?: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
}

function FeatureCard({ onClick, isLoading, icon, title, description, iconBgColor }: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left",
        "bg-background-elevated hover:bg-secondary/50",
        "border border-transparent hover:border-border/50",
        "disabled:opacity-50 disabled:cursor-not-allowed group"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
        iconBgColor
      )}>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        ) : (
          icon
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-xs text-text-secondary truncate">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-text-disabled group-hover:text-text-secondary transition-colors flex-shrink-0" />
    </button>
  );
}

export function AISuggestionChips({
  onGenerateSubtasks,
  onGenerateSuggestions,
  isLoadingSubtasks,
  isLoadingSuggestions,
}: AISuggestionChipsProps) {
  return (
    <div className="px-4 py-3">
      <p className="text-xs text-muted-foreground mb-3">Funciones</p>
      <div className="space-y-2">
        <FeatureCard
          onClick={onGenerateSubtasks}
          isLoading={isLoadingSubtasks}
          icon={<ListTodo className="h-5 w-5 text-white" />}
          title="Generar subtareas"
          description="Divide la tarea en pasos accionables"
          iconBgColor="bg-purple-500"
        />

        <FeatureCard
          onClick={onGenerateSuggestions}
          isLoading={isLoadingSuggestions}
          icon={<Wand2 className="h-5 w-5 text-white" />}
          title="Sugerir propiedades"
          description="Prioridad, tags y tiempo estimado"
          iconBgColor="bg-blue-500"
        />
      </div>
    </div>
  );
}
