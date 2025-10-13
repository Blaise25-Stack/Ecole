import { useState, useEffect } from 'react';
import { Building2, Plus, Search, Users, Calendar } from 'lucide-react';

interface CompaniesModuleProps {
  activeSubmenu?: string;
}

export function CompaniesModule({ activeSubmenu }: CompaniesModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const companies = [
    {
      id: '1',
      name: 'École Internationale de Casablanca',
      code: 'EIC001',
      email: 'contact@eic-casa.ma',
      phone: '+212 522 XXX XXX',
      students: 234,
      staff: 28,
      active: true,
      created: '2020-09-01',
    },
    {
      id: '2',
      name: 'Lycée Mohammed V',
      code: 'LM5002',
      email: 'admin@lm5.ma',
      phone: '+212 537 XXX XXX',
      students: 456,
      staff: 42,
      active: true,
      created: '2018-09-01',
    },
    {
      id: '3',
      name: 'Groupe Scolaire Al Amal',
      code: 'GSA003',
      email: 'info@alamal.ma',
      phone: '+212 523 XXX XXX',
      students: 189,
      staff: 22,
      active: true,
      created: '2021-09-01',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Entreprises</h1>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full">
            Super Admin
          </span>
        </div>
        <p className="text-gray-600">Vue d'ensemble de toutes les entreprises du système</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total entreprises', value: companies.length, icon: Building2, color: 'bg-blue-500' },
          { label: 'Entreprises actives', value: companies.filter(c => c.active).length, icon: Building2, color: 'bg-green-500' },
          { label: 'Total étudiants', value: companies.reduce((sum, c) => sum + c.students, 0), icon: Users, color: 'bg-purple-500' },
          { label: 'Total personnel', value: companies.reduce((sum, c) => sum + c.staff, 0), icon: Users, color: 'bg-orange-500' },
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une entreprise..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">
            <Plus className="w-5 h-5" />
            Nouvelle entreprise
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      company.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {company.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Code: {company.code}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-sm font-medium text-gray-900">{company.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Téléphone</p>
                      <p className="text-sm font-medium text-gray-900">{company.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Étudiants</p>
                      <p className="text-sm font-medium text-gray-900">{company.students}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Personnel</p>
                      <p className="text-sm font-medium text-gray-900">{company.staff}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Créée le {company.created}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                  Voir détails
                </button>
                <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
                  Modifier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
