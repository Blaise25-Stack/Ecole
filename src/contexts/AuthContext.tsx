import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_id: string | null;
  role_id: string;
  photo_url?: string;
  role: {
    name: string;
    is_super_admin: boolean;
  };
  company?: {
    name: string;
    code: string;
    logo_url?: string;
  };
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
        setLoading(false);
      })();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
          await logLogin(session.user.id);
        } else {
          setProfile(null);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        role:user_roles(name, is_super_admin),
        company:companies(name, code, logo_url)
      `)
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      setProfile(data as unknown as UserProfile);

      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    }
  };

  const logLogin = async (userId: string) => {
    const { data: userData } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', userId)
      .maybeSingle();

    await supabase.from('login_history').insert({
      user_id: userId,
      company_id: userData?.company_id,
      success: true,
    });
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  };

  const isSuperAdmin = profile?.role?.is_super_admin ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signOut,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
}
