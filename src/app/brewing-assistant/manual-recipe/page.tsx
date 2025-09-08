'use client';
import { BrewingAssistantForm } from '@/components/brewing-assistant/form';
import { createManualRecipe } from '@/services/brewing-assistant-service';

const ManualRecipePage = () => {
  return (
    <BrewingAssistantForm
      handleFormSubmit={createManualRecipe}
      heading='Manual Recipe'
      isManualRecipe
      title='Manual Recipe'
      headingDescription='Create your own recipe. Save. Share. '
    />
  );
};

export default ManualRecipePage;
