import { Button } from '@/components/ui/button';
import React from 'react';

export function StepButton({
  onClick,
  icon,
  disabled,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Button
      type='button'
      className='px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition w-full'
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </Button>
  );
}
