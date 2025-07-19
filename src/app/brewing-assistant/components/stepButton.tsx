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
      variant='default'
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </Button>
  );
}
