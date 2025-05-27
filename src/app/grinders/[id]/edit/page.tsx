"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Grinder } from "@/types/grinder";
import { getGrinderById } from "@/services/grinder-service";
import { GrinderForm } from "@/components/grinders/grinder-form";
import { Button } from "@/components/ui/button";
import { Container } from '@/components/container';

export default function EditGrinderPage() {
  const params = useParams();
  const router = useRouter();
  const [grinder, setGrinder] = useState<Grinder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;

    if (!id) {
      setError('Grinder ID is missing');
      setIsLoading(false);
      return;
    }

    try {
      const grinderData = getGrinderById(id);

      if (!grinderData) {
        setError('Grinder not found');
      } else {
        setGrinder(grinderData);
      }
    } catch (err) {
      console.error('Error loading grinder:', err);
      setError('Failed to load grinder data');
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <div className='flex justify-center items-center h-40'>
          <p className='text-gray-500'>Loading grinder data...</p>
        </div>
      </div>
    );
  }

  if (error || !grinder) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <div className='bg-white dark:bg-coffee-navy-dark border border-coffee-gray/30 dark:border-coffee-navy rounded-lg p-8 text-center'>
          <h3 className='text-xl font-medium mb-2'>Error</h3>
          <p className='text-gray-500 dark:text-gray-400 mb-6'>
            {error || 'Failed to load grinder data'}
          </p>
          <Button onClick={() => router.push('/grinders')}>
            Back to Grinders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-coffee-navy dark:text-coffee-coral'>
          Edit Grinder
        </h1>
        <p className='text-gray-500 dark:text-gray-400'>
          Update information for {grinder.name}
        </p>
      </div>

      <div className='bg-white dark:bg-coffee-navy-dark border border-coffee-gray/30 dark:border-coffee-navy rounded-lg p-6'>
        <GrinderForm grinder={grinder} />
      </div>
    </Container>
  );
}
