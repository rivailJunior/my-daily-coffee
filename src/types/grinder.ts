export interface Grinder {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: 'manual' | 'electric' | 'smart';
  micronsPerClick?: number; // Microns of adjustment per click for stepped grinders
  burrSize?: number;
  burrType?: string;
  minGrindSize: number;
  maxGrindSize: number;
  stepless: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type GrinderFormData = Omit<Grinder, 'id' | 'createdAt' | 'updatedAt'>;

export type GrindSizePreset = {
  name: string;
  value: number;
  description: string;
};

export const GRIND_SIZE_PRESETS: GrindSizePreset[] = [
  { name: 'Extra Fine', value: 1, description: 'Turkish coffee' },
  { name: 'Fine', value: 3, description: 'Espresso' },
  { name: 'Medium-Fine', value: 5, description: 'Moka pot, AeroPress' },
  { name: 'Medium', value: 7, description: 'Pour over, Drip' },
  { name: 'Medium-Coarse', value: 9, description: 'Chemex' },
  { name: 'Coarse', value: 11, description: 'French Press' },
  { name: 'Extra Coarse', value: 13, description: 'Cold Brew' },
];

export const GRINDER_TYPES = [
  { value: 'manual', label: 'Manual' },
  { value: 'electric', label: 'Electric' },
  { value: 'smart', label: 'Smart' },
];
