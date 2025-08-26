import { SignupForm } from '@/components/auth/signup-form';
import { AuthLayout } from '@/components/auth/auth-layout';

export const metadata = {
  title: 'Sign Up - My Daily Coffee',
  description: 'Create a new account to start your coffee journey with My Daily Coffee',
};

export default function SignUp() {
  return (
    <AuthLayout
      title="Join Us Today"
      description="Create your account and start your coffee journey with us."
      pageTitle="Create an Account"
      pageDescription="Join our community of coffee enthusiasts"
      showFooterLink={true}
      footerLinkText="Already have an account?"
      footerLinkHref="/auth/login"
      footerLinkLabel="Sign in"
    >
      <SignupForm />
    </AuthLayout>
  );
}
