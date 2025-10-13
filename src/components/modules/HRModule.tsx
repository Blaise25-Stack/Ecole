import { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, DollarSign, UserCircle, Briefcase, Clock } from 'lucide-react';

interface HRModuleProps {
  activeSubmenu?: string;
}

export function HRModule({ activeSubmenu: propSubmenu }: HRModuleProps) {
  const [activeTab, setActiveTab] = useState(propSubmenu || 'staff');

  useEffect(() => {
    if (propSubmenu) {
      setActiveTab(propSubmenu);
    }
  }, [propSubmenu]);

  const staff = [
    {
      id: '1',
      code: 'STF001',
      name: 'Dr. Ahmed Benali',
      position: 'Directeur',
      department: 'Administration',
      status: 'active',
      salary: '5,000 €',
      hireDate: '2020-09-01',
    },
    {
      id: '2',
      code: 'STF002',
      name: 'Mme. Fatima Zahra',
      position: 'Enseignante',
      department: 'Mathématiques',
      status: 'active',
      salary: '3,200 €',
      hireDate: '2021-09-01',
    },
    {
      id: '3',
      code: 'STF003',
      name: 'M. Karim Idrissi',
      position: 'Enseignant',
      department: 'Sciences',
      status: 'active',
      salary: '3,000 €',
      hireDate: '2022-09-01',
    },
  ];

  const leaveRequests = [
    { id: '1', staff: 'Mme. Fatima Zahra', type: 'Congé annuel', dates: '20-25 Oct', days: 5, status: 'pending', reason: 'Vacances familiales' },
    { id: '2', staff: 'M. Karim Idrissi', type: 'Congé maladie', dates: '15 Oct', days: 1, status: 'approved', reason: 'Consultation médicale' },
    { id: '3', staff: 'Dr. Ahmed Benali', type: 'Congé annuel', dates: '1-10 Nov', days: 10, status: 'pending', reason: 'Voyage professionnel' },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ressources Humaines</h1>
          <p className="text-gray-600 mt-2">Gestion du personnel, salaires et présence</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg">
          <UserPlus className="w-5 h-5" />
          Nouveau personnel
        </button>
      </div>

      <div className="mb-6 flex gap-2 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'staff', label: 'Personnel', icon: Users },
          { id: 'attendance', label: 'Présence', icon: Clock },
          { id: 'salaries', label: 'Salaires', icon: DollarSign },
          { id: 'leaves', label: 'Congés', icon: Calendar },
          { id: 'contracts', label: 'Contrats', icon: Briefcase },
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

      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCircle className="w-12 h-12 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.code}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Actif
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Poste:</span>
                  <span className="font-medium text-gray-900">{member.position}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Département:</span>
                  <span className="font-medium text-gray-900">{member.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Salaire:</span>
                  <span className="font-medium text-gray-900">{member.salary}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Embauché:</span>
                  <span className="font-medium text-gray-900">{member.hireDate}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                  Voir profil
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
                  Modifier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leaves' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Personnel</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Dates</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jours</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Raison</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.staff}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.dates}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.days} jour(s)</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{request.reason}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          request.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {request.status === 'approved' && 'Approuvé'}
                        {request.status === 'pending' && 'En attente'}
                        {request.status === 'rejected' && 'Rejeté'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-green-50 text-green-600 rounded text-sm hover:bg-green-100 font-medium">
                            Approuver
                          </button>
                          <button className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 font-medium">
                            Rejeter
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activeTab === 'attendance' || activeTab === 'salaries' || activeTab === 'contracts') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === 'attendance' && <Clock className="w-8 h-8 text-gray-400" />}
            {activeTab === 'salaries' && <DollarSign className="w-8 h-8 text-gray-400" />}
            {activeTab === 'contracts' && <Briefcase className="w-8 h-8 text-gray-400" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Module en développement</h3>
          <p className="text-gray-600">Cette fonctionnalité sera bientôt disponible</p>
        </div>
      )}
    </div>
  );
}
