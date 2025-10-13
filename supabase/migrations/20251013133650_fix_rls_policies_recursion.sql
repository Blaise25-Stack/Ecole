/*
  # Fix RLS Policies - Remove Recursion

  ## Changes
  1. Drop all duplicate and recursive policies on users table
  2. Create simplified, non-recursive policies
  3. Fix login_history policies

  ## Security
  - Maintain proper access control without recursion
  - Use simpler conditions that don't query the same table
*/

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Super admins can view all users" ON users;
DROP POLICY IF EXISTS "Super admins view all users" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can view users in their company" ON users;
DROP POLICY IF EXISTS "Users update own profile" ON users;
DROP POLICY IF EXISTS "Users view company users" ON users;

-- Create simple, non-recursive policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Fix login_history policies
DROP POLICY IF EXISTS "Users can view own login history" ON login_history;
DROP POLICY IF EXISTS "System can insert login history" ON login_history;

CREATE POLICY "Users can view own login history"
  ON login_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow insert login history"
  ON login_history FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Also allow anon to insert (for login tracking)
CREATE POLICY "Allow anon insert login history"
  ON login_history FOR INSERT
  TO anon
  WITH CHECK (true);
