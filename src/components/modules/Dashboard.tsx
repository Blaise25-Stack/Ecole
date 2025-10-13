import { Users, DollarSign, GraduationCap, TrendingUp, Bell, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Dashboard() {
  const { profile, isSuperAdmin } = useAuth();

  const stats = [
    {
      label: 'Étudiants actifs',
      value: '1,234',
      change: '+12%',
      icon: GraduationCap,
      color: 'bg-blue-500',
    },
    {
      label: 'Personnel',
      value: '87',
      change: '+3',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      label: 'Revenus (mois)',
      value: '245K €',
      change: '+8%',
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      label: 'Taux de réussite',
      value: '94%',
      change: '+2%',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">
          Bienvenue, {profile?.first_name}! {isSuperAdmin && '(Super Administrateur)'}
        </p>
        {profile?.company && (
          <p className="text-sm text-gray-500 mt-1">{profile.company.name}</p>
        )}
      </div>

      {isSuperAdmin && (
        <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">Mode Super Administrateur</h3>
            <p className="text-sm text-yellow-800 mt-1">
              Vous avez un accès complet à toutes les entreprises et données du système
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Activités récentes
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { action: 'Nouvel étudiant inscrit', time: 'Il y a 5 min', type: 'success' },
              { action: 'Paiement reçu - 500€', time: 'Il y a 15 min', type: 'success' },
              { action: 'Notes mises à jour - Classe 6A', time: 'Il y a 1h', type: 'info' },
              { action: 'Nouveau contrat signé', time: 'Il y a 2h', type: 'info' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-gray-700">{activity.action}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Rappels importants
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Réunion des parents', date: '15 Oct 2025', priority: 'high' },
              { title: 'Date limite paiement mensuel', date: '20 Oct 2025', priority: 'high' },
              { title: 'Évaluation trimestrielle', date: '25 Oct 2025', priority: 'medium' },
              { title: 'Formation du personnel', date: '30 Oct 2025', priority: 'low' },
            ].map((reminder, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  reminder.priority === 'high' ? 'bg-red-500' :
                  reminder.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{reminder.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{reminder.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
