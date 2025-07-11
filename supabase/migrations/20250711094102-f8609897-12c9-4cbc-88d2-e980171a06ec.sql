-- Fix infinite recursion in profiles RLS policy
-- Drop the problematic policy
DROP POLICY IF EXISTS "Approved users can view profiles" ON public.profiles;

-- Create a simpler policy that avoids recursion
-- Users can always view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all profiles (using a direct role check to avoid recursion)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p2
    WHERE p2.user_id = auth.uid() 
    AND p2.role = 'admin'
    AND p2.id != profiles.id  -- Avoid self-reference
  )
);

-- Approved users can view other approved profiles
CREATE POLICY "View approved profiles" 
ON public.profiles 
FOR SELECT 
USING (
  approved = true AND 
  EXISTS (
    SELECT 1 FROM public.profiles p2
    WHERE p2.user_id = auth.uid() 
    AND p2.approved = true
    AND p2.id != profiles.id  -- Avoid self-reference
  )
);