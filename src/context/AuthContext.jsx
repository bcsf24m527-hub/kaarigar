import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (!error && data) {
      setProfile(data);
    } else {
      setProfile(null);
    }
  };

  useEffect(() => {
    // Safety fallback: force loading to false after 3 seconds if Supabase hangs
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        clearTimeout(fallbackTimer);
        setLoading(false);
      }
    };
    
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (currentUser) {
            await fetchProfile(currentUser.id);
          } else {
            setProfile(null);
          }
        } catch (err) {
          console.error("Auth state change error:", err);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, role = 'service_taker', fullName = '', serviceType = null) => {
    // Pass profile data as metadata so the DB trigger can create the profile
    // even before email confirmation (bypasses RLS)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          service_type: serviceType,
        },
      },
    });

    if (error) return { data, error };

    // If email confirmation is disabled and a session exists, try client-side upsert as backup
    if (data?.session && data?.user) {
      const { error: profileError } = await supabase.from('profiles').upsert(
        [{
          id: data.user.id,
          email,
          full_name: fullName,
          role,
          service_type: serviceType,
        }],
        { onConflict: 'id' }
      );
      if (profileError) {
        console.error('Profile upsert error (non-fatal, trigger should handle):', profileError);
      }
    }

    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data?.user) {
      await fetchProfile(data.user.id);
    }
    return { data, error };
  };

  const signInWithProvider = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  };

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (e) {
      return { error: e };
    }
  };

  const role = profile?.role || null;
  const isProvider = role === 'service_provider';
  const isTaker = role === 'service_taker';

  return (
    <AuthContext.Provider value={{
      user, profile, role, isProvider, isTaker, loading,
      signUp, signIn, signInWithProvider, signOut,
      resetPassword, updatePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
