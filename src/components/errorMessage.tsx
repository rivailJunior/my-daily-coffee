import React from 'react';

type ErrorMessageProps = {
  error: string | undefined;
};

export function ErrorMessage({ error }: Readonly<ErrorMessageProps>) {
  return (
    <div className='flex w-full '>
      {error && (
        <p className='text-sm text-red-500 text-center w-full'>{error}</p>
      )}
    </div>
  );
}
