'use client'

import { usePathname } from 'next/navigation'
import { AuthStatus } from './auth-status'

export function ConditionalAuthStatus() {
  const pathname = usePathname()
  
  // Don't show auth status on login page
  if (pathname === '/login') {
    return null
  }
  
  return <AuthStatus />
}
