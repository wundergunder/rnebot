/*
  # Add license image storage

  1. Changes
    - Create storage bucket for license images
    - Add RLS policies for storage access

  2. Security
    - Enable RLS on storage bucket
    - Add policies for authenticated users to manage their own license images
*/

-- Create storage bucket for license images if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  SELECT 'license_images', 'license_images', false
  WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'license_images'
  );
END $$;

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read license images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own license images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own license images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own license images" ON storage.objects;

-- Create storage policies
CREATE POLICY "Authenticated users can read license images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'license_images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can upload their own license images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'license_images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own license images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'license_images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own license images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'license_images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);