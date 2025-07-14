-- Reset admin credentials and set up current user as admin
-- First, reset all existing admin roles
UPDATE public.profiles 
SET role = 'staff', approved = false, approved_at = NULL, approved_by = NULL
WHERE role = 'admin';

-- Create/update the current user profile without approved_by first
INSERT INTO public.profiles (user_id, approved, role, approved_at, display_name, first_name, last_name)
VALUES (
  '9c4f639f-c5c3-43bf-99e4-6e93a85f1472',
  true,
  'admin',
  now(),
  'Zerai Gebresilassie',
  'Zerai',
  'Gebresilassie'
)
ON CONFLICT (user_id) DO UPDATE SET
  approved = true,
  role = 'admin',
  approved_at = now(),
  approved_by = NULL,
  display_name = 'Zerai Gebresilassie',
  first_name = 'Zerai',
  last_name = 'Gebresilassie';

-- Now update the approved_by to reference the profile ID
UPDATE public.profiles 
SET approved_by = id 
WHERE user_id = '9c4f639f-c5c3-43bf-99e4-6e93a85f1472';