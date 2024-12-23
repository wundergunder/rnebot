-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admin full access" ON profiles;

-- Create new admin policy without referencing auth.users
CREATE POLICY "Admin full access"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
      AND admin_profile.email = 'marty@quidni.group'
    )
  );

-- Ensure basic policies remain
ALTER POLICY "Enable read access for authenticated users"
  ON profiles
  USING (auth.uid() IS NOT NULL);

-- Update other policies to handle admin role
CREATE OR REPLACE POLICY "Enable update for users and admins"
  ON profiles FOR UPDATE
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
    )
  );