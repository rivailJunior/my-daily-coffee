'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';
import { Container } from '@/components/container';
import { getAllRecipes } from '@/services/brewing-assistant-service';
import { Skeleton } from '@/components/ui/skeleton';
import { HomeCard, HomeCardHorizontal } from '@/components/homeCard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAuth } from '@/providers/auth-provider';

dayjs.extend(relativeTime);

const HomeCards = [
  {
    title: 'Recipes',
    href: '/brewing-assistant/recipes',
    description: 'View and manage your recipes',
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Grinders',
    href: '/grinders',
    description: 'View and manage your grinders',
    image:
      'https://images.unsplash.com/photo-1554906110-c83e812733f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

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
              <p className='text-coffee-navy/70 dark:text-coffee-white/70 capitalize'>
                Good evening, {user?.email ?? 'Coffee Lover'}!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-2 sm:grid-cols-2 gap-4 mb-8'>
          {HomeCards.map((card) => (
            <HomeCard
              key={card.title}
              title={card.title}
              description={card.description}
              onClick={() => router.push(card.href)}
              image={card.image}
            />
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
                  <HomeCardHorizontal
                    key={brew.id}
                    title={brew.name}
                    description={
                      'Ratio: 1:' +
                      brew.coffeeAmount +
                      ' - Water: ' +
                      brew.waterAmount +
                      'ml' +
                      ' - Roast Profile: ' +
                      brew.roastProfile
                    }
                    createdAt={dayjs(brew.formattedDate).fromNow()}
                    image={
                      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                    }
                  />
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
