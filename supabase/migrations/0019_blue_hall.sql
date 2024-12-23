-- Drop existing enum type (cascade will remove it from the profiles table)
DROP TYPE IF EXISTS expertise_level CASCADE;

-- Create new enum type with correct values
CREATE TYPE expertise_level AS ENUM (
  'labourer',
  'apprentice',
  'journeyman',
  'foreman'
);

-- Add expertise_level column back to profiles table
ALTER TABLE profiles ADD COLUMN expertise_level expertise_level;