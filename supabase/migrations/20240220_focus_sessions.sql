-- Create enum for focus session status
CREATE TYPE focus_session_status AS ENUM ('active', 'completed', 'interrupted');

-- Create focus_sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- duration in seconds
    status focus_session_status NOT NULL DEFAULT 'active',
    notes TEXT,
    rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_duration CHECK (duration > 0),
    CONSTRAINT valid_end_time CHECK (end_time >= start_time)
);

-- Create index for faster queries
CREATE INDEX idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX idx_focus_sessions_task_id ON focus_sessions(task_id);
CREATE INDEX idx_focus_sessions_status ON focus_sessions(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_focus_sessions_updated_at
    BEFORE UPDATE ON focus_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for select
CREATE POLICY focus_sessions_select_policy ON focus_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy for insert
CREATE POLICY focus_sessions_insert_policy ON focus_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for update
CREATE POLICY focus_sessions_update_policy ON focus_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for delete
CREATE POLICY focus_sessions_delete_policy ON focus_sessions
    FOR DELETE USING (auth.uid() = user_id); 