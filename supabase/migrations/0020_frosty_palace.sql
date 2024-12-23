/*
  # Add license details and storage

  1. Changes
    - Add license_expiry and license_number to profile_skills table
    - Create storage bucket for license images
    - Add license_image_path to profile_skills table
    - Update RLS policies for storage access

  2. Security
    - Enable RLS on storage bucket
    - Add policies for authenticated users
*/

-- Add new columns to profile_skills
ALTER TABLE profile_skills 
ADD COLUMN license_number TEXT,
ADD COLUMN license_expiry DATE,
ADD COLUMN license_image_path TEXT;

-- Create storage bucket for license images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('license_images', 'license_images', false);

-- Enable RLS on the bucket
CREATE POLICY "Authenticated users can read license images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'license_images' AND
  auth.role() = 'authenticated'
);

-- Allow users to upload their own license images
CREATE POLICY "Users can upload their own license images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'license_images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own license images
CREATE POLICY "Users can update their own license images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'license_images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own license images
CREATE POLICY "Users can delete their own license images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'license_images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);