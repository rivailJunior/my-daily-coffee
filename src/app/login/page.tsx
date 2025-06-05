import { LoginForm } from '@/components/auth/login-form'
import { Coffee } from 'lucide-react';

export const metadata = {
  title: 'Login - My Daily Coffee',
  description: 'Sign in to your My Daily Coffee account',
};

export default function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-amber-50 to-amber-100 dark:from-coffee-900 dark:via-coffee-900/95 dark:to-coffee-800 relative overflow-hidden transition-colors duration-300'>
      {/* Background pattern - light */}
      <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23f59e0b%22%20fill-opacity=%220.05%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-100 dark:opacity-100' />

      {/* Background pattern - dark */}
      <div className='absolute inset-0 bg-gray-400 dark:bg-[#1D3241] dark:opacity-100' />
      <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23fef3c7%22%20fill-opacity=%220.1%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-1 dark:opacity-10' />

      <div className='w-full max-w-md px-4 sm:px-6 relative z-10'>
        <div className='text-center mb-10 animate-fade-in-up'>
          <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-coffee-navy/80 dark:to-coffee-navy/70 shadow-lg mb-6 transition-all duration-300 hover:scale-105 border border-gray-100/50 dark:border-coffee-navy/30'>
            <Coffee
              className='h-10 w-10 text-coffee-navy dark:text-white'
              strokeWidth={1.5}
            />
          </div>
          <h1 className='text-4xl font-light tracking-tight text-coffee-navy dark:text-white mb-2'>
            My Daily Coffee
          </h1>
          <p className='text-coffee-navy/80 dark:text-white/80 font-light text-lg'>
            Your personal coffee brewing assistant
          </p>
        </div>
        <div className='animate-fade-in-up animation-delay-100'>
          <LoginForm />
        </div>

        <div className='mt-8 text-center text-coffee-navy/80 dark:text-white/80 font-light text-sm'>
          <p>
            Don&apos;t hesitate to login, we&apos;re not storing any personal
            data.
          </p>
        </div>
      </div>
    </div>
  );
}
