import {
  BrewingAssistantFormData,
  BrewingRecipe,
  BrewingStep,
  generateRecipe,
} from '@/types/brewingAssistant';
import { getManualBrewerById } from '@/services/manual-brewing-service';
import { getGrinderById } from '@/services/grinder-service';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'my-daily-coffee-brewing-recipes';

export const generateRecipeWithAIViaAPI = async (
  formData: BrewingAssistantFormData
): Promise<BrewingRecipe> => {
  try {
    const brewer = getManualBrewerById(formData.brewerId);
    const grinder = getGrinderById(formData.grinderId);

    if (!brewer || !grinder) {
      throw new Error('Brewer or grinder not found');
    }

    const response = await fetch('/api/brewing-assistant/generate-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        brewer,
        grinder,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate recipe');
    }

    const data = await response.json();

    if (!data) {
      throw new Error('No data returned from API');
    }

    const helperTime = (time: number) => {
      return !!time && time < 1 ? time * 100 : time || 45;
    };

    const steps: BrewingStep[] = [];
    const stepsBeforePouring: BrewingStep[] = [];
    data?.forEach((step: any) => {
      if (step.time || step.isPouring || step.waterAmount) {
        steps.push({
          id: uuidv4(),
          name: step.description,
          description: step.description,
          time: step.time,
          waterAmount: step.waterAmount,
          isPouring: !!step.isPouring,
          isStirring: !!step.isStirring,
          isWaiting: step.isWaiting,
        });
      } else {
        stepsBeforePouring.push({
          id: uuidv4(),
          name: step.description,
          description: step.description,
          time: 0,
          waterAmount: 0,
          isPouring: false,
          isStirring: false,
          isWaiting: false,
        });
      }
    });

    if (!steps || steps.length === 0) {
      throw new Error('No valid steps found in AI response');
    }

    // Create a base recipe using the existing generator
    const baseRecipe = generateRecipe(formData, brewer, grinder);

    // Enhance the recipe with AI suggestions
    const recipe: BrewingRecipe = {
      ...baseRecipe,
      id: `recipe-ai-${Date.now()}`,
      name: `AI ${formData.beanName} with ${brewer.name}`,
      notes: baseRecipe.notes,
      updatedAt: new Date().toISOString(),
      steps: steps,
      stepsBeforePouring: stepsBeforePouring,
      grindSize: data?.[0]?.grindSize,
      waterTemperature: data?.[0]?.waterTemperature,
    };

    return recipe;
  } catch (error) {
    console.error('Error generating recipe via API:', error);
    throw error; // Re-throw to be handled by the caller
  }
};

// Helper to get saved recipes from localStorage
const getSavedRecipes = (): BrewingRecipe[] => {
  if (typeof window === 'undefined') return [];

  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return [];

  try {
    return JSON.parse(storedData).reverse();
  } catch (error) {
    console.error('Error parsing brewing recipes data:', error);
    return [];
  }
};

// Helper to save recipes to localStorage
const saveRecipes = (recipes: BrewingRecipe[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
};

/**
 * @deprecated Use generateRecipeWithAIViaAPI instead
 */
export const generateRecipeWithIA = generateRecipeWithAIViaAPI;

// Generate a brewing recipe based on user input
export const createBrewingRecipe = async (
  formData: BrewingAssistantFormData
): Promise<BrewingRecipe> => {
  try {
    // TODO: validate if user is authenticated and has ia subscription

    // const brewer = getManualBrewerById(formData.brewerId);
    // const grinder = getGrinderById(formData.grinderId);

    // if (!brewer || !grinder) {
    //   console.error("Brewer or grinder not found");
    //   return null;
    // }

    // // Generate recipe based on the selected brewer, grinder, and beans
    // const recipe = generateRecipe(formData, brewer, grinder);

    // TODO: validate if user has ia subscription to use generateRecipeWithIA
    const recipe = await generateRecipeWithAIViaAPI(formData);
    const recipes: BrewingRecipe[] = getSavedRecipes();

    if (recipe) {
      recipes.push(recipe);
      saveRecipes(recipes);
      return recipe;
    }

    throw new Error('Failed to create recipe');
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

// Get all saved recipes
export const getAllRecipes = (): BrewingRecipe[] => {
  return getSavedRecipes();
};

// Get a recipe by ID
export const getRecipeById = (id: string): BrewingRecipe | undefined => {
  const recipes = getSavedRecipes();
  return recipes.find((recipe) => recipe.id === id);
};

// Save a recipe
export const saveRecipe = (recipe: BrewingRecipe): BrewingRecipe => {
  const recipes = getSavedRecipes();
  const idx = recipes.findIndex((r) => r.id === recipe.id);
  if (idx !== -1) {
    // Update existing recipe
    const updatedRecipe = {
      ...recipe,
      updatedAt: new Date().toISOString(),
    };
    recipes[idx] = updatedRecipe;
    saveRecipes(recipes);
    return updatedRecipe;
  } else {
    // New recipe
    const newRecipe = {
      ...recipe,
      id: recipe.id || uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    recipes.push(newRecipe);
    saveRecipes(recipes);
    return newRecipe;
  }
};

// Create a manual recipe from form data (for manual-recipe form)
export async function createManualRecipe(
  formData: BrewingAssistantFormData & {
    steps?: { time: number }[];
  }
): Promise<BrewingRecipe> {
  const {
    brewerId,
    grinderId,
    coffeeAmount,
    waterAmount,
    beanName,
    roastProfile,
    steps,
    waterTemperature,
  } = formData;
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const recipe: BrewingRecipe = {
    id,
    name: `${beanName} Manual Recipe`,
    brewerId,
    grinderId,
    coffeeAmount,
    waterAmount,
    waterTemperature: waterTemperature || 90,
    totalTime: steps?.reduce((sum, s) => sum + s.time, 0) || 0,
    steps:
      steps?.map((step, idx) => ({
        id: uuidv4(),
        name: `Step ${idx + 1}`,
        description: step.description,
        time: step.time,
        isPouring: false,
      })) || [],
    grindSize: 800,
    notes: '',
    beanName,
    roastProfile: roastProfile as any,
    createdAt,
    updatedAt,
    stepsBeforePouring: [],
  };

  saveRecipe(recipe);
  return recipe;
}


// Delete a recipe
export const deleteRecipe = (id: string): boolean => {
  const recipes = getSavedRecipes();
  const filteredRecipes = recipes.filter((recipe) => recipe.id !== id);

  if (filteredRecipes.length === recipes.length) {
    return false; // Nothing was deleted
  }

  saveRecipes(filteredRecipes);
  return true;
};
