-- Update users table to include settings column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'users' 
                  AND column_name = 'settings') THEN
        ALTER TABLE public.users 
        ADD COLUMN settings JSONB NOT NULL DEFAULT '{
            "theme": "system",
            "language": "en",
            "notifications": {
                "email": true,
                "pushNotifications": true,
                "soundEffects": true
            },
            "focusMode": {
                "defaultDuration": 25,
                "autoStartBreaks": false,
                "showMotivationalMessages": true
            },
            "accessibility": {
                "highContrast": false,
                "reducedMotion": false,
                "largeText": false
            },
            "profile": {
                "displayName": "",
                "timeZone": "UTC",
                "weekStartsOn": "monday"
            }
        }'::jsonb;
    END IF;
END $$;

-- Create a function to validate settings JSON
CREATE OR REPLACE FUNCTION validate_user_settings()
RETURNS trigger AS $$
BEGIN
  -- Validate theme
  IF NEW.settings->>'theme' NOT IN ('light', 'dark', 'system') THEN
    RAISE EXCEPTION 'Invalid theme setting';
  END IF;

  -- Validate language
  IF NEW.settings->>'language' NOT IN ('en', 'es') THEN
    RAISE EXCEPTION 'Invalid language setting';
  END IF;

  -- Validate focus mode duration
  IF (NEW.settings->'focusMode'->>'defaultDuration')::int < 1 OR 
     (NEW.settings->'focusMode'->>'defaultDuration')::int > 120 THEN
    RAISE EXCEPTION 'Focus duration must be between 1 and 120 minutes';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for settings validation
DROP TRIGGER IF EXISTS validate_settings ON public.users;
CREATE TRIGGER validate_settings
  BEFORE INSERT OR UPDATE OF settings
  ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION validate_user_settings();

-- Add RLS policies for settings
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings"
ON public.users
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own settings"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);