import { BrewingRecipe } from '@/types/brewingAssistant';
import React from 'react';

export interface DetailItemProps {
  label?: string;
  value: string | number;
  valueClassName?: string;
  icon: string | number;
}

export interface RecipeItemProps {
  recipe: Pick<
    BrewingRecipe,
    | 'name'
    | 'steps'
    | 'totalTime'
    | 'coffeeAmount'
    | 'notes'
    | 'roastProfile'
    | 'grindSize'
    | 'waterAmount'
    | 'waterTemperature'
  > & {
    drip: string;
    grinder: string;
    ratio: string;
  };
}

export function RecipeCard({ recipe }: RecipeItemProps) {
  return (
    <div className='flex-1 p-4 flex flex-col'>
      {/* Title */}
      <h2 className='text-md font-regular text-amber-900  text-center'>
        {recipe.name}
      </h2>

      {/* Divider */}
      <div className='h-px bg-amber-200 my-4 w-3/4 mx-auto'></div>

      {/* Recipe Details */}
      <div className='grid grid-cols-2 gap-1'>
        <DetailItem value={recipe.totalTime} icon='⏱️' />
        <DetailItem value={recipe.drip} icon='🍶' />
        <DetailItem value={recipe.ratio} icon='⚖️' />
        <DetailItem value={recipe.waterTemperature + '°C'} icon='🌡️' />
        <DetailItem value={recipe.waterAmount + 'ml'} icon='💧' />
        <DetailItem
          value={recipe.grinder + ' - ' + recipe.grindSize}
          icon='⚙'
        />
      </div>
      {/* Divider */}
      <div className='h-px bg-amber-200 my-4 w-3/4 mx-auto'></div>
      <div className='grid grid-cols-1 gap-1'>
        {recipe.steps.map((step, index) => (
          <div key={step.id} className='flex items-center gap-2'>
            <DetailItem
              label={step.description ?? step.name}
              value={'⏱ ' + step.time}
              valueClassName='font-thin text-xs text-gray-700'
              icon={index + 1}
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className='mt-auto pt-4 border-t border-amber-200'>
        <div className='flex items-center justify-center gap-2'>
          <span className='text-amber-700 text-sm font-medium'>
            My Daily Coffee
          </span>
          <span className='text-amber-400'>•</span>
          <span className='text-amber-600 text-sm'>@mydailycoffee</span>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  valueClassName = 'font-regular text-sm text-amber-900',
  icon,
}: DetailItemProps) {
  return (
    <div className='flex items-center gap-2'>
      <span className='text-amber-700'>{icon}</span>
      <div>
        {label && (
          <div className='text-sm text-amber-600 font-normal'>{label}</div>
        )}
        <div className={valueClassName}>{value}</div>
      </div>
    </div>
  );
}
