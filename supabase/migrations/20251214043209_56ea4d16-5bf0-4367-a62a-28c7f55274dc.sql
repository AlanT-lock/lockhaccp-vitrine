-- Block all public read access to contact_requests table
-- Only service role (backend/dashboard) can read this data
CREATE POLICY "Block public read access" 
ON public.contact_requests 
FOR SELECT 
USING (false);