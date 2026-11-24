import * as THREE from 'three';
import { RoomDimensions, SurfaceMaterial, InventorySummary, FurnitureItem } from '../types';
import { MeshFactory } from './mesh_factory';

export class RoomBuilder {
  static createFloor(dimensions: RoomDimensions, floorMaterial: SurfaceMaterial): THREE.Group {
    const group = new THREE.Group();
    group.name = 'room_floor_group';

    const { width, length } = dimensions;
    const mat = MeshFactory.createMaterial(floorMaterial.color, floorMaterial.textureType);

    // Main floor slab
    const floorGeometry = new THREE.BoxGeometry(width, 0.1, length);
    const floorMesh = new THREE.Mesh(floorGeometry, mat);
    floorMesh.position.y = -0.05;
    floorMesh.receiveShadow = true;
    group.add(floorMesh);

    // Subtle alignment grid
    const gridHelper = new THREE.GridHelper(Math.max(width, length), Math.round(Math.max(width, length) * 2), 0x94a3b8, 0x334155);
    gridHelper.position.y = 0.002;
    group.add(gridHelper);

    return group;
  }

  static createWalls(
    dimensions: RoomDimensions,
    wallMaterial: SurfaceMaterial,
    showCeiling = false
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = 'room_walls_group';

    const { width, length, height } = dimensions;
    const thickness = 0.15;
    const mat = MeshFactory.createMaterial(wallMaterial.color, wallMaterial.textureType);

    // North Wall (Z = -length / 2)
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, thickness), mat);
    northWall.position.set(0, height / 2, -length / 2 - thickness / 2);
    northWall.receiveShadow = true;
    group.add(northWall);

    // South Wall (Z = length / 2) - Cut down for camera visibility in perspective mode
    const southWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, thickness), mat);
    southWall.position.set(0, height / 2, length / 2 + thickness / 2);
    southWall.receiveShadow = true;
    group.add(southWall);

    // West Wall (X = -width / 2)
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(thickness, height, length + thickness * 2), mat);
    westWall.position.set(-width / 2 - thickness / 2, height / 2, 0);
    westWall.receiveShadow = true;
    group.add(westWall);

    // East Wall (X = width / 2)
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(thickness, height, length + thickness * 2), mat);
    eastWall.position.set(width / 2 + thickness / 2, height / 2, 0);
    eastWall.receiveShadow = true;
    group.add(eastWall);

    if (showCeiling) {
      const ceiling = new THREE.Mesh(new THREE.BoxGeometry(width, 0.1, length), mat);
      ceiling.position.y = height + 0.05;
      group.add(ceiling);
    }

    return group;
  }

  static calculateMetrics(dimensions: RoomDimensions, items: FurnitureItem[]): InventorySummary {
    const floorArea = dimensions.width * dimensions.length;
    const perimeter = (dimensions.width + dimensions.length) * 2;
    const wallSurface = perimeter * dimensions.height;

    const categoryCounts: Record<FurnitureItem['category'], number> = {
      SEATING: 0,
      TABLES: 0,
      STORAGE: 0,
      BEDS: 0,
      LIGHTING: 0,
      DECOR: 0,
      ELECTRONICS: 0,
    };

    for (const item of items) {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }

    return {
      totalItems: items.length,
      categoryCounts,
      floorAreaSqMeters: parseFloat(floorArea.toFixed(2)),
      wallSurfaceSqMeters: parseFloat(wallSurface.toFixed(2)),
    };
  }
}
