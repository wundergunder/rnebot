/*
  # Add test admin user

  1. Changes
    - Updates the role of admin@test.com to 'admin'
*/

-- Update profile for admin@test.com to admin role
UPDATE profiles 
SET role = 'admin'
WHERE email = 'admin@test.com';