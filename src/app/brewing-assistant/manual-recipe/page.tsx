'use client';
import { BrewingAssistantForm } from '../components/form';
import { createManualRecipe } from '@/services/brewing-assistant-service';

const ManualRecipePage = () => {
  return (
    <BrewingAssistantForm
      handleFormSubmit={createManualRecipe}
      heading='Manual Recipe'
      isManualRecipe
    />
  );
};

export default ManualRecipePage;
