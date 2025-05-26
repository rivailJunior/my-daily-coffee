import { LoginForm } from '@/components/auth/login-form'
import { Coffee } from 'lucide-react';

export const metadata = {
  title: 'Login - My Daily Coffee',
  description: 'Sign in to your My Daily Coffee account',
};

export default function LoginPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/50'>
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <div className='inline-block p-2 rounded-full  mb-4'>
            <Coffee className='h-10 w-10 text-primary' />
          </div>
          <h1 className='text-3xl font-thin tracking-tight mb-2'>
            My Daily Coffee
          </h1>
          <p className='text-muted-foreground font-thin'>
            Your personal coffee brewing assistant
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
