export interface FocusSession {
  id: string;
  start_time: string;
  duration: number | null;
  status: string;
  notes?: string;
  rating?: number;
}

export interface FocusSessionWithTask extends FocusSession {
  task?: {
    id: string;
    title: string;
    description: string | null;
  } | null;
}

export interface FocusHistoryRef {
  reloadSessions: () => Promise<void>;
  addSession: (session: FocusSessionWithTask) => void;
}