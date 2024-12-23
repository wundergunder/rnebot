/*
  # Add License Details to Profile Skills

  1. Changes
    - Add license_number column to profile_skills
    - Add license_expiry_date column to profile_skills
    - Add license_image_path column to profile_skills

  2. Notes
    - Using IF NOT EXISTS to prevent errors if columns already exist
    - license_expiry_date uses DATE type for proper date handling
    - license_image_path stores the path to uploaded license images
*/

-- Add new columns to profile_skills if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profile_skills' AND column_name = 'license_number'
  ) THEN
    ALTER TABLE profile_skills ADD COLUMN license_number TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profile_skills' AND column_name = 'license_expiry_date'
  ) THEN
    ALTER TABLE profile_skills ADD COLUMN license_expiry_date DATE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profile_skills' AND column_name = 'license_image_path'
  ) THEN
    ALTER TABLE profile_skills ADD COLUMN license_image_path TEXT;
  END IF;
END $$;