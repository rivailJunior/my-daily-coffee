import { LoginForm } from '@/components/auth/login-form';
import { AuthLayout } from '@/components/auth/auth-layout';

export const metadata = {
  title: 'Login - My Daily Coffee',
  description: 'Sign in to your My Daily Coffee account',
};

export default function Login() {
  return (
    <AuthLayout
      title="Welcome Back!"
      description="Track your coffee brewing, discover new recipes, and join a community of coffee enthusiasts."
      pageTitle="Welcome Back"
      pageDescription="Sign in to continue to My Daily Coffee"
      showFooterLink={true}
      footerLinkText="Don't have an account?"
      footerLinkHref="/auth/signup"
      footerLinkLabel="Sign up"
    >
      <LoginForm />
    </AuthLayout>
  );
}
