/*
  # Update Training Schedules to Indonesian Day Names
  
  1. Changes
    - Update day names to Indonesian
    - Reorder days starting from Monday (Senin)
    - Keep existing time slots and descriptions
*/

-- First, delete existing schedules
DELETE FROM training_schedules;

-- Insert schedules with Indonesian day names in correct order
INSERT INTO training_schedules (day_of_week, start_time, end_time, description) VALUES
  ('Senin', '06:00', '21:00', 'Jadwal latihan hari kerja'),
  ('Selasa', '06:00', '21:00', 'Jadwal latihan hari kerja'),
  ('Rabu', '06:00', '21:00', 'Jadwal latihan hari kerja'),
  ('Kamis', '06:00', '21:00', 'Jadwal latihan hari kerja'),
  ('Jumat', '06:00', '21:00', 'Jadwal latihan hari kerja'),
  ('Sabtu', '07:00', '18:00', 'Jadwal latihan akhir pekan'),
  ('Minggu', '08:00', '15:00', 'Jadwal latihan akhir pekan');