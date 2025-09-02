'use client';

import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, Key } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { handleConfirmSignUp } from '@/services/auth';
import Link from 'next/link';

const confirmSignupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  code: z.string().min(6, 'Verification code must be 6 characters'),
});

type FormValues = z.infer<typeof confirmSignupSchema>;

export function ConfirmSignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(confirmSignupSchema),
    defaultValues: {
      email: '',
      code: '',
    },
  });

  const confirmSignupMutation = useMutation({
    mutationFn: handleConfirmSignUp,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Your account has been confirmed! Redirecting to login...',
      });
      router.push('/auth/login');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to confirm your account. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('code', values.code);
    confirmSignupMutation.mutate(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='hidden lg:block text-left'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Confirm Your Account
          </h2>
          <p className='mt-2 text-sm text-gray-900 dark:text-white'>
            Enter the verification code sent to your email
          </p>
        </div>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium text-gray-900 dark:text-white'>
                  Email address
                </FormLabel>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Mail className='h-5 w-5 text-gray-400' />
                  </div>
                  <FormControl>
                    <Input
                      placeholder='your@email.com'
                      type='email'
                      autoCapitalize='none'
                      autoComplete='email'
                      autoCorrect='off'
                      disabled={confirmSignupMutation.isPending}
                      className='pl-10 h-11 text-base text-gray-900 dark:text-white'
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className='text-xs mt-1' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium text-gray-900 dark:text-white'>
                  Verification Code
                </FormLabel>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Key className='h-5 w-5 text-gray-400' />
                  </div>
                  <FormControl>
                    <Input
                      placeholder='123456'
                      type='text'
                      autoComplete='one-time-code'
                      disabled={confirmSignupMutation.isPending}
                      className='pl-10 h-11 text-base text-gray-900 dark:text-white'
                      {...field}
                    />
                  </FormControl>
                </div>
                <p className='text-xs text-gray-900 dark:text-white mt-1'>
                  Enter the 6-digit code sent to your email
                </p>
                <FormMessage className='text-xs mt-1' />
              </FormItem>
            )}
          />
        </div>

        <Button
          type='submit'
          variant='default'
          className='w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          disabled={confirmSignupMutation.isPending}
        >
          {confirmSignupMutation.isPending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Confirming...
            </>
          ) : (
            'Confirm Account'
          )}
        </Button>

        <div className='text-center text-sm text-gray-900 dark:text-white mt-4'>
          <p>
            Already have an account?{' '}
            <Link
              href='/auth/login'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
