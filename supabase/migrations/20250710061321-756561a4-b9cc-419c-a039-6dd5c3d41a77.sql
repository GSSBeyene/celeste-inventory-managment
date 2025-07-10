-- Add approval fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN approved BOOLEAN DEFAULT FALSE,
ADD COLUMN approved_by UUID REFERENCES public.profiles(id),
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;

-- Create index for better performance on approval queries
CREATE INDEX idx_profiles_approved ON public.profiles(approved);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);

-- Update RLS policies to only allow approved users
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Only approved users can view profiles (except admins who can view all)
CREATE POLICY "Approved users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- User can view their own profile regardless of approval status
  auth.uid() = user_id OR 
  -- Approved users can view other approved profiles
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND approved = TRUE
  ) AND approved = TRUE) OR
  -- Admins can view all profiles
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can approve users
CREATE POLICY "Admins can approve users" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Update other table policies to require approved users
-- Menu items policies
DROP POLICY IF EXISTS "Authenticated users can create menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Authenticated users can update menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Authenticated users can delete menu items" ON public.menu_items;

CREATE POLICY "Approved users can create menu items" 
ON public.menu_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND approved = TRUE
  )
);

CREATE POLICY "Approved users can update menu items" 
ON public.menu_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND approved = TRUE
  )
);

CREATE POLICY "Approved users can delete menu items" 
ON public.menu_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND approved = TRUE
  )
);

-- Create the first admin user (update this with actual admin email)
-- This will be needed so there's at least one admin to approve other users
UPDATE public.profiles 
SET role = 'admin', approved = TRUE, approved_at = now()
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'admin@celeste-hotel.com' 
  LIMIT 1
);

-- If no admin exists, make the first user an approved admin
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin' AND approved = TRUE) THEN
    UPDATE public.profiles 
    SET role = 'admin', approved = TRUE, approved_at = now()
    WHERE created_at = (SELECT MIN(created_at) FROM public.profiles)
    AND user_id IS NOT NULL;
  END IF;
END $$;