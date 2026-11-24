import { describe, it, expect, beforeEach } from 'vitest';
import { useDesignStore } from '../src/core/design_store';
import { FURNITURE_CATALOG } from '../src/core/catalog';

describe('DesignStore (Zustand)', () => {
  beforeEach(() => {
    useDesignStore.getState().resetRoom();
  });

  it('initializes with default room design containing 2 items', () => {
    const state = useDesignStore.getState();
    expect(state.design.dimensions.width).toBe(6.0);
    expect(state.design.items.length).toBe(2);
    expect(state.cameraMode).toBe('PERSPECTIVE');
  });

  it('updates room dimensions and wall materials', () => {
    const store = useDesignStore.getState();
    store.setDimensions({ width: 7.5, length: 6.5 });
    store.setWallMaterial({ color: '#ffffff', textureType: 'BRICK' });

    const updated = useDesignStore.getState().design;
    expect(updated.dimensions.width).toBe(7.5);
    expect(updated.dimensions.length).toBe(6.5);
    expect(updated.wallMaterial.textureType).toBe('BRICK');
  });

  it('adds, updates, duplicates, and removes furniture items', () => {
    const store = useDesignStore.getState();
    const bedTemplate = FURNITURE_CATALOG.find((i) => i.modelType === 'KING_BED')!;

    // Add item
    const newItem = store.addItem(bedTemplate, [1.5, 0, 1.5]);
    expect(useDesignStore.getState().design.items.length).toBe(3);
    expect(useDesignStore.getState().selectedItemId).toBe(newItem.id);

    // Update item
    store.updateItem(newItem.id, { color: '#ec4899', scale: [1.2, 1.2, 1.2] });
    const fetched = useDesignStore.getState().design.items.find((i) => i.id === newItem.id);
    expect(fetched?.color).toBe('#ec4899');
    expect(fetched?.scale[0]).toBe(1.2);

    // Duplicate item
    const duplicate = store.duplicateItem(newItem.id);
    expect(duplicate).toBeDefined();
    expect(useDesignStore.getState().design.items.length).toBe(4);

    // Remove item
    store.removeItem(newItem.id);
    expect(useDesignStore.getState().design.items.length).toBe(3);
  });
});
