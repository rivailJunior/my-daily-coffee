'use client'

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className='w-full'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className='transition-colors duration-300'>
        <div className='p-2 flex items-center justify-center flex-col'>
          <Button
            type='button'
            variant='outline'
            className='w-2/3 lg:w-1/2 py-6 rounded-md text-base font-normal transition-all hover:shadow-md flex items-center justify-center 
                     border-gray-700 dark:border-coffee-navy/70 
                     bg-white dark:bg-coffee-navy/30 
                     hover:bg-gray-50 dark:hover:bg-coffee-navy/50 
                     text-gray-900 dark:text-white 
                     hover:text-gray-900 dark:hover:text-white
                     relative overflow-hidden group'
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <motion.span
              className='absolute inset-0 bg-gray-100/50 dark:bg-gray-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />

            {isLoading ? (
              <motion.span
                className='flex items-center justify-center'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700 dark:text-gray-400'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                <span className='relative z-10'>Signing in...</span>
              </motion.span>
            ) : (
              <motion.span
                className='flex items-center justify-center relative z-10'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <svg className='mr-3 h-5 w-5' viewBox='0 0 24 24'>
                  <path
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    fill='#4285F4'
                  />
                  <path
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    fill='#34A853'
                  />
                  <path
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    fill='#FBBC05'
                  />
                  <path
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    fill='#EA4335'
                  />
                </svg>
                <span>Continue with Google</span>
              </motion.span>
            )}
          </Button>

          <div className='mt-6 text-center text-sm text-gray-600/60 dark:text-gray-400/40'>
            <p>
              We won&apos;t save your data. We don&apos;t have money to pay for
              servers.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
