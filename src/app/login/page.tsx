import { LoginForm } from '@/components/auth/login-form';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Login - My Daily Coffee',
  description: 'Sign in to your My Daily Coffee account',
};

const coffeeImageUrl =
  'https://images.unsplash.com/photo-1521677446241-d182a96ec49f?q=80&w=3645&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export default function LoginPage() {
  return (
    <main className='h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#f8fafc] to-[#ece9e6] dark:from-gray-900 dark:to-gray-800 items-stretch'>
      {/* Left: image + logo */}
      <aside className='relative flex-1 h-full w-full md:w-1/2 flex flex-col items-center justify-center bg-coffee-50 dark:bg-gray-800 p-8 overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <Image
            src={coffeeImageUrl}
            alt='Coffee beans and brewing equipment'
            fill
            className='object-cover object-center opacity-80'
            priority
            sizes='(min-width: 768px) 50vw, 100vw'
          />
          <div className='absolute inset-0 bg-black/30 dark:bg-black/50 z-10' />
        </div>
        <div className='relative z-20 flex flex-col items-center justify-center w-full h-full'>
          <h1 className='text-2xl font-semibold text-white tracking-wide text-center drop-shadow mb-2'>
            My Daily Coffee
          </h1>
          <p className='text-sm text-white/90 text-center mb-0 drop-shadow'>
            Brew better, every day
          </p>
        </div>
      </aside>

      {/* Right: login form */}
      <section
        className='flex-1 h-full w-full md:w-1/2 flex flex-col justify-center p-8 bg-white dark:bg-gray-900 z-10 overflow-hidden'
        aria-label='Login panel'
      >
        <header className='mb-8 text-center'>
          <h2 className='text-3xl font-bold text-coffee-900 dark:text-white mb-2'>
            Sign In
          </h2>
          <p className='text-base text-gray-600 dark:text-gray-300  font-light'>
            Please login to your account.
          </p>
        </header>

        <LoginForm />
      </section>
    </main>
  );
}
