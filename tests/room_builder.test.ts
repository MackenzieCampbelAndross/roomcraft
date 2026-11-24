import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { RoomBuilder } from '../src/core/room_builder';
import { RoomDimensions, SurfaceMaterial, FurnitureItem } from '../src/types';

describe('RoomBuilder', () => {
  const dimensions: RoomDimensions = {
    width: 8.0,
    length: 6.0,
    height: 3.0,
    unit: 'METERS',
  };

  const wallMat: SurfaceMaterial = {
    color: '#f8fafc',
    roughness: 0.6,
    metalness: 0.05,
    textureType: 'PLASTER',
  };

  const floorMat: SurfaceMaterial = {
    color: '#78350f',
    roughness: 0.35,
    metalness: 0.1,
    textureType: 'HARDWOOD',
  };

  it('creates floor group with floor mesh and grid helper', () => {
    const floor = RoomBuilder.createFloor(dimensions, floorMat);
    expect(floor).toBeInstanceOf(THREE.Group);
    expect(floor.children.length).toBe(2); // floor mesh and grid helper
  });

  it('creates 4 perimeter walls matching room dimensions', () => {
    const walls = RoomBuilder.createWalls(dimensions, wallMat, false);
    expect(walls).toBeInstanceOf(THREE.Group);
    expect(walls.children.length).toBe(4); // North, South, West, East
  });

  it('calculates spatial metrics and furniture category counts accurately', () => {
    const items: FurnitureItem[] = [
      {
        id: '1',
        name: 'Sofa',
        category: 'SEATING',
        modelType: 'SOFA_3SEATER',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: '#000',
        material: 'CARPET',
        dimensions: { width: 2, height: 1, depth: 1 },
      },
      {
        id: '2',
        name: 'Armchair',
        category: 'SEATING',
        modelType: 'ARMCHAIR',
        position: [1, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: '#000',
        material: 'CARPET',
        dimensions: { width: 1, height: 1, depth: 1 },
      },
      {
        id: '3',
        name: 'Table',
        category: 'TABLES',
        modelType: 'DINING_TABLE',
        position: [0, 0, 1],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: '#000',
        material: 'HARDWOOD',
        dimensions: { width: 1.5, height: 0.7, depth: 0.8 },
      },
    ];

    const metrics = RoomBuilder.calculateMetrics(dimensions, items);
    // Floor area = 8.0 * 6.0 = 48.0 m²
    expect(metrics.floorAreaSqMeters).toBe(48.0);
    // Perimeter = (8 + 6) * 2 = 28m. Wall surface = 28 * 3.0 = 84.0 m²
    expect(metrics.wallSurfaceSqMeters).toBe(84.0);
    expect(metrics.totalItems).toBe(3);
    expect(metrics.categoryCounts.SEATING).toBe(2);
    expect(metrics.categoryCounts.TABLES).toBe(1);
    expect(metrics.categoryCounts.STORAGE).toBe(0);
  });
});
