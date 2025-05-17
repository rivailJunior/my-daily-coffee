'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  email: string
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem('isAuthenticated')
        
        if (authStatus === 'true') {
          // In a real app, you would validate the token with your backend
          // and fetch the user data
          setIsAuthenticated(true)
          
          // Mock user data - in a real app, this would come from your backend
          const storedEmail = localStorage.getItem('userEmail')
          if (storedEmail) {
            setUser({ email: storedEmail })
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Only run on client-side
    if (typeof window !== 'undefined') {
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [])

  // Login function
  const login = async (email: string) => {
    setIsLoading(true)
    
    try {
      // Verify it's a Gmail account
      if (!email.endsWith('@gmail.com')) {
        throw new Error('Only Gmail accounts are allowed')
      }

      // In a real app, this would be an API call to your authentication endpoint
      // For Gmail accounts, you would typically use OAuth 2.0 with Google
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userEmail', email)
      
      setUser({ email })
      setIsAuthenticated(true)
      
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setIsLoading(true)
    
    try {
      // In a real app, this would be an API call to your logout endpoint
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Clear authentication state
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userEmail')
      
      setUser(null)
      setIsAuthenticated(false)
      
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
