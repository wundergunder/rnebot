-- Create admin role if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role' AND typarray = 'user_role[]') THEN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';
  END IF;
END $$;

-- Update or insert admin user profile
DO $$ 
BEGIN
  -- First ensure the user exists in auth.users
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'marty@quidni.group'
  ) THEN
    -- Update existing profile to admin
    UPDATE profiles 
    SET role = 'admin'
    WHERE email = 'marty@quidni.group';
  END IF;
END $$;

-- Grant admin role additional permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create policies for admin access
DO $$ 
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('
      CREATE POLICY IF NOT EXISTS "Admins have full access to %I"
        ON %I FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = ''admin''
          )
        )
    ', table_name, table_name);
  END LOOP;
END $$;