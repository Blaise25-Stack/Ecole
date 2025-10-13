import {
  Home,
  LayoutDashboard,
  Building2,
  GraduationCap,
  DollarSign,
  UserCheck,
  Settings,
  Shield,
  Users,
  ClipboardList,
  BookOpen,
  Award,
  Calendar,
  FileText,
  CreditCard,
  Receipt,
  Wallet,
  PieChart,
  TrendingUp,
  User,
  Mail,
  Phone,
  Briefcase,
  Clock,
  CheckCircle,
  FileSpreadsheet,
  Database,
  Lock,
  Key,
  UserPlus,
  Building,
  MapPin,
  Banknote,
  BadgeCheck,
  Book,
  type LucideIcon
} from 'lucide-react';

export interface SubMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  superAdminOnly: boolean;
  submenus?: SubMenuItem[];
}

export const moduleStructure: MenuItem[] = [
  {
    id: 'home',
    label: 'Accueil',
    icon: Home,
    superAdminOnly: false,
  },
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    superAdminOnly: false,
    submenus: [
      { id: 'overview', label: 'Vue d\'ensemble', icon: PieChart, description: 'Statistiques globales et indicateurs clés' },
      { id: 'analytics', label: 'Analytics', icon: TrendingUp, description: 'Analyses détaillées et graphiques' },
    ]
  },
  {
    id: 'companies',
    label: 'Entreprises',
    icon: Building2,
    superAdminOnly: true,
    submenus: [
      { id: 'list', label: 'Liste des entreprises', icon: Building, description: 'Gestion complète des établissements scolaires' },
      { id: 'create', label: 'Nouvelle entreprise', icon: UserPlus, description: 'Création d\'un nouvel établissement' },
      { id: 'settings', label: 'Paramètres', icon: Settings, description: 'Configuration des entreprises' },
    ]
  },
  {
    id: 'students',
    label: 'Gestion Étudiants',
    icon: GraduationCap,
    superAdminOnly: false,
    submenus: [
      { id: 'list', label: 'Liste des étudiants', icon: Users, description: 'Base de données complète des étudiants avec recherche, filtres et exports' },
      { id: 'enrollment', label: 'Inscriptions', icon: ClipboardList, description: 'Processus d\'inscription et réinscription avec formulaires et validation' },
      { id: 'classes', label: 'Gestion des classes', icon: BookOpen, description: 'Attribution des classes, niveaux, sections et gestion des effectifs' },
      { id: 'grades', label: 'Notes & Évaluations', icon: Award, description: 'Saisie des notes, calcul moyennes, bulletins et relevés de notes' },
      { id: 'attendance', label: 'Présence & Absences', icon: CheckCircle, description: 'Pointage quotidien, justificatifs et rapports de présence' },
      { id: 'timetable', label: 'Emploi du temps', icon: Calendar, description: 'Planning des cours, horaires et calendrier scolaire' },
      { id: 'certificates', label: 'Attestations', icon: FileText, description: 'Génération d\'attestations de scolarité, réussite et transfert' },
      { id: 'parents', label: 'Gestion Parents', icon: Users, description: 'Base de données parents, contacts et communications' },
    ]
  },
  {
    id: 'accounting',
    label: 'Comptabilité',
    icon: DollarSign,
    superAdminOnly: false,
    submenus: [
      { id: 'overview', label: 'Vue d\'ensemble', icon: PieChart, description: 'Dashboard financier avec indicateurs et graphiques' },
      { id: 'payments', label: 'Paiements', icon: CreditCard, description: 'Enregistrement des paiements, méthodes multiples et historique' },
      { id: 'invoices', label: 'Factures', icon: Receipt, description: 'Création, émission et suivi des factures avec relances' },
      { id: 'fees', label: 'Frais de scolarité', icon: Banknote, description: 'Configuration des frais par niveau et suivi des paiements' },
      { id: 'expenses', label: 'Dépenses', icon: TrendingUp, description: 'Enregistrement et catégorisation des dépenses' },
      { id: 'cashregister', label: 'Caisse', icon: Wallet, description: 'Gestion de la caisse, mouvements et clôtures journalières' },
      { id: 'reports', label: 'Rapports financiers', icon: FileSpreadsheet, description: 'Génération de rapports comptables et exports Excel/PDF' },
      { id: 'balance', label: 'Bilan & États', icon: Database, description: 'Bilan financier, états de résultats et comptabilité analytique' },
    ]
  },
  {
    id: 'hr',
    label: 'Ressources Humaines',
    icon: UserCheck,
    superAdminOnly: false,
    submenus: [
      { id: 'staff', label: 'Personnel', icon: Users, description: 'Base de données du personnel avec dossiers complets' },
      { id: 'recruitment', label: 'Recrutement', icon: UserPlus, description: 'Gestion des candidatures et processus de recrutement' },
      { id: 'contracts', label: 'Contrats', icon: FileText, description: 'Gestion des contrats de travail et renouvellements' },
      { id: 'salaries', label: 'Salaires & Paie', icon: Banknote, description: 'Calcul des salaires, primes et génération des bulletins de paie' },
      { id: 'attendance', label: 'Présence & Pointage', icon: Clock, description: 'Suivi des présences, retards et heures supplémentaires' },
      { id: 'leaves', label: 'Congés & Absences', icon: Calendar, description: 'Demandes de congés, validations et planning' },
      { id: 'training', label: 'Formations', icon: Award, description: 'Plan de formation, suivi et évaluations' },
      { id: 'evaluation', label: 'Évaluations', icon: CheckCircle, description: 'Évaluations de performance et entretiens annuels' },
    ]
  },
  {
    id: 'config',
    label: 'Configuration',
    icon: Settings,
    superAdminOnly: false,
    submenus: [
      { id: 'general', label: 'Paramètres généraux', icon: Settings, description: 'Configuration de base du système' },
      { id: 'users', label: 'Utilisateurs', icon: Users, description: 'Gestion des comptes utilisateurs' },
      { id: 'roles', label: 'Rôles & Permissions', icon: Lock, description: 'Configuration des rôles et droits d\'accès' },
      { id: 'academic', label: 'Année scolaire', icon: Calendar, description: 'Configuration de l\'année scolaire, trimestres et périodes' },
      { id: 'levels', label: 'Niveaux & Classes', icon: BookOpen, description: 'Structure pédagogique, niveaux et options' },
      { id: 'subjects', label: 'Matières', icon: Book, description: 'Gestion des matières et coefficients' },
      { id: 'notifications', label: 'Notifications', icon: Mail, description: 'Paramètres des notifications email et SMS' },
      { id: 'backup', label: 'Sauvegardes', icon: Database, description: 'Configuration des sauvegardes automatiques' },
    ]
  },
  {
    id: 'audit',
    label: 'Audit & Sécurité',
    icon: Shield,
    superAdminOnly: true,
    submenus: [
      { id: 'logs', label: 'Journaux d\'activité', icon: FileText, description: 'Historique complet des actions utilisateurs' },
      { id: 'security', label: 'Sécurité', icon: Lock, description: 'Paramètres de sécurité et surveillance' },
      { id: 'sessions', label: 'Sessions actives', icon: Clock, description: 'Gestion des sessions utilisateurs connectés' },
      { id: 'reports', label: 'Rapports d\'audit', icon: FileSpreadsheet, description: 'Génération de rapports d\'audit et conformité' },
    ]
  },
];
