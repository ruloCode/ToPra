'use client';

import { Subtask } from '@/types/subtasks';
import { SubtaskItem } from './SubtaskItem';

interface SubtasksListProps {
  subtasks: Subtask[];
  onToggleStatus: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Subtask>) => void;
  onDelete: (id: string) => void;
}

export function SubtasksList({
  subtasks,
  onToggleStatus,
  onUpdate,
  onDelete,
}: SubtasksListProps) {
  return (
    <div className="space-y-1">
      {subtasks.map((subtask) => (
        <SubtaskItem
          key={subtask.id}
          subtask={subtask}
          onToggleStatus={onToggleStatus}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
