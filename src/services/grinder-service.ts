import { Grinder, GrinderFormData } from "@/types/grinder";
import { v4 as uuidv4 } from "uuid";

// List of popular coffee grinders to use as initial data
export const INITIAL_GRINDERS: Grinder[] = [
  // Baratza Electric Grinders
  // {
  //   id: "baratza-virtuoso-plus",
  //   name: "Virtuoso+ Conical Burr",
  //   brand: "Baratza",
  //   model: "Virtuoso+",
  //   type: "electric",
  //   burrSize: 40,
  //   burrType: "Conical steel",
  //   minGrindSize: 1,
  //   maxGrindSize: 10,
  //   stepless: false,
  //   micronsPerClick: 10,
  //   notes: "High-quality conical burrs with 40 grind settings. Great for pour-over and drip coffee.",
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString()
  // },
  // {
  //   id: 'breville-smart-grinder-pro',
  //   name: 'Smart Grinder Pro',
  //   brand: 'Breville',
  //   model: 'BCG820BSSXL',
  //   type: 'electric',
  //   burrSize: 38,
  //   burrType: 'Stainless steel conical',
  //   minGrindSize: 1,
  //   maxGrindSize: 12,
  //   stepless: false,
  //   micronsPerClick: 8,
  //   notes:
  //     'Digital display with 60 precise grind settings. Good for espresso to French press.',
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: 'baratza-encore',
  //   name: 'Encore Conical Burr',
  //   brand: 'Baratza',
  //   model: 'Encore',
  //   type: 'electric',
  //   burrSize: 40,
  //   burrType: 'Conical steel',
  //   minGrindSize: 1,
  //   maxGrindSize: 10,
  //   stepless: false,
  //   micronsPerClick: 12,
  //   notes:
  //     'Entry-level burr grinder with 40 grind settings. Great value for pour-over and drip.',
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: 'fellow-ode-gen2',
  //   name: 'Ode Gen 2',
  //   brand: 'Fellow',
  //   model: 'Ode Gen 2',
  //   type: 'electric',
  //   burrSize: 64,
  //   burrType: 'Flat burrs',
  //   minGrindSize: 1,
  //   maxGrindSize: 11,
  //   stepless: false,
  //   micronsPerClick: 7,
  //   notes:
  //     'Designed specifically for filter coffee with 64mm professional-grade flat burrs. Quiet operation and minimal retention.',
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: 'oxo-brew-conical',
  //   name: 'Brew Conical Burr',
  //   brand: 'OXO',
  //   model: '8717000',
  //   type: 'electric',
  //   burrSize: 40,
  //   burrType: 'Stainless steel conical',
  //   minGrindSize: 1,
  //   maxGrindSize: 10,
  //   stepless: false,
  //   notes:
  //     'Budget-friendly electric burr grinder with 15 settings. Timer function for consistent dosing.',
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },

  // Comandante Manual Grinders
  {
    id: 'comandante-c40-mk4',
    name: 'C40 MK4 Nitro Blade',
    brand: 'Comandante',
    model: 'C40 MK4',
    type: 'manual',
    burrSize: 39,
    burrType: 'High-nitrogen martensitic steel',
    minGrindSize: 1,
    maxGrindSize: 9,
    stepless: false,
    micronsPerClick: 15,
    notes:
      'Premium hand grinder with high-precision burrs. Widely considered the gold standard for manual grinders.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'comandante-c40-mk3',
    name: 'C40 MK3 Nitro Blade',
    brand: 'Comandante',
    model: 'C40 MK3',
    type: 'manual',
    burrSize: 39,
    burrType: 'High-nitrogen martensitic steel',
    minGrindSize: 1,
    maxGrindSize: 9,
    stepless: false,
    micronsPerClick: 15,
    notes:
      'Previous generation of the C40 with the same high-quality burrs. Excellent grind consistency.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'comandante-c40-red-clix',
    name: 'C40 Red Clix',
    brand: 'Comandante',
    model: 'C40 Red Clix',
    type: 'manual',
    burrSize: 39,
    burrType: 'High-nitrogen martensitic steel',
    minGrindSize: 1,
    maxGrindSize: 9,
    stepless: false,
    micronsPerClick: 7.5,
    notes:
      'Special edition with Red Clix axle providing double the adjustment steps (twice the precision) for espresso.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'comandante-c40-black-clix',
    name: 'C40 Black Clix',
    brand: 'Comandante',
    model: 'C40 Black Clix',
    type: 'manual',
    burrSize: 39,
    burrType: 'High-nitrogen martensitic steel',
    minGrindSize: 1,
    maxGrindSize: 9,
    stepless: false,
    micronsPerClick: 7.5,
    notes:
      'Special edition with Black Clix axle providing double the adjustment steps for precise espresso grinding.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Timemore Manual Grinders
  {
    id: 'timemore-chestnut-c2',
    name: 'Chestnut C2',
    brand: 'Timemore',
    model: 'Chestnut C2',
    type: 'manual',
    burrSize: 38,
    burrType: 'Stainless steel conical',
    minGrindSize: 1,
    maxGrindSize: 8,
    stepless: false,
    micronsPerClick: 20,
    notes:
      'Entry-level grinder with excellent value. Aluminum body with stainless steel burrs for consistent grinding.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'timemore-chestnut-x',
    name: 'Chestnut X',
    brand: 'Timemore',
    model: 'Chestnut X',
    type: 'manual',
    burrSize: 42,
    burrType: 'Stainless steel conical',
    minGrindSize: 1,
    maxGrindSize: 9,
    stepless: false,
    micronsPerClick: 12,
    notes:
      'Premium model with larger 42mm burrs. Magnetic catch cup and improved adjustment system.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'timemore-slim-plus',
    name: 'Slim Plus',
    brand: 'Timemore',
    model: 'Slim Plus',
    type: 'manual',
    burrSize: 38,
    burrType: 'Stainless steel conical',
    minGrindSize: 1,
    maxGrindSize: 8,
    stepless: false,
    micronsPerClick: 20,
    notes:
      'Compact design for travel. E&B burrs (Espresso & Brew) for versatile grinding capabilities.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'timemore-nano',
    name: 'Nano',
    brand: 'Timemore',
    model: 'Nano',
    type: 'manual',
    burrSize: 38,
    burrType: 'Stainless steel conical',
    minGrindSize: 1,
    maxGrindSize: 8,
    stepless: false,
    micronsPerClick: 20,
    notes:
      'Ultra-portable design with foldable handle. Perfect for travel with the same quality burrs as larger models.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Kinu Manual Grinders
  // {
  //   id: 'kinu-m47-classic',
  //   name: 'M47 Classic',
  //   brand: 'Kinu',
  //   model: 'M47 Classic',
  //   type: 'manual',
  //   burrSize: 47,
  //   burrType: 'Black Fusion-Treated Hardened Conical',
  //   minGrindSize: 1,
  //   maxGrindSize: 10,
  //   stepless: true,
  //   notes:
  //     'Premium all-stainless steel construction with 47mm hardened steel burrs. Magnetic catch cup attachment.',
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: 'kinu-m47-simplicity',
  //   name: 'M47 Simplicity',
  //   brand: 'Kinu',
  //   model: 'M47 Simplicity',
  //   type: 'manual',
  //   burrSize: 47,
  //   burrType: 'Black Fusion-Treated Hardened Conical',
  //   minGrindSize: 1,
  //   maxGrindSize: 10,
  //   stepless: true,
  //   notes:
  //     'More affordable version with ABS plastic hopper and grounds container. Same premium 47mm burrs as the Classic.',
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: 'kinu-m47-phoenix',
  //   name: 'M47 Phoenix',
  //   brand: 'Kinu',
  //   model: 'M47 Phoenix',
  //   type: 'manual',
  //   burrSize: 47,
  //   burrType: 'Black Fusion-Treated Hardened Conical',
  //   minGrindSize: 1,
  //   maxGrindSize: 10,
  //   stepless: true,
  //   notes:
  //     'Special edition with stainless steel body and ABS plastic components. Features silicone ring instead of thumb stopper.',
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },

  // 1Zpresso Manual Grinders
  {
    id: '1zpresso-j-manual',
    name: 'J-Max Manual',
    brand: '1Zpresso',
    model: 'J-Max',
    type: 'manual',
    burrSize: 48,
    burrType: 'Stainless steel conical',
    minGrindSize: 1,
    maxGrindSize: 9,
    stepless: true,
    notes:
      'Premium manual grinder with 48mm steel burrs. External adjustment ring with numbered settings for precision.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '1zpresso-k-plus',
    name: 'K-Plus',
    brand: '1Zpresso',
    model: 'K-Plus',
    type: 'manual',
    burrSize: 48,
    burrType: 'Stainless steel conical',
    minGrindSize: 1,
    maxGrindSize: 9,
    stepless: false,
    micronsPerClick: 22,
    notes:
      'Designed for pour-over coffee with 48mm burrs. Features magnetic catch cup and external adjustment dial.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Kingrinder Manual Grinders
  {
    id: 'kingrinder-k0',
    name: 'K0',
    brand: 'Kingrinder',
    model: 'K0',
    type: 'manual',
    burrSize: 38,
    burrType: 'Stainless steel conical',
    minGrindSize: 1,
    maxGrindSize: 8,
    stepless: false,
    micronsPerClick: 18,
    notes:
      'Entry-level grinder with smaller 38mm burrs. Ideal for beginners with capacity for a single cup. Interior adjustment mechanism.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kingrinder-k2',
    name: 'K2',
    brand: 'Kingrinder',
    model: 'K2',
    type: 'manual',
    burrSize: 48,
    burrType: 'Stainless steel conical',
    minGrindSize: 1,
    maxGrindSize: 9,
    stepless: false,
    micronsPerClick: 18,
    notes:
      'Economic model with 48mm burrs capable of all brewing methods. Great value for money with interior adjustment (40 clicks per round).',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kingrinder-k3',
    name: 'K3',
    brand: 'Kingrinder',
    model: 'K3',
    type: 'manual',
    burrSize: 48,
    burrType: 'Titanium-coated conical',
    minGrindSize: 1,
    maxGrindSize: 9,
    stepless: false,
    micronsPerClick: 18,
    notes:
      'Espresso-focused grinder with 48mm titanium-coated burrs. Interior adjustment with 18 microns per click. Affordable espresso option.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kingrinder-k4',
    name: 'K4',
    brand: 'Kingrinder',
    model: 'K4',
    type: 'manual',
    burrSize: 48,
    burrType: 'Titanium-coated conical',
    minGrindSize: 1,
    maxGrindSize: 9,
    stepless: false,
    micronsPerClick: 16,
    notes:
      'Premium espresso grinder with 48mm titanium-coated burrs. Features exterior adjustment with finer 16 microns per click. Can grind for two double-shot espressos.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kingrinder-k5',
    name: 'K5',
    brand: 'Kingrinder',
    model: 'K5',
    type: 'manual',
    burrSize: 48,
    burrType: 'Heptagonal stainless steel',
    minGrindSize: 1,
    maxGrindSize: 9,
    stepless: false,
    micronsPerClick: 18,
    notes:
      'Versatile grinder with 48mm heptagonal stainless steel burrs. Interior adjustment mechanism. Mini version of the K6 with better grinding consistency.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kingrinder-k6',
    name: 'K6',
    brand: 'Kingrinder',
    model: 'K6',
    type: 'manual',
    burrSize: 48,
    burrType: 'Heptagonal stainless steel',
    minGrindSize: 1,
    maxGrindSize: 9,
    stepless: false,
    micronsPerClick: 16,
    notes:
      'Premium versatile grinder with 48mm heptagonal stainless steel burrs. Exterior adjustment with 16 microns per click. Excellent for light roasts and pour-over.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = "my-daily-coffee-grinders";

// Helper to get current grinders from localStorage
const getGrinders = (): Grinder[] => {
  if (typeof window === "undefined") return [];
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    // Initialize with sample grinders
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GRINDERS));
    return INITIAL_GRINDERS;
  }
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error parsing grinders data:", error);
    return [];
  }
};

