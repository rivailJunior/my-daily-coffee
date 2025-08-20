import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import React from 'react';

type SubmitButtonProps = {
  isLoading?: boolean;
  text: string;
};
export function SubmitButton({ isLoading, text }: Readonly<SubmitButtonProps>) {
  return (
    <Button
      className='mt-5'
      variant='default'
      aria-disabled={isLoading}
      disabled={isLoading}
    >
      {text} <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
    </Button>
  );
}
