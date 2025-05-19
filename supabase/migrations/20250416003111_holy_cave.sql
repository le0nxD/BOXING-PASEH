/*
  # Add Registration and Training Schedule Fields

  1. Changes to profiles table
    - Add training schedule fields
    - Add emergency contact information
    - Add training preferences

  2. New Tables
    - `training_schedules`
      - `id` (uuid, primary key)
      - `day_of_week` (text)
      - `start_time` (time)
      - `end_time` (time)
      - `description` (text)
      - `max_capacity` (integer)

    - `user_schedules`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `schedule_id` (uuid, references training_schedules)
      - `status` (text)
      - `created_at` (timestamptz)

  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Add new columns to profiles table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'emergency_contact_name') THEN
    ALTER TABLE profiles ADD COLUMN emergency_contact_name text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'emergency_contact_phone') THEN
    ALTER TABLE profiles ADD COLUMN emergency_contact_phone text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'blood_type') THEN
    ALTER TABLE profiles ADD COLUMN blood_type text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'medical_conditions') THEN
    ALTER TABLE profiles ADD COLUMN medical_conditions text[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'training_goals') THEN
    ALTER TABLE profiles ADD COLUMN training_goals text[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'preferred_training_time') THEN
    ALTER TABLE profiles ADD COLUMN preferred_training_time text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'training_experience') THEN
    ALTER TABLE profiles ADD COLUMN training_experience text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_active') THEN
    ALTER TABLE profiles ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END $$;

-- Create training schedules table if it doesn't exist
CREATE TABLE IF NOT EXISTS training_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  description text,
  max_capacity integer DEFAULT 20,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user schedules table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  schedule_id uuid REFERENCES training_schedules(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, schedule_id)
);

-- Enable RLS
ALTER TABLE training_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_schedules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Training schedules are viewable by everyone" ON training_schedules;
DROP POLICY IF EXISTS "Only admins can insert training schedules" ON training_schedules;
DROP POLICY IF EXISTS "Only admins can update training schedules" ON training_schedules;
DROP POLICY IF EXISTS "Users can view their own schedules" ON user_schedules;
DROP POLICY IF EXISTS "Users can insert their own schedules" ON user_schedules;
DROP POLICY IF EXISTS "Users can update their own schedules" ON user_schedules;
DROP POLICY IF EXISTS "Admins can view all schedules" ON user_schedules;

-- Create policies
CREATE POLICY "Training schedules are viewable by everyone"
  ON training_schedules
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert training schedules"
  ON training_schedules
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update training schedules"
  ON training_schedules
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view their own schedules"
  ON user_schedules
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own schedules"
  ON user_schedules
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules"
  ON user_schedules
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all schedules"
  ON user_schedules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert default training schedules if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM training_schedules WHERE day_of_week = 'Monday') THEN
    INSERT INTO training_schedules (day_of_week, start_time, end_time, description) VALUES
      ('Monday', '06:00'::time, '21:00'::time, 'Weekday training session');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM training_schedules WHERE day_of_week = 'Tuesday') THEN
    INSERT INTO training_schedules (day_of_week, start_time, end_time, description) VALUES
      ('Tuesday', '06:00'::time, '21:00'::time, 'Weekday training session');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM training_schedules WHERE day_of_week = 'Wednesday') THEN
    INSERT INTO training_schedules (day_of_week, start_time, end_time, description) VALUES
      ('Wednesday', '06:00'::time, '21:00'::time, 'Weekday training session');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM training_schedules WHERE day_of_week = 'Thursday') THEN
    INSERT INTO training_schedules (day_of_week, start_time, end_time, description) VALUES
      ('Thursday', '06:00'::time, '21:00'::time, 'Weekday training session');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM training_schedules WHERE day_of_week = 'Friday') THEN
    INSERT INTO training_schedules (day_of_week, start_time, end_time, description) VALUES
      ('Friday', '06:00'::time, '21:00'::time, 'Weekday training session');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM training_schedules WHERE day_of_week = 'Saturday') THEN
    INSERT INTO training_schedules (day_of_week, start_time, end_time, description) VALUES
      ('Saturday', '07:00'::time, '18:00'::time, 'Weekend training session');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM training_schedules WHERE day_of_week = 'Sunday') THEN
    INSERT INTO training_schedules (day_of_week, start_time, end_time, description) VALUES
      ('Sunday', '08:00'::time, '15:00'::time, 'Weekend training session');
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_schedules_user_id ON user_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_user_schedules_schedule_id ON user_schedules(schedule_id);
CREATE INDEX IF NOT EXISTS idx_training_schedules_day ON training_schedules(day_of_week);

-- Create or replace function for handling updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_training_schedules_updated_at ON training_schedules;
DROP TRIGGER IF EXISTS update_user_schedules_updated_at ON user_schedules;

-- Create triggers for updated_at
CREATE TRIGGER update_training_schedules_updated_at
  BEFORE UPDATE ON training_schedules
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_user_schedules_updated_at
  BEFORE UPDATE ON user_schedules
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();