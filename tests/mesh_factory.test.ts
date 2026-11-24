import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { MeshFactory } from '../src/core/mesh_factory';
import { FurnitureItem } from '../src/types';

describe('MeshFactory', () => {
  it('creates proper THREE.MeshStandardMaterial based on material type', () => {
    const woodMat = MeshFactory.createMaterial('#b45309', 'HARDWOOD');
    expect(woodMat).toBeInstanceOf(THREE.MeshStandardMaterial);
    expect(woodMat.roughness).toBe(0.4);
    expect(woodMat.metalness).toBe(0.05);

    const marbleMat = MeshFactory.createMaterial('#ffffff', 'MARBLE');
    expect(marbleMat.roughness).toBe(0.15);

    const carpetMat = MeshFactory.createMaterial('#3b82f6', 'CARPET');
    expect(carpetMat.roughness).toBe(0.95);
  });

  it('builds procedural 3D mesh group for SOFA_3SEATER', () => {
    const item: FurnitureItem = {
      id: 'sofa_test_1',
      name: 'Test Sofa',
      category: 'SEATING',
      modelType: 'SOFA_3SEATER',
      position: [1.0, 0, 2.0],
      rotation: [0, Math.PI / 2, 0],
      scale: [1, 1, 1],
      color: '#3b82f6',
      material: 'CARPET',
      dimensions: { width: 2.2, height: 0.85, depth: 0.95 },
    };

    const mesh = MeshFactory.buildFurnitureMesh(item);
    expect(mesh).toBeInstanceOf(THREE.Group);
    expect(mesh.name).toBe('sofa_test_1');
    expect(mesh.children.length).toBeGreaterThan(5); // base, cushions, back, arms, legs
    expect(mesh.position.x).toBe(1.0);
    expect(mesh.position.z).toBe(2.0);
    expect(mesh.rotation.y).toBeCloseTo(Math.PI / 2);
  });

  it('builds procedural 3D mesh for each model type', () => {
    const modelTypes = [
      'ARMCHAIR',
      'DINING_TABLE',
      'COFFEE_TABLE',
      'BOOKSHELF',
      'KING_BED',
      'DESK',
      'FLOOR_LAMP',
      'POTTED_PLANT',
      'TELEVISION',
    ] as const;

    for (const mt of modelTypes) {
      const item: FurnitureItem = {
        id: `test_${mt}`,
        name: `Test ${mt}`,
        category: 'SEATING',
        modelType: mt,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: '#ffffff',
        material: 'HARDWOOD',
        dimensions: { width: 1, height: 1, depth: 1 },
      };

      const group = MeshFactory.buildFurnitureMesh(item);
      expect(group).toBeInstanceOf(THREE.Group);
      expect(group.children.length).toBeGreaterThan(0);
    }
  });
});
