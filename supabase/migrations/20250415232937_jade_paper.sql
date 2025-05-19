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
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS blood_type text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS medical_conditions text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS training_goals text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_training_time text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS training_experience text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create training schedules table
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

-- Create user schedules table
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

-- Policies for training_schedules
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

-- Policies for user_schedules
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

-- Insert default training schedules
INSERT INTO training_schedules (day_of_week, start_time, end_time, description) VALUES
  ('Monday', '06:00', '21:00', 'Weekday training session'),
  ('Tuesday', '06:00', '21:00', 'Weekday training session'),
  ('Wednesday', '06:00', '21:00', 'Weekday training session'),
  ('Thursday', '06:00', '21:00', 'Weekday training session'),
  ('Friday', '06:00', '21:00', 'Weekday training session'),
  ('Saturday', '07:00', '18:00', 'Weekend training session'),
  ('Sunday', '08:00', '15:00', 'Weekend training session');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_schedules_user_id ON user_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_user_schedules_schedule_id ON user_schedules(schedule_id);
CREATE INDEX IF NOT EXISTS idx_training_schedules_day ON training_schedules(day_of_week);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_training_schedules_updated_at
  BEFORE UPDATE ON training_schedules
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_user_schedules_updated_at
  BEFORE UPDATE ON user_schedules
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();