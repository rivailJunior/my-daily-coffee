'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, ButtonProps } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'

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
  const { logout } = useAuth()

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      // Use the auth provider's logout function
      await logout()
      
      // The auth provider will handle the redirect and state clearing
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
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
