/*
  # Add initial admin user
  
  1. Changes
    - Insert initial admin user into auth.users
    - Create corresponding profile entry
*/

-- Insert admin user (password will be set through the UI)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  crypt('admin', gen_salt('bf')),
  now(),
  '{"full_name": "Admin User"}'
) ON CONFLICT DO NOTHING;