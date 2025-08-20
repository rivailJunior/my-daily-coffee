'use client';
import { SendVerificationCode } from './send-verification-code-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { confirmSignupSchema } from '@/types/authSchema';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SubmitButton, ErrorMessage } from '@/components/';
import { handleConfirmSignUp } from '@/services/auth';

type TConfirmSignupForm = z.infer<typeof confirmSignupSchema>;

export function ConfirmSignUpForm() {
  const router = useRouter();
  const form = useForm<TConfirmSignupForm>({
    resolver: zodResolver(confirmSignupSchema),
  });

  const mutation = useMutation({
    mutationFn: handleConfirmSignUp,
    onSuccess: () => {
      form.reset();
      router.push('/auth/login');
    },
  });

  async function onSubmit(values: TConfirmSignupForm) {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('code', values.code);

    return await mutation.mutateAsync(formData);
  }

  return (
    <Form {...form}>
      <form
        className='max-w-md md:ml-auto w-full bg-white color-black rounded-lg px-8 p-6 shadow-md flex flex-col justify-center'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='text-slate-900 lg:text-3xl text-2xl font-bold mb-8 color-invert'>
          Por favor, confirme sua conta!
        </div>
        <div className='space-y-6'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='text-black'>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder='fulano@detal.com' {...field} />
                </FormControl>
                <FormDescription>
                  Digite e-mail cadastrado no sistema
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem className='text-black'>
                <FormLabel>Código de verificação</FormLabel>
                <FormControl>
                  <Input type='text' placeholder='123456' {...field} />
                </FormControl>
                <FormDescription>
                  Digite o código de verificação
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='mt-4'>
          <SubmitButton isLoading={mutation.isPending} text='Confirmar' />
          <SendVerificationCode />
          {mutation.error && (
            <ErrorMessage error='E-mail ou código invalidos' />
          )}
        </div>
        <div className='text-sm text-slate-500 block  text-center'>
          Já possui conta?{' '}
          <Link href='/auth/login' className='text-blue-500 hover:underline'>
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
