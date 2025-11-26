export interface ManualBrewer {
  id: string;
  name: string;
  brand: string;
  model: string;
  brewMethod: 'percolation' | 'immersion' | 'hybrid';
  type: 'conical' | 'flat' | 'wave' | 'press' | 'siphon' | 'other';
  material: 'ceramic' | 'glass' | 'plastic' | 'metal' | 'other';
  filterType: 'paper' | 'metal' | 'cloth' | 'none' | 'other';
  capacity: number; // in ml or cups
  recommendedGrindSize: number;
  brewTime: {
    min: number; // in seconds
    max: number; // in seconds
  };
  pressure?: boolean; // For methods that use pressure like AeroPress
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ManualBrewerFormData = Omit<ManualBrewer, 'id' | 'createdAt' | 'updatedAt'>;

export type BrewingMethod = {
  name: string;
  description: string;
  brewMethod: ManualBrewer['brewMethod'];
  type: ManualBrewer['type'];
  recommendedRatio: string; // e.g., "1:16" (coffee:water)
  technique: string;
};

export const BREW_METHODS = [
  { value: 'percolation', label: 'Percolation' },
  { value: 'immersion', label: 'Immersion' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const BREWER_TYPES = [
  { value: 'conical', label: 'Conical' },
  { value: 'flat', label: 'Flat' },
  { value: 'wave', label: 'Wave' },
  { value: 'press', label: 'Press' },
  { value: 'siphon', label: 'Siphon' },
  { value: 'other', label: 'Other' },
];

export const BREWER_MATERIALS = [
  { value: 'ceramic', label: 'Ceramic' },
  { value: 'glass', label: 'Glass' },
  { value: 'plastic', label: 'Plastic' },
  { value: 'metal', label: 'Metal' },
  { value: 'other', label: 'Other' },
];

export const FILTER_TYPES = [
  { value: 'paper', label: 'Paper' },
  { value: 'metal', label: 'Metal' },
  { value: 'cloth', label: 'Cloth' },
  { value: 'none', label: 'None' },
  { value: 'other', label: 'Other' },
];

// Percolation methods (Pour Over)
export const PERCOLATION_METHODS: BrewingMethod[] = [
  {
    name: 'Hario V60',
    description:
      'Conical dripper with spiral ridges and large opening for faster flow',
    brewMethod: 'percolation',
    type: 'conical',
    recommendedRatio: '1:16',
    technique: 'Bloom 30s, then pour in spirals from center outward',
  },
  {
    name: 'Chemex',
    description: 'Hourglass-shaped brewer with thick filters for clean cup',
    brewMethod: 'percolation',
    type: 'conical',
    recommendedRatio: '1:17',
    technique: 'Bloom 45s, then pour in 2-3 stages with pauses between',
  },
  {
    name: 'Kalita Wave',
    description:
      'Flat-bottomed dripper with three small holes for even extraction',
    brewMethod: 'percolation',
    type: 'wave',
    recommendedRatio: '1:16',
    technique:
      'Bloom 30s, then pour in concentric circles maintaining water level',
  },
  {
    name: 'Origami Dripper',
    description: 'Ribbed ceramic dripper compatible with multiple filter types',
    brewMethod: 'percolation',
    type: 'conical',
    recommendedRatio: '1:15',
    technique: 'Bloom 30s, then pour in stages maintaining even saturation',
  },
  {
    name: 'Melitta',
    description: 'Classic wedge-shaped dripper with single hole',
    brewMethod: 'percolation',
    type: 'flat',
    recommendedRatio: '1:16',
    technique: 'Bloom 30s, then pour slowly in center',
  },
  // {
  //   name: 'Bee House',
  //   description:
  //     'Wedge-shaped ceramic dripper with two holes for controlled flow',
  //   brewMethod: 'percolation',
  //   type: 'flat',
  //   recommendedRatio: '1:15',
  //   technique: 'Bloom 30s, then pour in small, steady streams',
  // },
  // {
  //   name: 'Kono',
  //   description:
  //     'Conical glass dripper with narrow angle for slower extraction',
  //   brewMethod: 'percolation',
  //   type: 'conical',
  //   recommendedRatio: '1:15',
  //   technique: 'Bloom 30s, then pour slowly in the center',
  // },
  // {
  //   name: 'December Dripper',
  //   description: 'Adjustable-flow flat-bottomed dripper with variable aperture',
  //   brewMethod: 'percolation',
  //   type: 'flat',
  //   recommendedRatio: '1:16',
  //   technique: 'Bloom 30s, adjust flow rate based on coffee amount'
  // },
  // {
  //   name: 'Torch Mountain',
  //   description: 'Flat-bottomed dripper with mountain-shaped ridges for even extraction',
  //   brewMethod: 'percolation',
  //   type: 'flat',
  //   recommendedRatio: '1:16',
  //   technique: 'Bloom 30s, then pour in concentric circles'
  // },
  // {
  //   name: 'Blue Bottle Dripper',
  //   description: 'Porcelain dripper with single hole and steep walls',
  //   brewMethod: 'percolation',
  //   type: 'conical',
  //   recommendedRatio: '1:14',
  //   technique: 'Bloom 45s, then pour in 4-5 pulses with 30-45s intervals',
  // },
  {
    name: 'Orea V3',
    description:
      'Flat-bottomed brewer with multiple drainage channels for even flow',
    brewMethod: 'percolation',
    type: 'flat',
    recommendedRatio: '1:16',
    technique: 'Bloom 30s, then pour in slow, continuous stream',
  },
  // {
  //   name: 'Fellow Stagg [X]',
  //   description: 'Flat-bottomed dripper with vacuum-insulated double walls',
  //   brewMethod: 'percolation',
  //   type: 'flat',
  //   recommendedRatio: '1:17',
  //   technique: 'Bloom 45s, then pour in 2-3 stages maintaining water level',
  // },
  {
    name: 'April Brewer',
    description: 'Flat-bottomed brewer with optimized drainage system',
    brewMethod: 'percolation',
    type: 'flat',
    recommendedRatio: '1:16',
    technique: 'Bloom 30s, then pour in 2-3 stages with 30s intervals',
  },
];

// Immersion methods
export const IMMERSION_METHODS: BrewingMethod[] = [
  {
    name: 'French Press',
    description: 'Classic immersion brewer with metal mesh filter',
    brewMethod: 'immersion',
    type: 'press',
    recommendedRatio: '1:15',
    technique: 'Stir after adding water, steep for 4 minutes, press slowly',
  },
  {
    name: 'Clever Dripper',
    description: 'Immersion brewer with paper filter and release valve',
    brewMethod: 'immersion',
    type: 'flat',
    recommendedRatio: '1:16',
    technique: 'Add coffee and water, steep for 2-3 minutes, then release',
  },
  // {
  //   name: 'Siphon',
  //   description: 'Vacuum brewer using vapor pressure and cloth filter',
  //   brewMethod: 'immersion',
  //   type: 'siphon',
  //   recommendedRatio: '1:17',
  //   technique:
  //     'Heat lower chamber, stir gently when water rises, remove from heat',
  // },
  // {
  //   name: 'Bodum Chambord',
  //   description: 'Classic French press with glass beaker and metal frame',
  //   brewMethod: 'immersion',
  //   type: 'press',
  //   recommendedRatio: '1:15',
  //   technique: 'Stir after adding water, steep for 4 minutes, press slowly',
  // },
  // {
  //   name: 'Espro Press',
  //   description: 'Double micro-filtered French press for cleaner cup',
  //   brewMethod: 'immersion',
  //   type: 'press',
  //   recommendedRatio: '1:15',
  //   technique: 'Stir after adding water, steep for 4 minutes, press slowly',
  // },
  // {
  //   name: 'Walkure',
  //   description: 'All-porcelain brewing system with built-in filter mechanism',
  //   brewMethod: 'immersion',
  //   type: 'other',
  //   recommendedRatio: '1:15',
  //   technique: 'No paper filter needed, pour slowly in center',
  // },
  // {
  //   name: 'Cold Brew Toddy',
  //   description: 'Immersion cold brew system with felt filter',
  //   brewMethod: 'immersion',
  //   type: 'other',
  //   recommendedRatio: '1:7',
  //   technique: 'Steep for 12-24 hours at room temperature or refrigerated'
  // }
];

// Hybrid methods
export const HYBRID_METHODS: BrewingMethod[] = [
  {
    name: 'AeroPress',
    description: 'Versatile brewer using immersion and pressure',
    brewMethod: 'hybrid',
    type: 'press',
    recommendedRatio: '1:16',
    technique: 'Steep for 1-2 minutes, then press through paper filter'
  },
  {
    name: 'AeroPress Inverted',
    description: 'Inverted method for longer immersion time',
    brewMethod: 'hybrid',
    type: 'press',
    recommendedRatio: '1:16',
    technique: 'Steep for 1-2 minutes inverted, flip and press'
  },
  {
    name: 'Hario Switch',
    description: 'V60 with immersion/percolation switching capability',
    brewMethod: 'hybrid',
    type: 'conical',
    recommendedRatio: '1:15',
    technique: 'Immersion steep for 2 minutes, then switch to drip'
  },
  {
    name: 'Delter Press',
    description: 'Pressure brewer with water injection system',
    brewMethod: 'hybrid',
    type: 'press',
    recommendedRatio: '1:15',
    technique: 'Inject water through coffee bed with controlled pressure'
  },
  {
    name: 'Cafec Flower Dripper',
    description: 'Dripper with adjustable flow rate for hybrid brewing',
    brewMethod: 'hybrid',
    type: 'flat',
    recommendedRatio: '1:16',
    technique: 'Close valve for immersion, open for percolation'
  }
];

// Combined methods for easy access
export const ALL_BREWING_METHODS: BrewingMethod[] = [
  ...PERCOLATION_METHODS,
  ...IMMERSION_METHODS,
  ...HYBRID_METHODS
];

// Pre-created manual brewers for initial data
export const INITIAL_MANUAL_BREWERS: ManualBrewer[] = [
  {
    id: "v60-ceramic-white",
    name: "My V60 Setup",
    brand: "Hario",
    model: "V60 02 Ceramic",
    brewMethod: "percolation",
    type: "conical",
    material: "ceramic",
    filterType: "paper",
    capacity: 600,
    recommendedGrindSize: 7,
    brewTime: {
      min: 150,
      max: 210
    },
    pressure: false,
    notes: "White ceramic V60 with Hario tabbed filters. Best for light to medium roasts.",
    createdAt: "2025-04-15T10:30:00.000Z",
    updatedAt: "2025-04-15T10:30:00.000Z"
  },
  {
    id: "chemex-classic-6cup",
    name: "Chemex Classic",
    brand: "Chemex",
    model: "Classic 6-Cup",
    brewMethod: "percolation",
    type: "conical",
    material: "glass",
    filterType: "paper",
    capacity: 900,
    recommendedGrindSize: 9,
    brewTime: {
      min: 240,
      max: 300
    },
    pressure: false,
    notes: "Classic hourglass design with thick filters for a clean cup. Great for sharing.",
    createdAt: "2025-04-16T14:45:00.000Z",
    updatedAt: "2025-04-16T14:45:00.000Z"
  },
  {
    id: "aeropress-standard",
    name: "AeroPress Standard",
    brand: "AeroPress",
    model: "Original",
    brewMethod: "hybrid",
    type: "press",
    material: "plastic",
    filterType: "paper",
    capacity: 250,
    recommendedGrindSize: 5,
    brewTime: {
      min: 60,
      max: 120
    },
    pressure: true,
    notes: "Versatile brewing method for travel and experimentation. Great for medium roasts.",
    createdAt: "2025-04-18T08:15:00.000Z",
    updatedAt: "2025-04-18T08:15:00.000Z"
  },
  {
    id: "french-press-bodum",
    name: "Bodum Chambord",
    brand: "Bodum",
    model: "Chambord 8-Cup",
    brewMethod: "immersion",
    type: "press",
    material: "glass",
    filterType: "metal",
    capacity: 1000,
    recommendedGrindSize: 11,
    brewTime: {
      min: 240,
      max: 300
    },
    pressure: false,
    notes: "Classic French press with stainless steel frame. Perfect for dark roasts and full body.",
    createdAt: "2025-04-20T17:30:00.000Z",
    updatedAt: "2025-04-20T17:30:00.000Z"
  },
  {
    id: "kalita-wave-155",
    name: "Kalita Wave Small",
    brand: "Kalita",
    model: "Wave 155",
    brewMethod: "percolation",
    type: "wave",
    material: "metal",
    filterType: "paper",
    capacity: 300,
    recommendedGrindSize: 8,
    brewTime: {
      min: 120,
      max: 180
    },
    pressure: false,
    notes: "Flat-bottomed dripper with three holes for even extraction. Great for single cups.",
    createdAt: "2025-04-25T09:20:00.000Z",
    updatedAt: "2025-04-25T09:20:00.000Z"
  }
];
