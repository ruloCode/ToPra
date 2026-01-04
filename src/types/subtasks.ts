export interface Subtask {
  id: string;
  user_id: string;
  task_id: string;
  title: string;
  status: SubtaskStatus;
  priority: number;
  position: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  ai_generated: boolean;
}

export type SubtaskStatus = 'pending' | 'in_progress' | 'completed';

export const SubtaskStatusEnum = {
  PENDING: 'pending' as const,
  IN_PROGRESS: 'in_progress' as const,
  COMPLETED: 'completed' as const,
} as const;

export interface CreateSubtaskInput {
  user_id: string;
  task_id: string;
  title: string;
  priority?: number;
  position?: number;
  ai_generated?: boolean;
}

export interface UpdateSubtaskInput {
  title?: string;
  status?: SubtaskStatus;
  priority?: number;
  position?: number;
  completed_at?: string | null;
}

export interface SubtaskSuggestion {
  title: string;
  priority: number;
  selected?: boolean;
}
