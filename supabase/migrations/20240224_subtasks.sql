-- Create subtasks table
CREATE TABLE IF NOT EXISTS subtasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    priority INTEGER NOT NULL DEFAULT 2 CHECK (priority >= 1 AND priority <= 4),
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    ai_generated BOOLEAN DEFAULT FALSE
);

-- Create indexes for performance
CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX idx_subtasks_user_id ON subtasks(user_id);
CREATE INDEX idx_subtasks_task_position ON subtasks(task_id, position);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_subtasks_updated_at
    BEFORE UPDATE ON subtasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Create policy for select
CREATE POLICY subtasks_select_policy ON subtasks
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy for insert
CREATE POLICY subtasks_insert_policy ON subtasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for update
CREATE POLICY subtasks_update_policy ON subtasks
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for delete
CREATE POLICY subtasks_delete_policy ON subtasks
    FOR DELETE USING (auth.uid() = user_id);
