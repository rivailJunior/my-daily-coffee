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
import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';
import { handleSignIn } from '@/services/auth';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: handleSignIn,
    onSuccess: () => {
      window.location.assign('/');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    loginMutation.mutate({ email: values.email, password: values.password });
  };

  return (
    <div className='w-full'>
      <div className='space-y-6'>
        <div className='hidden lg:block text-left'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Sign in to your account
          </h2>
          <p className='mt-2 text-sm text-gray-900 dark:text-white'>
            Enter your credentials to access your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium text-gray-700 dark:text-white'>
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
                          disabled={loginMutation.isPending}
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
                    <div className='flex items-center justify-between'>
                      <FormLabel className='text-sm font-medium text-gray-900 dark:text-white'>
                        Password
                      </FormLabel>
                      {/* <a
                        href='/forgot-password'
                        className='text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300'
                      >
                        Forgot password?
                      </a> */}
                    </div>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Lock className='h-5 w-5 text-gray-400' />
                      </div>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            placeholder='••••••••'
                            type={showPassword ? 'text' : 'password'}
                            autoComplete='current-password'
                            disabled={loginMutation.isPending}
                            className='pl-10 pr-10 h-11 text-base text-gray-900 dark:text-white'
                            {...field}
                          />
                          <button
                            type='button'
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loginMutation.isPending}
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
                    <FormMessage className='text-xs mt-1' />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type='submit'
              variant='default'
              className='w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </Form>

        {/* <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-200' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-3 bg-white dark:bg-coffee-navy text-gray-900 dark:text-white text-xs'>
              Or continue with
            </span>
          </div>
        </div> */}

        {/* <div className='grid grid-cols-2 gap-3'>
          <Button
            type='button'
            variant='outline'
            className='h-11 flex items-center justify-center space-x-2 border-gray-300 hover:bg-gray-50'
          >
            <svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z' />
            </svg>
            <span>Google</span>
          </Button>
          <Button
            type='button'
            variant='outline'
            className='h-11 flex items-center justify-center space-x-2 border-gray-300 hover:bg-gray-50'
          >
            <svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.108 0-.612.492-1.108 1.1-1.108s1.1.496 1.1 1.108c0 .612-.494 1.108-1.1 1.108zm8 6.891h-1.706v-3.556c0-.976-.704-1.564-1.594-1.564-.771 0-1.201.405-1.412.811-.082.143-.102.34-.102.531v3.778h-1.687v-4.5c0-.744-.013-1.5.01-2.094h1.464l.088 1.01h.046c.256-.4.879-1.35 2.089-1.35 1.378 0 2.434.9 2.434 2.847v3.637z' />
            </svg>
            <span>LinkedIn</span>
          </Button>
        </div> */}
      </div>
    </div>
  );
}
