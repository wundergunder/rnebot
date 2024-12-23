-- Make license_images bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'license_images';

-- Update storage policies to be more permissive for admins
CREATE POLICY "Admins can access all license images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'license_images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Update existing read policy to allow public access
DROP POLICY IF EXISTS "Authenticated users can read license images" ON storage.objects;
CREATE POLICY "Anyone can read license images"
ON storage.objects FOR SELECT
USING (bucket_id = 'license_images');

-- Ensure proper folder structure and access control
CREATE POLICY "Users and admins can manage license images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'license_images' AND
  (
    -- User owns the image
    (storage.foldername(name))[1] = auth.uid()::text
    OR
    -- User is an admin
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
);