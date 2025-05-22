import { BrewingAssistantFormData, BrewingRecipe, generateRecipe } from "@/types/brewingAssistant";
import { getManualBrewerById } from "@/services/manual-brewing-service";
import { getGrinderById } from "@/services/grinder-service";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "my-daily-coffee-brewing-recipes";

// Helper to get saved recipes from localStorage
const getSavedRecipes = (): BrewingRecipe[] => {
  if (typeof window === "undefined") return [];
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return [];
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error parsing brewing recipes data:", error);
    return [];
  }
};

// Helper to save recipes to localStorage
const saveRecipes = (recipes: BrewingRecipe[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
};

// Generate a brewing recipe based on user input
export const createBrewingRecipe = (formData: BrewingAssistantFormData): BrewingRecipe | null => {
  const brewer = getManualBrewerById(formData.brewerId);
  const grinder = getGrinderById(formData.grinderId);
  
  if (!brewer || !grinder) {
    console.error("Brewer or grinder not found");
    return null;
  }
  
  // Generate recipe based on the selected brewer, grinder, and beans
  const recipe = generateRecipe(formData, brewer, grinder);
  
  // Save the recipe to localStorage
  const recipes = getSavedRecipes();
  recipes.push(recipe);
  saveRecipes(recipes);
  
  return recipe;
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
