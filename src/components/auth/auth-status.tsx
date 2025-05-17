'use client'

import Link from 'next/link'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/auth/logout-button'
import { LogIn, User } from 'lucide-react'

export function AuthStatus() {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">{user.email}</span>
        </div>
        <LogoutButton variant="outline" size="sm" />
      </div>
    )
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/login">
        <LogIn className="mr-2 h-4 w-4" />
        Sign in
      </Link>
    </Button>
  )
}
