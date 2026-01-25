'use client';

import { Mic } from 'lucide-react';
import { useVoiceCoach } from '@/contexts/VoiceCoachContext';
import { cn } from '@/lib/utils';

interface VoiceCoachHeaderButtonProps {
  className?: string;
}

export function VoiceCoachHeaderButton({ className }: VoiceCoachHeaderButtonProps) {
  const { isOpen, toggleCoach, isSupported } = useVoiceCoach();

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleCoach}
      className={cn(
        "p-2 rounded-md transition-colors flex items-center gap-1.5",
        isOpen
          ? "bg-[#b5b76a] text-white"
          : "hover:bg-secondary text-muted-foreground hover:text-foreground",
        className
      )}
      title={isOpen ? 'Cerrar Coach de Voz' : 'Coach de Voz'}
    >
      <Mic className="h-5 w-5" />
      <span className="text-sm font-medium hidden sm:inline">Coach de Voz</span>
    </button>
  );
}
