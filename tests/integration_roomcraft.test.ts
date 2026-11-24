import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { useDesignStore } from '../src/core/design_store';
import { FURNITURE_CATALOG } from '../src/core/catalog';
import { RoomBuilder } from '../src/core/room_builder';
import { MeshFactory } from '../src/core/mesh_factory';
import { LightingManager } from '../src/core/lighting_manager';
import { ExportService } from '../src/core/export_service';

describe('RoomCraft End-to-End Architectural Pipeline', () => {
  it('constructs, customizes, populates, lights, and exports a 3D architectural interior', () => {
    // 1. Initialize store & create 3D room
    const store = useDesignStore.getState();
    store.resetRoom();

    // 2. Set custom dimensions (8m x 7m x 3.2m)
    store.setDimensions({ width: 8.0, length: 7.0, height: 3.2 });
    store.setWallMaterial({ color: '#f1f5f9', textureType: 'PLASTER' });
    store.setFloorMaterial({ color: '#ffffff', textureType: 'MARBLE' });

    // 3. Add multiple pieces of furniture from catalog
    const deskTemplate = FURNITURE_CATALOG.find((f) => f.modelType === 'DESK')!;
    const lampTemplate = FURNITURE_CATALOG.find((f) => f.modelType === 'FLOOR_LAMP')!;
    const plantTemplate = FURNITURE_CATALOG.find((f) => f.modelType === 'POTTED_PLANT')!;

    const desk = store.addItem(deskTemplate, [-2, 0, -2]);
    const lamp = store.addItem(lampTemplate, [-2.8, 0, -2]);
    const plant = store.addItem(plantTemplate, [2.5, 0, 2.5]);

    expect(desk.modelType).toBe('DESK');
    expect(lamp.modelType).toBe('FLOOR_LAMP');
    expect(plant.modelType).toBe('POTTED_PLANT');

    // 4. Transform item (rotate and scale desk)
    store.updateItem(desk.id, {
      rotation: [0, Math.PI / 4, 0],
      scale: [1.1, 1.1, 1.1],
    });

    // 5. Change lighting to Golden Sunset
    store.setLightingPreset('WARM_SUNSET');
    const currentDesign = useDesignStore.getState().design;
    expect(currentDesign.lighting.preset).toBe('WARM_SUNSET');

    // 6. Construct Three.js Scene hierarchy
    const scene = new THREE.Scene();
    const floor = RoomBuilder.createFloor(currentDesign.dimensions, currentDesign.floorMaterial);
    const walls = RoomBuilder.createWalls(currentDesign.dimensions, currentDesign.wallMaterial);
    scene.add(floor);
    scene.add(walls);

    for (const item of currentDesign.items) {
      const mesh = MeshFactory.buildFurnitureMesh(item);
      scene.add(mesh);
    }

    LightingManager.applyLightingToScene(scene, currentDesign.lighting);

    // Verify scene composition
    expect(scene.children.length).toBeGreaterThan(5);

    // 7. Calculate metrics & generate BOM
    const metrics = RoomBuilder.calculateMetrics(currentDesign.dimensions, currentDesign.items);
    expect(metrics.floorAreaSqMeters).toBe(56.0); // 8.0 * 7.0
    expect(metrics.totalItems).toBe(5); // 2 initial + 3 added

    const bom = ExportService.generateBillOfMaterials(currentDesign);
    expect(bom).toContain('Total Floor Area:** 56 m²');
    expect(bom).toContain('Floor Material:** MARBLE');
    expect(bom).toContain('Lighting Ambience:** WARM_SUNSET');

    // 8. Export and re-import project JSON
    const exportedJSON = ExportService.exportDesignJSON(currentDesign);
    const importedDesign = ExportService.parseDesignJSON(exportedJSON);

    expect(importedDesign.dimensions.width).toBe(8.0);
    expect(importedDesign.items.length).toBe(5);
  });
});
