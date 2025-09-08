import React from 'react';
import { BrewingRecipe } from '@/types/brewingAssistant';
import { formatTime } from '@/utils/formatTime';
export interface DetailItemProps {
  label?: string;
  value: string | number;
  valueClassName?: string;
  icon?: string | number | React.ReactNode;
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
      <h2 className='text-md font-regular text-gray-700  text-left capitalize'>
        {recipe.name}
      </h2>

      {/* Divider */}
      <div className='h-px bg-gray-200 my-4 w-3/4 mx-auto'></div>

      {/* Recipe Details */}
      <div className='grid grid-cols-2 '>
        <DetailItem value={formatTime(recipe.totalTime)} icon='⏱️' />
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
      <div className='h-px bg-gray-200 my-4 w-3/4 mx-auto'></div>
      <div className='flex flex-col gap-2'>
        {recipe.steps.map((step, index) => (
          <div key={step.id} className='flex items-center '>
            <DetailItem
              label={index + 1 + '. ' + (step.description ?? step.name)}
              value={'⏱ ' + formatTime(step.time)}
              valueClassName='font-thin text-xs text-gray-700 capitalize'
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className='mt-auto pt-1 border-gray-200 w-full'>
        <span className='text-gray-600 text-xs align-right'>
          @mydailycoffee
        </span>
      </div>
    </div>
  );
}

export function DetailItem({
  label,
  value,
  valueClassName = 'font-regular text-xs text-gray-700 capitalize',
  icon,
}: DetailItemProps) {
  return (
    <div className='flex items-center gap-2'>
      <span className='text-gray-600'>{icon}</span>
      <div className='flex flex-col'>
        {label && (
          <div className='text-xs text-gray-700 font-normal capitalize'>
            {label}
          </div>
        )}
        <div className={valueClassName}>{value}</div>
      </div>
    </div>
  );
}
