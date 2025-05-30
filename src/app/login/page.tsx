import { LoginForm } from '@/components/auth/login-form'
import { Coffee } from 'lucide-react';

export const metadata = {
  title: 'Login - My Daily Coffee',
  description: 'Sign in to your My Daily Coffee account',
};

export default function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-amber-50 to-amber-100 dark:from-amber-900/95 dark:via-amber-900/95 dark:to-amber-950 relative overflow-hidden transition-colors duration-300'>
      {/* Background pattern - light */}
      <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23f59e0b%22%20fill-opacity=%220.05%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] dark:opacity-10' />
      
      {/* Background pattern - dark */}
      <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23fef3c7%22%20fill-opacity=%220.1%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-0 dark:opacity-20' />
      
      <div className='w-full max-w-md px-4 sm:px-6 relative z-10'>
        <div className='text-center mb-10 animate-fade-in-up'>
          <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-800/30 dark:to-amber-900/50 shadow-lg mb-6 transition-all duration-300 hover:scale-105'>
            <Coffee className='h-10 w-10 text-amber-700 dark:text-amber-400' strokeWidth={1.5} />
          </div>
          <h1 className='text-4xl font-light tracking-tight text-amber-900 dark:text-amber-100 mb-2'>
            My Daily Coffee
          </h1>
          <p className='text-amber-700/80 dark:text-amber-300/80 font-light text-lg'>
            Your personal coffee brewing assistant
          </p>
        </div>
        <div className='animate-fade-in-up animation-delay-100'>
          <LoginForm />
        </div>
        
        <div className='mt-8 text-center text-sm text-amber-700/60 dark:text-amber-400/60'>
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
