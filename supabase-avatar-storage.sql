-- Profile photos for customer accounts
-- Run this in your Supabase SQL Editor (Settings -> SQL Editor)

-- 0. Table-level privileges. RLS policies decide WHICH rows, these grants decide
--    whether the role may touch the table at all. Without them every UPDATE from
--    the browser fails with 42501 "permission denied for table profiles".
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- Column-scoped UPDATE only. A blanket GRANT UPDATE would let any signed-in
-- customer write role = 'admin' from the browser console, which is exactly what
-- supabase-admin-verification.sql closes off.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (first_name, last_name, company, avatar_url, updated_at)
  ON public.profiles TO authenticated;

-- 1. Store the public URL of the uploaded photo on the profile row
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Public bucket that holds the images (files live under <user-id>/...)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Storage policies: anyone can read, users can only write inside their own folder
DROP POLICY IF EXISTS "Avatar images are publicly readable" ON storage.objects;
CREATE POLICY "Avatar images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
