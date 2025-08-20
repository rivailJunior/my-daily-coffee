'use client'
import { useContext, useEffect, useState } from 'react';

import Cookie from 'js-cookie';

import {
  AuthContext,
  AuthProviderProps,
  AuthState,
} from '@/types/authProvider';

export function AuthProvider({
  children,
  initialAuthState = {},
}: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: '',
    isLoading: true,
    error: null,
    ...initialAuthState,
  });

  const refreshAuth = async () => {
    const user = Cookie.get('cognito_user');
    const accessToken = Cookie.get('cognito_token');
    if (user) {
      setAuthState({
        isAuthenticated: !!user,
        user: JSON.parse(user),
        accessToken: accessToken || '',
        isLoading: false,
        error: null,
      });
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication state and user information
 * @returns Authentication context with user info and auth state
 * @example
 * const { isAuthenticated, user, isLoading, refreshAuth } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