// Helper to save grinders to localStorage
const saveGrinders = (grinders: Grinder[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(grinders));
};

// Get all grinders
export const getAllGrinders = (): Grinder[] => {
  return getGrinders();
};

// Get a grinder by ID
export const getGrinderById = (id: string): Grinder | undefined => {
  const grinders = getGrinders();
  return grinders.find(grinder => grinder.id === id);
};

// Create a new grinder
export const createGrinder = (grinderData: GrinderFormData): Grinder => {
  const grinders = getGrinders();
  
  const newGrinder: Grinder = {
    ...grinderData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  grinders.push(newGrinder);
  saveGrinders(grinders);
  
  return newGrinder;
};

// Update an existing grinder
export const updateGrinder = (id: string, grinderData: GrinderFormData): Grinder | null => {
  const grinders = getGrinders();
  const index = grinders.findIndex(grinder => grinder.id === id);
  
  if (index === -1) return null;
  
  const updatedGrinder: Grinder = {
    ...grinders[index],
    ...grinderData,
    updatedAt: new Date().toISOString(),
  };
  
  grinders[index] = updatedGrinder;
  saveGrinders(grinders);
  
  return updatedGrinder;
};

// Delete a grinder
export const deleteGrinder = (id: string): boolean => {
  const grinders = getGrinders();
  const filteredGrinders = grinders.filter(grinder => grinder.id !== id);
  
  if (filteredGrinders.length === grinders.length) {
    return false; // Nothing was deleted
  }
  
  saveGrinders(filteredGrinders);
  return true;
};
