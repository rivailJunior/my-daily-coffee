import React from 'react';

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className='container mx-auto px-4 pt-16 pb-28 md:pt-16 lg:pt-14 bg-transparent'>
      {children}
    </div>
  );
}
