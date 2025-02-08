'use client';

import { Plus } from 'lucide-react';
import { useTaskModal } from '@/contexts/TaskModalContext';

export default function FloatingActionButton() {
  const { openCreateTaskModal } = useTaskModal();

  return (
    <button
      onClick={openCreateTaskModal}
      className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg hover:bg-accent/90 transition-colors duration-200 sm:bottom-8"
    >
      <Plus className="h-6 w-6" />
    </button>
  );
} 