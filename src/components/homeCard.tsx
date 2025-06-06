import { Card } from './ui/card';

interface HomeCardProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const HomeCard = ({ children, onClick }: HomeCardProps) => {
  return (
    <Card
      className='p-4 flex flex-col items-center justify-center hover:bg-coffee-gray/10 dark:hover:bg-coffee-navy-dark cursor-pointer transition-colors border-coffee-gray/30 dark:border-coffee-navy-dark bg-white dark:bg-coffee-navy'
      onClick={onClick}
    >
      {children}
    </Card>
  );
};
