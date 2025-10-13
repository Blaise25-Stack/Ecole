import { useState } from 'react';
import { LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { moduleStructure } from '../../config/moduleStructure';

interface SidebarProps {
  activeModule: string;
  activeSubmenu: string;
  onNavigate: (moduleId: string, submenuId?: string) => void;
}

export function Sidebar({ activeModule, activeSubmenu, onNavigate }: SidebarProps) {
  const { profile, signOut, isSuperAdmin } = useAuth();
  const [expandedModule, setExpandedModule] = useState<string>(activeModule);

  const filteredModules = moduleStructure.filter(
    (module) => !module.superAdminOnly || isSuperAdmin
  );

  const handleModuleClick = (moduleId: string) => {
    const module = moduleStructure.find((m) => m.id === moduleId);

    if (!module?.submenus || module.submenus.length === 0) {
      onNavigate(moduleId);
      setExpandedModule(moduleId);
    } else {
      if (expandedModule === moduleId) {
        setExpandedModule('');
      } else {
        setExpandedModule(moduleId);
      }
    }
  };

  const handleSubmenuClick = (moduleId: string, submenuId: string) => {
    onNavigate(moduleId, submenuId);
  };

  return (
    <div className="w-72 bg-slate-900 text-white flex flex-col h-screen">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">ERP Scolaire</h2>
            {profile?.company && (
              <p className="text-xs text-slate-400 truncate">{profile.company.name}</p>
            )}
            {isSuperAdmin && (
              <p className="text-xs text-yellow-400 font-semibold">Super Admin</p>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredModules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          const isExpanded = expandedModule === module.id;
          const hasSubmenus = module.submenus && module.submenus.length > 0;

          return (
            <div key={module.id}>
              <button
                onClick={() => handleModuleClick(module.id)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{module.label}</span>
                </div>
                {hasSubmenus && (
                  <div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </button>

              {hasSubmenus && isExpanded && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-700 pl-2">
                  {module.submenus!.map((submenu) => {
                    const SubmenuIcon = submenu.icon;
                    const isSubmenuActive =
                      activeModule === module.id && activeSubmenu === submenu.id;

                    return (
                      <button
                        key={submenu.id}
                        onClick={() => handleSubmenuClick(module.id, submenu.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                          isSubmenuActive
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <SubmenuIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs font-medium">{submenu.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="mb-4 p-3 bg-slate-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              {profile?.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-slate-400 truncate">{profile?.role?.name}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
