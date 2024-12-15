-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create companies if they are managers" ON companies;
DROP POLICY IF EXISTS "Users can read their own company" ON companies;
DROP POLICY IF EXISTS "Managers can update their own company" ON companies;
DROP POLICY IF EXISTS "Managers can delete their own company" ON companies;

-- Create new policies with fixed permissions
CREATE POLICY "Anyone can read companies"
  ON companies FOR SELECT
  USING (true);

CREATE POLICY "Managers can create companies"
  ON companies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
    )
  );

CREATE POLICY "Managers can update their companies"
  ON companies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
      AND profiles.company_id = id
    )
  );

CREATE POLICY "Managers can delete their companies"
  ON companies FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
      AND profiles.company_id = id
    )
  );

-- Add missing policies for other tables
CREATE POLICY "Anyone can read company locations"
  ON company_locations FOR SELECT
  USING (true);

CREATE POLICY "Managers can manage company locations"
  ON company_locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
      AND profiles.company_id = company_id
    )
  );

CREATE POLICY "Anyone can read skills"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "Managers can manage skills"
  ON skills FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
      AND profiles.company_id = company_id
    )
  );

-- Update the handle_new_user function to handle role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'worker'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;