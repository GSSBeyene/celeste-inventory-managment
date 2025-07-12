-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "View approved profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can approve users" ON public.profiles;

-- Create simple, non-recursive policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow viewing all profiles for authenticated users (simplified)
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow updates for authenticated users (for approval)
CREATE POLICY "Authenticated users can update profiles" 
ON public.profiles 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Approve the current user and make them admin
UPDATE public.profiles 
SET approved = true, 
    role = 'admin',
    approved_at = now(),
    approved_by = id
WHERE user_id = '93cee353-9bd5-4e31-b07a-d682ad298722';