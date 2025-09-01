'use client'

import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/auth/logout-button';
import { LogIn, User } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

export function AuthStatus() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading state while authentication status is being fetched
  if (isLoading) {
    return <div className='h-9 w-24 animate-pulse rounded bg-muted'></div>;
  }

  const handleSignIn = () => {
    window.location.href = '/auth/login';
  };

  // Show user info and logout button when authenticated
  if (isAuthenticated && user) {
    return (
      <div className='flex items-center gap-2'>
        <div className='hidden md:flex items-center gap-2'>
          <span className='text-sm font-medium uppercase'>
            {user.email?.split('@')[0]}
          </span>
        </div>
        <LogoutButton
          variant='default'
          size='sm'
          className='w-full md:w-auto'
        />
      </div>
    );
  }

  // Show sign in button when not authenticated
  return (
    <Button variant='outline' size='default' onClick={handleSignIn}>
      <LogIn className='mr-2 h-4 w-4 capitalize' />
      Sign in
    </Button>
  );
}
