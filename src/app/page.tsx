'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  BeanIcon,
  Blend,
  ChartBar,
  Clock,
  Coffee,
  List,
  PlusIcon,
  Settings,
  ShoppingCart,
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { Container } from '@/components/container';
import { getAllRecipes } from '@/services/brewing-assistant-service';
import { Skeleton } from '@/components/ui/skeleton';
import { HomeCard } from '@/components/homeCard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSession } from 'next-auth/react';

dayjs.extend(relativeTime);

const HomeCards = [
  {
    title: 'Recipes',
    href: '/brewing-assistant/recipes',
    icon: <List className='h-5 w-5 text-coffee-navy dark:text-coffee-coral' />,
  },
  {
    title: 'Grinders',
    href: '/grinders',
    icon: <Blend className='h-5 w-5 text-coffee-navy dark:text-coffee-coral' />,
  },
  {
    title: 'Stats (not implemented)',
    href: '/stats',
    icon: (
      <ChartBar className='h-5 w-5 text-coffee-navy dark:text-coffee-coral' />
    ),
  },
];

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['brewing-recipes'],
    queryFn: () => getAllRecipes(),
  });

  // Get the 3 most recent brews, sorted by date (newest first)
  const recentBrews = recipes
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3)
    .map((recipe) => ({
      ...recipe,
      // Format date for display
      formattedDate: new Date(recipe.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }));

  return (
    <Container>
      <div className='flex flex-col min-h-screen bg-transparent '>
        {/* App Header with Welcome Message */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h1 className='text-2xl font-bold text-coffee-navy dark:text-coffee-coral'>
                Home
              </h1>
              <p className='text-coffee-navy/70 dark:text-coffee-white/70'>
                Good evening, {session?.user?.name ?? 'Coffee Lover'}!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8'>
          {HomeCards.map((card) => (
            <HomeCard
              key={card.title}
              title={card.title}
              onClick={() => router.push(card.href)}
            >
              {card.icon}
            </HomeCard>
          ))}
        </div>

        {/* Recent Brews */}
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold text-coffee-navy dark:text-coffee-white'>
              Recent Brews
            </h2>
            <Link
              href='/brewing-assistant/recipes'
              className='text-coffee-navy hover:text-coffee-coral dark:text-coffee-coral dark:hover:text-coffee-coral/80 text-sm font-medium'
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
                  className='block hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors'
                >
                  <div className='hover:bg-coffee-gray/10 dark:hover:bg-coffee-navy-dark flex items-center p-3 bg-white dark:bg-coffee-navy border-2 border-coffee-gray dark:border-coffee-navy-dark cursor-pointer rounded-lg'>
                    <div className='bg-coffee-navy/20 dark:bg-coffee-coral/20 p-2 rounded-lg mr-3'>
                      <Coffee className='w-5 h-5 text-coffee-navy dark:text-coffee-coral' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                        {brew.name}
                      </p>
                    </div>
                    <div className='flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2'>
                      <Clock className='w-3.5 h-3.5 mr-1' />
                      {dayjs().from(brew.createdAt, true)} ago
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
      </div>
    </Container>
  );
}
