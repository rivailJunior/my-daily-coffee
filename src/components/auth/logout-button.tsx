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
  const { accessToken } = useAuth();

  const handleLogout = () => {
    try {
      handleSignOut(accessToken || '').then(() => {
        window.location.reload();
      });
    } catch (error) {}
  };

  return (
    <Button variant={variant} onClick={() => handleLogout()} {...props}>
      {showIcon && <LogOut />}
      {/* {children || 'Sign out'} */}
    </Button>
  );
}
