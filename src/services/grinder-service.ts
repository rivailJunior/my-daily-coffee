import { Grinder, GrinderFormData } from "@/types/grinder";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "my-daily-coffee-grinders";

// Helper to get current grinders from localStorage
const getGrinders = (): Grinder[] => {
  if (typeof window === "undefined") return [];
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return [];
  
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
