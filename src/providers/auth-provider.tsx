'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

type AuthProviderProps = {
  children: ReactNode
}

/**
 * Client-side authentication provider that wraps the application
 * and provides session information to all child components.
 * 
 * This provider enables the use of useSession() hook in client components.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
