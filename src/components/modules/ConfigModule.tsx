import { useState, useEffect } from 'react';
import { Settings, Shield, Users, BookOpen, Calendar, Bell, Database } from 'lucide-react';

interface ConfigModuleProps {
  activeSubmenu?: string;
}

export function ConfigModule({ activeSubmenu: propSubmenu }: ConfigModuleProps) {
  const [activeTab, setActiveTab] = useState(propSubmenu || 'general');

  useEffect(() => {
    if (propSubmenu) {
      setActiveTab(propSubmenu);
    }
  }, [propSubmenu]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuration</h1>
        <p className="text-gray-600 mt-2">Paramètres système, rôles et autorisations</p>
      </div>

      <div className="mb-6 flex gap-2 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'general', label: 'Général', icon: Settings },
          { id: 'roles', label: 'Rôles', icon: Users },
          { id: 'permissions', label: 'Permissions', icon: Shield },
          { id: 'academic', label: 'Année scolaire', icon: Calendar },
          { id: 'subjects', label: 'Matières', icon: BookOpen },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'backup', label: 'Sauvegarde', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition whitespace-nowrap ${
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

      {activeTab === 'general' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations de l'établissement</h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'établissement
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="École Internationale"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code établissement
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SCH001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de contact
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@ecole.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+212 5XX XXX XXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse complète
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Adresse de l'établissement..."
              />
            </div>

            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
              Enregistrer les modifications
            </button>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { name: 'Administrateur', users: 3, permissions: 'Accès complet à tous les modules', color: 'bg-red-100 text-red-700' },
            { name: 'Enseignant', users: 42, permissions: 'Notes, présence, emploi du temps', color: 'bg-blue-100 text-blue-700' },
            { name: 'Comptable', users: 2, permissions: 'Comptabilité, paiements, factures', color: 'bg-green-100 text-green-700' },
            { name: 'RH Manager', users: 1, permissions: 'Personnel, salaires, congés, contrats', color: 'bg-purple-100 text-purple-700' },
            { name: 'Étudiant', users: 234, permissions: 'Consultation notes et emploi du temps', color: 'bg-gray-100 text-gray-700' },
          ].map((role, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${role.color}`}>
                      {role.users} utilisateurs
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{role.permissions}</p>
                </div>
                <button className="ml-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                  Modifier
                </button>
              </div>
            </div>
          ))}

          <button className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 hover:bg-blue-50 transition text-center">
            <div className="text-blue-600 font-medium">+ Créer un nouveau rôle</div>
          </button>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Matrice des permissions</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Module</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Créer</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Lire</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Modifier</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Supprimer</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Exporter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {['Étudiants', 'Comptabilité', 'Ressources Humaines', 'Configuration'].map((module, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{module}</td>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <td key={i} className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                          defaultChecked={i <= 3}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
              Enregistrer les permissions
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Années scolaires</h3>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
              + Nouvelle année
            </button>
          </div>

          <div className="space-y-4">
            {[
              { name: '2024-2025', status: 'active', start: '01 Sep 2024', end: '30 Juin 2025', students: 234 },
              { name: '2023-2024', status: 'completed', start: '01 Sep 2023', end: '30 Juin 2024', students: 198 },
              { name: '2022-2023', status: 'completed', start: '01 Sep 2022', end: '30 Juin 2023', students: 176 },
            ].map((year, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{year.name}</h4>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        year.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {year.status === 'active' ? 'Active' : 'Terminée'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{year.start} - {year.end}</span>
                    <span>•</span>
                    <span>{year.students} étudiants</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
                  Modifier
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Matières enseignées</h3>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
              + Nouvelle matière
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Mathématiques', code: 'MATH', coefficient: 3, teachers: 5 },
              { name: 'Physique-Chimie', code: 'PC', coefficient: 2.5, teachers: 3 },
              { name: 'Français', code: 'FR', coefficient: 2, teachers: 4 },
              { name: 'Anglais', code: 'EN', coefficient: 2, teachers: 3 },
              { name: 'Histoire-Géo', code: 'HG', coefficient: 1.5, teachers: 2 },
              { name: 'SVT', code: 'SVT', coefficient: 2, teachers: 2 },
              { name: 'EPS', code: 'EPS', coefficient: 1, teachers: 2 },
              { name: 'Arts Plastiques', code: 'ART', coefficient: 1, teachers: 1 },
            ].map((subject, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                    {subject.code}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Coef: {subject.coefficient}</span>
                  <span>{subject.teachers} enseignants</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeTab === 'notifications' || activeTab === 'backup') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === 'notifications' && <Bell className="w-8 h-8 text-gray-400" />}
            {activeTab === 'backup' && <Database className="w-8 h-8 text-gray-400" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Module en développement</h3>
          <p className="text-gray-600">Cette fonctionnalité sera bientôt disponible</p>
        </div>
      )}
    </div>
  );
}
