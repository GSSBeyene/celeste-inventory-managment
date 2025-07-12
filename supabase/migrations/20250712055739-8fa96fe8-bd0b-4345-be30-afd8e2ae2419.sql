-- Reset admin credentials and set up current user as admin
-- First, reset all existing admin roles
UPDATE public.profiles 
SET role = 'staff', approved = false, approved_at = NULL, approved_by = NULL
WHERE role = 'admin';

-- Now set up the current user (from auth logs) as admin
INSERT INTO public.profiles (user_id, approved, role, approved_at, approved_by, display_name, first_name, last_name)
VALUES (
  '9c4f639f-c5c3-43bf-99e4-6e93a85f1472',
  true,
  'admin',
  now(),
  '9c4f639f-c5c3-43bf-99e4-6e93a85f1472',
  'Zerai Gebresilassie',
  'Zerai',
  'Gebresilassie'
)
ON CONFLICT (user_id) DO UPDATE SET
  approved = true,
  role = 'admin',
  approved_at = now(),
  approved_by = '9c4f639f-c5c3-43bf-99e4-6e93a85f1472';