import * as THREE from 'three';
import { LightingConfig, LightPreset } from '../types';

export class LightingManager {
  static getPresetConfig(preset: LightPreset): LightingConfig {
    switch (preset) {
      case 'WARM_SUNSET':
        return {
          preset: 'WARM_SUNSET',
          ambientIntensity: 0.4,
          sunIntensity: 1.2,
          sunPosition: [8, 4, 6],
          sunColor: '#f97316',
          shadowsEnabled: true,
        };
      case 'STUDIO':
        return {
          preset: 'STUDIO',
          ambientIntensity: 0.6,
          sunIntensity: 0.9,
          sunPosition: [0, 10, 5],
          sunColor: '#ffffff',
          shadowsEnabled: true,
        };
      case 'CYBER_NEON':
        return {
          preset: 'CYBER_NEON',
          ambientIntensity: 0.25,
          sunIntensity: 1.4,
          sunPosition: [-6, 6, 6],
          sunColor: '#ec4899',
          shadowsEnabled: true,
        };
      case 'COZY_NIGHT':
        return {
          preset: 'COZY_NIGHT',
          ambientIntensity: 0.2,
          sunIntensity: 0.3,
          sunPosition: [2, 3, 2],
          sunColor: '#fed7aa',
          shadowsEnabled: true,
        };
      case 'DAYLIGHT':
      default:
        return {
          preset: 'DAYLIGHT',
          ambientIntensity: 0.5,
          sunIntensity: 1.0,
          sunPosition: [5, 9, 7],
          sunColor: '#f8fafc',
          shadowsEnabled: true,
        };
    }
  }

  static applyLightingToScene(scene: THREE.Scene, config: LightingConfig): {
    ambientLight: THREE.AmbientLight;
    directionalLight: THREE.DirectionalLight;
  } {
    // Remove existing lights
    const toRemove: THREE.Object3D[] = [];
    scene.traverse((obj) => {
      if (obj instanceof THREE.Light) {
        toRemove.push(obj);
      }
    });
    for (const l of toRemove) scene.remove(l);

    // Create Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, config.ambientIntensity);
    scene.add(ambientLight);

    // Create Directional Light
    const directionalLight = new THREE.DirectionalLight(config.sunColor, config.sunIntensity);
    directionalLight.position.set(...config.sunPosition);
    directionalLight.castShadow = config.shadowsEnabled;

    if (config.shadowsEnabled) {
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 30;
      directionalLight.shadow.camera.left = -10;
      directionalLight.shadow.camera.right = 10;
      directionalLight.shadow.camera.top = 10;
      directionalLight.shadow.camera.bottom = -10;
      directionalLight.shadow.bias = -0.0005;
    }

    scene.add(directionalLight);

    return { ambientLight, directionalLight };
  }
}
