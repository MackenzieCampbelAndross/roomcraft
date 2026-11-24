/**
 * Domain types and models for RoomCraft (Interactive 3D Interior Design Application).
 */

export type UnitType = 'METERS' | 'FEET';

export interface RoomDimensions {
  width: number;  // X-axis (e.g. 6.0 meters)
  length: number; // Z-axis (e.g. 5.0 meters)
  height: number; // Y-axis (e.g. 2.8 meters)
  unit: UnitType;
}

export type MaterialType =
  | 'HARDWOOD'
  | 'MARBLE'
  | 'CONCRETE'
  | 'TILES'
  | 'CARPET'
  | 'PLASTER'
  | 'BRICK'
  | 'GLASS';

export interface SurfaceMaterial {
  color: string;
  roughness: number;
  metalness: number;
  textureType: MaterialType;
}

export type FurnitureCategory =
  | 'SEATING'
  | 'TABLES'
  | 'STORAGE'
  | 'BEDS'
  | 'LIGHTING'
  | 'DECOR'
  | 'ELECTRONICS';

export type ModelType =
  | 'SOFA_3SEATER'
  | 'ARMCHAIR'
  | 'DINING_TABLE'
  | 'COFFEE_TABLE'
  | 'BOOKSHELF'
  | 'KING_BED'
  | 'DESK'
  | 'FLOOR_LAMP'
  | 'POTTED_PLANT'
  | 'TELEVISION';

export interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  modelType: ModelType;
  position: [number, number, number]; // [x, y, z] in meters
  rotation: [number, number, number]; // [x, y, z] in radians
  scale: [number, number, number];    // [scaleX, scaleY, scaleZ]
  color: string;
  material: MaterialType;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export type LightPreset =
  | 'DAYLIGHT'
  | 'WARM_SUNSET'
  | 'STUDIO'
  | 'CYBER_NEON'
  | 'COZY_NIGHT';

export interface LightingConfig {
  preset: LightPreset;
  ambientIntensity: number;
  sunIntensity: number;
  sunPosition: [number, number, number];
  sunColor: string;
  shadowsEnabled: boolean;
}

export type CameraMode = 'PERSPECTIVE' | 'TOP_DOWN' | 'FIRST_PERSON' | 'ISOMETRIC';

export type TransformTool = 'SELECT' | 'MOVE' | 'ROTATE' | 'SCALE';

export interface RoomDesign {
  id: string;
  name: string;
  description?: string;
  dimensions: RoomDimensions;
  wallMaterial: SurfaceMaterial;
  floorMaterial: SurfaceMaterial;
  lighting: LightingConfig;
  items: FurnitureItem[];
  createdAt: number;
  updatedAt: number;
}

export interface InventorySummary {
  totalItems: number;
  categoryCounts: Record<FurnitureCategory, number>;
  floorAreaSqMeters: number;
  wallSurfaceSqMeters: number;
}
