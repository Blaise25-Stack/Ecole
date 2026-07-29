-- Fix: "Database error querying schema" at login.
--
-- Root cause: auth.users.instance_id references auth.instances, but the
-- instances table is empty. GoTrue looks up the instance during the
-- password grant and fails with a 500 "unexpected_failure".
--
-- 1) Insert the missing instance row that the user references.
-- 2) Normalize NULL instance_id on the other user to the same instance.
-- 3) Recreate the missing identity row for admin@school.com (email column is generated).

INSERT INTO auth.instances (id, uuid, raw_base_config, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  '{}',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Normalize NULL instance_id to the known instance.
UPDATE auth.users
SET instance_id = '00000000-0000-0000-0000-000000000000'
WHERE instance_id IS NULL;

-- Recreate the missing identity row for admin@school.com.
-- "email" is a generated column (lower(identity_data->>'email')), so we omit it.
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id)
SELECT
  u.id::text,
  u.id,
  jsonb_build_object('sub', u.id, 'email', u.email, 'email_verified', true),
  'email',
  u.created_at,
  u.created_at,
  u.created_at,
  gen_random_uuid()
FROM auth.users u
WHERE u.email = 'admin@school.com'
  AND NOT EXISTS (
    SELECT 1 FROM auth.identities i WHERE i.user_id = u.id
  )
ON CONFLICT DO NOTHING;
