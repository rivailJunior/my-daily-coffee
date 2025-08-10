import { LoginForm } from '@/components/auth/login-form';
import Image from 'next/image';
export const metadata = {
  title: 'Login - My Daily Coffee',
  description: 'Sign in to your My Daily Coffee account',
};
const coffeeImageUrl =
  'https://images.unsplash.com/photo-1521677446241-d182a96ec49f?q=80&w=3645&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export default function LoginPage() {
  return (
    <main className='min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#f8fafc] to-[#ece9e6] dark:from-gray-900 dark:to-gray-800'>
      <div className='w-full max-w-md mx-auto'>
        <LoginForm />
      </div>
    </main>
  );
}
