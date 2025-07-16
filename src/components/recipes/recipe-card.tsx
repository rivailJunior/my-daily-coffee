'use client';

import { useRouter } from 'next/navigation';
import { BrewingRecipe } from '@/types/brewingAssistant';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface RecipeCardProps {
  recipe: BrewingRecipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const router = useRouter();

  return (
    <Card className='p-6 bg-white dark:bg-coffee-navy border border-gray-200 dark:border-coffee-navy-dark rounded-xl shadow-sm'>
      <div className='flex flex-col items-start justify-between gap-6'>
        {/* Left Section: Info */}
        <div className='flex-1'>
          <div className='flex gap-3 mb-1'>
            <h3 className='text-lg font-medium text-coffee-navy dark:text-coffee-coral truncate capitalize'>
              {recipe.name || 'Unnamed Recipe'}
            </h3>
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-300 mb-4 capitalize font-medium'>
            {recipe?.beanName} - {recipe?.roastProfile} -{' '}
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              {dayjs().from(recipe.updatedAt, true)} ago
            </span>
          </div>
          <div className='grid grid-cols-2 gap-y-2 gap-x-8 text-sm'>
            <div>
              <div className='uppercase text-xs text-gray-500 dark:text-gray-400 tracking-wider'>
                Coffee
              </div>
              <div className='font-semibold text-coffee-navy dark:text-coffee-coral'>
                {recipe.coffeeAmount}g
              </div>
            </div>
            <div>
              <div className='uppercase text-xs text-gray-500 dark:text-gray-400 tracking-wider'>
                Water
              </div>
              <div className='font-semibold text-coffee-navy dark:text-coffee-coral'>
                {recipe.waterAmount}ml
              </div>
            </div>
            <div>
              <div className='uppercase text-xs text-gray-500 dark:text-gray-400 tracking-wider'>
                Temp
              </div>
              <div className='font-semibold text-coffee-navy dark:text-coffee-coral'>
                {recipe.waterTemperature}°C
              </div>
            </div>
            <div>
              <div className='uppercase text-xs text-gray-500 dark:text-gray-400 tracking-wider'>
                Ratio
              </div>
              <div className='font-semibold text-coffee-navy dark:text-coffee-coral'>
                {recipe.waterAmount / recipe.coffeeAmount}:1
              </div>
            </div>
          </div>
        </div>
        {/* Right Section: Actions */}
        <div className='flex flex-col items-start justify-between w-full'>
          <div className='flex space-x-2 w-full'>
            {' '}
            <Button
              variant='default'
              size='sm'
              className='w-full'
              onClick={(e) => {
                router.push(`/brewing-assistant/timer/${recipe.id}`);
              }}
            >
              Brew
            </Button>
            <Button
              size='sm'
              className='w-full'
              variant='outline'
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/brewing-assistant/recipes/${recipe.id}`);
              }}
            >
              Screenshot
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
