import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDesignStore } from '../core/design_store';
import { RoomBuilder } from '../core/room_builder';
import { MeshFactory } from '../core/mesh_factory';
import { LightingManager } from '../core/lighting_manager';

export const Viewport3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    design,
    selectedItemId,
    cameraMode,
    activeTool,
    selectItem,
    updateItem,
  } = useDesignStore();

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const furnitureGroupRef = useRef<THREE.Group | null>(null);
  const roomGroupRef = useRef<THREE.Group | null>(null);

  // Orbit state
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const cameraSphericalRef = useRef({ radius: 10, theta: Math.PI / 4, phi: Math.PI / 3 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 1, 0));

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Groups
    const roomGroup = new THREE.Group();
    roomGroup.name = 'room_group';
    scene.add(roomGroup);
    roomGroupRef.current = roomGroup;

    const furnitureGroup = new THREE.Group();
    furnitureGroup.name = 'furniture_group';
    scene.add(furnitureGroup);
    furnitureGroupRef.current = furnitureGroup;

    // Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Camera positioning from spherical coordinates
      if (cameraMode === 'PERSPECTIVE') {
        const { radius, theta, phi } = cameraSphericalRef.current;
        camera.position.x = cameraTargetRef.current.x + radius * Math.sin(phi) * Math.sin(theta);
        camera.position.y = cameraTargetRef.current.y + radius * Math.cos(phi);
        camera.position.z = cameraTargetRef.current.z + radius * Math.sin(phi) * Math.cos(theta);
        camera.lookAt(cameraTargetRef.current);
      } else if (cameraMode === 'TOP_DOWN') {
        camera.position.set(0, 14, 0.001);
        camera.lookAt(0, 0, 0);
      } else if (cameraMode === 'ISOMETRIC') {
        camera.position.set(9, 9, 9);
        camera.lookAt(0, 1, 0);
      } else if (cameraMode === 'FIRST_PERSON') {
        camera.position.set(0, 1.6, design.dimensions.length / 2 - 0.5);
        camera.lookAt(0, 1.4, -1);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Window resize handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Sync Room Geometry & Materials
  useEffect(() => {
    if (!roomGroupRef.current) return;
    const group = roomGroupRef.current;

    // Clear previous room meshes
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
    }

    const floor = RoomBuilder.createFloor(design.dimensions, design.floorMaterial);
    const walls = RoomBuilder.createWalls(design.dimensions, design.wallMaterial);
    group.add(floor);
    group.add(walls);
  }, [design.dimensions, design.wallMaterial, design.floorMaterial]);

  // Sync Lighting
  useEffect(() => {
    if (!sceneRef.current) return;
    LightingManager.applyLightingToScene(sceneRef.current, design.lighting);
  }, [design.lighting]);

  // Sync Furniture Items
  useEffect(() => {
    if (!furnitureGroupRef.current) return;
    const fGroup = furnitureGroupRef.current;

    // Clear previous items
    while (fGroup.children.length > 0) {
      const obj = fGroup.children[0];
      fGroup.remove(obj);
    }

    // Build meshes
    for (const item of design.items) {
      const mesh = MeshFactory.buildFurnitureMesh(item);

      // If selected, add high-visibility outline bounding box
      if (item.id === selectedItemId) {
        const box = new THREE.BoxHelper(mesh, 0x38bdf8);
        (box.material as THREE.LineBasicMaterial).linewidth = 2;
        mesh.add(box);
      }

      fGroup.add(mesh);
    }
  }, [design.items, selectedItemId]);

  // Mouse / Pointer Interaction handlers (Orbit, Pan, Select, Move)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };

    // Raycast to pick item
    if (!containerRef.current || !cameraRef.current || !furnitureGroupRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(furnitureGroupRef.current.children, true);

    if (intersects.length > 0) {
      // Find top-level group with item id
      let curr: THREE.Object3D | null = intersects[0].object;
      while (curr && curr.parent !== furnitureGroupRef.current) {
        curr = curr.parent;
      }
      if (curr && curr.name) {
        selectItem(curr.name);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - prevMouseRef.current.x;
    const dy = e.clientY - prevMouseRef.current.y;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };

    if (e.buttons === 1) {
      // Left Click: Orbit or Move item depending on tool
      if (activeTool === 'MOVE' && selectedItemId) {
        const item = design.items.find((i) => i.id === selectedItemId);
        if (item) {
          const moveSpeed = 0.01;
          const newX = Math.min(
            design.dimensions.width / 2 - 0.2,
            Math.max(-design.dimensions.width / 2 + 0.2, item.position[0] + dx * moveSpeed)
          );
          const newZ = Math.min(
            design.dimensions.length / 2 - 0.2,
            Math.max(-design.dimensions.length / 2 + 0.2, item.position[2] + dy * moveSpeed)
          );
          updateItem(selectedItemId, { position: [newX, item.position[1], newZ] });
        }
      } else if (activeTool === 'ROTATE' && selectedItemId) {
        const item = design.items.find((i) => i.id === selectedItemId);
        if (item) {
          const newRotY = item.rotation[1] + dx * 0.03;
          updateItem(selectedItemId, { rotation: [0, newRotY, 0] });
        }
      } else {
        // Orbit camera
        cameraSphericalRef.current.theta -= dx * 0.008;
        cameraSphericalRef.current.phi = Math.max(
          0.1,
          Math.min(Math.PI / 2 - 0.05, cameraSphericalRef.current.phi - dy * 0.008)
        );
      }
    } else if (e.buttons === 2) {
      // Right Click: Pan camera
      const panSpeed = 0.01;
      cameraTargetRef.current.x -= dx * panSpeed;
      cameraTargetRef.current.z -= dy * panSpeed;
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    cameraSphericalRef.current.radius = Math.max(
      3,
      Math.min(22, cameraSphericalRef.current.radius + e.deltaY * 0.01)
    );
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating HUD controls */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 shadow-xl flex items-center space-x-3 pointer-events-none">
        <span className="font-semibold text-sky-400">Camera: {cameraMode}</span>
        <span className="text-slate-500">•</span>
        <span>Left Click: Orbit</span>
        <span className="text-slate-500">•</span>
        <span>Right Click: Pan</span>
        <span className="text-slate-500">•</span>
        <span>Scroll: Zoom</span>
      </div>
    </div>
  );
};
