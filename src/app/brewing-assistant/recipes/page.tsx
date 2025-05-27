'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { getAllRecipes } from '@/services/brewing-assistant-service';
import { BrewingRecipe } from '@/types/brewingAssistant';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import dayjs from 'dayjs';

export default function RecipesPage() {
  const {
    data: recipes = [],
    isLoading,
    error,
  } = useQuery<BrewingRecipe[]>({
    queryKey: ['brewing-recipes'],
    queryFn: () => getAllRecipes(),
  });

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred while loading recipes.';
  };

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold'>My Brewing Recipes</h1>
          <Button disabled>
            <Plus className='mr-2 h-4 w-4' />
            New Recipe
          </Button>
        </div>
        <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3].map((i) => (
            <Card key={i} className='h-48'>
              <CardHeader>
                <Skeleton className='h-6 w-3/4 mb-2' />
                <Skeleton className='h-4 w-1/2' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-4 w-full mb-2' />
                <Skeleton className='h-4 w-5/6' />
              </CardContent>
              <CardFooter>
                <Skeleton className='h-4 w-24' />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center text-red-500'>
          Error loading recipes: {handleError(error)}
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>My Brewing Recipes</h1>
        <Button asChild>
          <Link href='/brewing-assistant/recipes/new'>
            <Plus className='mr-2 h-4 w-4' />
            New Recipe
          </Link>
        </Button>
      </div>

      {!recipes || recipes.length === 0 ? (
        <div className='text-center py-12'>
          <h3 className='text-lg font-medium'>No recipes yet</h3>
          <p className='text-muted-foreground mt-2'>
            Create your first brewing recipe to get started
          </p>
          <Button className='mt-4' asChild>
            <Link href='/brewing-assistant/recipes/new'>Create Recipe</Link>
          </Button>
        </div>
      ) : (
        <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/brewing-assistant/recipes/${recipe.id}`}
            >
              <Card className='h-full transition-colors hover:bg-accent/50'>
                <CardHeader>
                  <CardTitle className='text-xl'>
                    {recipe.name || 'Unnamed Recipe'}
                  </CardTitle>
                  <CardDescription className='line-clamp-1'>
                    {recipe.beanName || 'No bean name'}
                    {recipe.roastProfile && ` • ${recipe.roastProfile}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Coffee
                      </span>
                      <span>{recipe.coffeeAmount}g</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Water
                      </span>
                      <span>{recipe.waterAmount}ml</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Temp
                      </span>
                      <span>{recipe.waterTemperature}°C</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='text-sm text-muted-foreground'>
                  Last updated{' '}
                  {dayjs(new Date(recipe.updatedAt)).format('MMM d, yyyy')}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
