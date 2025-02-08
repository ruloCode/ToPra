import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for type-safe database operations
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
          last_login: string | null;
          settings: { [key: string]: string | number | boolean };
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          priority: number;
          due_date: string | null;
          status: string;
          created_at: string;
          updated_at: string;
          ai_metadata: { [key: string]: string | number | boolean };
          tags: string[];
        };
      };
      focus_sessions: {
        Row: {
          id: string;
          user_id: string;
          task_id: string | null;
          start_time: string;
          end_time: string | null;
          duration: number | null;
          status: string;
          notes: string | null;
          rating: number | null;
        };
      };
    };
  };
}; 