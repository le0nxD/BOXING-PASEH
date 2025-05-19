/*
  # Add Admin Management Features

  1. Changes
    - Add admin-specific policies for managing users
    - Add policy for admins to update user roles
*/

-- Add admin management policies
CREATE POLICY "Admins can update any profile"
  ON profiles
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can delete profiles"
  ON profiles
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Add index for role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);