/* eslint-disable react/no-unescaped-entities */
'use client';
import { createBrewingRecipe } from '@/services/brewing-assistant-service';
import { BrewingAssistantForm } from '@/components/brewing-assistant/form';

export default function BrewingAssistantPage() {
  return (
    <BrewingAssistantForm
      handleFormSubmit={createBrewingRecipe}
      heading='AI Brewing Assistant'
      title='AI Brewing Assistant'
      headingDescription='It will generate a recipe based on your brewing method and grinder'
    />
  );
}
