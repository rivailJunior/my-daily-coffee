'use client';

import React from 'react';
import { RecipeCard } from '../../components/recipeCard';
import { Container } from '@/components/container';
import { useQuery } from '@tanstack/react-query';
import { getRecipeById } from '@/services/brewing-assistant-service';
import { BrewingRecipe } from '@/types/brewingAssistant';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function RecipePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  console.log(id);

  // Load recipe data
  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery<BrewingRecipe | undefined, Error>({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id),
    enabled: !!id,
  });

  console.log(recipe);

  if (isLoading) {
    return (
      <Container>
        <p className='text-lg sm:text-xl'>Loading recipe...</p>
      </Container>
    );
  }

  if (error || !recipe) {
    return (
      <Container>
        <AlertCircle className='h-12 w-12 sm:h-16 sm:w-16 text-red-500 mb-4' />
        <p className='text-lg sm:text-xl mb-4'>Error loading recipe</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container>
      <RecipeCard
        recipe={{
          name: recipe.name,
          steps: recipe.steps,
          totalTime: recipe.totalTime,
          coffeeAmount: recipe.coffeeAmount,
          notes: recipe.notes,
          roastProfile: recipe.roastProfile,
          grindSize: recipe.grindSize,
          waterAmount: recipe.waterAmount,
          waterTemperature: recipe.waterTemperature,
          drip: 'teste',
          grinder: 'teste',
          ratio: 'teste',
        }}
        onClose={() => router.back()}
        className='w-full'
      />
    </Container>
  );
}
