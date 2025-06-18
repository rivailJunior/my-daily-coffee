/* eslint-disable react/no-unescaped-entities */
'use client';
import { createBrewingRecipe } from '@/services/brewing-assistant-service';
import { BrewingAssistantForm } from './components/form';

export default function BrewingAssistantPage() {
  return (
    <BrewingAssistantForm
      handleFormSubmit={createBrewingRecipe}
      heading='AI Brewing Assistant'
    />
  );
}
