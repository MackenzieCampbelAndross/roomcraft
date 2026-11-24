import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { LightingManager } from '../src/core/lighting_manager';

describe('LightingManager', () => {
  it('retrieves distinct light presets with calibrated parameters', () => {
    const daylight = LightingManager.getPresetConfig('DAYLIGHT');
    expect(daylight.preset).toBe('DAYLIGHT');
    expect(daylight.sunIntensity).toBe(1.0);
    expect(daylight.shadowsEnabled).toBe(true);

    const sunset = LightingManager.getPresetConfig('WARM_SUNSET');
    expect(sunset.sunColor).toBe('#f97316');

    const cyber = LightingManager.getPresetConfig('CYBER_NEON');
    expect(cyber.sunColor).toBe('#ec4899');
  });

  it('adds ambient and directional lights to a Three.js scene', () => {
    const scene = new THREE.Scene();
    const config = LightingManager.getPresetConfig('STUDIO');

    const lights = LightingManager.applyLightingToScene(scene, config);
    expect(lights.ambientLight).toBeInstanceOf(THREE.AmbientLight);
    expect(lights.directionalLight).toBeInstanceOf(THREE.DirectionalLight);

    let lightCount = 0;
    scene.traverse((obj) => {
      if (obj instanceof THREE.Light) lightCount++;
    });
    expect(lightCount).toBe(2);
  });
});
