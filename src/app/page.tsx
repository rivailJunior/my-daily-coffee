"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/container';

export default function Home() {
  const router = useRouter();
  // Mock data for recent brews
  const recentBrews = [
    {
      id: 1,
      name: 'Morning Espresso',
      rating: 4.5,
      date: '2 hours ago',
      method: 'Espresso',
    },
    {
      id: 2,
      name: 'Ethiopian Pour Over',
      rating: 5,
      date: 'Yesterday',
      method: 'Pour Over',
    },
    {
      id: 3,
      name: 'Afternoon Latte',
      rating: 4,
      date: '2 days ago',
      method: 'Espresso',
    },
  ];

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
      <div className='flex flex-col min-h-screen bg-white dark:bg-coffee-navy'>
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
              Buy Beans
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
              Stats
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
              Start
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
            {recentBrews.map((brew) => (
              <Card
                key={brew.id}
                className='p-4 hover:bg-coffee-gray/10 dark:hover:bg-coffee-navy-dark cursor-pointer transition-colors border-coffee-gray/30 dark:border-coffee-navy-dark bg-white dark:bg-coffee-navy'
              >
                <div className='flex justify-between items-center'>
                  <div>
                    <h3 className='font-medium text-coffee-navy dark:text-coffee-white'>
                      {brew.name}
                    </h3>
                    <div className='text-sm text-coffee-navy/70 dark:text-coffee-white/70'>
                      {brew.method} • {brew.date}
                    </div>
                  </div>
                  <div className='flex items-center bg-coffee-coral/20 dark:bg-coffee-coral/10 px-2 py-1 rounded-full'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4 text-coffee-coral mr-1'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    <span className='text-sm font-medium text-coffee-navy dark:text-coffee-white'>
                      {brew.rating}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Coffee Beans */}
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold text-coffee-navy dark:text-coffee-white'>
              My Coffee Beans
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
                <span className='text-sm font-medium'>Add New Beans</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}
