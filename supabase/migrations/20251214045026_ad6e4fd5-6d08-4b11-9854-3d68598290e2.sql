-- Allow authenticated users to read contact requests
CREATE POLICY "Authenticated users can view contact requests" 
ON public.contact_requests 
FOR SELECT 
USING (auth.uid() IS NOT NULL);