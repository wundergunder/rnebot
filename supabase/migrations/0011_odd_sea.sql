-- Drop all existing profile policies to start fresh
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON profiles;
DROP POLICY IF EXISTS "Admin full access" ON profiles;
DROP POLICY IF EXISTS "Enable update for users and admins" ON profiles;

-- Create simplified policies that avoid recursion
-- Allow all authenticated users to read profiles
CREATE POLICY "Allow authenticated to read profiles"
  ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Allow users to insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Allow users to delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- Special admin policy using email check instead of role
CREATE POLICY "Admin full access to profiles"
  ON profiles FOR ALL
  USING (
    (SELECT email FROM auth.users WHERE auth.users.id = auth.uid()) = 'marty@quidni.group'
  );