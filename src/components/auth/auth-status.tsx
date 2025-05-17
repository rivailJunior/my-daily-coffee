'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/auth/logout-button'
import { LogIn, User } from 'lucide-react'
import { useSession, signIn } from 'next-auth/react'

export function AuthStatus() {
  const { data: session, status } = useSession()
  // Show loading state while session is being fetched
  if (status === 'loading') {
    return <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
  }

  // Show user info and logout button when authenticated
  if (status === 'authenticated' && session?.user) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">{session.user.email}</span>
        </div>
        <LogoutButton variant="outline" size="sm" />
      </div>
    )
  }

  // Show sign in button when not authenticated
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => signIn()}
    >
      <LogIn className="mr-2 h-4 w-4" />
      Sign in
    </Button>
  )
}
