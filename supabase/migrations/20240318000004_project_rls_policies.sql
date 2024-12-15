-- Enable RLS on project-related tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_requirements ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Anyone can read projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Managers can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
      AND profiles.company_id = company_id
    )
  );

CREATE POLICY "Managers can update their projects"
  ON projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
      AND profiles.company_id = company_id
    )
  );

CREATE POLICY "Managers can delete their projects"
  ON projects FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
      AND profiles.company_id = company_id
    )
  );

-- Project requirements policies
CREATE POLICY "Anyone can read project requirements"
  ON project_requirements FOR SELECT
  USING (true);

CREATE POLICY "Managers can manage project requirements"
  ON project_requirements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN projects proj ON proj.company_id = p.company_id
      WHERE p.id = auth.uid()
      AND p.role = 'manager'
      AND proj.id = project_requirements.project_id
    )
  );