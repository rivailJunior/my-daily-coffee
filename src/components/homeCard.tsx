import Image from 'next/image';
import { Button } from './ui/button';
import { Link } from 'lucide-react';

interface HomeCardProps {
  onClick?: () => void;
  title: string;
  description: string;
  image: string;
}

export const HomeCard = ({
  onClick,
  title,
  description,
  image,
}: HomeCardProps) => {
  return (
    <div className=' bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700'>
      <Image
        className='rounded-t-lg w-full h-48 md:h-80 object-cover'
        src={image}
        alt=''
        width={500}
        height={500}
      />
      <div className='p-5'>
        <a href='#'>
          <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            {title}
          </h5>
        </a>
        <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
          {description}
        </p>
        <Button variant='default' onClick={onClick}>
          See more
        </Button>
      </div>
    </div>
  );
};

export const HomeCardHorizontal = ({
  title,
  description,
  image,
  createdAt,
}: HomeCardProps & { createdAt: string }) => {
  return (
    <div className='flex flex-row bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm md:flex-row w-full hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 h-auto'>
      <Image
        className='object-cover max-w-20 h-auto md:h-auto md:max-w-24 md:rounded-none md:rounded-s-lg'
        src={image}
        alt=''
        width={500}
        height={500}
      />
      <div className='flex flex-col  p-4 leading-normal'>
        <div className='text-lg font-medium tracking-tight text-gray-900 dark:text-white capitalize'>
          {title}
        </div>
        <div className='text-md text-gray-700 dark:text-gray-400 pt-1 capitalize'>
          {description}
        </div>
        <div className='text-sm text-gray-700 dark:text-gray-400 pt-4'>
          {createdAt}
        </div>
      </div>
    </div>
  );
};