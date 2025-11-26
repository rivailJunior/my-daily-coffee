import { ManualBrewer } from "./manualBrewing";
import { Grinder } from "./grinder";

export interface BrewingRecipe {
  id: string;
  name: string;
  brewerId: string; // Reference to ManualBrewer.id
  grinderId: string; // Reference to Grinder.id
  coffeeAmount: number; // in grams
  waterAmount: number; // in ml
  waterTemperature: number; // in Celsius
  grindSize: number; // 1-13 scale
  totalTime: number; // in seconds
  steps: BrewingStep[];
  notes?: string;
  beanName?: string;
  roastProfile?: RoastProfile;
  createdAt: string;
  updatedAt: string;
  stepsBeforePouring: BrewingStep[];
}

export interface BrewingStep {
  id: string;
  name: string;
  description: string;
  time: number; // in seconds
  waterAmount?: number; // in ml (for pour steps)
  isPouring: boolean;
  isStirring?: boolean;
  isWaiting?: boolean;
}

export type RoastProfile = 'light' | 'medium' | 'medium-dark' | 'dark';

export const ROAST_PROFILES = [
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  // { value: 'medium-dark', label: 'Medium-Dark' },
  { value: 'dark', label: 'Dark' },
];

export interface BrewingAssistantFormData {
  brewerId: string;
  grinderId: string;
  coffeeAmount: number;
  waterAmount: number;
  beanName: string;
  roastProfile: RoastProfile;
  grindSize?: number; // 1-13 scale, matches BrewingRecipe
  steps?: Pick<BrewingStep, 'time' | 'description'>[];
  waterTemperature?: number;
}

// Recipe templates for different brewing methods
export const generateRecipe = (
  formData: BrewingAssistantFormData,
  brewer: ManualBrewer,
  grinder: Grinder
): BrewingRecipe => {
  const {
    brewerId,
    grinderId,
    coffeeAmount,
    waterAmount,
    beanName,
    roastProfile,
  } = formData;

  // Base recipe structure
  const recipe: BrewingRecipe = {
    id: `recipe-${Date.now()}`,
    name: `${beanName} with ${brewer.name}`,
    brewerId,
    grinderId,
    coffeeAmount,
    waterAmount,
    waterTemperature: 0,
    grindSize: 0,
    totalTime: brewer.brewTime.max,
    steps: [],
    notes: `${beanName} (${roastProfile} roast) brewed with ${brewer.name} using a ${grinder.name} grinder.`,
    beanName,
    roastProfile,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stepsBeforePouring: [],
  };

  // Generate steps based on brewing method
  switch (brewer.brewMethod) {
    case 'percolation':
      recipe.steps = generatePercolationSteps(recipe);
      break;
    case 'immersion':
      recipe.steps = generateImmersionSteps(recipe);
      break;
    case 'hybrid':
      recipe.steps = generateHybridSteps(recipe);
      break;
    default:
      recipe.steps = generateDefaultSteps(recipe);
  }

  return recipe;
};

// Helper functions for recipe generation
const getWaterTemperature = (roastProfile: RoastProfile): number => {
  switch (roastProfile) {
    case 'light':
      return 96; // Higher temperature for light roasts
    case 'medium':
      return 93;
    case 'medium-dark':
      return 91;
    case 'dark':
      return 88; // Lower temperature for dark roasts
    default:
      return 93;
  }
};

const getGrindSize = (brewer: ManualBrewer, roastProfile: RoastProfile): number => {
  // Start with the brewer's recommended grind size
  let baseSize = brewer.recommendedGrindSize;
  
  // Adjust based on roast profile
  switch (roastProfile) {
    case 'light':
      // Slightly finer for light roasts to increase extraction
      return Math.max(1, baseSize - 1);
    case 'dark':
      // Slightly coarser for dark roasts to prevent over-extraction
      return Math.min(13, baseSize + 1);
    default:
      return baseSize;
  }
};

