-- Fix: les politiques RLS sur `users` référencent `users` elle-même,
-- ce qui crée une récursion infinie et provoque l'erreur
-- "Database error querying schema" lors du login (grant_type=password).

-- 1) Fonctions SECURITY DEFINER stables pour lire le profil courant
--    SANS déclencher RLS sur la table `users`.

CREATE OR REPLACE FUNCTION public.current_user_company_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT company_id FROM public.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.current_user_is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE((
    SELECT ur.is_super_admin
    FROM public.users u
    JOIN public.user_roles ur ON ur.id = u.role_id
    WHERE u.id = auth.uid()
  ), false);
$$;

-- 2) On remplace toutes les politiques existantes sur `users` par des
--    versions qui utilisent les fonctions ci-dessus (pas de récursion).

DROP POLICY IF EXISTS "Super admins view all users" ON public.users;
DROP POLICY IF EXISTS "Users view company users" ON public.users;
DROP POLICY IF EXISTS "Users update own profile" ON public.users;

CREATE POLICY "Super admins view all users"
  ON public.users FOR SELECT TO authenticated
  USING (public.current_user_is_super_admin());

CREATE POLICY "Users view company users"
  ON public.users FOR SELECT TO authenticated
  USING (company_id = public.current_user_company_id());

CREATE POLICY "Users view own profile"
  ON public.users FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users update own profile"
  ON public.users FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 3) On corrige aussi les autres tables qui référencent `users`
--    dans leurs politiques (même problème de récursion potentielle).

DROP POLICY IF EXISTS "Super admins view all companies" ON public.companies;
DROP POLICY IF EXISTS "Users view own company" ON public.companies;

CREATE POLICY "Super admins view all companies"
  ON public.companies FOR SELECT TO authenticated
  USING (public.current_user_is_super_admin());

CREATE POLICY "Users view own company"
  ON public.companies FOR SELECT TO authenticated
  USING (id = public.current_user_company_id());

DROP POLICY IF EXISTS "Company data access" ON public.students;
CREATE POLICY "Company data access"
  ON public.students FOR SELECT TO authenticated
  USING (company_id = public.current_user_company_id());

DROP POLICY IF EXISTS "Company data access" ON public.staff;
CREATE POLICY "Company data access"
  ON public.staff FOR SELECT TO authenticated
  USING (company_id = public.current_user_company_id());

DROP POLICY IF EXISTS "Company data access" ON public.payments;
CREATE POLICY "Company data access"
  ON public.payments FOR SELECT TO authenticated
  USING (company_id = public.current_user_company_id());

DROP POLICY IF EXISTS "Company data access" ON public.salaries;
CREATE POLICY "Company data access"
  ON public.salaries FOR SELECT TO authenticated
  USING (company_id = public.current_user_company_id());

DROP POLICY IF EXISTS "Super admins view all audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins view company audit logs" ON public.audit_logs;

CREATE POLICY "Super admins view all audit logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (public.current_user_is_super_admin());

CREATE POLICY "Admins view company audit logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (company_id = public.current_user_company_id());

DROP POLICY IF EXISTS "Only super admins view deleted backup" ON public.deleted_data_backup;
CREATE POLICY "Only super admins view deleted backup"
  ON public.deleted_data_backup FOR SELECT TO authenticated
  USING (public.current_user_is_super_admin());

DROP POLICY IF EXISTS "Users view own login history" ON public.login_history;
DROP POLICY IF EXISTS "Super admins view all login history" ON public.login_history;

CREATE POLICY "Users view own login history"
  ON public.login_history FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admins view all login history"
  ON public.login_history FOR SELECT TO authenticated
  USING (public.current_user_is_super_admin());
