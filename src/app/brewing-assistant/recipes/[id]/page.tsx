'use client';

import React from 'react';
import { DownloadRecipeCard } from '../../components/downloadRecipeCard';
import { Container } from '@/components/container';
import { useQuery } from '@tanstack/react-query';
import { getRecipeById } from '@/services/brewing-assistant-service';
import { BrewingRecipe } from '@/types/brewingAssistant';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getManualBrewerById } from '@/services/manual-brewing-service';
import { getGrinderById } from '@/services/grinder-service';

export default function RecipePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

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

  const { data: brewer } = useQuery({
    queryKey: ['brewer', recipe?.brewerId],
    queryFn: () => getManualBrewerById(recipe?.brewerId || ''),
    enabled: !!recipe?.brewerId,
  });

  const { data: grinder } = useQuery({
    queryKey: ['grinder', recipe?.grinderId],
    queryFn: () => getGrinderById(recipe?.grinderId || ''),
    enabled: !!recipe?.grinderId,
  });

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
      <DownloadRecipeCard
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
          drip: brewer?.name || '',
          grinder: grinder?.name || '',
          ratio: `1:${recipe.coffeeAmount}`,
        }}
        onClose={() => router.back()}
        className='w-full'
      />
    </Container>
  );
}
