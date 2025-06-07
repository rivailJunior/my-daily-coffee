'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Coffee, Droplet, Plus, Timer as TimerIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
import { useToast } from '@/hooks/use-toast';
import dayjs from 'dayjs';
import { Container } from '@/components/container';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function RecipesPage() {
  const router = useRouter();
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
      <Container>
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
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className='text-center text-red-500'>
          Error loading recipes: {handleError(error)}
        </div>
      </Container>
    );
  }

  return (
    <Container>
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
          {recipes.reverse().map((recipe) => (
            <Card
              key={recipe.id}
              className='h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-coffee-navy-dark'
              onClick={() =>
                router.push(`/brewing-assistant/timer/${recipe.id}`)
              }
            >
              <CardHeader className='py-4 '>
                <CardTitle className='text-xl line-clamp-1 capitalize'>
                  {recipe.name || 'Unnamed Recipe'}
                </CardTitle>
                <CardDescription className='line-clamp-1 capitalize'>
                  Variety - {recipe.beanName || 'No bean name'} | Roast -{' '}
                  {recipe.roastProfile || 'No roast profile'}
                </CardDescription>
              </CardHeader>
              <CardContent className='flex-1'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between p-3 bg-muted/50 dark:bg-coffee-coral/20 rounded-lg'>
                    <div className='flex items-center space-x-2'>
                      <Coffee className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm'>Coffee</span>
                    </div>
                    <span className='font-medium'>{recipe.coffeeAmount}g</span>
                  </div>
                  <div className='flex items-center justify-between p-3 bg-muted/50 dark:bg-coffee-coral/20 rounded-lg'>
                    <div className='flex items-center space-x-2'>
                      <Droplet className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm'>Water</span>
                    </div>
                    <span className='font-medium'>{recipe.waterAmount}ml</span>
                  </div>
                  <div className='flex items-center justify-between p-3 bg-muted/50 dark:bg-coffee-coral/20 rounded-lg'>
                    <div className='flex items-center space-x-2'>
                      <TimerIcon className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm'>Temp</span>
                    </div>
                    <span className='font-medium'>
                      {recipe.waterTemperature}°C
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='flex justify-between items-center pt-4 border-t'>
                <span className='text-xs text-muted-foreground'>
                  {dayjs().from(recipe.updatedAt, true)} ago
                </span>
                <div className='flex space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/brewing-assistant/recipes/${recipe.id}`);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    size='sm'
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/brewing-assistant/timer/${recipe.id}`);
                    }}
                  >
                    <TimerIcon className='mr-2 h-4 w-4' />
                    Brew
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
