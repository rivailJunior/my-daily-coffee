import { Card } from './ui/card';

interface HomeCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  title: string;
}

export const HomeCard = ({ children, onClick, title }: HomeCardProps) => {
  return (
    <Card
      className='p-4 flex flex-col items-center justify-center hover:bg-coffee-gray/10 dark:hover:bg-coffee-navy-dark cursor-pointer transition-colors border-coffee-gray/30 dark:border-coffee-navy-dark bg-white dark:bg-coffee-navy'
      onClick={onClick}
    >
      <div className='h-10 w-10 rounded-full bg-coffee-navy/20 dark:bg-coffee-coral/20 flex items-center justify-center mb-2'>
        {children}
      </div>
      <span className='text-sm font-medium text-coffee-navy dark:text-coffee-white'>
        {title}
      </span>
    </Card>
  );
};
