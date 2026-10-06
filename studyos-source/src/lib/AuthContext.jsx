import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out

  useEffect(() => {
    // Check if guest mode was active
    const isGuest = localStorage.getItem('studyos_is_guest') === 'true';
    if (isGuest) {
      setSession({
        user: {
          id: 'adhd-guest-user',
          email: 'guest@studyos.local',
          user_metadata: { name: 'Focus Champion' },
        },
      });
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession || null);
    });

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  const enterGuestMode = () => {
    localStorage.setItem('studyos_is_guest', 'true');
    setSession({
      user: {
        id: 'adhd-guest-user',
        email: 'guest@studyos.local',
        user_metadata: { name: 'Focus Champion' },
      },
    });
  };

  const signOut = async () => {
    localStorage.removeItem('studyos_is_guest');
    await supabase.auth.signOut();
    setSession(null);
  };

  const value = {
    session,
    user: session?.user ?? null,
    loading: session === undefined,
    isGuest: session?.user?.id === 'adhd-guest-user',
    enterGuestMode,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
