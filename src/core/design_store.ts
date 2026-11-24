import { create } from 'zustand';
import {
  RoomDesign,
  RoomDimensions,
  SurfaceMaterial,
  FurnitureItem,
  CameraMode,
  TransformTool,
  LightPreset,
  LightingConfig,
} from '../types';
import { CatalogTemplate } from './catalog';
import { LightingManager } from './lighting_manager';

export interface DesignState {
  design: RoomDesign;
  selectedItemId: string | null;
  cameraMode: CameraMode;
  activeTool: TransformTool;
  savedDesigns: RoomDesign[];

  // Actions
  setDimensions: (dimensions: Partial<RoomDimensions>) => void;
  setWallMaterial: (material: Partial<SurfaceMaterial>) => void;
  setFloorMaterial: (material: Partial<SurfaceMaterial>) => void;
  setLightingPreset: (preset: LightPreset) => void;
  setLightingConfig: (config: Partial<LightingConfig>) => void;
  addItem: (template: CatalogTemplate, position?: [number, number, number]) => FurnitureItem;
  updateItem: (id: string, updates: Partial<FurnitureItem>) => void;
  removeItem: (id: string) => void;
  duplicateItem: (id: string) => FurnitureItem | null;
  selectItem: (id: string | null) => void;
  setCameraMode: (mode: CameraMode) => void;
  setActiveTool: (tool: TransformTool) => void;
  saveCurrentDesign: () => void;
  loadDesign: (design: RoomDesign) => void;
  resetRoom: () => void;
}

const DEFAULT_DIMENSIONS: RoomDimensions = {
  width: 6.0,
  length: 5.0,
  height: 2.8,
  unit: 'METERS',
};

const DEFAULT_WALL_MATERIAL: SurfaceMaterial = {
  color: '#e2e8f0',
  roughness: 0.7,
  metalness: 0.05,
  textureType: 'PLASTER',
};

const DEFAULT_FLOOR_MATERIAL: SurfaceMaterial = {
  color: '#b45309',
  roughness: 0.35,
  metalness: 0.1,
  textureType: 'HARDWOOD',
};

export const createInitialDesign = (name = 'Modern Living Room'): RoomDesign => ({
  id: `design_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
  name,
  dimensions: { ...DEFAULT_DIMENSIONS },
  wallMaterial: { ...DEFAULT_WALL_MATERIAL },
  floorMaterial: { ...DEFAULT_FLOOR_MATERIAL },
  lighting: LightingManager.getPresetConfig('DAYLIGHT'),
  items: [
    {
      id: 'item_initial_sofa',
      name: 'Modern 3-Seater Sofa',
      category: 'SEATING',
      modelType: 'SOFA_3SEATER',
      position: [0, 0, 0.5],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#3b82f6',
      material: 'CARPET',
      dimensions: { width: 2.2, height: 0.85, depth: 0.95 },
    },
    {
      id: 'item_initial_table',
      name: 'Minimalist Coffee Table',
      category: 'TABLES',
      modelType: 'COFFEE_TABLE',
      position: [0, 0, -0.6],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#1e293b',
      material: 'MARBLE',
      dimensions: { width: 1.1, height: 0.42, depth: 0.6 },
    },
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const useDesignStore = create<DesignState>((set, get) => ({
  design: createInitialDesign(),
  selectedItemId: 'item_initial_sofa',
  cameraMode: 'PERSPECTIVE',
  activeTool: 'SELECT',
  savedDesigns: [],

  setDimensions: (dims) => {
    set((state) => ({
      design: {
        ...state.design,
        dimensions: { ...state.design.dimensions, ...dims },
        updatedAt: Date.now(),
      },
    }));
  },

  setWallMaterial: (mat) => {
    set((state) => ({
      design: {
        ...state.design,
        wallMaterial: { ...state.design.wallMaterial, ...mat },
        updatedAt: Date.now(),
      },
    }));
  },

  setFloorMaterial: (mat) => {
    set((state) => ({
      design: {
        ...state.design,
        floorMaterial: { ...state.design.floorMaterial, ...mat },
        updatedAt: Date.now(),
      },
    }));
  },

  setLightingPreset: (preset) => {
    const config = LightingManager.getPresetConfig(preset);
    set((state) => ({
      design: {
        ...state.design,
        lighting: config,
        updatedAt: Date.now(),
      },
    }));
  },

  setLightingConfig: (config) => {
    set((state) => ({
      design: {
        ...state.design,
        lighting: { ...state.design.lighting, ...config },
        updatedAt: Date.now(),
      },
    }));
  },

  addItem: (template, position) => {
    const newItem: FurnitureItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: template.name,
      category: template.category,
      modelType: template.modelType,
      position: position || [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: template.defaultColor,
      material: template.defaultMaterial,
      dimensions: { ...template.dimensions },
    };

    set((state) => ({
      design: {
        ...state.design,
        items: [...state.design.items, newItem],
        updatedAt: Date.now(),
      },
      selectedItemId: newItem.id,
    }));

    return newItem;
  },

  updateItem: (id, updates) => {
    set((state) => ({
      design: {
        ...state.design,
        items: state.design.items.map((it) =>
          it.id === id ? { ...it, ...updates } : it
        ),
        updatedAt: Date.now(),
      },
    }));
  },

  removeItem: (id) => {
    set((state) => ({
      design: {
        ...state.design,
        items: state.design.items.filter((it) => it.id !== id),
        updatedAt: Date.now(),
      },
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    }));
  },

  duplicateItem: (id) => {
    const item = get().design.items.find((it) => it.id === id);
    if (!item) return null;

    const duplicated: FurnitureItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${item.name} (Copy)`,
      position: [item.position[0] + 0.3, item.position[1], item.position[2] + 0.3],
    };

    set((state) => ({
      design: {
        ...state.design,
        items: [...state.design.items, duplicated],
        updatedAt: Date.now(),
      },
      selectedItemId: duplicated.id,
    }));

    return duplicated;
  },

  selectItem: (id) => {
    set({ selectedItemId: id });
  },

  setCameraMode: (mode) => {
    set({ cameraMode: mode });
  },

  setActiveTool: (tool) => {
    set({ activeTool: tool });
  },

  saveCurrentDesign: () => {
    const current = get().design;
    set((state) => {
      const existingIdx = state.savedDesigns.findIndex((d) => d.id === current.id);
      let updatedList = [...state.savedDesigns];
      if (existingIdx >= 0) {
        updatedList[existingIdx] = current;
      } else {
        updatedList.push(current);
      }
      return { savedDesigns: updatedList };
    });
  },

  loadDesign: (design) => {
    set({
      design,
      selectedItemId: design.items[0]?.id || null,
    });
  },

  resetRoom: () => {
    const fresh = createInitialDesign('New Room Layout');
    set({
      design: fresh,
      selectedItemId: fresh.items[0]?.id || null,
    });
  },
}));
