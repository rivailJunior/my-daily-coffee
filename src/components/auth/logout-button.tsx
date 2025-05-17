'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, ButtonProps } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface LogoutButtonProps extends ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  showIcon?: boolean
}

export function LogoutButton({ 
  variant = 'ghost', 
  showIcon = true, 
  children, 
  ...props 
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      // Use NextAuth's signOut function
      await signOut({ redirect: true, callbackUrl: '/' })
      
      // NextAuth will handle the redirect and state clearing
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      disabled={isLoading}
      {...props}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || 'Sign out'}
    </Button>
  )
}
