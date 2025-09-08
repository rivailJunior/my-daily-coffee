import React from 'react';
import { Input } from '@/components/ui/input';
import { onlyNumber } from '@/utils/inputField';

export function InputNumber({
  field,
  onChange,
  placeholder,
  disabled,
}: {
  field: any;
  onChange: any;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <Input
      type='text'
      className='bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-coffee-coral/50 dark:focus:ring-coffee-coral/70 transition-colors'
      {...field}
      placeholder={placeholder}
      onChange={(e) => {
        const numValue = onlyNumber(e.target.value);
        onChange(numValue || 0);
      }}
      disabled={disabled}
    />
  );
}
