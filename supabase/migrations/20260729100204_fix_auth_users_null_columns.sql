-- Fix: "Database error querying schema" at login (root cause).
--
-- GoTrue's Go SQL scanner cannot convert NULL to string for certain
-- columns in auth.users. These columns MUST be empty strings (''),
-- never NULL. The admin@school.com user has NULLs in confirmation_token,
-- email_change, email_change_token_new, and recovery_token, which causes
-- GoTrue to crash with a 500 "unexpected_failure" during password grant.

UPDATE auth.users
SET
  confirmation_token = COALESCE(confirmation_token, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  reauthentication_token = COALESCE(reauthentication_token, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, '')
WHERE
  confirmation_token IS NULL
  OR email_change IS NULL
  OR email_change_token_new IS NULL
  OR recovery_token IS NULL
  OR email_change_token_current IS NULL
  OR reauthentication_token IS NULL
  OR phone_change IS NULL
  OR phone_change_token IS NULL;
