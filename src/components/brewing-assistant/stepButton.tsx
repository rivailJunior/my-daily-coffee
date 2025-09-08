import { Button } from '@/components/ui/button';
import React from 'react';

export function StepButton({
  onClick,
  icon,
  disabled,
  variant,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'destructive';
}) {
  return (
    <Button
      type='button'
      variant={variant || 'default'}
      onClick={onClick}
      disabled={disabled}
      className='w-full'
    >
      {icon}
    </Button>
  );
}
