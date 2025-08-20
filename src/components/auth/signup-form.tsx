'use client';
import React from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { handleSignUp } from '@/services/auth';
import { signupSchema } from '@/types/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { ErrorMessage, SubmitButton } from '@/components';
import { useToast } from '@/hooks/useToast';

type TSignupForm = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { toast } = useToast();
  const form = useForm<TSignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const mutation = useMutation({
    mutationFn: handleSignUp,
    onSuccess: () => {
      form.reset();
      // Optionally redirect to confirm signup page
      // router.push('/auth/confirm-signup');
    },
    onError: (error: Error) => {
      // Show error message to user
      toast({
        title: 'Error',
        description:
          error.message || 'Erro ao realizar cadastro. Tente novamente.',
        variant: 'destructive',
      });
      console.error('Signup error:', error);
    },
  });

  async function onSubmit(values: TSignupForm) {
    try {
      const response = await mutation.mutateAsync({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      // Show success message
      toast({
        title: 'Success',
        description:
          'Cadastro realizado com sucesso! Por favor, verifique seu e-mail.',
        variant: 'default',
      });
      return response;
    } catch (error) {
      // Error is already handled by the mutation's onError
      return null;
    }
  }

  return (
    <div className='flex min-h-screen w-full items-center justify-center p-4'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='max-w-md  w-full bg-white p-8 shadow-lg dark:bg-gray-800 rounded-lg flex flex-col justify-center'
        >
          <div className='text-invert lg:text-3xl text-2xl font-bold mb-8 text-center'>
            Sign up
          </div>

          <div className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='text-invert'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='John Doe' {...field} />
                  </FormControl>
                  <FormDescription>Enter your name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='email'
              control={form.control}
              render={({ field }) => (
                <FormItem className='text-invert'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='fulano@detal.com' {...field} />
                  </FormControl>
                  <FormDescription>Enter your email</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='password'
              control={form.control}
              render={({ field }) => (
                <FormItem className='text-invert'>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='*****' {...field} />
                  </FormControl>
                  <FormDescription>Enter your password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='confirmPassword'
              control={form.control}
              render={({ field }) => (
                <FormItem className='text-invert'>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='*****' {...field} />
                  </FormControl>
                  <FormDescription>Confirm your password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <SubmitButton isLoading={mutation.isPending} text='Sign up' />
          {mutation.error && (
            <ErrorMessage error='Ops, algo deu errado. Tente novamente!' />
          )}
          <p className='text-sm mt-4 text-slate-500 block  text-center'>
            Already have an account?{' '}
            <Link href='/login' className='mt-2 cursor-pointer text-blue-500'>
              Login.
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
