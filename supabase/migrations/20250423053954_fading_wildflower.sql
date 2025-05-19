/*
  # Add delete_schedule function

  1. New Function
    - `delete_schedule(schedule_id uuid)`
      - Deletes a schedule and its associated user schedules
      - Returns void
      - Handles cascading deletion of related records

  2. Security
    - Function is accessible only to authenticated users
    - Checks if the user has admin role before deletion
*/

CREATE OR REPLACE FUNCTION public.delete_schedule(schedule_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can delete schedules';
  END IF;

  -- Delete the schedule (user_schedules will be deleted automatically due to CASCADE)
  DELETE FROM training_schedules
  WHERE id = schedule_id;
END;
$$;