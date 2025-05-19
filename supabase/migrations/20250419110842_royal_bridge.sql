/*
  # Add Profile Photo Support
  
  1. Changes
    - Add profile_photo column to profiles table
    - Add policies for photo access and management
*/

-- Add profile_photo column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS profile_photo text;

-- Create RLS policy for profile photo updates
CREATE POLICY "Users can update their own profile photo"
ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create index for faster photo lookups
CREATE INDEX IF NOT EXISTS idx_profiles_photo ON profiles(profile_photo);