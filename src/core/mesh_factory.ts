import * as THREE from 'three';
import { FurnitureItem, MaterialType } from '../types';

export class MeshFactory {
  static createMaterial(colorHex: string, materialType: MaterialType): THREE.MeshStandardMaterial {
    let roughness = 0.5;
    let metalness = 0.1;

    switch (materialType) {
      case 'HARDWOOD':
        roughness = 0.4;
        metalness = 0.05;
        break;
      case 'MARBLE':
        roughness = 0.15;
        metalness = 0.1;
        break;
      case 'CONCRETE':
        roughness = 0.85;
        metalness = 0.05;
        break;
      case 'TILES':
        roughness = 0.2;
        metalness = 0.2;
        break;
      case 'CARPET':
        roughness = 0.95;
        metalness = 0.0;
        break;
      case 'GLASS':
        roughness = 0.05;
        metalness = 0.9;
        break;
      case 'BRICK':
        roughness = 0.8;
        metalness = 0.05;
        break;
      case 'PLASTER':
      default:
        roughness = 0.6;
        metalness = 0.05;
        break;
    }

    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness,
      metalness,
    });
  }

  static buildFurnitureMesh(item: FurnitureItem): THREE.Group {
    const group = new THREE.Group();
    group.name = item.id;
    const mat = this.createMaterial(item.color, item.material);
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.6 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });

    switch (item.modelType) {
      case 'SOFA_3SEATER': {
        // Base / Frame
        const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.2, 0.9), mat);
        base.position.y = 0.2;
        base.castShadow = true;
        group.add(base);

        // 3 Cushions
        for (let i = -1; i <= 1; i++) {
          const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.18, 0.75), mat);
          cushion.position.set(i * 0.7, 0.38, 0.05);
          cushion.castShadow = true;
          group.add(cushion);
        }

        // Backrest
        const back = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 0.2), mat);
        back.position.set(0, 0.6, -0.35);
        back.castShadow = true;
        group.add(back);

        // Armrests
        const armLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.4, 0.9), mat);
        armLeft.position.set(-1.05, 0.45, 0);
        armLeft.castShadow = true;
        group.add(armLeft);

        const armRight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.4, 0.9), mat);
        armRight.position.set(1.05, 0.45, 0);
        armRight.castShadow = true;
        group.add(armRight);

        // Legs
        const legGeom = new THREE.CylinderGeometry(0.03, 0.02, 0.2);
        for (const [lx, lz] of [[-1, -0.38], [1, -0.38], [-1, 0.38], [1, 0.38]]) {
          const leg = new THREE.Mesh(legGeom, darkWoodMat);
          leg.position.set(lx, 0.1, lz);
          leg.castShadow = true;
          group.add(leg);
        }
        break;
      }

      case 'ARMCHAIR': {
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.8), mat);
        seat.position.y = 0.3;
        seat.castShadow = true;
        group.add(seat);

        const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.15), mat);
        back.position.set(0, 0.55, -0.32);
        back.castShadow = true;
        group.add(back);

        const legGeom = new THREE.CylinderGeometry(0.03, 0.02, 0.3);
        for (const [lx, lz] of [[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]]) {
          const leg = new THREE.Mesh(legGeom, metalMat);
          leg.position.set(lx, 0.15, lz);
          leg.castShadow = true;
          group.add(leg);
        }
        break;
      }

      case 'DINING_TABLE': {
        const top = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.9), mat);
        top.position.y = 0.72;
        top.castShadow = true;
        group.add(top);

        const legGeom = new THREE.BoxGeometry(0.06, 0.72, 0.06);
        for (const [lx, lz] of [[-0.82, -0.38], [0.82, -0.38], [-0.82, 0.38], [0.82, 0.38]]) {
          const leg = new THREE.Mesh(legGeom, darkWoodMat);
          leg.position.set(lx, 0.36, lz);
          leg.castShadow = true;
          group.add(leg);
        }
        break;
      }

      case 'COFFEE_TABLE': {
        const top = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.04, 0.6), mat);
        top.position.y = 0.4;
        top.castShadow = true;
        group.add(top);

        const legGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.4);
        for (const [lx, lz] of [[-0.48, -0.24], [0.48, -0.24], [-0.48, 0.24], [0.48, 0.24]]) {
          const leg = new THREE.Mesh(legGeom, metalMat);
          leg.position.set(lx, 0.2, lz);
          leg.castShadow = true;
          group.add(leg);
        }
        break;
      }

      case 'KING_BED': {
        // Bed base
        const frame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 2.1), darkWoodMat);
        frame.position.y = 0.15;
        frame.castShadow = true;
        group.add(frame);

        // Mattress
        const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.28, 2.0), mat);
        mattress.position.set(0, 0.44, 0.02);
        mattress.castShadow = true;
        group.add(mattress);

        // Headboard
        const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.9, 0.15), mat);
        headboard.position.set(0, 0.6, -1.0);
        headboard.castShadow = true;
        group.add(headboard);

        // Pillows
        const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
        for (const px of [-0.5, 0.5]) {
          const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.4), pillowMat);
          pillow.position.set(px, 0.62, -0.7);
          pillow.castShadow = true;
          group.add(pillow);
        }
        break;
      }

      case 'BOOKSHELF': {
        const sides = new THREE.BoxGeometry(0.04, 2.0, 0.35);
        const leftSide = new THREE.Mesh(sides, darkWoodMat);
        leftSide.position.set(-0.58, 1.0, 0);
        group.add(leftSide);

        const rightSide = new THREE.Mesh(sides, darkWoodMat);
        rightSide.position.set(0.58, 1.0, 0);
        group.add(rightSide);

        // 5 shelves
        const shelfGeom = new THREE.BoxGeometry(1.16, 0.03, 0.35);
        for (let i = 0; i < 5; i++) {
          const shelf = new THREE.Mesh(shelfGeom, darkWoodMat);
          shelf.position.set(0, 0.1 + i * 0.45, 0);
          shelf.castShadow = true;
          group.add(shelf);
        }
        break;
      }

      case 'DESK': {
        const top = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.75), mat);
        top.position.y = 0.74;
        top.castShadow = true;
        group.add(top);

        // Steel frame legs
        const legGeom = new THREE.BoxGeometry(0.05, 0.74, 0.05);
        for (const [lx, lz] of [[-0.68, -0.32], [0.68, -0.32], [-0.68, 0.32], [0.68, 0.32]]) {
          const leg = new THREE.Mesh(legGeom, metalMat);
          leg.position.set(lx, 0.37, lz);
          leg.castShadow = true;
          group.add(leg);
        }
        break;
      }

      case 'FLOOR_LAMP': {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03), metalMat);
        base.position.y = 0.015;
        group.add(base);

        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.8), metalMat);
        pole.position.y = 0.9;
        group.add(pole);

        const shadeMat = new THREE.MeshStandardMaterial({
          color: 0xfffbeb,
          roughness: 0.2,
          emissive: 0xfef08a,
          emissiveIntensity: 0.5,
        });
        const shade = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.3, 16, 1, true), shadeMat);
        shade.position.y = 1.75;
        group.add(shade);
        break;
      }

      case 'POTTED_PLANT': {
        const potMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.4, 16), potMat);
        pot.position.y = 0.2;
        pot.castShadow = true;
        group.add(pot);

        const plantMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
        for (let i = 0; i < 6; i++) {
          const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), plantMat);
          leaf.scale.set(0.6, 1.4, 0.2);
          const angle = (i / 6) * Math.PI * 2;
          leaf.position.set(Math.cos(angle) * 0.15, 0.45 + i * 0.08, Math.sin(angle) * 0.15);
          leaf.rotation.z = Math.cos(angle) * 0.4;
          leaf.rotation.x = Math.sin(angle) * 0.4;
          group.add(leaf);
        }
        break;
      }

      case 'TELEVISION':
      default: {
        // Cabinet
        const credenza = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 0.4), darkWoodMat);
        credenza.position.y = 0.225;
        credenza.castShadow = true;
        group.add(credenza);

        // TV screen
        const screenMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.05, metalness: 0.95 });
        const screen = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.03), screenMat);
        screen.position.set(0, 0.9, 0);
        screen.castShadow = true;
        group.add(screen);

        const stand = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.2), metalMat);
        stand.position.set(0, 0.475, 0);
        group.add(stand);
        break;
      }
    }

    // Set position, rotation, scale
    group.position.set(...item.position);
    group.rotation.set(...item.rotation);
    group.scale.set(...item.scale);

    return group;
  }
}
