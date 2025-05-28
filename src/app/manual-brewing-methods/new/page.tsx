"use client";

import { ManualBrewerForm } from "@/components/manual-brewing/manual-brewer-form";
import { Container } from '@/components/container';

export default function NewManualBrewerPage() {
  return (
    <Container>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-coffee-navy dark:text-coffee-coral'>
          Add New Brewing Method
        </h1>
        <p className='text-gray-500 dark:text-gray-400'>
          Register a new manual brewing method to use in your recipes
        </p>
      </div>

      <div className='bg-white dark:bg-coffee-navy-dark border border-coffee-gray/30 dark:border-coffee-navy rounded-lg p-6'>
        <ManualBrewerForm />
      </div>
    </Container>
  );
}
