import {
  GraduationCap,
  DollarSign,
  Users,
  Building2,
  Settings,
  Shield,
  BookOpen,
  Calendar,
  FileText,
  TrendingUp,
  UserCheck,
  ClipboardList,
  Award,
  Wallet,
  BarChart3,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function HomePage() {
  const { profile } = useAuth();

  const mainFeatures = [
    {
      icon: GraduationCap,
      title: 'Gestion des Étudiants',
      description: 'Gérez les inscriptions, classes et parcours scolaires avec efficacité.',
      badge: 'Complet',
      badgeColor: 'bg-blue-100 text-blue-700',
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: BookOpen,
      title: 'Gestion des Classes',
      description: 'Contrôlez les classes, niveaux et affectations en temps réel.',
      badge: 'Temps Réel',
      badgeColor: 'bg-green-100 text-green-700',
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: DollarSign,
      title: 'Gestion Financière',
      description: 'Suivez les paiements, factures et générez des rapports automatisés.',
      badge: 'Intelligent',
      badgeColor: 'bg-yellow-100 text-yellow-700',
      color: 'from-yellow-500 to-yellow-600',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      icon: Wallet,
      title: 'Gestion de Caisse',
      description: 'Créez et gérez la trésorerie automatiquement.',
      badge: 'Rapide',
      badgeColor: 'bg-red-100 text-red-700',
      color: 'from-red-500 to-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      icon: Users,
      title: 'Gestion des Parents',
      description: 'Gérez les parents et leurs communications efficacement.',
      badge: 'Complet',
      badgeColor: 'bg-cyan-100 text-cyan-700',
      color: 'from-cyan-500 to-cyan-600',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
    },
    {
      icon: FileText,
      title: 'Gestion des Documents',
      description: 'Maintenez vos documents et optimisez vos attestations.',
      badge: 'Optimisé',
      badgeColor: 'bg-purple-100 text-purple-700',
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: BarChart3,
      title: 'Rapports & Analyses',
      description: 'Générez des rapports et analyses statistiques automatisées.',
      badge: 'Analytique',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      color: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      icon: UserCheck,
      title: 'Gestion du Personnel',
      description: 'Gérez les utilisateurs et les rôles du personnel.',
      badge: 'Sécurisé',
      badgeColor: 'bg-teal-100 text-teal-700',
      color: 'from-teal-500 to-teal-600',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
    },
  ];

  const stats = [
    { label: '100%', sublabel: 'Automatisé', icon: TrendingUp },
    { label: '24/7', sublabel: 'Disponible', icon: Clock },
    { label: '0', sublabel: 'Erreurs', icon: Shield },
  ];

  return (
    <div>
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl shadow-2xl p-12 mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mb-32"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold text-sm mb-6 shadow-lg">
            <GraduationCap className="w-5 h-5" />
            ERP Scolaire
          </div>

          <h1 className="text-5xl font-bold text-white mb-4 flex items-center gap-3">
            Bienvenue {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'au système'} !
            <span className="text-4xl">🎓</span>
          </h1>

          <p className="text-xl text-blue-100 mb-8 max-w-3xl">
            Une solution puissante pour gérer efficacement votre établissement scolaire.
            Prêt à booster la gestion de votre école ?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition"
                >
                  <Icon className="w-8 h-8 text-yellow-400 mb-3" />
                  <p className="text-4xl font-bold text-white mb-1">{stat.label}</p>
                  <p className="text-blue-100 font-medium">{stat.sublabel}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Settings className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Fonctionnalités Clés du Système</h2>
            <p className="text-gray-600">Comment optimiser les tâches avec le système ?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-9 h-9 ${feature.iconColor}`} />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{feature.description}</p>

                <span className={`inline-block px-3 py-1 ${feature.badgeColor} text-xs font-bold rounded-full`}>
                  {feature.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Raccourcis Rapides</h3>
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-green-50 transition font-medium text-gray-700 flex items-center gap-3">
              <ClipboardList className="w-5 h-5 text-green-600" />
              Nouvelle inscription
            </button>
            <button className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-green-50 transition font-medium text-gray-700 flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              Enregistrer paiement
            </button>
            <button className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-green-50 transition font-medium text-gray-700 flex items-center gap-3">
              <FileText className="w-5 h-5 text-green-600" />
              Générer attestation
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Activités Récentes</h3>
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900">Nouvelle inscription</p>
              <p className="text-xs text-gray-600 mt-1">Il y a 2 heures</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900">Paiement reçu</p>
              <p className="text-xs text-gray-600 mt-1">Il y a 3 heures</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900">Rapport généré</p>
              <p className="text-xs text-gray-600 mt-1">Il y a 5 heures</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Calendrier</h3>
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900">Réunion parents</p>
              <p className="text-xs text-gray-600 mt-1">Demain, 14h00</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900">Examens finaux</p>
              <p className="text-xs text-gray-600 mt-1">Dans 5 jours</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900">Fin trimestre</p>
              <p className="text-xs text-gray-600 mt-1">Dans 2 semaines</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
