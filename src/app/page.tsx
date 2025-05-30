"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Clock, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/container';
import { getAllRecipes } from '@/services/brewing-assistant-service';
import { Skeleton } from '@/components/ui/skeleton';
import dayjs from 'dayjs';

export default function Home() {
  const router = useRouter();
  
  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['brewing-recipes'],
    queryFn: () => getAllRecipes(),
  });

  // Get the 3 most recent brews, sorted by date (newest first)
  const recentBrews = recipes
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
    .map(recipe => ({
      ...recipe,
      // Format date for display
      formattedDate: new Date(recipe.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }));

  // Mock data for coffee beans
  const coffeeBeans = [
    {
      id: 1,
      name: 'Ethiopian Yirgacheffe',
      roaster: 'Blue Bottle',
      roastLevel: 'Light',
    },
    {
      id: 2,
      name: 'Colombian Supremo',
      roaster: 'Stumptown',
      roastLevel: 'Medium',
    },
    {
      id: 3,
      name: 'Sumatra Mandheling',
      roaster: "Peet's",
      roastLevel: 'Dark',
    },
  ];

  return (
    <Container>
      <div className='flex flex-col min-h-screen bg-transparent '>
        {/* App Header with Welcome Message */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h1 className='text-2xl font-bold text-coffee-navy dark:text-coffee-white'>
                My Daily Coffee
              </h1>
              <p className='text-coffee-navy/70 dark:text-coffee-white/70'>
                Good evening, Coffee Lover
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'>
          <Card className='p-4 flex flex-col items-center justify-center hover:bg-coffee-gray/10 dark:hover:bg-coffee-navy-dark cursor-pointer transition-colors border-coffee-gray/30 dark:border-coffee-navy-dark bg-white dark:bg-coffee-navy'>
            <div className='h-10 w-10 rounded-full bg-coffee-coral/20 dark:bg-coffee-coral/10 flex items-center justify-center mb-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-coffee-coral'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' />
              </svg>
            </div>
            <span className='text-sm font-medium text-coffee-navy dark:text-coffee-white'>
              Buy Coffee Beans (not implemented)
            </span>
          </Card>
          <Card className='p-4 flex flex-col items-center justify-center hover:bg-coffee-gray/10 dark:hover:bg-coffee-navy-dark cursor-pointer transition-colors border-coffee-gray/30 dark:border-coffee-navy-dark bg-white dark:bg-coffee-navy'>
            <div
              className='h-10 w-10 rounded-full bg-coffee-coral/20 dark:bg-coffee-coral/10 flex items-center justify-center mb-2'
              onClick={() => router.push('/brewing-assistant/recipes')}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-coffee-coral'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <span className='text-sm font-medium text-coffee-navy dark:text-coffee-white'>
              Recipes
            </span>
          </Card>
          <Card
            className='p-4 flex flex-col items-center justify-center hover:bg-coffee-gray/10 dark:hover:bg-coffee-navy-dark cursor-pointer transition-colors border-coffee-gray/30 dark:border-coffee-navy-dark bg-white dark:bg-coffee-navy'
            onClick={() => router.push('/grinders')}
          >
            <div className='h-10 w-10 rounded-full bg-coffee-coral/20 dark:bg-coffee-coral/10 flex items-center justify-center mb-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-coffee-coral'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <span className='text-sm font-medium text-coffee-navy dark:text-coffee-white'>
              Grinders
            </span>
          </Card>
          <Card className='p-4 flex flex-col items-center justify-center hover:bg-coffee-gray/10 dark:hover:bg-coffee-navy-dark cursor-pointer transition-colors border-coffee-gray/30 dark:border-coffee-navy-dark bg-white dark:bg-coffee-navy'>
            <div className='h-10 w-10 rounded-full bg-coffee-coral/20 dark:bg-coffee-coral/10 flex items-center justify-center mb-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-coffee-coral'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path d='M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z' />
              </svg>
            </div>
            <span className='text-sm font-medium text-coffee-navy dark:text-coffee-white'>
              Stats (not implemented)
            </span>
          </Card>
        </div>

        {/* Brew Timer Card */}
        <Card className='mb-8 p-6 bg-gradient-to-r from-coffee-coral to-coffee-navy text-white border-none'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold'>Brew Timer</h2>
            <Button
              variant='outline'
              className='border-white text-white hover:bg-white/20'
            >
              Start (not implemented)
            </Button>
          </div>
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div>
              <div className='text-3xl font-mono font-bold'>00:00</div>
              <div className='text-xs text-coffee-white/80'>TIMER</div>
            </div>
            <div>
              <div className='text-3xl font-mono font-bold'>18g</div>
              <div className='text-xs text-coffee-white/80'>COFFEE</div>
            </div>
            <div>
              <div className='text-3xl font-mono font-bold'>300ml</div>
              <div className='text-xs text-coffee-white/80'>WATER</div>
            </div>
          </div>
        </Card>

        {/* Recent Brews */}
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold text-coffee-navy dark:text-coffee-white'>
              Recent Brews
            </h2>
            <Link
              href='/brews'
              className='text-coffee-coral hover:text-coffee-coral/80 dark:text-coffee-coral dark:hover:text-coffee-coral/80 text-sm font-medium'
            >
              View All
            </Link>
          </div>
          <div className='space-y-3'>
            {isLoading ? (
              // Loading state
              [1, 2, 3].map((i) => (
                <div key={i} className='flex items-center p-3'>
                  <Skeleton className='h-10 w-10 rounded-lg mr-3' />
                  <div className='space-y-2 flex-1'>
                    <Skeleton className='h-4 w-3/4' />
                    <Skeleton className='h-3 w-1/2' />
                  </div>
                </div>
              ))
            ) : recentBrews.length > 0 ? (
              // Show recent brews
              recentBrews.map((brew) => (
                <Link
                  key={brew.id}
                  href={`/brewing-assistant/timer/${brew.id}`}
                  className='block hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors '
                >
                  <div className='hover:bg-coffee-gray/10 dark:hover:bg-coffee-navy-dark flex items-center p-3 bg-white dark:bg-coffee-navy border-2 border-coffee-gray dark:border-coffee-navy-dark cursor-pointer rounded-lg'>
                    <div className='bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3'>
                      <Coffee className='w-5 h-5 text-coffee-coral dark:text-coffee-coral' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                        {brew.name}
                      </p>
                      <div className='flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400'>
                        <span className='truncate'>
                          {brew.brewerId || 'Custom Brew'}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2'>
                      <Clock className='w-3.5 h-3.5 mr-1' />
                      {brew.formattedDate}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // No recent brews
              <div className='p-4 text-center text-sm text-gray-500 dark:text-gray-400'>
                No recent brews found. Create your first brewing recipe to get
                started!
              </div>
            )}
          </div>
        </div>

        {/* Coffee Beans */}
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold text-coffee-navy dark:text-coffee-white'>
              My Coffee Beans (mocked)
            </h2>
            <Link
              href='/beans'
              className='text-coffee-coral hover:text-coffee-coral/80 dark:text-coffee-coral dark:hover:text-coffee-coral/80 text-sm font-medium'
            >
              View All
            </Link>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {coffeeBeans.map((bean) => (
              <Card
                key={bean.id}
                className='p-4 hover:bg-coffee-gray/10 dark:hover:bg-coffee-navy-dark cursor-pointer transition-colors border-coffee-gray/30 dark:border-coffee-navy-dark bg-white dark:bg-coffee-navy'
              >
                <div className='flex items-center'>
                  <div className='h-10 w-10 rounded-full bg-coffee-coral/20 dark:bg-coffee-coral/10 flex items-center justify-center mr-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-coffee-coral'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className='font-medium text-coffee-navy dark:text-coffee-white'>
                      {bean.name}
                    </h3>
                    <div className='text-sm text-coffee-navy/70 dark:text-coffee-white/70'>
                      {bean.roaster} • {bean.roastLevel}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            <Card className='p-4 border-dashed border-coffee-gray/50 dark:border-coffee-white/20 flex items-center justify-center cursor-pointer hover:bg-coffee-gray/10 dark:hover:bg-coffee-navy-dark transition-colors bg-white dark:bg-coffee-navy'>
              <div className='flex flex-col items-center text-coffee-navy/70 dark:text-coffee-white/70'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 mb-1 text-coffee-coral'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                  />
                </svg>
                <span className='text-sm font-medium'>
                  Add New Beans (not implemented)
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}
