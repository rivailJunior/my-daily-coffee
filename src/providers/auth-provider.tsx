'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { AuthProvider as CustomAuthProvider } from '@/contexts/AuthContext'

type AuthProviderProps = {
  children: ReactNode
}

/**
 * Client-side authentication provider that wraps the application
 * and provides session information to all child components.
 * 
 * This provider enables the use of useSession() hook in client components
 * and provides our custom authentication context.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <CustomAuthProvider>
        {children}
      </CustomAuthProvider>
    </SessionProvider>
  )
}

/**
 * Hook to access auth context
 * @deprecated Use useAuth from @/contexts/AuthContext instead
 */
export function useAuth() {
  console.warn('useAuth from providers/auth-provider is deprecated. Use useAuth from contexts/AuthContext instead.');
  return {
    login: async () => {
      console.warn('This function is deprecated. Use useAuth from contexts/AuthContext instead.');
      return false;
    }
  };
}
