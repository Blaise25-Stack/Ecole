import { useState } from 'react';
import {
  School,
  GraduationCap,
  DollarSign,
  UserCheck,
  Settings,
  Shield,
  Building2,
  BarChart3,
  FileText,
  Calendar,
  Users,
  CheckCircle,
  ArrowRight,
  X
} from 'lucide-react';

interface LandingPageProps {
  onShowLogin: () => void;
}

export function LandingPage({ onShowLogin }: LandingPageProps) {
  const [showFeatures, setShowFeatures] = useState(false);

  const features = [
    {
      icon: GraduationCap,
      title: 'Gestion des Étudiants',
      description: 'Inscriptions, réinscriptions, attribution de classes, notes, bulletins, attestations',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: DollarSign,
      title: 'Comptabilité',
      description: 'Paiements, factures, gestion de caisse, rapports financiers, multi-devises',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: UserCheck,
      title: 'Ressources Humaines',
      description: 'Personnel, salaires, présence, congés, contrats, formation',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Building2,
      title: 'Multi-Entreprises',
      description: 'Gestion centralisée de plusieurs établissements avec isolation des données',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Shield,
      title: 'Sécurité & Audit',
      description: 'Authentification JWT, logs d\'activités, sauvegarde des données',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Settings,
      title: 'Configuration',
      description: 'Rôles, permissions, paramètres système, personnalisation complète',
      color: 'from-gray-600 to-gray-700',
    },
    {
      icon: BarChart3,
      title: 'Rapports & Analytics',
      description: 'Statistiques en temps réel, tableaux de bord personnalisés, exports',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Calendar,
      title: 'Emploi du temps',
      description: 'Planification des cours, gestion des horaires, notifications',
      color: 'from-teal-500 to-teal-600',
    },
  ];

  const benefits = [
    'Isolation complète des données par entreprise',
    'Authentification sécurisée avec JWT',
    'Interface moderne et intuitive',
    'Gestion multi-devises (FC, FCFA, $, £, €)',
    'Système de permissions granulaire',
    'Rapports PDF/Excel automatiques',
    'Sauvegarde automatique des données',
    'Support multi-langue',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ERP Scolaire</h1>
                <p className="text-xs text-gray-600">Multi-Entreprises</p>
              </div>
            </div>
            <button
              onClick={onShowLogin}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-lg"
            >
              Se connecter
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Système sécurisé et multi-tenant
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Système de Gestion Scolaire
            <span className="block text-blue-600 mt-2">Moderne & Complet</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Plateforme intégrée pour la gestion complète de vos établissements scolaires.
            Multi-entreprises, modulaire, sécurisé et entièrement personnalisable.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onShowLogin}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-xl"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg border-2 border-gray-200"
            >
              Découvrir les fonctionnalités
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-br ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {showFeatures && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Fonctionnalités Clés</h3>
                <button
                  onClick={() => setShowFeatures(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-900 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Modules inclus</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: GraduationCap, text: 'Gestion Étudiants' },
                      { icon: DollarSign, text: 'Comptabilité' },
                      { icon: UserCheck, text: 'Ressources Humaines' },
                      { icon: Settings, text: 'Configuration' },
                      { icon: Building2, text: 'Multi-Entreprises' },
                      { icon: Shield, text: 'Audit & Sécurité' },
                      { icon: FileText, text: 'Documents & Certificats' },
                      { icon: BarChart3, text: 'Rapports & Analytics' },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                          <Icon className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-gray-900">{item.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => {
                      setShowFeatures(false);
                      onShowLogin();
                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition shadow-xl"
                  >
                    Commencer maintenant
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-12 text-center text-white">
          <Users className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h3 className="text-3xl font-bold mb-4">Prêt à transformer votre gestion scolaire?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez les établissements qui ont choisi notre solution pour optimiser leur gestion quotidienne
          </p>
          <button
            onClick={onShowLogin}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl inline-flex items-center gap-2"
          >
            Accéder au système
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <School className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">ERP Scolaire Multi-Entreprises</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <span>Sécurisé avec JWT</span>
              <span>•</span>
              <span>Multi-tenant</span>
              <span>•</span>
              <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
