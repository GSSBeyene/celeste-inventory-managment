-- Fix critical security vulnerability: Remove public read access to customers table
-- This prevents competitors from stealing customer contact information

-- Drop the public read policy that allows anyone to access customer data
DROP POLICY IF EXISTS "Customers are publicly readable" ON public.customers;

-- The existing "Authenticated users can manage customers" policy already covers 
-- read access for authenticated users, so no additional read policy needed