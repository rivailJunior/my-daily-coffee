import { LoginForm } from '@/components/auth/login-form';
export const metadata = {
  title: 'Login - My Daily Coffee',
  description: 'Sign in to your My Daily Coffee account',
};

export default function Login() {
  return (
    <main className='min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#f8fafc] to-[#ece9e6] dark:from-gray-900 dark:to-gray-800'>
      <div className='w-full max-w-md mx-auto'>
        <LoginForm />
      </div>
    </main>
  );
}
