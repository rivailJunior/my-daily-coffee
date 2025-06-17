'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/auth/logout-button'
import { LogIn, User } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useAuth } from '@/contexts/AuthContext'

export function AuthStatus() {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Show loading state while authentication status is being fetched
  if (isLoading) {
    return <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
  }

  // Show user info and logout button when authenticated
  if (isAuthenticated && user) {
    return (
      <div className='flex items-center gap-4'>
        <div className='hidden md:flex items-center gap-2'>
          <User className='h-4 w-4' />
          <span className='text-sm font-medium capitalize'>{user.name}</span>
        </div>
        <LogoutButton
          variant='outline'
          size='sm'
          className='w-full md:w-auto lg:w-auto capitalize'
        />
      </div>
    );
  }

  // Show sign in button when not authenticated
  return (
    <Button variant='outline' size='sm' onClick={() => signIn()}>
      <LogIn className='mr-2 h-4 w-4 capitalize' />
      Sign in
    </Button>
  );
}
