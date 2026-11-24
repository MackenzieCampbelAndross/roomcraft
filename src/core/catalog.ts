import { FurnitureItem, ModelType } from '../types';

export interface CatalogTemplate {
  name: string;
  category: FurnitureItem['category'];
  modelType: ModelType;
  defaultColor: string;
  defaultMaterial: FurnitureItem['material'];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  description: string;
}

export const FURNITURE_CATALOG: CatalogTemplate[] = [
  {
    name: 'Modern 3-Seater Sofa',
    category: 'SEATING',
    modelType: 'SOFA_3SEATER',
    defaultColor: '#3b82f6',
    defaultMaterial: 'CARPET',
    dimensions: { width: 2.2, height: 0.85, depth: 0.95 },
    description: 'Plush three-cushion fabric sofa with timber base and cylindrical bolster pillows.',
  },
  {
    name: 'Lounge Armchair',
    category: 'SEATING',
    modelType: 'ARMCHAIR',
    defaultColor: '#f97316',
    defaultMaterial: 'CARPET',
    dimensions: { width: 0.9, height: 0.8, depth: 0.85 },
    description: 'Ergonomic accent armchair with tapered brass legs.',
  },
  {
    name: 'Scandinavian Dining Table',
    category: 'TABLES',
    modelType: 'DINING_TABLE',
    defaultColor: '#d97706',
    defaultMaterial: 'HARDWOOD',
    dimensions: { width: 1.8, height: 0.75, depth: 0.9 },
    description: 'Solid oak dining table accommodating up to 6 seats.',
  },
  {
    name: 'Minimalist Coffee Table',
    category: 'TABLES',
    modelType: 'COFFEE_TABLE',
    defaultColor: '#1e293b',
    defaultMaterial: 'MARBLE',
    dimensions: { width: 1.1, height: 0.42, depth: 0.6 },
    description: 'Carrara marble top with matte black steel geometric frame.',
  },
  {
    name: 'King Platform Bed',
    category: 'BEDS',
    modelType: 'KING_BED',
    defaultColor: '#f1f5f9',
    defaultMaterial: 'CARPET',
    dimensions: { width: 2.0, height: 1.1, depth: 2.1 },
    description: 'King-size upholstered bed frame with winged headboard.',
  },
  {
    name: 'Oak Library Bookshelf',
    category: 'STORAGE',
    modelType: 'BOOKSHELF',
    defaultColor: '#78350f',
    defaultMaterial: 'HARDWOOD',
    dimensions: { width: 1.2, height: 2.0, depth: 0.35 },
    description: 'Five-tier vertical display bookcase for volumes and architectural objects.',
  },
  {
    name: 'Executive Studio Desk',
    category: 'TABLES',
    modelType: 'DESK',
    defaultColor: '#334155',
    defaultMaterial: 'HARDWOOD',
    dimensions: { width: 1.5, height: 0.76, depth: 0.75 },
    description: 'Solid walnut writing desk with integrated dual drawer units.',
  },
  {
    name: 'Arc Floor Lamp',
    category: 'LIGHTING',
    modelType: 'FLOOR_LAMP',
    defaultColor: '#e2e8f0',
    defaultMaterial: 'MARBLE',
    dimensions: { width: 0.45, height: 1.9, depth: 0.45 },
    description: 'Sculptural brass standing lamp with weighted white marble base.',
  },
  {
    name: 'Fiddle Leaf Fig Plant',
    category: 'DECOR',
    modelType: 'POTTED_PLANT',
    defaultColor: '#16a34a',
    defaultMaterial: 'CONCRETE',
    dimensions: { width: 0.6, height: 1.4, depth: 0.6 },
    description: 'Lush indoor foliage in a ribbed ceramic planter.',
  },
  {
    name: '65" OLED Television & Media Console',
    category: 'ELECTRONICS',
    modelType: 'TELEVISION',
    defaultColor: '#0f172a',
    defaultMaterial: 'GLASS',
    dimensions: { width: 1.6, height: 1.1, depth: 0.4 },
    description: 'Ultra-thin 4K television on a low-profile media credenza.',
  },
];
