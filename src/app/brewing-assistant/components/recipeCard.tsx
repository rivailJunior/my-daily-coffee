'use client';

import React, { useRef, useState } from 'react';
import { Download, Instagram, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import html2canvas from 'html2canvas';
import { BrewingRecipe } from '@/types/brewingAssistant';

type AspectRatio = '9:16' | '4:5';

interface RecipeCardProps {
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
  onClose?: () => void;
  className?: string;
}

export function RecipeCard({
  recipe,
  onClose,
  className = '',
}: RecipeCardProps) {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:5');
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher scale for better quality
      });

      const link = document.createElement('a');
      link.download = `${recipe.name
        .replace(/\s+/g, '-')
        .toLowerCase()}-recipe.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'w-[337.5px] h-[600px]';
      case '4:5':
      default:
        return 'w-[400px] h-[500px]';
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className='flex items-center gap-2 mb-4'>
        <div className='flex items-center gap-2'>
          <Instagram className='w-5 h-5 text-pink-600' />
          <span className='text-sm font-medium'>Aspect Ratio:</span>
          <Select
            value={aspectRatio}
            onValueChange={(value: AspectRatio) => setAspectRatio(value)}
          >
            <SelectTrigger className='w-[100px]'>
              <SelectValue placeholder='Select ratio' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='4:5'>4:5 (Portrait)</SelectItem>
              <SelectItem value='9:16'>9:16 (Story)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        ref={cardRef}
        className={`${getAspectRatioClass()} relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl overflow-hidden shadow-xl flex flex-col`}
      >
        {/* Header with gradient */}
        <div className='h-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600'></div>

        {/* Content */}
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
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 mt-4'>
        <Button
          onClick={handleDownload}
          className='bg-amber-600 hover:bg-amber-700 flex items-center gap-2'
        >
          <Download className='w-4 h-4' />
          Download
        </Button>
        {onClose && (
          <Button
            variant='outline'
            onClick={onClose}
            className='border-amber-300 text-amber-700 hover:bg-amber-50'
          >
            <X className='w-4 h-4 mr-2' />
            Close
          </Button>
        )}
      </div>
    </div>
  );
}

interface DetailItemProps {
  label?: string;
  value: string | number;
  valueClassName?: string;
  icon: string | number;
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
