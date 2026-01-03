export interface Comment {
  id: string;
  user_id: string;
  task_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentInput {
  user_id: string;
  task_id: string;
  content: string;
}

export interface UpdateCommentInput {
  content: string;
}
