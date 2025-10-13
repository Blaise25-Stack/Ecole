import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HomePage } from './components/modules/HomePage';
import { Dashboard } from './components/modules/Dashboard';
import { CompaniesModule } from './components/modules/CompaniesModule';
import { StudentsModule } from './components/modules/StudentsModule';
import { AccountingModule } from './components/modules/AccountingModule';
import { HRModule } from './components/modules/HRModule';
import { ConfigModule } from './components/modules/ConfigModule';
import { AuditModule } from './components/modules/AuditModule';

function MainApp() {
  const { user, loading } = useAuth();
  const [activeModule, setActiveModule] = useState('home');
  const [activeSubmenu, setActiveSubmenu] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Chargement du système...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showLogin) {
      return <LoginPage />;
    }
    return <LandingPage onShowLogin={() => setShowLogin(true)} />;
  }

  const handleNavigation = (moduleId: string, submenuId?: string) => {
    setActiveModule(moduleId);
    setActiveSubmenu(submenuId || '');
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'home':
        return <HomePage />;
      case 'dashboard':
        return <Dashboard />;
      case 'companies':
        return <CompaniesModule activeSubmenu={activeSubmenu} />;
      case 'students':
        return <StudentsModule activeSubmenu={activeSubmenu} />;
      case 'accounting':
        return <AccountingModule activeSubmenu={activeSubmenu} />;
      case 'hr':
        return <HRModule activeSubmenu={activeSubmenu} />;
      case 'config':
        return <ConfigModule activeSubmenu={activeSubmenu} />;
      case 'audit':
        return <AuditModule activeSubmenu={activeSubmenu} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeModule={activeModule}
        activeSubmenu={activeSubmenu}
        onNavigate={handleNavigation}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-8">{renderModule()}</div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
