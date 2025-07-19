import Image from 'next/image';
import { Button } from './ui/button';

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
