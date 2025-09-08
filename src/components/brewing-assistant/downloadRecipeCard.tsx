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
import { RecipeCard, RecipeItemProps } from './recipeCard';

type AspectRatio = '9:16' | '4:5';

interface RecipeCardProps {
  recipe: RecipeItemProps['recipe'];
  onClose?: () => void;
  className?: string;
}

export function DownloadRecipeCard({
  recipe,
  onClose,
  className = '',
}: RecipeCardProps) {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current);

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
      <div className='flex items-center gap-2 mb-4 '>
        <div className='flex items-center gap-2 '>
          <Instagram className='w-8 h-8 text-coffee-coral' />
          <Select
            value={aspectRatio}
            onValueChange={(value: AspectRatio) => setAspectRatio(value)}
          >
            <SelectTrigger className='w-full'>
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
        data-testid='recipe-card'
        className={`${getAspectRatioClass()} relative bg-white  overflow-hidden shadow-xl flex flex-col`}
      >
        {/* Content */}
        <RecipeCard recipe={recipe} />
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 mt-4'>
        <Button
          onClick={handleDownload}
          className='bg-coffee-navy text-white flex items-center gap-2'
        >
          <Download className='w-4 h-4' />
          Download
        </Button>
        {onClose && (
          <Button
            variant='outline'
            onClick={onClose}
            className='border-coffee-navy text-white'
          >
            <X className='w-4 h-4 mr-2' />
            Close
          </Button>
        )}
      </div>
    </div>
  );
}
