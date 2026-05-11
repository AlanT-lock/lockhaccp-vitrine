-- Create a public storage bucket for assets like logo
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true);

-- Allow public read access to the assets bucket
CREATE POLICY "Public read access for assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'assets');

-- Allow authenticated users to upload to assets bucket
CREATE POLICY "Authenticated users can upload assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');