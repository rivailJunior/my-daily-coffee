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
      className='w-full shadow-xl py-2.5 px-4 mt-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none'
      aria-disabled={isLoading}
      disabled={isLoading}
    >
      {text} <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
    </Button>
  );
}
