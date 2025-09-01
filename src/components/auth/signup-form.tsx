'use client';

import { useState } from 'react';
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
import { Loader2, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
// import Link from 'next/link';
import { handleSignUp } from '@/services/auth';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const signupMutation = useMutation({
    mutationFn: handleSignUp,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Account created! Please check your email to verify your account.',
      });
      form.reset();
      router.push('/auth/confirm-signup');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    signupMutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='lg:hidden text-center mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            Create an Account
          </h2>
          <p className='text-sm text-gray-900 dark:text-white'>
            Join our community of coffee enthusiasts
          </p>
        </div>
        <div className='hidden lg:block text-left'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Create an Account
          </h2>
          <p className='mt-2 text-sm text-gray-900 dark:text-white'>
            Join our community of coffee enthusiasts
          </p>
        </div>

        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium text-gray-900 dark:text-white'>
                  Full Name
                </FormLabel>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <User className='h-5 w-5 text-gray-400' />
                  </div>
                  <FormControl>
                    <Input
                      placeholder='John Doe'
                      autoComplete='name'
                      disabled={signupMutation.isPending}
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
                      disabled={signupMutation.isPending}
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
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium text-gray-900 dark:text-white'>
                  Password
                </FormLabel>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-gray-400' />
                  </div>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        placeholder='••••••••'
                        type={showPassword ? 'text' : 'password'}
                        autoComplete='new-password'
                        disabled={signupMutation.isPending}
                        className='pl-10 pr-10 h-11 text-base text-gray-900 dark:text-white'
                        {...field}
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={signupMutation.isPending}
                      >
                        {showPassword ? (
                          <EyeOff className='h-5 w-5' />
                        ) : (
                          <Eye className='h-5 w-5' />
                        )}
                        <span className='sr-only'>
                          {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </button>
                    </div>
                  </FormControl>
                </div>
                <p className='text-xs text-gray-900 dark:text-white mt-1'>
                  Use at least 6 characters
                </p>
                <FormMessage className='text-xs mt-1' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium text-gray-900 dark:text-white'>
                  Confirm Password
                </FormLabel>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-gray-400' />
                  </div>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        placeholder='••••••••'
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete='new-password'
                        disabled={signupMutation.isPending}
                        className='pl-10 pr-10 h-11 text-base text-gray-900 dark:text-white'
                        {...field}
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={signupMutation.isPending}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-5 w-5' />
                        ) : (
                          <Eye className='h-5 w-5' />
                        )}
                        <span className='sr-only'>
                          {showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'}
                        </span>
                      </button>
                    </div>
                  </FormControl>
                </div>
                <FormMessage className='text-xs mt-1' />
              </FormItem>
            )}
          />
        </div>

        <Button
          type='submit'
          variant='default'
          className='w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </Form>
  );
}
