/*
  # Reset Database Schema
  
  This migration drops all existing tables and their dependencies to start fresh.
*/

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS user_schedules CASCADE;
DROP TABLE IF EXISTS training_schedules CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS handle_updated_at CASCADE;

-- Drop existing indexes
DROP INDEX IF EXISTS idx_user_schedules_user_id;
DROP INDEX IF EXISTS idx_user_schedules_schedule_id;
DROP INDEX IF EXISTS idx_training_schedules_day;
DROP INDEX IF EXISTS idx_profiles_role;
DROP INDEX IF EXISTS idx_registrations_user_id;