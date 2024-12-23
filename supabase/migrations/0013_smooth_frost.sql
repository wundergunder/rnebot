-- Drop all existing profile policies
DROP POLICY IF EXISTS "profiles_read_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_policy" ON profiles;

-- Create a basic read policy for authenticated users
CREATE POLICY "profiles_read_policy"
  ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Create a basic write policy for own profile
CREATE POLICY "profiles_write_policy"
  ON profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create a function to check admin status without recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin policy using the function
CREATE POLICY "profiles_admin_policy"
  ON profiles FOR ALL
  USING (is_admin());

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;