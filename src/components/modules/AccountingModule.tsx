import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  Download,
  Receipt,
  CreditCard,
  Wallet,
  FileText,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  Banknote,
  FileSpreadsheet,
  Database
} from 'lucide-react';
import { CurrencySelector, formatCurrency } from '../common/CurrencySelector';

interface AccountingModuleProps {
  activeSubmenu?: string;
}

export function AccountingModule({ activeSubmenu: propSubmenu }: AccountingModuleProps) {
  const [period, setPeriod] = useState('month');
  const [currency, setCurrency] = useState('FC');
  const [activeSubmenu, setActiveSubmenu] = useState(propSubmenu || 'overview');

  useEffect(() => {
    if (propSubmenu) {
      setActiveSubmenu(propSubmenu);
    }
  }, [propSubmenu]);

  const submenuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: PieChart },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'invoices', label: 'Factures', icon: FileText },
    { id: 'fees', label: 'Frais de scolarité', icon: Banknote },
    { id: 'expenses', label: 'Dépenses', icon: ArrowDownRight },
    { id: 'cashregister', label: 'Caisse', icon: Wallet },
    { id: 'reports', label: 'Rapports financiers', icon: FileSpreadsheet },
    { id: 'balance', label: 'Bilan & États', icon: Database },
  ];

  const stats = [
    { label: 'Revenus totaux', value: 245680, trend: '+12%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Dépenses', value: 87340, trend: '-5%', icon: TrendingDown, color: 'text-red-600' },
    { label: 'Solde caisse', value: 158340, trend: '+8%', icon: DollarSign, color: 'text-blue-600' },
    { label: 'En attente', value: 23450, trend: '-3%', icon: Calendar, color: 'text-orange-600' },
  ];

  const transactions = [
    { id: '1', student: 'Marie Dupont', type: 'Frais scolarité', amount: 500, date: '13 Oct 2025', status: 'completed', method: 'Espèces', isIncome: true },
    { id: '2', student: 'Ahmed Benali', type: 'Inscription', amount: 450, date: '13 Oct 2025', status: 'completed', method: 'Virement', isIncome: true },
    { id: '3', student: 'Fournitures scolaires', type: 'Dépense', amount: 320, date: '12 Oct 2025', status: 'completed', method: 'Espèces', isIncome: false },
    { id: '4', student: 'Sophie Martin', type: 'Mensualité', amount: 500, date: '12 Oct 2025', status: 'pending', method: 'Mobile Money', isIncome: true },
    { id: '5', student: 'Karim Idrissi', type: 'Frais examen', amount: 200, date: '11 Oct 2025', status: 'completed', method: 'Chèque', isIncome: true },
  ];

  const invoices = [
    { id: 'INV-001', student: 'Marie Dupont', amount: 1500, dueDate: '20 Oct 2025', status: 'paid' },
    { id: 'INV-002', student: 'Ahmed Benali', amount: 1500, dueDate: '22 Oct 2025', status: 'pending' },
    { id: 'INV-003', student: 'Sophie Martin', amount: 1500, dueDate: '18 Oct 2025', status: 'overdue' },
  ];

  const expenses = [
    { id: '1', category: 'Salaires', amount: 45000, date: '01 Oct 2025', beneficiary: 'Personnel enseignant' },
    { id: '2', category: 'Fournitures', amount: 8500, date: '05 Oct 2025', beneficiary: 'Papeterie ABC' },
    { id: '3', category: 'Maintenance', amount: 12000, date: '10 Oct 2025', beneficiary: 'Services techniques' },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comptabilité & Finance</h1>
          <p className="text-gray-600 mt-2">Gestion financière complète avec multi-devises</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <CurrencySelector value={currency} onChange={setCurrency} className="w-48" />
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Download className="w-5 h-5" />
            Exporter
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg">
            <Plus className="w-5 h-5" />
            Nouveau paiement
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        {[
          { id: 'day', label: 'Aujourd\'hui' },
          { id: 'week', label: 'Semaine' },
          { id: 'month', label: 'Mois' },
          { id: 'year', label: 'Année' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setPeriod(item.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === item.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <span className={`text-sm font-medium ${stat.color}`}>{stat.trend}</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stat.value, currency)}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-1 p-2 border-b border-gray-200 overflow-x-auto">
          {submenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubmenu(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition whitespace-nowrap ${
                  activeSubmenu === item.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeSubmenu === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Transactions récentes</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Voir tout
                  </button>
                </div>

                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.isIncome ? 'bg-green-100' : 'bg-red-100'
                          }`}
                        >
                          {transaction.isIncome ? (
                            <ArrowUpRight className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{transaction.student}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">{transaction.type}</span>
                            <span className="text-xs text-gray-500">• {transaction.method}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p
                          className={`font-bold text-lg ${
                            transaction.isIncome ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition revenus</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Frais scolarité', amount: 180450, percentage: 73, color: 'bg-blue-500' },
                    { label: 'Inscriptions', amount: 35230, percentage: 14, color: 'bg-green-500' },
                    { label: 'Activités', amount: 20000, percentage: 8, color: 'bg-yellow-500' },
                    { label: 'Autres', amount: 10000, percentage: 5, color: 'bg-gray-500' },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(item.amount, currency)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubmenu === 'payments' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Gestion des paiements</h3>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                  <Plus className="w-4 h-4" />
                  Enregistrer paiement
                </button>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un paiement..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <Filter className="w-5 h-5" />
                  Filtrer
                </button>
              </div>

              <div className="space-y-3">
                {transactions.filter(t => t.isIncome).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{transaction.student}</p>
                        <p className="text-sm text-gray-600 mt-1">{transaction.type}</p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-sm text-gray-600 mb-1">Méthode</p>
                        <p className="font-medium text-gray-900">{transaction.method}</p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-sm text-gray-600 mb-1">Montant</p>
                        <p className="font-bold text-lg text-green-600">{formatCurrency(transaction.amount, currency)}</p>
                      </div>
                      <div className="text-center px-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {transaction.status === 'completed' ? 'Payé' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubmenu === 'invoices' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Factures</h3>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                  <Plus className="w-4 h-4" />
                  Nouvelle facture
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-600 font-medium mb-1">Factures payées</p>
                  <p className="text-3xl font-bold text-green-900">1</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                  <p className="text-sm text-yellow-600 font-medium mb-1">En attente</p>
                  <p className="text-3xl font-bold text-yellow-900">1</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-600 font-medium mb-1">En retard</p>
                  <p className="text-3xl font-bold text-red-900">1</p>
                </div>
              </div>

              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{invoice.id}</p>
                        <p className="text-sm text-gray-600 mt-1">{invoice.student}</p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-sm text-gray-600 mb-1">Échéance</p>
                        <p className="font-medium text-gray-900">{invoice.dueDate}</p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-sm text-gray-600 mb-1">Montant</p>
                        <p className="font-bold text-lg text-gray-900">{formatCurrency(invoice.amount, currency)}</p>
                      </div>
                      <div className="text-center px-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : invoice.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {invoice.status === 'paid' && 'Payée'}
                          {invoice.status === 'pending' && 'En attente'}
                          {invoice.status === 'overdue' && 'En retard'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubmenu === 'expenses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Dépenses</h3>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                  <Plus className="w-4 h-4" />
                  Nouvelle dépense
                </button>
              </div>

              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <ArrowDownRight className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{expense.category}</p>
                        <p className="text-sm text-gray-600 mt-1">{expense.beneficiary}</p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-sm text-gray-600 mb-1">Date</p>
                        <p className="font-medium text-gray-900">{expense.date}</p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-sm text-gray-600 mb-1">Montant</p>
                        <p className="font-bold text-lg text-red-600">-{formatCurrency(expense.amount, currency)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeSubmenu === 'fees' || activeSubmenu === 'cashregister' || activeSubmenu === 'reports' || activeSubmenu === 'balance') && (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeSubmenu === 'cashregister' && <Wallet className="w-8 h-8 text-gray-400" />}
                {activeSubmenu === 'reports' && <Download className="w-8 h-8 text-gray-400" />}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Section en développement</h3>
              <p className="text-gray-600">Cette fonctionnalité sera bientôt disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
