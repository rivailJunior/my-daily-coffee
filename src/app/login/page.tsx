import { LoginForm } from '@/components/auth/login-form'
import { Coffee } from 'lucide-react';

export const metadata = {
  title: 'Login - My Daily Coffee',
  description: 'Sign in to your My Daily Coffee account',
};

export default function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center relative'>
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
