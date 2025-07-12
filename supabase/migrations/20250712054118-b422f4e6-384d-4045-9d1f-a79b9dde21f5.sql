-- Create and approve profile for current user
INSERT INTO public.profiles (user_id, approved, role, approved_at, approved_by, display_name, first_name, last_name)
VALUES (
  '9c4f639f-c5c3-43bf-99e4-6e93a85f1472',
  true,
  'admin',
  now(),
  'c14485ee-f7ef-4e54-a389-002d72e81d64',
  'Zerai Gebresilassie',
  'Zerai',
  'Gebresilassie'
)
ON CONFLICT (user_id) DO UPDATE SET
  approved = true,
  role = 'admin',
  approved_at = now(),
  approved_by = 'c14485ee-f7ef-4e54-a389-002d72e81d64';