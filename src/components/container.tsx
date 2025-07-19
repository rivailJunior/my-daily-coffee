import React from 'react';

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className='container mx-auto px-4 pt-6 pb-28 md:pt-12 lg:pt-10 bg-transparent'>
      {children}
    </div>
  );
}
