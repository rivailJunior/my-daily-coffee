'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, ButtonProps } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider';
import { handleSignOut } from '@/services/auth';

interface LogoutButtonProps extends ButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  showIcon?: boolean;
}

export function LogoutButton({
  variant = 'ghost',
  showIcon = true,
  children,
  ...props
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await handleSignOut(accessToken || '');
      window.location.reload();
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      disabled={isLoading}
      {...props}
    >
      {showIcon && <LogOut className='mr-2 h-4 w-4' />}
      {children || 'Sign out'}
    </Button>
  );
}
