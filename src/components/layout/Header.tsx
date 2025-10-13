import { Bell, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { profile, isSuperAdmin } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher dans le système..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-8">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-8 w-px bg-gray-300"></div>

          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer group">
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
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 truncate text-sm">
                  {profile?.first_name} {profile?.last_name}
                </p>
                {isSuperAdmin && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">
                    SUPER
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-gray-600 truncate">{profile?.role?.name}</p>
                {profile?.company && (
                  <>
                    <span className="text-gray-400">•</span>
                    <p className="text-xs text-gray-500 truncate">{profile.company.name}</p>
                  </>
                )}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition flex-shrink-0" />
          </div>
        </div>
      </div>
    </header>
  );
}
