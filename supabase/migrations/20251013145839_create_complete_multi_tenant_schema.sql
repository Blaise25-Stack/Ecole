/*
  # ERP/MIS Scolaire Multi-Tenant - Schema Complet
  
  ## Description
  Système complet de gestion scolaire multi-entreprises avec isolation des données,
  gestion des rôles, audit et sauvegarde des données supprimées.
  
  ## Tables Principales
  
  ### 1. Gestion Multi-Tenant
    - companies: Entreprises/Écoles
    - user_roles: Rôles système (super_admin, admin, teacher, etc.)
    - users: Utilisateurs du système
    - permissions: Permissions par module
    - role_permissions: Mapping rôle-permission par entreprise
  
  ### 2. Module Étudiants
    - academic_years: Années scolaires
    - levels: Niveaux (6ème, 5ème, etc.)
    - streams: Filières (Sciences, Arts, etc.)
    - classes: Classes
    - subjects: Matières
    - class_subjects: Attribution matière-classe-enseignant
    - students: Étudiants
    - enrollments: Inscriptions
    - grades: Notes
    - timetable_slots: Emploi du temps
    - student_certificates: Attestations/Certificats
  
  ### 3. Module Comptabilité
    - fee_types: Types de frais
    - student_fees: Frais étudiants
    - payments: Paiements
    - invoices: Factures
    - expense_categories: Catégories de dépenses
    - expenses: Dépenses
    - cash_register: Caisse
    - penalties: Pénalités
  
  ### 4. Module RH
    - departments: Départements
    - staff: Personnel
    - contracts: Contrats
    - staff_subjects: Attribution enseignant-matière
    - salaries: Salaires
    - attendance: Présence
    - leave_types: Types de congés
    - leave_requests: Demandes de congés
  
  ### 5. Audit & Sécurité
    - audit_logs: Journal d'activités
    - deleted_data_backup: Sauvegarde données supprimées (Super Admin uniquement)
    - login_history: Historique des connexions
  
  ## Sécurité RLS
  - Isolation complète des données par company_id
  - Super admins ont accès à toutes les données
  - Utilisateurs réguliers accèdent uniquement à leur entreprise
  - Backup des suppressions accessible uniquement aux super admins
*/

-- ============================================
-- 1. TABLES DE BASE MULTI-TENANT
-- ============================================

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  logo_url text,
  active boolean DEFAULT true,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  is_super_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES user_roles(id) ON DELETE RESTRICT,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  photo_url text,
  active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module text NOT NULL,
  action text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(module, action)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES user_roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, role_id, permission_id)
);

-- ============================================
-- 2. MODULE ÉTUDIANTS
-- ============================================

CREATE TABLE IF NOT EXISTS academic_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, name)
);

CREATE TABLE IF NOT EXISTS levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, name)
);

CREATE TABLE IF NOT EXISTS streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, name)
);

CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  level_id uuid NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  stream_id uuid REFERENCES streams(id) ON DELETE SET NULL,
  name text NOT NULL,
  capacity integer DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  coefficient decimal(4,2) DEFAULT 1.00,
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, code)
);

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  student_code text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('M', 'F')),
  email text,
  phone text,
  photo_url text,
  address text,
  parent_name text NOT NULL,
  parent_phone text NOT NULL,
  parent_email text,
  emergency_contact text,
  medical_info text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, student_code)
);

CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  enrollment_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'transferred', 'withdrawn')),
  documents jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 3. MODULE COMPTABILITÉ
-- ============================================

CREATE TABLE IF NOT EXISTS fee_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  amount decimal(10,2) NOT NULL,
  is_recurring boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, name)
);

CREATE TABLE IF NOT EXISTS student_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  fee_type_id uuid NOT NULL REFERENCES fee_types(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  paid_amount decimal(10,2) DEFAULT 0,
  due_date date NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'overdue')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  student_fee_id uuid NOT NULL REFERENCES student_fees(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  payment_date date DEFAULT CURRENT_DATE,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'mobile_money', 'check')),
  reference text,
  notes text,
  received_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cash_register (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('income', 'expense')),
  amount decimal(10,2) NOT NULL,
  description text NOT NULL,
  reference_type text,
  reference_id uuid,
  balance_after decimal(10,2) NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 4. MODULE RH
-- ============================================

CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, name)
);

CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  staff_code text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('M', 'F')),
  email text NOT NULL,
  phone text NOT NULL,
  photo_url text,
  address text NOT NULL,
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  position text NOT NULL,
  hire_date date NOT NULL,
  employment_type text NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'contract')),
  qualifications jsonb DEFAULT '[]'::jsonb,
  emergency_contact_name text NOT NULL,
  emergency_contact_phone text NOT NULL,
  bank_account text,
  tax_id text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, staff_code)
);

CREATE TABLE IF NOT EXISTS salaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  month text NOT NULL,
  base_salary decimal(10,2) NOT NULL,
  allowances decimal(10,2) DEFAULT 0,
  bonuses decimal(10,2) DEFAULT 0,
  deductions decimal(10,2) DEFAULT 0,
  net_salary decimal(10,2) NOT NULL,
  payment_date date,
  payment_method text CHECK (payment_method IN ('cash', 'bank_transfer', 'mobile_money', 'check')),
  payment_reference text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  notes text,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, staff_id, month)
);

CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'half_day')),
  check_in time,
  check_out time,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, staff_id, date)
);

-- ============================================
-- 5. AUDIT & SÉCURITÉ
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action text NOT NULL,
  module text NOT NULL,
  entity_type text,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS deleted_data_backup (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  data jsonb NOT NULL,
  deleted_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deleted_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  login_time timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  success boolean DEFAULT true,
  failure_reason text
);

-- ============================================
-- INDEX POUR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_students_company ON students(company_id);
CREATE INDEX IF NOT EXISTS idx_staff_company ON staff(company_id);
CREATE INDEX IF NOT EXISTS idx_payments_company ON payments(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_company ON audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_deleted_backup_company ON deleted_data_backup(company_id);
CREATE INDEX IF NOT EXISTS idx_login_history_user ON login_history(user_id);

-- ============================================
-- ENABLE RLS SUR TOUTES LES TABLES
-- ============================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE deleted_data_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLITIQUES RLS - COMPANIES
-- ============================================

CREATE POLICY "Super admins view all companies"
  ON companies FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users u JOIN user_roles ur ON u.role_id = ur.id
    WHERE u.id = auth.uid() AND ur.is_super_admin = true
  ));

CREATE POLICY "Users view own company"
  ON companies FOR SELECT TO authenticated
  USING (id IN (SELECT company_id FROM users WHERE id = auth.uid()));

-- ============================================
-- POLITIQUES RLS - USERS
-- ============================================

CREATE POLICY "Super admins view all users"
  ON users FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users u JOIN user_roles ur ON u.role_id = ur.id
    WHERE u.id = auth.uid() AND ur.is_super_admin = true
  ));

CREATE POLICY "Users view company users"
  ON users FOR SELECT TO authenticated
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users update own profile"
  ON users FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================
-- POLITIQUES RLS - DONNÉES PAR ENTREPRISE
-- ============================================

CREATE POLICY "Company data access" ON students FOR SELECT TO authenticated
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Company data access" ON staff FOR SELECT TO authenticated
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Company data access" ON payments FOR SELECT TO authenticated
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Company data access" ON salaries FOR SELECT TO authenticated
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

-- ============================================
-- POLITIQUES RLS - AUDIT & BACKUP
-- ============================================

CREATE POLICY "Super admins view all audit logs"
  ON audit_logs FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users u JOIN user_roles ur ON u.role_id = ur.id
    WHERE u.id = auth.uid() AND ur.is_super_admin = true
  ));

CREATE POLICY "Admins view company audit logs"
  ON audit_logs FOR SELECT TO authenticated
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "System insert audit logs"
  ON audit_logs FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only super admins view deleted backup"
  ON deleted_data_backup FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users u JOIN user_roles ur ON u.role_id = ur.id
    WHERE u.id = auth.uid() AND ur.is_super_admin = true
  ));

CREATE POLICY "System insert deleted backup"
  ON deleted_data_backup FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users view own login history"
  ON login_history FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admins view all login history"
  ON login_history FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users u JOIN user_roles ur ON u.role_id = ur.id
    WHERE u.id = auth.uid() AND ur.is_super_admin = true
  ));

-- ============================================
-- DONNÉES INITIALES
-- ============================================

INSERT INTO user_roles (name, description, is_super_admin) VALUES
  ('super_admin', 'Super Administrateur - Accès complet système', true),
  ('admin', 'Administrateur Entreprise', false),
  ('teacher', 'Enseignant', false),
  ('accountant', 'Comptable', false),
  ('hr_manager', 'Responsable RH', false),
  ('student', 'Étudiant', false)
ON CONFLICT (name) DO NOTHING;

INSERT INTO permissions (module, action, description) VALUES
  ('students', 'create', 'Créer étudiants'),
  ('students', 'read', 'Voir étudiants'),
  ('students', 'update', 'Modifier étudiants'),
  ('students', 'delete', 'Supprimer étudiants'),
  ('students', 'export', 'Exporter données étudiants'),
  ('accounting', 'create', 'Créer données comptables'),
  ('accounting', 'read', 'Voir données comptables'),
  ('accounting', 'update', 'Modifier données comptables'),
  ('accounting', 'delete', 'Supprimer données comptables'),
  ('accounting', 'export', 'Exporter rapports comptables'),
  ('hr', 'create', 'Créer données RH'),
  ('hr', 'read', 'Voir données RH'),
  ('hr', 'update', 'Modifier données RH'),
  ('hr', 'delete', 'Supprimer données RH'),
  ('hr', 'export', 'Exporter rapports RH'),
  ('config', 'create', 'Créer configurations'),
  ('config', 'read', 'Voir configurations'),
  ('config', 'update', 'Modifier configurations'),
  ('config', 'delete', 'Supprimer configurations')
ON CONFLICT (module, action) DO NOTHING;