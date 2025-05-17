'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// Form validation schema
const loginFormSchema = z.object({
  email: z.string()
    .email({ message: 'Please enter a valid email address' })
    .refine((email) => email.endsWith('@gmail.com'), {
      message: 'Only Gmail accounts are allowed'
    })
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  // Initialize form with react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
    },
  })

  // Handle form submission
  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    
    try {
      // Use the auth provider's login function
      await login(data.email)
      
      // The auth provider will handle the redirect
    } catch (error) {
      console.error('Login failed:', error)
      // Handle login error
      form.setError('email', { 
        type: 'manual',
        message: error instanceof Error ? error.message : 'Login failed. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 overflow-hidden bg-gradient-to-br from-background to-muted/50">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-foreground"></div>
      <CardHeader className="space-y-1 pb-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-8 w-8">
              <path d="M10 2v1h4v-1"/>
              <path d="M12 16c1.5 0 3-1.5 3-3 0-1.5-1.5-3-3-3s-3 1.5-3 3c0 1.5 1.5 3 3 3z"/>
              <path d="M14 22H10"/>
              <path d="M5 8h14"/>
              <path d="M5 2h14v4H5z"/>
              <path d="M6 22v-7.5c0-1 .5-1.5 1.5-1.5h9c1 0 1.5.5 1.5 1.5V22"/>
            </svg>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Sign in with your Gmail account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">Gmail Account</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="you@gmail.com" 
                        type="email" 
                        className="pl-10 py-6 rounded-lg bg-background border-muted-foreground/20 focus-visible:ring-primary" 
                        disabled={isLoading} 
                        {...field} 
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground">
                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full py-6 text-base font-medium rounded-lg transition-all hover:shadow-md" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : "Sign in with Gmail"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center pb-8">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account? <a href="/register" className="text-primary font-medium hover:underline transition-colors">Sign up</a>
        </p>
      </CardFooter>
    </Card>
  )
}
