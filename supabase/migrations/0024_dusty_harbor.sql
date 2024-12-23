/*
  # Add Project Management Tables

  1. New Tables
    - `projects`
      - Basic project information including work order, client, type, stage
    - `project_assignments`
      - Links workers to projects
    - `project_tools`
      - Tools required for projects
  
  2. Security
    - Enable RLS on all tables
    - Add policies for managers and admins
*/

-- Create project_assignments table if it doesn't exist
CREATE TABLE IF NOT EXISTS project_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, worker_id)
);

-- Create project_tools table if it doesn't exist
CREATE TABLE IF NOT EXISTS project_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tools ENABLE ROW LEVEL SECURITY;

-- Project assignments policies
CREATE POLICY "Allow managers to manage project assignments"
  ON project_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'manager' OR profiles.role = 'admin')
    )
  );

CREATE POLICY "Allow workers to view their assignments"
  ON project_assignments FOR SELECT
  USING (
    worker_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'manager' OR profiles.role = 'admin')
    )
  );

-- Project tools policies
CREATE POLICY "Allow managers to manage project tools"
  ON project_tools FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'manager' OR profiles.role = 'admin')
    )
  );

CREATE POLICY "Allow workers to view project tools"
  ON project_tools FOR SELECT
  USING (auth.uid() IS NOT NULL);