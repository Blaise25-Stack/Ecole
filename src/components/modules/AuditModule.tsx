import { useState, useEffect } from 'react';
import { Shield, Activity, Trash2, Clock, User, FileText } from 'lucide-react';

interface AuditModuleProps {
  activeSubmenu?: string;
}

export function AuditModule({ activeSubmenu: propSubmenu }: AuditModuleProps) {
  const [activeTab, setActiveTab] = useState(propSubmenu || 'logs');

  useEffect(() => {
    if (propSubmenu) {
      setActiveTab(propSubmenu);
    }
  }, [propSubmenu]);

  const auditLogs = [
    {
      id: '1',
      user: 'admin@eic-casa.ma',
      action: 'Création étudiant',
      module: 'Étudiants',
      company: 'EIC Casablanca',
      timestamp: '2025-10-13 14:23:45',
      ip: '192.168.1.10',
    },
    {
      id: '2',
      user: 'teacher@lm5.ma',
      action: 'Modification notes',
      module: 'Étudiants',
      company: 'Lycée M5',
      timestamp: '2025-10-13 14:15:22',
      ip: '192.168.1.15',
    },
    {
      id: '3',
      user: 'accountant@alamal.ma',
      action: 'Enregistrement paiement',
      module: 'Comptabilité',
      company: 'GS Al Amal',
      timestamp: '2025-10-13 13:45:10',
      ip: '192.168.1.20',
    },
  ];

  const deletedData = [
    {
      id: '1',
      table: 'students',
      record: 'Jean Dupont (STU2024050)',
      deletedBy: 'admin@eic-casa.ma',
      company: 'EIC Casablanca',
      deletedAt: '2025-10-10 16:30:00',
      reason: 'Transfert vers autre établissement',
    },
    {
      id: '2',
      table: 'staff',
      record: 'Marie Martin (STF-042)',
      deletedBy: 'hr@lm5.ma',
      company: 'Lycée M5',
      deletedAt: '2025-10-08 10:15:00',
      reason: 'Fin de contrat',
    },
  ];

  const loginHistory = [
    {
      id: '1',
      user: 'admin@eic-casa.ma',
      company: 'EIC Casablanca',
      loginTime: '2025-10-13 08:30:00',
      ip: '192.168.1.10',
      success: true,
    },
    {
      id: '2',
      user: 'teacher@lm5.ma',
      company: 'Lycée M5',
      loginTime: '2025-10-13 08:15:00',
      ip: '192.168.1.15',
      success: true,
    },
    {
      id: '3',
      user: 'unknown@test.com',
      company: null,
      loginTime: '2025-10-13 02:30:00',
      ip: '45.123.45.67',
      success: false,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Audit & Sécurité</h1>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full">
            Super Admin
          </span>
        </div>
        <p className="text-gray-600">Journal des activités et données supprimées</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Logs aujourd\'hui', value: '1,234', icon: Activity, color: 'bg-blue-500' },
          { label: 'Connexions', value: '342', icon: User, color: 'bg-green-500' },
          { label: 'Données supprimées', value: '23', icon: Trash2, color: 'bg-red-500' },
          { label: 'Actions critiques', value: '5', icon: Shield, color: 'bg-orange-500' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-6 flex gap-2 border-b border-gray-200">
        {[
          { id: 'logs', label: 'Journal d\'activités', icon: Activity },
          { id: 'deleted', label: 'Données supprimées', icon: Trash2 },
          { id: 'logins', label: 'Historique connexions', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Module</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Entreprise</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date/Heure</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{log.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.module}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.timestamp}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'deleted' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-red-50">
            <div className="flex items-start gap-3">
              <Trash2 className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Données supprimées - Accès restreint</h3>
                <p className="text-sm text-red-800 mt-1">
                  Seuls les Super Admins peuvent consulter les données supprimées à des fins d'audit
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Table</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Enregistrement</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Supprimé par</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Entreprise</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date suppression</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deletedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.table}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.record}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.deletedBy}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.deletedAt}</td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100 font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Voir détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'logins' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Entreprise</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date/Heure</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Adresse IP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loginHistory.map((login) => (
                  <tr key={login.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{login.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{login.company || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{login.loginTime}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{login.ip}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          login.success
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {login.success ? 'Succès' : 'Échec'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
