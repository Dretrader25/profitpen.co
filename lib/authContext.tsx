// lib/authContext.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from './supabaseClient'; // Your Supabase client
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean; // To track if the initial session is being loaded
  signOut: () => Promise<void>; // Add signOut here for convenience
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true until first auth check

  useEffect(() => {
    // Fetch initial session. Supabase client might do this automatically,
    // but explicitly getting it can ensure state is set.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for changes in authentication state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Supabase auth event:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false); // Ensure loading is false after any auth event
      }
    );

    // Cleanup function
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out in AuthProvider:', error);
    }
    // Session and user will be set to null by onAuthStateChange
    // No need to redirect here, components using useAuth can decide
  };

  const value = {
    session,
    user,
    isLoading,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
