-- Add predefined skills
INSERT INTO skills (company_id, name, requires_license, description) VALUES
  ((SELECT id FROM companies LIMIT 1), 'Telehandler Ticket', true, 'License to operate telehandler machinery'),
  ((SELECT id FROM companies LIMIT 1), 'Lift Ticket', true, 'License to operate lifting equipment'),
  ((SELECT id FROM companies LIMIT 1), 'Forklift Ticket', true, 'License to operate forklifts'),
  ((SELECT id FROM companies LIMIT 1), 'Spider Crane Ticket', true, 'License to operate spider cranes'),
  ((SELECT id FROM companies LIMIT 1), 'First Aid', true, 'First aid certification'),
  ((SELECT id FROM companies LIMIT 1), 'Approved Driver', true, 'Approved company driver status');

-- Update RLS policies for skills
DROP POLICY IF EXISTS "Anyone can read skills" ON skills;
DROP POLICY IF EXISTS "Managers can manage skills" ON skills;

-- Only managers can read and manage skills
CREATE POLICY "Managers can read skills"
  ON skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
      AND profiles.company_id = skills.company_id
    )
  );

CREATE POLICY "Managers can manage skills"
  ON skills FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
      AND profiles.company_id = skills.company_id
    )
  );

-- Workers can only read skills
CREATE POLICY "Workers can read skills"
  ON skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'worker'
      AND profiles.company_id = skills.company_id
    )
  );