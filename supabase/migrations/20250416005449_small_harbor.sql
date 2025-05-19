/*
  # Synchronize Registration and Profile Schema
  
  1. Profile Table Structure
    - Basic information (name, role, etc.)
    - Personal details (gender, birth date, etc.)
    - Physical information (height, weight)
    - Contact information (whatsapp, instagram, address)
    - Training preferences
    - Achievements and progress tracking
    
  2. Security
    - RLS policies for data access
    - Proper indexing for performance
*/

-- Drop existing tables to ensure clean slate
DROP TABLE IF EXISTS user_schedules CASCADE;
DROP TABLE IF EXISTS training_schedules CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table with all necessary fields
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  role text DEFAULT 'athlete',
  gender text,
  occupation text,
  institution text,
  birth_date date,
  height integer,
  weight integer,
  whatsapp text,
  instagram text,
  address text,
  training_location text DEFAULT 'sasana',
  achievements jsonb[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create training schedules table
CREATE TABLE training_schedules (
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
CREATE TABLE user_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  schedule_id uuid REFERENCES training_schedules(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, schedule_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_schedules ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Training Schedule Policies
CREATE POLICY "Training schedules are viewable by everyone"
  ON training_schedules FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert training schedules"
  ON training_schedules FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update training schedules"
  ON training_schedules FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- User Schedule Policies
CREATE POLICY "Users can view their own schedules"
  ON user_schedules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own schedules"
  ON user_schedules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules"
  ON user_schedules FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all schedules"
  ON user_schedules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create updated_at function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_training_schedules_updated_at
  BEFORE UPDATE ON training_schedules
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_user_schedules_updated_at
  BEFORE UPDATE ON user_schedules
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better query performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_user_schedules_user_id ON user_schedules(user_id);
CREATE INDEX idx_user_schedules_schedule_id ON user_schedules(schedule_id);
CREATE INDEX idx_training_schedules_day ON training_schedules(day_of_week);

-- Insert default training schedules
INSERT INTO training_schedules (day_of_week, start_time, end_time, description) VALUES
  ('Monday', '06:00', '21:00', 'Weekday training session'),
  ('Tuesday', '06:00', '21:00', 'Weekday training session'),
  ('Wednesday', '06:00', '21:00', 'Weekday training session'),
  ('Thursday', '06:00', '21:00', 'Weekday training session'),
  ('Friday', '06:00', '21:00', 'Weekday training session'),
  ('Saturday', '07:00', '18:00', 'Weekend training session'),
  ('Sunday', '08:00', '15:00', 'Weekend training session');