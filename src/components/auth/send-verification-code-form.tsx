'use client';

import { Button } from '@/components/ui/button';
import { handleSendEmailVerificationCode } from '@/services/auth';
import { ArrowRightIcon } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';

export function SendVerificationCode() {
  const [response, dispatch] = useFormState(handleSendEmailVerificationCode, {
    message: '',
    errorMessage: '',
  });
  const { pending } = useFormStatus();
  return (
    <>
      <Button
        className='mt-4 w-full bg-green-700 hover:bg-green-600 text-white shadow-xl py-2.5 px-4 text-sm font-semibold rounded'
        aria-disabled={pending}
        formAction={dispatch}
      >
        Reenviar código{' '}
        <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
      </Button>
      <div className='flex h-8 items-end space-x-1'>
        <div
          className='flex h-8 items-end space-x-1'
          aria-live='polite'
          aria-atomic='true'
        >
          {response?.errorMessage && (
            <p className='text-sm text-red-500'>{response.errorMessage}</p>
          )}
          {response?.message && (
            <p className='text-sm text-green-500'>{response.message}</p>
          )}
        </div>
      </div>
    </>
  );
}
