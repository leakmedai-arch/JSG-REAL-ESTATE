import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Compass, Eye, Sparkles, Maximize2 } from 'lucide-react';

interface Hero3DTurntableProps {
  currentSlideIndex: number;
  slideThemeColor?: string;
  onExplore?: () => void;
}

export const Hero3DTurntable: React.FC<Hero3DTurntableProps> = ({
  currentSlideIndex,
  slideThemeColor = '#c5a059',
  onExplore
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [currentAngleDegrees, setCurrentAngleDegrees] = useState(0);

  // References for animation and interaction
  const stateRef = useRef({
    isPointerDown: false,
    pointerStartX: 0,
    pointerStartY: 0,
    targetRotationY: 0.4,
    targetRotationX: 0.22,
    currentRotationY: 0.4,
    currentRotationX: 0.22,
    angularVelocityY: 0.005,
    autoRotateSpeed: 0.006,
    autoRotate: true,
    targetSlide: 0
  });

  useEffect(() => {
    stateRef.current.targetSlide = currentSlideIndex;
  }, [currentSlideIndex]);

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 480;
    let height = container.clientHeight || 480;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    // Transparent background so the hero gradient and ambient glow shine through
    scene.background = null;

    // 2. Camera Setup (Perspective for high-end depth)
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 5.5, 11);
    camera.lookAt(0, 1.2, 0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // 4. Master Rotational Stage Pivot Group
    const stagePivot = new THREE.Group();
    scene.add(stagePivot);

    // =========================================================================
    // MULTI-TIERED CIRCULAR TURNTABLE PEDESTAL (Exactly matching image.png)
    // =========================================================================
    const pedestalGroup = new THREE.Group();
    stagePivot.add(pedestalGroup);

    // A. Bottom Base Ring (Dark Metallic Rim)
    const baseGeom = new THREE.CylinderGeometry(4.3, 4.5, 0.4, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0c211a,
      metalness: 0.9,
      roughness: 0.25
    });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.y = -0.2;
    baseMesh.receiveShadow = true;
    pedestalGroup.add(baseMesh);

    // B. Middle Tier with Recessed Glow Ring
    const middleGeom = new THREE.CylinderGeometry(3.9, 4.15, 0.35, 64);
    const middleMat = new THREE.MeshStandardMaterial({
      color: 0x14362d,
      metalness: 0.85,
      roughness: 0.3
    });
    const middleMesh = new THREE.Mesh(middleGeom, middleMat);
    middleMesh.position.y = 0.12;
    middleMesh.receiveShadow = true;
    pedestalGroup.add(middleMesh);

    // C. Glowing LED Light Ring Band (Emerald to Gold)
    const glowRingGeom = new THREE.TorusGeometry(3.98, 0.065, 16, 64);
    const glowRingMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37
    });
    const glowRingMesh = new THREE.Mesh(glowRingGeom, glowRingMat);
    glowRingMesh.rotation.x = Math.PI / 2;
    glowRingMesh.position.y = 0.28;
    pedestalGroup.add(glowRingMesh);

    // D. Secondary Inner Ambient Ring (Luxury Champagne Gold)
    const innerGlowRingGeom = new THREE.TorusGeometry(3.6, 0.035, 16, 64);
    const innerGlowRingMat = new THREE.MeshBasicMaterial({
      color: 0xd9bf8c
    });
    const innerGlowRingMesh = new THREE.Mesh(innerGlowRingGeom, innerGlowRingMat);
    innerGlowRingMesh.rotation.x = Math.PI / 2;
    innerGlowRingMesh.position.y = 0.32;
    pedestalGroup.add(innerGlowRingMesh);

    // E. Top Beveled Turntable Disc Platform
    const topDiscGeom = new THREE.CylinderGeometry(3.7, 3.8, 0.25, 64);
    const topDiscMat = new THREE.MeshStandardMaterial({
      color: 0x0f2921,
      metalness: 0.8,
      roughness: 0.2,
    });
    const topDiscMesh = new THREE.Mesh(topDiscGeom, topDiscMat);
    topDiscMesh.position.y = 0.42;
    topDiscMesh.receiveShadow = true;
    pedestalGroup.add(topDiscMesh);

    // F. Platform Radial Inlay Rings & Concentric Details
    const inlayGeom = new THREE.RingGeometry(1.2, 3.5, 48);
    const inlayMat = new THREE.MeshBasicMaterial({
      color: 0xc5a059,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const inlayMesh = new THREE.Mesh(inlayGeom, inlayMat);
    inlayMesh.rotation.x = -Math.PI / 2;
    inlayMesh.position.y = 0.55;
    pedestalGroup.add(inlayMesh);

    // =========================================================================
    // 3D ARCHITECTURAL DUBAI SKYSCRAPERS & TOWERS CLUSTER
    // =========================================================================
    const towersGroup = new THREE.Group();
    stagePivot.add(towersGroup);

    // Tower Materials with Luxury Deep Blue/Emerald Facades & Gold Accents
    const glassTowerMat = new THREE.MeshStandardMaterial({
      color: 0x1a463a,
      metalness: 0.85,
      roughness: 0.15,
      emissive: 0x081e17,
      emissiveIntensity: 0.4
    });

    const blueGlassTowerMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      metalness: 0.9,
      roughness: 0.12,
      emissive: 0x0c2461,
      emissiveIntensity: 0.5
    });

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15
    });

    const windowGlowMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a
    });

    // Helper: Build a stylized modern tower with tiered levels, spires, and lit window strips
    interface TowerConfig {
      x: number;
      z: number;
      baseWidth: number;
      baseDepth: number;
      height: number;
      levels?: number;
      hasSpire?: boolean;
      spireHeight?: number;
      material?: THREE.Material;
      crownColor?: number;
    }

    const createArchitecturalTower = (cfg: TowerConfig) => {
      const tower = new THREE.Group();
      tower.position.set(cfg.x, 0.55, cfg.z);

      const levels = cfg.levels || 3;
      let currentY = 0;
      let curW = cfg.baseWidth;
      let curD = cfg.baseDepth;
      const levelHeight = cfg.height / levels;

      for (let i = 0; i < levels; i++) {
        const segGeom = new THREE.BoxGeometry(curW, levelHeight, curD);
        const segMesh = new THREE.Mesh(segGeom, cfg.material || glassTowerMat);
        segMesh.position.y = currentY + levelHeight / 2;
        segMesh.castShadow = true;
        segMesh.receiveShadow = true;
        tower.add(segMesh);

        // Window accent bands
        const bandGeom = new THREE.BoxGeometry(curW * 1.02, 0.08, curD * 1.02);
        const bandMesh = new THREE.Mesh(bandGeom, goldAccentMat);
        bandMesh.position.y = currentY + levelHeight * 0.9;
        tower.add(bandMesh);

        // Vertical corner mullions / fins
        const finGeom = new THREE.BoxGeometry(0.04, levelHeight, 0.04);
        const finOffsets = [
          [-curW / 2, -curD / 2],
          [curW / 2, -curD / 2],
          [-curW / 2, curD / 2],
          [curW / 2, curD / 2]
        ];
        finOffsets.forEach(([fx, fz]) => {
          const finMesh = new THREE.Mesh(finGeom, goldAccentMat);
          finMesh.position.set(fx, currentY + levelHeight / 2, fz);
          tower.add(finMesh);
        });

        currentY += levelHeight;
        curW *= 0.82; // Tapering
        curD *= 0.82;
      }

      // Penthouse Crown / Helipad / Spire
      if (cfg.hasSpire) {
        const spireH = cfg.spireHeight || 1.4;
        const spireGeom = new THREE.ConeGeometry(curW * 0.5, spireH, 16);
        const spireMesh = new THREE.Mesh(spireGeom, goldAccentMat);
        spireMesh.position.y = currentY + spireH / 2;
        tower.add(spireMesh);

        // Beacon Sphere Light at peak
        const beaconGeom = new THREE.SphereGeometry(0.08, 16, 16);
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const beaconMesh = new THREE.Mesh(beaconGeom, beaconMat);
        beaconMesh.position.y = currentY + spireH;
        tower.add(beaconMesh);
      } else {
        // Penthouse crown bevel
        const crownGeom = new THREE.CylinderGeometry(curW * 0.45, curW * 0.6, 0.25, 24);
        const crownMesh = new THREE.Mesh(crownGeom, goldAccentMat);
        crownMesh.position.y = currentY + 0.12;
        tower.add(crownMesh);
      }

      return tower;
    };

    // 1. Center Sovereign Spire (Tallest Dubai Trophy Tower)
    const centralTower = createArchitecturalTower({
      x: 0,
      z: 0,
      baseWidth: 1.15,
      baseDepth: 1.15,
      height: 4.8,
      levels: 4,
      hasSpire: true,
      spireHeight: 1.8,
      material: blueGlassTowerMat
    });
    towersGroup.add(centralTower);

    // 2. Marina Horizon Tower (Sleek High-Rise on Left)
    const leftTower = createArchitecturalTower({
      x: -1.4,
      z: 0.3,
      baseWidth: 0.95,
      baseDepth: 0.95,
      height: 3.6,
      levels: 3,
      hasSpire: true,
      spireHeight: 1.1,
      material: glassTowerMat
    });
    towersGroup.add(leftTower);

    // 3. Downtown Financial Obelisk (Right High-Rise)
    const rightTower = createArchitecturalTower({
      x: 1.3,
      z: 0.2,
      baseWidth: 0.9,
      baseDepth: 0.9,
      height: 3.9,
      levels: 3,
      hasSpire: true,
      spireHeight: 1.3,
      material: blueGlassTowerMat
    });
    towersGroup.add(rightTower);

    // 4. Palm Beachfront Curved Residence Tower (Front Left)
    const frontLeftTower = createArchitecturalTower({
      x: -0.9,
      z: 1.4,
      baseWidth: 0.8,
      baseDepth: 0.8,
      height: 2.6,
      levels: 3,
      hasSpire: false,
      material: glassTowerMat
    });
    towersGroup.add(frontLeftTower);

    // 5. Canal Waterside Crystal Tower (Front Right)
    const frontRightTower = createArchitecturalTower({
      x: 0.95,
      z: 1.35,
      baseWidth: 0.85,
      baseDepth: 0.85,
      height: 2.9,
      levels: 3,
      hasSpire: false,
      material: blueGlassTowerMat
    });
    towersGroup.add(frontRightTower);

    // 6. Dubai Hills Sky Villa Towers (Back Left & Back Right)
    const backLeftTower = createArchitecturalTower({
      x: -1.2,
      z: -1.1,
      baseWidth: 0.75,
      baseDepth: 0.75,
      height: 2.4,
      levels: 2,
      material: glassTowerMat
    });
    towersGroup.add(backLeftTower);

    const backRightTower = createArchitecturalTower({
      x: 1.1,
      z: -1.2,
      baseWidth: 0.8,
      baseDepth: 0.8,
      height: 2.8,
      levels: 3,
      material: glassTowerMat
    });
    towersGroup.add(backRightTower);

    // =========================================================================
    // FLOATING 3D METALLIC / ALABASTER CLOUDS (As seen in image.png)
    // =========================================================================
    const cloudsGroup = new THREE.Group();
    scene.add(cloudsGroup);

    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.25
    });

    const createFloatingCloud = (x: number, y: number, z: number, scale = 1) => {
      const cloud = new THREE.Group();
      cloud.position.set(x, y, z);
      cloud.scale.set(scale, scale, scale);

      // Composed of overlapping spheres with smooth pill formation
      const sphereGeom = new THREE.SphereGeometry(0.35, 20, 20);
      const positions = [
        [0, 0, 0, 1.1],
        [-0.32, -0.06, 0.05, 0.85],
        [0.34, -0.04, -0.05, 0.9],
        [-0.15, 0.16, 0.08, 0.8],
        [0.18, 0.14, 0.02, 0.85]
      ];

      positions.forEach(([cx, cy, cz, cs]) => {
        const mesh = new THREE.Mesh(sphereGeom, cloudMaterial);
        mesh.position.set(cx, cy, cz);
        mesh.scale.set(cs, cs, cs);
        mesh.castShadow = true;
        cloud.add(mesh);
      });

      return cloud;
    };

    const cloud1 = createFloatingCloud(-2.8, 5.2, -0.5, 0.9);
    const cloud2 = createFloatingCloud(3.1, 5.8, 0.8, 1.05);
    const cloud3 = createFloatingCloud(-3.2, 3.2, 2.2, 0.75);
    const cloud4 = createFloatingCloud(2.9, 3.6, -1.8, 0.85);

    cloudsGroup.add(cloud1);
    cloudsGroup.add(cloud2);
    cloudsGroup.add(cloud3);
    cloudsGroup.add(cloud4);

    // =========================================================================
    // LIGHTING SETUP (Cinematic Architectural Studio Lighting)
    // =========================================================================
    // Key Light: Warm Gold Sunbeam
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.8);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light: Emerald Ambience
    const fillLight = new THREE.DirectionalLight(0x34d399, 1.4);
    fillLight.position.set(-8, 6, -4);
    scene.add(fillLight);

    // Rim/Back Light: High-Contrast Platinum Edge
    const rimLight = new THREE.DirectionalLight(0x60a5fa, 2.2);
    rimLight.position.set(0, 10, -10);
    scene.add(rimLight);

    // Ambient Uplight
    const ambientLight = new THREE.AmbientLight(0x0e241e, 1.2);
    scene.add(ambientLight);

    // Dynamic Point Light under Pedestal Ring for Volumetric Glow
    const pedestalGlowLight = new THREE.PointLight(0xd4af37, 3, 7);
    pedestalGlowLight.position.set(0, 0.5, 0);
    scene.add(pedestalGlowLight);

    // =========================================================================
    // POINTER & TOUCH GESTURE LISTENERS (Smooth 360° Drag & Gyro Tilt)
    // =========================================================================
    const handlePointerDown = (e: PointerEvent) => {
      stateRef.current.isPointerDown = true;
      stateRef.current.pointerStartX = e.clientX;
      stateRef.current.pointerStartY = e.clientY;
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!stateRef.current.isPointerDown) return;
      const deltaX = e.clientX - stateRef.current.pointerStartX;
      const deltaY = e.clientY - stateRef.current.pointerStartY;

      stateRef.current.pointerStartX = e.clientX;
      stateRef.current.pointerStartY = e.clientY;

      // Rotate stage around Y-axis (360 degrees full freedom)
      stateRef.current.targetRotationY += deltaX * 0.008;
      stateRef.current.angularVelocityY = deltaX * 0.005;

      // Tilt camera pitch (clamped between 0.05 and 0.45 radians for great viewing angle)
      stateRef.current.targetRotationX = Math.max(
        0.05,
        Math.min(0.48, stateRef.current.targetRotationX - deltaY * 0.003)
      );
    };

    const handlePointerUp = (e: PointerEvent) => {
      stateRef.current.isPointerDown = false;
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // ignore
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);

    // =========================================================================
    // RESIZE OBSERVER
    // =========================================================================
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 480;
      const newH = container.clientHeight || 480;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // =========================================================================
    // 60FPS RENDER & PHYSICS LOOP
    // =========================================================================
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous automatic turntable orbit when not manually dragging
      if (!stateRef.current.isPointerDown && stateRef.current.autoRotate) {
        stateRef.current.targetRotationY += stateRef.current.autoRotateSpeed;
      }

      // Smooth damping interpolation (lerp)
      stateRef.current.currentRotationY += (stateRef.current.targetRotationY - stateRef.current.currentRotationY) * 0.08;
      stateRef.current.currentRotationX += (stateRef.current.targetRotationX - stateRef.current.currentRotationX) * 0.08;

      // Apply rotation to stage pivot (360 degrees turntable)
      stagePivot.rotation.y = stateRef.current.currentRotationY;

      // Camera elevation based on pitch tilt
      camera.position.y = 5.5 + Math.sin(stateRef.current.currentRotationX) * 3;
      camera.lookAt(0, 1.3, 0);

      // Floating clouds organic sinusoidal bobbing
      cloud1.position.y = 5.2 + Math.sin(elapsedTime * 1.2 + 0) * 0.18;
      cloud2.position.y = 5.8 + Math.cos(elapsedTime * 1.4 + 1) * 0.22;
      cloud3.position.y = 3.2 + Math.sin(elapsedTime * 1.5 + 2) * 0.14;
      cloud4.position.y = 3.6 + Math.cos(elapsedTime * 1.1 + 3) * 0.16;

      // Led glow ring pulsation
      const glowIntensity = 1 + Math.sin(elapsedTime * 2.5) * 0.25;
      pedestalGlowLight.intensity = 2.5 * glowIntensity;

      // Update degrees display
      const deg = Math.round(((stagePivot.rotation.y % (Math.PI * 2)) / (Math.PI * 2)) * 360);
      setCurrentAngleDegrees((deg + 360) % 360);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);

      // Clean Three.js resources
      renderer.dispose();
      scene.clear();
    };
  }, []);

  const resetView = (e: React.MouseEvent) => {
    e.stopPropagation();
    stateRef.current.targetRotationY = 0.4;
    stateRef.current.targetRotationX = 0.22;
  };

  const toggleAutoRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAutoRotate(prev => !prev);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] xl:h-[520px] flex items-center justify-center select-none"
    >
      {/* Three.js Interactive WebGL Canvas */}
      <canvas
        ref={canvasRef}
        data-cursor="360° Drag"
        className={`w-full h-full block touch-none z-10 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      />

      {/* Futuristic 360° UI HUD Floating Controls & Badge (Matching Picture Style) */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2 pointer-events-auto">
        {/* 360 Degree Dial Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c261e]/85 backdrop-blur-md border border-[#c5a059]/40 text-white shadow-xl">
          <RotateCw className={`w-3.5 h-3.5 text-[#d9bf8c] ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          <span className="text-[11px] font-black tracking-wider text-[#d9bf8c] uppercase">
            360° {currentAngleDegrees}°
          </span>
        </div>

        {/* Auto-Rotate Play/Pause Toggle */}
        <button
          type="button"
          onClick={toggleAutoRotate}
          className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-md ${
            autoRotate 
              ? 'bg-[#b58b4a]/20 border-[#b58b4a] text-[#d9bf8c]' 
              : 'bg-[#0c261e]/70 border-white/20 text-white/70 hover:text-white'
          }`}
          title={autoRotate ? "Pause Turntable" : "Start Auto-Turntable"}
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Reset Camera View Angle */}
        <button
          type="button"
          onClick={resetView}
          className="p-2 rounded-xl bg-[#0c261e]/70 hover:bg-[#0c261e] border border-white/20 text-white/80 hover:text-[#d9bf8c] transition-all cursor-pointer shadow-md"
          title="Reset to Front Angle"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Drag Instruction Hint Pill */}
      <div className="absolute bottom-2 inset-x-0 z-20 flex justify-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0c261e]/75 backdrop-blur-md border border-[#c5a059]/30 text-white/90 text-[11px] font-bold shadow-lg animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-[#d9bf8c]" />
          <span>Interactive 3D Turntable · Drag to rotate 360°</span>
        </div>
      </div>

      {/* Ambient Radial Spotlight Glow under the Stage */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-t from-[#b58b4a]/20 via-[#10b981]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
    </div>
  );
};
