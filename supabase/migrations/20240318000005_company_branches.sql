-- Create company_branches table
CREATE TABLE company_branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add updated_at trigger
CREATE TRIGGER update_company_branches_updated_at
    BEFORE UPDATE ON company_branches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE company_branches ENABLE ROW LEVEL SECURITY;

-- Anyone can read branches
CREATE POLICY "Anyone can read company branches"
  ON company_branches FOR SELECT
  USING (true);

-- Only company managers can insert branches
CREATE POLICY "Managers can create branches"
  ON company_branches FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
      AND profiles.company_id = company_id
    )
  );

-- Only company managers can update branches
CREATE POLICY "Managers can update branches"
  ON company_branches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
      AND profiles.company_id = company_id
    )
  );

-- Only company managers can delete branches
CREATE POLICY "Managers can delete branches"
  ON company_branches FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
      AND profiles.company_id = company_id
    )
  );