import type { Plant } from '../lib/types';

export const DEFAULT_PLANTS: Plant[] = [
  {
    id: 'plant-monstera',
    name: 'Monstera',
    type: 'Monstera deliciosa',
    status: 'healthy',
    lastWatered: new Date(Date.now() - 2 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    position: 0,
  },
  {
    id: 'plant-snake',
    name: 'Snake Plant',
    type: 'Sansevieria',
    status: 'healthy',
    lastWatered: new Date(Date.now() - 5 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    position: 1,
  },
  {
    id: 'plant-pothos',
    name: 'Golden Pothos',
    type: 'Epipremnum aureum',
    status: 'moderate',
    lastWatered: new Date(Date.now() - 8 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    position: 2,
  },
];

export const PLANT_TYPES = [
  'Monstera deliciosa',
  'Sansevieria',
  'Epipremnum aureum',
  'Ficus lyrata',
  'Spathiphyllum',
  'Aloe vera',
  'Chlorophytum comosum',
  'Other',
];