// Step generators for different brewing methods
const generatePercolationSteps = (recipe: BrewingRecipe): BrewingStep[] => {
  const { waterAmount, coffeeAmount } = recipe;
  const bloomWater = Math.round(coffeeAmount * 2); // 2:1 ratio for bloom
  const remainingWater = waterAmount - bloomWater;
  const pourCount = 3; // Number of pours after bloom
  const waterPerPour = Math.round(remainingWater / pourCount);
  
  const steps: BrewingStep[] = [
    {
      id: `step-bloom-${Date.now()}`,
      name: 'Bloom',
      description: `Pour ${bloomWater}ml of water to saturate all grounds`,
      time: 30,
      waterAmount: bloomWater,
      isPouring: true,
      isStirring: true
    }
  ];
  
  // Add multiple pour steps
  for (let i = 1; i <= pourCount; i++) {
    const pourTime = i === pourCount ? 30 : 20; // Last pour is slower
    steps.push({
      id: `step-pour-${i}-${Date.now()}`,
      name: `Pour ${i}`,
      description: `Slowly pour ${waterPerPour}ml of water in circular motion`,
      time: pourTime,
      waterAmount: waterPerPour,
      isPouring: true
    });
    
    // Add waiting step between pours (except after the last pour)
    if (i < pourCount) {
      steps.push({
        id: `step-wait-${i}-${Date.now()}`,
        name: 'Wait',
        description: 'Let water drain through the coffee bed',
        time: 20,
        isPouring: false,
        isWaiting: true
      });
    }
  }
  
  // Add final drawdown step
  steps.push({
    id: `step-drawdown-${Date.now()}`,
    name: 'Final Drawdown',
    description: 'Let all water drain through the coffee bed',
    time: 60,
    isPouring: false,
    isWaiting: true
  });
  
  return steps;
};

const generateImmersionSteps = (recipe: BrewingRecipe): BrewingStep[] => {
  const { waterAmount } = recipe;
  
  return [
    {
      id: `step-pour-${Date.now()}`,
      name: 'Add Water',
      description: `Pour ${waterAmount}ml of water`,
      time: 30,
      waterAmount,
      isPouring: true
    },
    {
      id: `step-stir-${Date.now()}`,
      name: 'Stir',
      description: 'Gently stir to ensure all grounds are saturated',
      time: 10,
      isPouring: false,
      isStirring: true
    },
    {
      id: `step-steep-${Date.now()}`,
      name: 'Steep',
      description: 'Let coffee steep',
      time: recipe.totalTime - 70, // Total time minus other steps
      isPouring: false,
      isWaiting: true
    },
    {
      id: `step-press-${Date.now()}`,
      name: 'Press/Filter',
      description: 'Press plunger down slowly or release valve',
      time: 30,
      isPouring: false
    }
  ];
};

const generateHybridSteps = (recipe: BrewingRecipe): BrewingStep[] => {
  const { waterAmount } = recipe;
  const halfWater = Math.round(waterAmount / 2);
  
  return [
    {
      id: `step-pour1-${Date.now()}`,
      name: 'First Pour',
      description: `Pour ${halfWater}ml of water`,
      time: 20,
      waterAmount: halfWater,
      isPouring: true
    },
    {
      id: `step-stir-${Date.now()}`,
      name: 'Stir',
      description: 'Gently stir to ensure all grounds are saturated',
      time: 10,
      isPouring: false,
      isStirring: true
    },
    {
      id: `step-steep-${Date.now()}`,
      name: 'Steep',
      description: 'Let coffee steep',
      time: 60,
      isPouring: false,
      isWaiting: true
    },
    {
      id: `step-pour2-${Date.now()}`,
      name: 'Second Pour',
      description: `Pour remaining ${halfWater}ml of water`,
      time: 20,
      waterAmount: halfWater,
      isPouring: true
    },
    {
      id: `step-wait-${Date.now()}`,
      name: 'Wait',
      description: 'Let coffee extract',
      time: 30,
      isPouring: false,
      isWaiting: true
    },
    {
      id: `step-press-${Date.now()}`,
      name: 'Press',
      description: 'Press plunger down slowly',
      time: 20,
      isPouring: false
    }
  ];
};

const generateDefaultSteps = (recipe: BrewingRecipe): BrewingStep[] => {
  return [
    {
      id: `step-pour-${Date.now()}`,
      name: 'Pour Water',
      description: `Pour ${recipe.waterAmount}ml of water`,
      time: 30,
      waterAmount: recipe.waterAmount,
      isPouring: true
    },
    {
      id: `step-brew-${Date.now()}`,
      name: 'Brew',
      description: 'Let coffee brew',
      time: recipe.totalTime - 30,
      isPouring: false,
      isWaiting: true
    }
  ];
};
