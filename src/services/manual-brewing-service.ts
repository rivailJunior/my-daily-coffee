import { ManualBrewer, ManualBrewerFormData, INITIAL_MANUAL_BREWERS } from "@/types/manualBrewing";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "my-daily-coffee-manual-brewers";

// Helper to get current manual brewers from localStorage
const getManualBrewers = (): ManualBrewer[] => {
  if (typeof window === "undefined") return [];
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    // Initialize with pre-created brewers if no data exists
    const initialData = INITIAL_MANUAL_BREWERS;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error parsing manual brewers data:", error);
    return [];
  }
};

// Helper to save manual brewers to localStorage
const saveManualBrewers = (brewers: ManualBrewer[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(brewers));
};

// Get all manual brewers
export const getAllManualBrewers = (): ManualBrewer[] => {
  return getManualBrewers();
};

// Get a manual brewer by ID
export const getManualBrewerById = (id: string): ManualBrewer | undefined => {
  const brewers = getManualBrewers();
  return brewers.find(brewer => brewer.id === id);
};

// Create a new manual brewer
export const createManualBrewer = (brewerData: ManualBrewerFormData): ManualBrewer => {
  const brewers = getManualBrewers();
  
  const newBrewer: ManualBrewer = {
    ...brewerData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  brewers.push(newBrewer);
  saveManualBrewers(brewers);
  
  return newBrewer;
};

// Update an existing manual brewer
export const updateManualBrewer = (id: string, brewerData: ManualBrewerFormData): ManualBrewer | null => {
  const brewers = getManualBrewers();
  const index = brewers.findIndex(brewer => brewer.id === id);
  
  if (index === -1) return null;
  
  const updatedBrewer: ManualBrewer = {
    ...brewers[index],
    ...brewerData,
    updatedAt: new Date().toISOString(),
  };
  
  brewers[index] = updatedBrewer;
  saveManualBrewers(brewers);
  
  return updatedBrewer;
};

// Delete a manual brewer
export const deleteManualBrewer = (id: string): boolean => {
  const brewers = getManualBrewers();
  const filteredBrewers = brewers.filter(brewer => brewer.id !== id);
  
  if (filteredBrewers.length === brewers.length) {
    return false; // Nothing was deleted
  }
  
  saveManualBrewers(filteredBrewers);
  return true;
};
