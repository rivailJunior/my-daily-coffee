import { BrewingAssistantFormData, BrewingRecipe, generateRecipe } from "@/types/brewingAssistant";
import { getManualBrewerById } from "@/services/manual-brewing-service";
import { getGrinderById } from "@/services/grinder-service";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI, Type } from '@google/genai';
const STORAGE_KEY = 'my-daily-coffee-brewing-recipes';

// Helper to get saved recipes from localStorage
const getSavedRecipes = (): BrewingRecipe[] => {
  if (typeof window === 'undefined') return [];

  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return [];

  try {
    return JSON.parse(storedData);
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

const generateRecipeWithIA = async (
  formData: BrewingAssistantFormData
): Promise<BrewingRecipe | null> => {
  try {
    // TODO: move it to api server
    const ai = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_IA_API_KEY,
    });
    const brewer = getManualBrewerById(formData.brewerId);
    const grinder = getGrinderById(formData.grinderId);

    if (!brewer || !grinder) {
      console.error('Brewer or grinder not found');
      return null;
    }

    // Get AI-generated content for brewing suggestions
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Generate a coffee brewing recipe for:
            - Brewing method: ${brewer.name} (${brewer.brewMethod})
            - Coffee amount: ${formData.coffeeAmount}g
            - Water amount: ${formData.waterAmount}ml
            - Bean: ${formData.beanName}
            - Roast profile: ${formData.roastProfile}
            - Grinder: ${grinder.name}.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              description: {
                type: Type.STRING,
              },
              time: {
                type: Type.NUMBER,
              },
              isPouring: {
                type: Type.BOOLEAN,
              },
              isStirring: {
                type: Type.BOOLEAN,
              },
              waterAmount: {
                type: Type.NUMBER,
              },
            },
            propertyOrdering: [
              'description',
              'time',
              'isPouring',
              'isStirring',
              'waterAmount',
            ],
          },
        },
      },
    });

    // Parse AI response and create recipe
    const aiSuggestion = response.text || 'No AI suggestions available';

    const helperTime = (time: number) => {
      return time < 1 ? time * 100 : time;
    };

    const steps = JSON.parse(aiSuggestion)?.map((step: any) => {
      return {
        id: uuidv4(),
        name: step.description,
        description: step.description,
        time: helperTime(step.time),
        waterAmount: step.waterAmount,
        isPouring: !!step.isPouring,
        isStirring: !!step.isStirring,
        isWaiting: step.isWaiting,
      };
    });

    if (!steps || steps.length === 0) {
      console.error('No valid steps found in AI response');
      return null;
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
    };

    return recipe;
  } catch (error) {
    console.error('Error generating recipe with AI:', error);
    return null;
  }
};

// Generate a brewing recipe based on user input
export const createBrewingRecipe = async (
  formData: BrewingAssistantFormData
): Promise<BrewingRecipe | null> => {
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
    const recipe = await generateRecipeWithIA(formData);
    console.log({ recipe });
    const recipes: BrewingRecipe[] = getSavedRecipes();

    if (recipe) {
      recipes.push(recipe);
      saveRecipes(recipes);
      return recipe;
    }

    return null;
  } catch (error) {
    console.error('Error creating recipe:', error);
    return null;
  }
};

// Get all saved recipes
export const getAllRecipes = (): BrewingRecipe[] => {
  return getSavedRecipes();
};

// Get a recipe by ID
export const getRecipeById = (id: string): BrewingRecipe | undefined => {
  const recipes = getSavedRecipes();
  return recipes.find(recipe => recipe.id === id);
};

// Save a recipe
export const saveRecipe = (recipe: BrewingRecipe): BrewingRecipe => {
  const recipes = getSavedRecipes();
  const index = recipes.findIndex(r => r.id === recipe.id);
  
  if (index === -1) {
    // New recipe
    const newRecipe = {
      ...recipe,
      id: recipe.id || uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    recipes.push(newRecipe);
    saveRecipes(recipes);
    return newRecipe;
  } else {
    // Update existing recipe
    const updatedRecipe = {
      ...recipe,
      updatedAt: new Date().toISOString()
    };
    recipes[index] = updatedRecipe;
    saveRecipes(recipes);
    return updatedRecipe;
  }
};

// Delete a recipe
export const deleteRecipe = (id: string): boolean => {
  const recipes = getSavedRecipes();
  const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
  
  if (filteredRecipes.length === recipes.length) {
    return false; // Nothing was deleted
  }
  
  saveRecipes(filteredRecipes);
  return true;
};
