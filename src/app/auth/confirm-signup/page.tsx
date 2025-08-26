import { ConfirmSignUpForm } from '@/components/auth/confirm-signup-form';
import { AuthLayout } from '@/components/auth/auth-layout';

export const metadata = {
  title: 'Confirm Sign Up - My Daily Coffee',
  description: 'Confirm your email address to complete your My Daily Coffee account setup',
};

export default function ConfirmSignUp() {
  return (
    <AuthLayout
      title="Confirm Your Account"
      description="Complete your registration and start exploring the world of coffee."
      pageTitle="Confirm Your Account"
      pageDescription="Enter the verification code sent to your email"
    >
      <ConfirmSignUpForm />
    </AuthLayout>
  );
}
