import { LoginForm } from '@/components/auth/login-form';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Login - My Daily Coffee',
  description: 'Sign in to your My Daily Coffee account',
};

export default function Login() {
  return (
    <main className='min-h-screen bg-white'>
      {/* Mobile Header with Image */}
      <div className='lg:hidden w-full h-48 sm:h-64 relative'>
        <div className='absolute inset-0 bg-black/30 z-10' />
        <Image
          src='/images/coffee-beans-bg.jpg'
          alt='Coffee beans background'
          fill
          className='object-cover'
          priority
        />
        <div className='relative z-20 p-6 h-full flex flex-col justify-end'>
          <Link href='/' className='text-xl font-bold text-white mb-2'>
            My Daily Coffee
          </Link>
          <h1 className='text-2xl font-bold text-white'>Welcome Back!</h1>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row min-h-0 lg:min-h-screen'>
        {/* Desktop Left side with background image - Hidden on mobile */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-gray-50 relative'>
          <div className='absolute inset-0 bg-black/30 z-10' />
          <Image
            src='/images/coffee-beans-bg.jpg'
            alt='Coffee beans background'
            fill
            className='object-cover'
            priority
          />
          <div className='relative z-20 flex flex-col justify-between p-12 w-full'>
            <Link href='/' className='text-2xl font-bold text-white'>
              My Daily Coffee
            </Link>
            <div className='text-white'>
              <h1 className='text-4xl font-bold mb-4'>Welcome Back!</h1>
              <p className='text-gray-200 max-w-md'>
                Track your coffee brewing, discover new recipes, and join a
                community of coffee enthusiasts.
              </p>
            </div>
          </div>
        </div>

        {/* Right side with login form */}
        <div className='w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8'>
          <div className='w-full max-w-md'>
            {/* Mobile header */}
            <div className='lg:hidden mb-8 text-center'>
              <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                Welcome Back
              </h1>
              <p className='text-gray-600 text-sm'>
                Sign in to continue to My Daily Coffee
              </p>
            </div>

            {/* Login Form */}
            <div>
              <LoginForm />

              <div className='mt-6 text-center text-sm text-gray-600'>
                <p>
                  Don&apos;t have an account?{' '}
                  <Link
                    href='/auth/signup'
                    className='font-medium text-blue-600 hover:text-blue-500'
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
