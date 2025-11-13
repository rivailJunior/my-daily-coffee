import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { List } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';

interface FormContainerProps {
  heading?: string;
  children: React.ReactNode;
  headingDescription?: string;
  title?: string;
  href?: string;
  buttonLabel?: string;
}

export function FormContainer({
  heading,
  children,
  headingDescription,
  title,
  href,
  buttonLabel,
}: Readonly<FormContainerProps>) {
  const router = useRouter();
  return (
    <Container>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-coffee-navy dark:text-coffee-coral'>
          {heading || 'Brewing Assistant'}
        </h1>
        <div>
          <Button
            onClick={() => router.push(href || '/brewing-assistant/recipes')}
            variant='outline'
          >
            <List />
            {buttonLabel}
          </Button>
        </div>
      </div>

      <Card
        data-testid='recipe-card'
        className='w-full mx-auto bg-white dark:bg-coffee-navy-dark border border-gray-200 dark:border-coffee-navy overflow-hidden'
      >
        <CardHeader className='dark:bg-gray-600 bg-gray-200 mb-4 shadow-md dark:shadow-md'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{headingDescription}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </Container>
  );
}
