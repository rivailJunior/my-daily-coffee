'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status when component mounts
    setIsLoading(status === 'loading');
  }, [status]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      setIsLoading(false);
      
      if (result?.error) {
        return false;
      }
      
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    isAuthenticated: status === 'authenticated',
    isLoading,
    user: session?.user || null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
