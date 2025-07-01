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

export function FormContainer({
  heading,
  children,
}: {
  heading?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Container>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-coffee-navy dark:text-coffee-coral'>
          {heading || 'Brewing Assistant'}
        </h1>
        <div>
          <Button
            onClick={() => router.push('/brewing-assistant/recipes')}
            className='text-white'
          >
            <List />
            Recipes
          </Button>
        </div>
      </div>

      <Card 
        data-testid="recipe-card"
        className='w-full mx-auto bg-white dark:bg-coffee-navy border-coffee-navy/30 dark:border-coffee-navy'
      >
        <CardHeader>
          <CardTitle>Create Your Brewing Recipe</CardTitle>
          <CardDescription>
            Select your brewing method, grinder, and beans to get a personalized
            brewing recipe with timer.
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </Container>
  );
}
