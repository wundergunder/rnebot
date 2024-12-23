-- Drop existing problematic policies
DROP POLICY IF EXISTS "profiles_read_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_write_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_policy" ON profiles;

-- Create a simpler read policy
CREATE POLICY "allow_read_profiles"
  ON profiles FOR SELECT
  USING (true);

-- Create a policy for users to manage their own profiles
CREATE POLICY "allow_users_manage_own_profile"
  ON profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create a separate admin policy for full access
CREATE POLICY "allow_admin_full_access"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM profiles admin_p
      WHERE admin_p.id = auth.uid()
      AND admin_p.role = 'admin'
      AND admin_p.id != profiles.id  -- Prevent recursion
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles admin_p
      WHERE admin_p.id = auth.uid()
      AND admin_p.role = 'admin'
      AND admin_p.id != profiles.id  -- Prevent recursion
    )
  );

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;