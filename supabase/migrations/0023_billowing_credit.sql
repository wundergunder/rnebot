/*
  # Update Project Schema

  1. Changes
    - Add new fields for project tracking
    - Update project stage and type enums
    - Add tools needed array

  2. New Fields
    - work_order: Text field for work order number
    - stage: Updated enum for project stages
    - project_type: Updated enum for project types
    - expected_hours: Integer for expected hours (nullable)
    - tools_needed: Text array for required tools
*/

-- Drop existing type if exists
DROP TYPE IF EXISTS project_stage CASCADE;
DROP TYPE IF EXISTS project_type CASCADE;

-- Create updated enum types
CREATE TYPE project_stage AS ENUM (
  'estimate',
  'parts_ordered',
  'appointment_booked',
  'onsite',
  'complete'
);

CREATE TYPE project_type AS ENUM (
  'shop',
  'site',
  'service'
);

-- Update projects table
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS work_order TEXT,
  ADD COLUMN IF NOT EXISTS stage project_stage DEFAULT 'estimate',
  ADD COLUMN IF NOT EXISTS project_type project_type DEFAULT 'shop',
  ADD COLUMN IF NOT EXISTS expected_hours INTEGER,
  ADD COLUMN IF NOT EXISTS tools_needed TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Add not null constraints after adding columns
ALTER TABLE projects
  ALTER COLUMN work_order SET NOT NULL,
  ALTER COLUMN stage SET NOT NULL,
  ALTER COLUMN project_type SET NOT NULL;

-- Create index for work order lookups
CREATE INDEX IF NOT EXISTS idx_projects_work_order ON projects(work_order);