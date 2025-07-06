'use client';

import React from 'react';
import { RecipeCard } from '../../components/recipeCard';
import { Container } from '@/components/container';

export default function RecipePage() {
  return (
    <Container>
      <RecipeCard
        recipe={{
          name: 'Arara V60',
          totalTime: 180,
          drip: 'V60',
          ratio: '1:15',
          grinder: 'Kingrinder K4',
          grindSize: 800,
          waterTemperature: 89,
          waterAmount: 240,
          coffeeAmount: 20,
          steps: [
            {
              id: 'step-1',
              name: 'Step 1',
              description: 'Step 1',
              time: 10,
              isPouring: true,
            },
            {
              id: 'step-2',
              name: 'Step 2',
              description: 'Step 2',
              time: 10,
              isPouring: true,
            },
            {
              id: 'step-3',
              name: 'Step 3',
              description: 'Step 3',
              time: 10,
              isPouring: true,
            },
            {
              id: 'step-4',
              name: 'Step 4',
              description: 'Step 4',
              time: 10,
              isPouring: true,
            },
          ],
        }}
        onClose={() => {}}
        className='w-full'
      />
    </Container>
  );
}
