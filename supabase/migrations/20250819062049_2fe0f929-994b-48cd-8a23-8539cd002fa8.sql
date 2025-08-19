-- Fix critical security vulnerability: Remove public read access to customers table
-- This prevents competitors from stealing customer contact information

-- Drop the public read policy that allows anyone to access customer data
DROP POLICY IF EXISTS "Customers are publicly readable" ON public.customers;

-- Ensure only authenticated users can read customer data
-- (The existing "Authenticated users can manage customers" policy already covers this,
-- but we're being explicit about read access)
CREATE POLICY "Authenticated users can read customers" 
ON public.customers 
FOR SELECT 
TO authenticated 
USING (true);

-- Update the management policy to be more explicit about roles
DROP POLICY IF EXISTS "Authenticated users can manage customers" ON public.customers;

CREATE POLICY "Authenticated users can manage customers" 
ON public.customers 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);