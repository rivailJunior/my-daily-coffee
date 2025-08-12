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
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';

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
    mutationFn: async (values: FormValues) => {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          username: values.email,
          password: values.password,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      return response.json();
    },
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
    loginMutation.mutate(values);
  };

  return (
    <div className='flex min-h-screen w-full items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Sign in to your account
          </h2>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Or{' '}
            <a
              href='/register'
              className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
            >
              create a new account
            </a>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='your@email.com'
                        type='email'
                        autoCapitalize='none'
                        autoComplete='email'
                        autoCorrect='off'
                        disabled={loginMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel>Password</FormLabel>
                      <a
                        href='/forgot-password'
                        className='text-sm font-medium text-blue-600 hover:underline dark:text-blue-400'
                      >
                        Forgot password?
                      </a>
                    </div>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder='••••••••'
                          type={showPassword ? 'text' : 'password'}
                          autoComplete='current-password'
                          disabled={loginMutation.isPending}
                          className='pr-10'
                          {...field}
                        />
                        <button
                          type='button'
                          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loginMutation.isPending}
                        >
                          {showPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                          <span className='sr-only'>
                            {showPassword ? 'Hide password' : 'Show password'}
                          </span>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type='submit'
              className='w-full'
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
      </div>
    </div>
  );
}
