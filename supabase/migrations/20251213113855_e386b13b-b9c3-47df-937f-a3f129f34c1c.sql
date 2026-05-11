-- Create a table for demo/contact requests from professionals
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_size TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (anyone can submit a contact form)
CREATE POLICY "Anyone can submit contact requests" 
ON public.contact_requests 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated admins should be able to read (we'll add this later if needed)
-- For now, keep it secure - no public reads