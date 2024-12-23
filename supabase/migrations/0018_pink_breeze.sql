-- Drop existing policies and functions
DROP POLICY IF EXISTS "allow_read_profiles" ON profiles;
DROP POLICY IF EXISTS "allow_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_admin_update_profiles" ON profiles;
DROP POLICY IF EXISTS "allow_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_admin_all_operations" ON profiles;
DROP FUNCTION IF EXISTS is_admin();

-- Create a simplified admin check function that avoids recursion
CREATE OR REPLACE FUNCTION check_admin_status(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users u
    JOIN profiles p ON u.id = p.id
    WHERE u.id = user_id
    AND p.role = 'admin'
  );
$$;

-- Basic read access for authenticated users
CREATE POLICY "profiles_read"
  ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Combined update policy for both users and admins
CREATE POLICY "profiles_update"
  ON profiles FOR UPDATE
  USING (
    auth.uid() = id OR check_admin_status(auth.uid())
  )
  WITH CHECK (
    auth.uid() = id OR check_admin_status(auth.uid())
  );

-- Basic insert policy
CREATE POLICY "profiles_insert"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admin delete policy
CREATE POLICY "profiles_delete"
  ON profiles FOR DELETE
  USING (check_admin_status(auth.uid()));

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_admin_status TO authenticated;
GRANT ALL ON profiles TO authenticated;