/*
  # Add Stored Procedure for Safe Schedule Deletion
  
  1. Create a stored procedure to handle schedule deletion
    - Ensures atomic transaction
    - Handles cascade deletion properly
    - Maintains data integrity
*/

-- Create function to safely delete schedule and related records
CREATE OR REPLACE FUNCTION delete_schedule(schedule_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete all related user schedules first
  DELETE FROM user_schedules
  WHERE schedule_id = $1;

  -- Delete the schedule
  DELETE FROM training_schedules
  WHERE id = $1;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_schedule TO authenticated;