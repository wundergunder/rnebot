-- Drop all existing profile policies
DROP POLICY IF EXISTS "Allow authenticated to read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to delete own profile" ON profiles;
DROP POLICY IF EXISTS "Admin full access to profiles" ON profiles;

-- Create simplified policies without auth.users dependency
-- Allow all authenticated users to read profiles
CREATE POLICY "profiles_read_policy"
  ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Allow users to update their own profile
CREATE POLICY "profiles_update_policy"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "profiles_insert_policy"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "profiles_delete_policy"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- Admin policy based on profile role instead of email
CREATE POLICY "profiles_admin_policy"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );