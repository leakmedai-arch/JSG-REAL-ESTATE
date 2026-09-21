import * as THREE from 'three';
import {
  createTravertineTexture,
  createCalacattaMarbleTexture,
  createConcreteTexture,
  createBlockworkTexture,
  createSoilTexture,
  createWaterNormalTexture
} from './proceduralTextures';
import {
  createHydraulicExcavator,
  createTowerCrane,
  createConcreteMixerTruck,
  ExcavatorParts,
  TowerCraneParts
} from './machineryModels';
import { createConstructionWorker } from './workerModels';

export interface SceneOptions {
  canvas: HTMLCanvasElement;
  onStageChange?: (stageIndex: number) => void;
}

export class Construction3DScene {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private animationFrameId: number | null = null;
  private onStageChange?: (stageIndex: number) => void;

  // Animation progress (0.0 to 1.0)
  public progress = 0.0;
  private targetProgress = 0.0;

  // Orbit / Free Inspection State
  public isInspectMode = false;
  private inspectRotation = { x: 0.28, y: 0.65 };
  private targetInspectRotation = { x: 0.28, y: 0.65 };
  private isPointerDown = false;
  private pointerStart = { x: 0, y: 0 };
  public isXRayMode = false;

  // Master Stage Groups
  private terrainGroup = new THREE.Group();
  private excavationGroup = new THREE.Group();
  private foundationGroup = new THREE.Group();
  private steelStructureGroup = new THREE.Group();
  private concreteSlabsGroup = new THREE.Group();
  private masonryWallsGroup = new THREE.Group();
  private mepServicesGroup = new THREE.Group();
  private facadeGlazingGroup = new THREE.Group();
  private exteriorCladdingGroup = new THREE.Group();
  private landscapeGroup = new THREE.Group();
  private interiorFitoutGroup = new THREE.Group();
  private luxuryFurnitureGroup = new THREE.Group();
  private machineryGroup = new THREE.Group();
  private workersGroup = new THREE.Group();
  private lightingGroup = new THREE.Group();

  // Dynamic Machinery References
  private excavator!: ExcavatorParts;
  private crane!: TowerCraneParts;
  private mixerTruck!: THREE.Group;
  private poolWater!: THREE.Mesh;
  private dustParticles!: THREE.Points;

  // Lighting References
  private sunLight!: THREE.DirectionalLight;
  private ambientLight!: THREE.AmbientLight;
  private hemiLight!: THREE.HemisphereLight;
  private interiorWarmLights: THREE.PointLight[] = [];
  private poolLight!: THREE.PointLight;
  private architecturalFacadeLights: THREE.SpotLight[] = [];

  // Reusable PBR Materials
  private travertineMat!: THREE.MeshStandardMaterial;
  private calacattaMat!: THREE.MeshStandardMaterial;
  private concreteMat!: THREE.MeshStandardMaterial;
  private blockworkMat!: THREE.MeshStandardMaterial;
  private soilMat!: THREE.MeshStandardMaterial;
  private steelMat!: THREE.MeshStandardMaterial;
  private glassCurtainMat!: THREE.MeshPhysicalMaterial;
  private bronzeMat!: THREE.MeshStandardMaterial;
  private walnutMat!: THREE.MeshStandardMaterial;

  constructor(options: SceneOptions) {
    this.canvas = options.canvas;
    this.onStageChange = options.onStageChange;

    // 1. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf6f8fa);
    this.scene.fog = new THREE.FogExp2(0xf6f8fa, 0.012);

    // 3. Perspective Camera
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.5,
      200
    );
    this.camera.position.set(30, 14, 32);
    this.camera.lookAt(0, 3, 0);

    // 4. Initialize Procedural Materials
    this.initMaterials();

    // 5. Build 3D Architectural Stages
    this.setupLighting();
    this.buildTerrainAndPlot();
    this.buildExcavation();
    this.buildFoundation();
    this.buildSteelStructure();
    this.buildConcreteSlabsAndStairs();
    this.buildMasonryWalls();
    this.buildMepServices();
    this.buildFacadeAndGlazing();
    this.buildExteriorCladdingAndFinishes();
    this.buildLandscapingAndPool();
    this.buildInteriorFitout();
    this.buildLuxuryFurniture();
    this.buildMachinery();
    this.buildWorkers();

    // 6. Add all Groups to Scene
    this.scene.add(this.terrainGroup);
    this.scene.add(this.excavationGroup);
    this.scene.add(this.foundationGroup);
    this.scene.add(this.steelStructureGroup);
    this.scene.add(this.concreteSlabsGroup);
    this.scene.add(this.masonryWallsGroup);
    this.scene.add(this.mepServicesGroup);
    this.scene.add(this.facadeGlazingGroup);
    this.scene.add(this.exteriorCladdingGroup);
    this.scene.add(this.landscapeGroup);
    this.scene.add(this.interiorFitoutGroup);
    this.scene.add(this.luxuryFurnitureGroup);
    this.scene.add(this.machineryGroup);
    this.scene.add(this.workersGroup);
    this.scene.add(this.lightingGroup);

    // 7. Event Handlers & Render Loop
    this.setupEvents();
    this.updateStages(0);
    this.animate(0);
  }

  // ----------------------------------------------------
  // INITIALIZE PROCEDURAL MATERIALS
  // ----------------------------------------------------
  private initMaterials() {
    const travertineTex = createTravertineTexture();
    const calacattaTex = createCalacattaMarbleTexture();
    const concreteTex = createConcreteTexture();
    const blockworkTex = createBlockworkTexture();
    const soilTex = createSoilTexture();

    this.travertineMat = new THREE.MeshStandardMaterial({
      map: travertineTex,
      roughness: 0.45,
      metalness: 0.05
    });

    this.calacattaMat = new THREE.MeshStandardMaterial({
      map: calacattaTex,
      roughness: 0.18,
      metalness: 0.12
    });

    this.concreteMat = new THREE.MeshStandardMaterial({
      map: concreteTex,
      roughness: 0.85,
      metalness: 0.08
    });

    this.blockworkMat = new THREE.MeshStandardMaterial({
      map: blockworkTex,
      roughness: 0.9,
      metalness: 0.02
    });

    this.soilMat = new THREE.MeshStandardMaterial({
      map: soilTex,
      roughness: 0.95,
      metalness: 0.02
    });

    this.steelMat = new THREE.MeshStandardMaterial({
      color: 0x38414e,
      roughness: 0.4,
      metalness: 0.85
    });

    this.glassCurtainMat = new THREE.MeshPhysicalMaterial({
      color: 0x88bbdd,
      transmission: 0.9,
      opacity: 0.95,
      transparent: true,
      roughness: 0.06,
      metalness: 0.1,
      ior: 1.52
    });

    this.bronzeMat = new THREE.MeshStandardMaterial({
      color: 0x8c6d46,
      roughness: 0.35,
      metalness: 0.85
    });

    this.walnutMat = new THREE.MeshStandardMaterial({
      color: 0x3d2817,
      roughness: 0.5,
      metalness: 0.05
    });
  }

  // ----------------------------------------------------
  // CINEMATIC LIGHTING SETUP
  // ----------------------------------------------------
  private setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.lightingGroup.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0xe8f0f8, 0xd0d8d4, 0.65);
    this.hemiLight.position.set(0, 60, 0);
    this.lightingGroup.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff7ea, 1.8);
    this.sunLight.position.set(38, 50, 30);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 140;
    this.sunLight.shadow.camera.left = -32;
    this.sunLight.shadow.camera.right = 32;
    this.sunLight.shadow.camera.top = 32;
    this.sunLight.shadow.camera.bottom = -32;
    this.sunLight.shadow.bias = -0.0003;
    this.lightingGroup.add(this.sunLight);

    // Warm interior salon chandelier and cove LED lights
    const salonLight = new THREE.PointLight(0xffe2b3, 0, 18, 1.8);
    salonLight.position.set(0, 4.2, 2.0);
    this.interiorWarmLights.push(salonLight);
    this.lightingGroup.add(salonLight);

    const kitchenLight = new THREE.PointLight(0xffeedd, 0, 14, 1.8);
    kitchenLight.position.set(4.5, 4.0, -3.0);
    this.interiorWarmLights.push(kitchenLight);
    this.lightingGroup.add(kitchenLight);

    const masterBedLight = new THREE.PointLight(0xffe8cc, 0, 14, 1.8);
    masterBedLight.position.set(-4.5, 8.2, 1.5);
    this.interiorWarmLights.push(masterBedLight);
    this.lightingGroup.add(masterBedLight);

    // Underwater pool light
    this.poolLight = new THREE.PointLight(0x00f0ff, 0, 12, 2.0);
    this.poolLight.position.set(0, 0.2, 10.5);
    this.lightingGroup.add(this.poolLight);

    // Architectural facade accent uplights
    const facadeSpot1 = new THREE.SpotLight(0xd9bf8c, 0, 25, Math.PI / 5, 0.5, 1.5);
    facadeSpot1.position.set(-10, 0.4, 8);
    facadeSpot1.target.position.set(-8, 6, 0);
    this.architecturalFacadeLights.push(facadeSpot1);
    this.lightingGroup.add(facadeSpot1);
    this.lightingGroup.add(facadeSpot1.target);

    const facadeSpot2 = new THREE.SpotLight(0xd9bf8c, 0, 25, Math.PI / 5, 0.5, 1.5);
    facadeSpot2.position.set(10, 0.4, 8);
    facadeSpot2.target.position.set(8, 6, 0);
    this.architecturalFacadeLights.push(facadeSpot2);
    this.lightingGroup.add(facadeSpot2);
    this.lightingGroup.add(facadeSpot2.target);
  }

  // ----------------------------------------------------
  // 01 — TERRAIN & SITE PREPARATION
  // ----------------------------------------------------
  private buildTerrainAndPlot() {
    // 1. Vast desert landscape base
    const basePodium = new THREE.Mesh(
      new THREE.CylinderGeometry(48, 52, 2.0, 64),
      new THREE.MeshStandardMaterial({ color: 0xedebe6, roughness: 0.95 })
    );
    basePodium.position.y = -1.0;
    basePodium.receiveShadow = true;
    this.terrainGroup.add(basePodium);

    // 2. Rectangular surveyed construction plot (leveled earth)
    const plot = new THREE.Mesh(new THREE.BoxGeometry(34, 0.4, 30), this.soilMat);
    plot.position.y = 0;
    plot.receiveShadow = true;
    this.terrainGroup.add(plot);

    // 3. GNSS Survey Stakes with Neon Ribbon Flags
    const pinCoords = [
      new THREE.Vector3(-16.0, 0.6, -14.0),
      new THREE.Vector3(16.0, 0.6, -14.0),
      new THREE.Vector3(16.0, 0.6, 14.0),
      new THREE.Vector3(-16.0, 0.6, 14.0)
    ];

    pinCoords.forEach((pt) => {
      const stake = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 1.4, 12),
        new THREE.MeshStandardMaterial({ color: 0xb58b4a, metalness: 0.8, roughness: 0.2 })
      );
      stake.position.copy(pt);
      stake.castShadow = true;
      this.terrainGroup.add(stake);

      // Neon orange survey flag
      const flag = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.18, 0.02),
        new THREE.MeshStandardMaterial({ color: 0xff4500 })
      );
      flag.position.set(pt.x + 0.15, pt.y + 0.6, pt.z);
      this.terrainGroup.add(flag);
    });

    // 4. Perimeter Boundary Line
    const perimeterPts = [...pinCoords, pinCoords[0]];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(perimeterPts);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xb58b4a, transparent: true, opacity: 0.6 });
    const line = new THREE.Line(lineGeo, lineMat);
    line.position.y = 0.22;
    this.terrainGroup.add(line);
  }

  // ----------------------------------------------------
  // 02 — EXCAVATION PIT & SHORING
  // ----------------------------------------------------
  private buildExcavation() {
    // Stepped tiered excavation trench (-3.8m deep)
    const pitOuter = new THREE.Mesh(
      new THREE.BoxGeometry(22, 3.8, 20),
      this.soilMat
    );
    pitOuter.position.set(0, -1.9, 0);
    pitOuter.receiveShadow = true;
    this.excavationGroup.add(pitOuter);

    // Excavation floor
    const pitFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(21.6, 19.6),
      new THREE.MeshStandardMaterial({ color: 0x5a4028, roughness: 0.95 })
    );
    pitFloor.rotation.x = -Math.PI / 2;
    pitFloor.position.y = -3.79;
    pitFloor.receiveShadow = true;
    this.excavationGroup.add(pitFloor);

    // Soldier pile shoring with timber lagging along pit perimeter
    const shoringMat = new THREE.MeshStandardMaterial({ color: 0x6e5a44, roughness: 0.8 });
    [-10.8, 10.8].forEach((x) => {
      for (let z = -9.5; z <= 9.5; z += 3.8) {
        const pile = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.4, 0.35), this.steelMat);
        pile.position.set(x, -1.8, z);
        pile.castShadow = true;
        this.excavationGroup.add(pile);
      }
      const lagging = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.6, 19.5), shoringMat);
      lagging.position.set(x > 0 ? 10.6 : -10.6, -1.9, 0);
      lagging.castShadow = true;
      this.excavationGroup.add(lagging);
    });

    // Concrete piles / caissons in the ground
    const pileGeo = new THREE.CylinderGeometry(0.45, 0.45, 4.0, 16);
    for (let px = -8; px <= 8; px += 4) {
      for (let pz = -6; pz <= 6; pz += 4) {
        const caisson = new THREE.Mesh(pileGeo, this.concreteMat);
        caisson.position.set(px, -3.8, pz);
        caisson.castShadow = true;
        this.excavationGroup.add(caisson);
      }
    }

    // Dust particles in air around excavation
    const dustCount = 200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 30;
      dustPositions[i * 3 + 1] = Math.random() * 8;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xd2b48c, size: 0.15, transparent: true, opacity: 0.35 });
    this.dustParticles = new THREE.Points(dustGeo, dustMat);
    this.excavationGroup.add(this.dustParticles);
  }

  // ----------------------------------------------------
  // 03 — FOUNDATION & REBAR CAGES
  // ----------------------------------------------------
  private buildFoundation() {
    // 1. Dual-layer steel rebar grid mats (High-tensile ribbed rods)
    const rebarMat = new THREE.MeshStandardMaterial({
      color: 0x55606d,
      roughness: 0.35,
      metalness: 0.85
    });

    const rebarGeoX = new THREE.CylinderGeometry(0.025, 0.025, 19, 6);
    rebarGeoX.rotateZ(Math.PI / 2);
    const rebarGeoZ = new THREE.CylinderGeometry(0.025, 0.025, 21, 6);
    rebarGeoZ.rotateX(Math.PI / 2);

    // Bottom and top rebar mats
    [-3.5, -3.2].forEach((layerY) => {
      // Longitudinal bars
      for (let x = -9.5; x <= 9.5; x += 0.8) {
        const barZ = new THREE.Mesh(rebarGeoZ, rebarMat);
        barZ.position.set(x, layerY, 0);
        this.foundationGroup.add(barZ);
      }
      // Transverse bars
      for (let z = -8.5; z <= 8.5; z += 0.8) {
        const barX = new THREE.Mesh(rebarGeoX, rebarMat);
        barX.position.set(0, layerY, z);
        this.foundationGroup.add(barX);
      }
    });

    // 2. Vertical Column Starter Dowels (rebar sticking up from foundation)
    const colCoords = [
      [-8, -6], [-8, 0], [-8, 6],
      [-2, -6], [-2, 0], [-2, 6],
      [4, -6], [4, 0], [4, 6],
      [9, -6], [9, 0], [9, 6]
    ];

    colCoords.forEach(([cx, cz]) => {
      // 4 vertical bars per column
      [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(([ox, oz]) => {
        const dowel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.2, 8), rebarMat);
        dowel.position.set(cx + ox, -2.5, cz + oz);
        dowel.castShadow = true;
        this.foundationGroup.add(dowel);
      });
    });

    // 3. Monolithic Concrete Raft Slab
    const raftSlab = new THREE.Mesh(new THREE.BoxGeometry(21.4, 0.85, 19.4), this.concreteMat);
    raftSlab.position.set(0, -3.35, 0);
    raftSlab.castShadow = true;
    raftSlab.receiveShadow = true;
    this.foundationGroup.add(raftSlab);

    // Substructure retaining walls bringing ground up to level 0.0
    const subWallMat = this.concreteMat;
    const subBasement = new THREE.Mesh(new THREE.BoxGeometry(20.4, 3.0, 18.4), subWallMat);
    subBasement.position.set(0, -1.5, 0);
    subBasement.castShadow = true;
    this.foundationGroup.add(subBasement);
  }

  // ----------------------------------------------------
  // 04 — STRUCTURAL STEEL FRAMEWORK & COLUMNS
  // ----------------------------------------------------
  private buildSteelStructure() {
    const colCoords = [
      [-8, -6], [-8, 0], [-8, 6],
      [-2, -6], [-2, 0], [-2, 6],
      [4, -6], [4, 0], [4, 6],
      [9, -6], [9, 0], [9, 6]
    ];

    // True ASTM A992 I-Beams (W-section columns with web and flanges)
    colCoords.forEach(([cx, cz]) => {
      // Base plate with 4 anchor bolts
      const basePlate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.7), this.steelMat);
      basePlate.position.set(cx, 0.04, cz);
      this.steelStructureGroup.add(basePlate);

      // Flanged Steel Column (Ground to Roof = 8.5m high)
      const web = new THREE.Mesh(new THREE.BoxGeometry(0.06, 8.5, 0.38), this.steelMat);
      web.position.set(cx, 4.25, cz);
      web.castShadow = true;
      this.steelStructureGroup.add(web);

      // Flanges
      [-0.19, 0.19].forEach((fz) => {
        const flange = new THREE.Mesh(new THREE.BoxGeometry(0.38, 8.5, 0.06), this.steelMat);
        flange.position.set(cx, 4.25, cz + fz);
        flange.castShadow = true;
        this.steelStructureGroup.add(flange);
      });

      // Moment connection gusset plates at floor joints (Y=4.0m and Y=8.0m)
      [4.0, 8.0].forEach((my) => {
        const gusset = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.5), this.steelMat);
        gusset.position.set(cx, my, cz);
        this.steelStructureGroup.add(gusset);
      });
    });

    // Horizontal Steel I-Beams connecting columns on Level 1 (Y=4.0m) and Level 2 (Y=8.0m)
    [4.0, 8.0].forEach((beamY) => {
      // Longitudinal beams (along X)
      [-6, 0, 6].forEach((bz) => {
        const beamX = new THREE.Mesh(new THREE.BoxGeometry(18.0, 0.35, 0.22), this.steelMat);
        beamX.position.set(0.5, beamY, bz);
        beamX.castShadow = true;
        this.steelStructureGroup.add(beamX);
      });
      // Transverse beams (along Z)
      [-8, -2, 4, 9].forEach((bx) => {
        const beamZ = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 12.8), this.steelMat);
        beamZ.position.set(bx, beamY, 0);
        beamZ.castShadow = true;
        this.steelStructureGroup.add(beamZ);
      });
    });
  }

  // ----------------------------------------------------
  // 05 — CONCRETE FLOORS, CANTILEVERS & STAIRCASE
  // ----------------------------------------------------
  private buildConcreteSlabsAndStairs() {
    // 1. Ground Floor Finished Podium Slab
    const groundSlab = new THREE.Mesh(new THREE.BoxGeometry(22, 0.4, 20), this.concreteMat);
    groundSlab.position.set(0.5, 0.2, 0);
    groundSlab.castShadow = true;
    groundSlab.receiveShadow = true;
    this.concreteSlabsGroup.add(groundSlab);

    // 2. First Floor Suspended Slab with 5.2m Cantilever Terrace Overhang
    const firstSlab = new THREE.Mesh(new THREE.BoxGeometry(23.5, 0.4, 19.5), this.concreteMat);
    firstSlab.position.set(1.2, 4.1, 0.5);
    firstSlab.castShadow = true;
    firstSlab.receiveShadow = true;
    this.concreteSlabsGroup.add(firstSlab);

    // 3. Roof Cantilever Canopy Slab
    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(24.5, 0.45, 20.5), this.concreteMat);
    roofSlab.position.set(1.4, 8.1, 0.5);
    roofSlab.castShadow = true;
    this.concreteSlabsGroup.add(roofSlab);

    // 4. Central Elevator Shear Core Walls
    const core = new THREE.Mesh(new THREE.BoxGeometry(3.6, 8.5, 3.4), this.concreteMat);
    core.position.set(-2, 4.25, -2);
    core.castShadow = true;
    this.concreteSlabsGroup.add(core);

    // 5. Full 3D Cast Concrete Staircase with Steps
    const stepsCount = 18;
    const stepWidth = 1.4;
    const stepRise = 3.9 / stepsCount;
    const stepRun = 0.32;

    for (let s = 0; s < stepsCount; s++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(stepRun, stepRise, stepWidth),
        this.concreteMat
      );
      step.position.set(-4.8 + s * stepRun, 0.4 + s * stepRise + stepRise / 2, -4.5);
      step.castShadow = true;
      this.concreteSlabsGroup.add(step);
    }
  }

  // ----------------------------------------------------
  // 06 — AAC BRICK / BLOCKWORK WALLS
  // ----------------------------------------------------
  private buildMasonryWalls() {
    // Level 1 Exterior Perimeter AAC Walls with Window & Door Cutouts
    // Left Wing (Study & Guest Suite)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.5, 11), this.blockworkMat);
    leftWall.position.set(-8.8, 2.15, 0);
    leftWall.castShadow = true;
    this.masonryWallsGroup.add(leftWall);

    // Rear Wall (Service Corridor & Utility)
    const rearWall = new THREE.Mesh(new THREE.BoxGeometry(17, 3.5, 0.3), this.blockworkMat);
    rearWall.position.set(0.5, 2.15, -6.8);
    rearWall.castShadow = true;
    this.masonryWallsGroup.add(rearWall);

    // Interior Room Partitions (Kitchen, Salon, Powder Room)
    const kitchenPartition = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.5, 5.5), this.blockworkMat);
    kitchenPartition.position.set(3.2, 2.15, -3.8);
    kitchenPartition.castShadow = true;
    this.masonryWallsGroup.add(kitchenPartition);

    // Level 2 Bedroom & Ensuite Partitions
    const l2LeftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.5, 11), this.blockworkMat);
    l2LeftWall.position.set(-8.8, 6.15, 0);
    l2LeftWall.castShadow = true;
    this.masonryWallsGroup.add(l2LeftWall);

    const l2MasterSuiteWall = new THREE.Mesh(new THREE.BoxGeometry(7.5, 3.5, 0.25), this.blockworkMat);
    l2MasterSuiteWall.position.set(-4.5, 6.15, 2.5);
    l2MasterSuiteWall.castShadow = true;
    this.masonryWallsGroup.add(l2MasterSuiteWall);

    // Precast Concrete Lintels over openings
    const lintelMat = this.concreteMat;
    const lintel1 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.35, 0.35), lintelMat);
    lintel1.position.set(1.0, 3.6, 6.8);
    this.masonryWallsGroup.add(lintel1);
  }

  // ----------------------------------------------------
  // 07 — MEP / SERVICES & BUILDING ANATOMY
  // ----------------------------------------------------
  private buildMepServices() {
    // 1. Galvanized Silver Rectangular HVAC Ductwork with Turning Vanes
    const ductMat = new THREE.MeshStandardMaterial({
      color: 0xc8d0d8,
      roughness: 0.3,
      metalness: 0.85
    });

    // Main central HVAC supply duct running along Level 1 ceiling
    const mainDuct = new THREE.Mesh(new THREE.BoxGeometry(15.0, 0.45, 0.75), ductMat);
    mainDuct.position.set(0.5, 3.75, 0);
    this.mepServicesGroup.add(mainDuct);

    // Branch ducts to living zones
    [-4, 1, 6].forEach((dx) => {
      const branchDuct = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 5.0), ductMat);
      branchDuct.position.set(dx, 3.75, 2.5);
      this.mepServicesGroup.add(branchDuct);

      // Diffuser supply grilles
      const diffuser = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.6), this.steelMat);
      diffuser.position.set(dx, 3.55, 4.8);
      this.mepServicesGroup.add(diffuser);
    });

    // Level 2 HVAC Duct
    const l2Duct = new THREE.Mesh(new THREE.BoxGeometry(14.0, 0.45, 0.75), ductMat);
    l2Duct.position.set(0, 7.75, 0);
    this.mepServicesGroup.add(l2Duct);

    // 2. Dual PEX Hot & Cold Domestic Water Pipes
    const coldPexMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.3 }); // Blue PEX
    const hotPexMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4, metalness: 0.3 });  // Red PEX

    for (let p = 0; p < 2; p++) {
      const pexMat = p === 0 ? coldPexMat : hotPexMat;
      const offsetY = p * 0.12;

      // Pipe running along rear utility wall
      const pexLine = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 14.0, 8), pexMat);
      pexLine.rotation.z = Math.PI / 2;
      pexLine.position.set(0.5, 1.8 + offsetY, -6.5);
      this.mepServicesGroup.add(pexLine);

      // Vertical riser to Level 2
      const pexRiser = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 7.0, 8), pexMat);
      pexRiser.position.set(3.5 + p * 0.15, 3.8, -6.4);
      this.mepServicesGroup.add(pexRiser);
    }

    // 3. Electrical Conduits (EMT Galvanized & Orange Cables)
    const conduitMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 }); // Orange conduit

    const conduitTree = new THREE.Group();
    for (let c = 0; c < 4; c++) {
      const cond = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 12.0, 6), conduitMat);
      cond.rotation.z = Math.PI / 2;
      cond.position.set(0, 3.65 + c * 0.05, -2.5);
      conduitTree.add(cond);
    }
    this.mepServicesGroup.add(conduitTree);

    // Main Distribution Board / Electrical Panel with circuit breakers
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 1.4, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 })
    );
    panel.position.set(-8.5, 2.0, -5.5);
    panel.castShadow = true;
    this.mepServicesGroup.add(panel);
  }

  // ----------------------------------------------------
  // 08 — WINDOWS, DOORS & GLASS CURTAIN WALLS
  // ----------------------------------------------------
  private buildFacadeAndGlazing() {
    // Floor-to-ceiling glass curtain walls on front elevation (Grand Salon & Master Suite)
    // Ground Floor Panoramic Sliding Glass Walls
    const groundGlass = new THREE.Mesh(new THREE.PlaneGeometry(16.5, 3.7), this.glassCurtainMat);
    groundGlass.position.set(1.5, 2.15, 6.9);
    this.facadeGlazingGroup.add(groundGlass);

    // Level 1 Glass Curtain Wall
    const l1Glass = new THREE.Mesh(new THREE.PlaneGeometry(17.5, 3.7), this.glassCurtainMat);
    l1Glass.position.set(1.5, 6.15, 6.9);
    this.facadeGlazingGroup.add(l1Glass);

    // Slim Champagne Bronze Aluminium Mullions & Transoms
    for (let m = -6.5; m <= 9.5; m += 3.2) {
      // Vertical Mullions
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7.8, 0.18), this.bronzeMat);
      mullion.position.set(m, 4.2, 6.92);
      mullion.castShadow = true;
      this.facadeGlazingGroup.add(mullion);
    }

    // Horizontal Transoms
    [0.3, 4.0, 7.9].forEach((ty) => {
      const transom = new THREE.Mesh(new THREE.BoxGeometry(17.5, 0.1, 0.18), this.bronzeMat);
      transom.position.set(1.5, ty, 6.92);
      this.facadeGlazingGroup.add(transom);
    });

    // Seamless Structural Glass Balustrade on Master Balcony
    const railingGlass = new THREE.Mesh(
      new THREE.BoxGeometry(16.0, 1.1, 0.05),
      new THREE.MeshPhysicalMaterial({ color: 0xddeeff, transmission: 0.95, transparent: true, roughness: 0.05 })
    );
    railingGlass.position.set(1.5, 4.85, 9.8);
    railingGlass.castShadow = true;
    this.facadeGlazingGroup.add(railingGlass);
  }

  // ----------------------------------------------------
  // 09 — EXTERIOR CLADDING, TRAVERTINE & TIMBER ACCENTS
  // ----------------------------------------------------
  private buildExteriorCladdingAndFinishes() {
    // 1. Honed Roman Travertine Stone Panels on Left Villa Wing
    const stoneWing = new THREE.Mesh(new THREE.BoxGeometry(0.4, 7.8, 12.0), this.travertineMat);
    stoneWing.position.set(-8.95, 4.2, 0);
    stoneWing.castShadow = true;
    stoneWing.receiveShadow = true;
    this.exteriorCladdingGroup.add(stoneWing);

    // 2. Sculptural Floating Roof Fascia with Travertine Underside
    const fasciaFront = new THREE.Mesh(new THREE.BoxGeometry(24.8, 0.6, 0.5), this.travertineMat);
    fasciaFront.position.set(1.4, 8.1, 10.4);
    fasciaFront.castShadow = true;
    this.exteriorCladdingGroup.add(fasciaFront);

    // 3. Vertical Architectural Fluted Timber Louvers (Shading Screens)
    const timberLouverGroup = new THREE.Group();
    for (let l = 0; l < 18; l++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.6, 0.25), this.walnutMat);
      slat.position.set(-7.5 + l * 0.28, 6.15, 7.2);
      slat.castShadow = true;
      timberLouverGroup.add(slat);
    }
    this.exteriorCladdingGroup.add(timberLouverGroup);
  }

  // ----------------------------------------------------
  // 10 — LANDSCAPING, INFINITY POOL & MOTOR COURT
  // ----------------------------------------------------
  private buildLandscapingAndPool() {
    // 1. Lush Emerald Lawn Turf surrounding the villa
    const lawn = new THREE.Mesh(
      new THREE.BoxGeometry(33.8, 0.35, 29.8),
      new THREE.MeshStandardMaterial({ color: 0x3d7a46, roughness: 0.85 })
    );
    lawn.position.y = 0.05;
    lawn.receiveShadow = true;
    this.landscapeGroup.add(lawn);

    // 2. Travertine Large-Format Paver Terrace & Sun Deck
    const terrace = new THREE.Mesh(new THREE.BoxGeometry(20.0, 0.38, 7.0), this.travertineMat);
    terrace.position.set(1.5, 0.08, 10.0);
    terrace.receiveShadow = true;
    this.landscapeGroup.add(terrace);

    // 3. Private Negative-Edge Luxury Infinity Swimming Pool
    const poolGroup = new THREE.Group();
    poolGroup.position.set(0, 0.1, 13.8);

    // Deep pool basin
    const basin = new THREE.Mesh(
      new THREE.BoxGeometry(14.0, 1.8, 5.0),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.1 })
    );
    basin.position.y = -0.8;
    basin.receiveShadow = true;
    poolGroup.add(basin);

    // Sparkling Turquoise Water with Normal Ripple Texture
    const waterNormal = createWaterNormalTexture();
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      normalMap: waterNormal,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.88,
      ior: 1.333
    });
    this.poolWater = new THREE.Mesh(new THREE.PlaneGeometry(13.6, 4.6), waterMat);
    this.poolWater.rotation.x = -Math.PI / 2;
    this.poolWater.position.y = 0.02;
    poolGroup.add(this.poolWater);

    this.landscapeGroup.add(poolGroup);

    // 4. Sculptural Date Palm Trees (Trunk + Fronds)
    const palmLocations = [
      new THREE.Vector3(-12.0, 0.2, 11.0),
      new THREE.Vector3(12.0, 0.2, 11.0),
      new THREE.Vector3(-13.0, 0.2, -6.0)
    ];

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
    const frondMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.6, side: THREE.DoubleSide });

    palmLocations.forEach((loc) => {
      const tree = new THREE.Group();
      tree.position.copy(loc);

      // Curved segmented palm trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 7.5, 12), trunkMat);
      trunk.position.y = 3.75;
      trunk.rotation.z = (Math.random() - 0.5) * 0.15;
      trunk.castShadow = true;
      tree.add(trunk);

      // Radiating lush palm fronds
      for (let f = 0; f < 14; f++) {
        const angle = (f * Math.PI * 2) / 14;
        const frond = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 3.6), frondMat);
        frond.position.set(Math.cos(angle) * 1.5, 7.4, Math.sin(angle) * 1.5);
        frond.rotation.y = angle;
        frond.rotation.x = 0.7;
        frond.castShadow = true;
        tree.add(frond);
      }
      this.landscapeGroup.add(tree);
    });

    // 5. Paved Motor Court & Luxury Modern SUV
    const driveway = new THREE.Mesh(
      new THREE.BoxGeometry(10.0, 0.36, 12.0),
      new THREE.MeshStandardMaterial({ color: 0x404348, roughness: 0.85 })
    );
    driveway.position.set(11.5, 0.08, -5.0);
    this.landscapeGroup.add(driveway);

    // Luxury Dark Bronze SUV parked on driveway
    const suv = new THREE.Group();
    suv.position.set(11.5, 0.3, -5.0);
    suv.rotation.y = -Math.PI / 4;

    const suvBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 1.2, 4.4),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.2, metalness: 0.85 })
    );
    suvBody.position.y = 0.85;
    suvBody.castShadow = true;
    suv.add(suvBody);

    const suvGlass = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.7, 2.4),
      this.glassCurtainMat
    );
    suvGlass.position.set(0, 1.6, -0.2);
    suv.add(suvGlass);

    this.landscapeGroup.add(suv);
  }

  // ----------------------------------------------------
  // 11 — INTERIOR FIT-OUT & CALACATTA MARBLE FLOORS
  // ----------------------------------------------------
  private buildInteriorFitout() {
    // 1. Polished Book-Matched Calacatta Gold Marble Flooring (Ground Salon & Kitchen)
    const marbleFloor = new THREE.Mesh(new THREE.BoxGeometry(19.2, 0.08, 14.5), this.calacattaMat);
    marbleFloor.position.set(1.0, 0.42, 0.5);
    marbleFloor.receiveShadow = true;
    this.interiorFitoutGroup.add(marbleFloor);

    // Level 2 Engineered Smoked Oak Parquet Flooring
    const woodFloor = new THREE.Mesh(new THREE.BoxGeometry(19.2, 0.08, 14.5), this.walnutMat);
    woodFloor.position.set(1.0, 4.32, 0.5);
    woodFloor.receiveShadow = true;
    this.interiorFitoutGroup.add(woodFloor);

    // 2. Suspended Gypsum Ceiling with Warm LED Cove Recesses
    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(18.5, 0.15, 14.0),
      new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.9 })
    );
    ceiling.position.set(1.0, 3.85, 0.5);
    this.interiorFitoutGroup.add(ceiling);

    // Recessed architectural linear slot AC diffusers
    const acSlot = new THREE.Mesh(
      new THREE.BoxGeometry(12.0, 0.05, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x111111 })
    );
    acSlot.position.set(1.0, 3.77, 2.0);
    this.interiorFitoutGroup.add(acSlot);

    // 3. Contemporary Italian Chef's Kitchen
    // Monolithic Calacatta Marble Waterfall Island
    const island = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.1, 1.4), this.calacattaMat);
    island.position.set(5.5, 0.95, -2.5);
    island.castShadow = true;
    this.interiorFitoutGroup.add(island);

    // High barstools
    for (let s = -1.2; s <= 1.2; s += 1.2) {
      const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.75, 16), this.walnutMat);
      stool.position.set(5.5 + s, 0.78, -1.2);
      stool.castShadow = true;
      this.interiorFitoutGroup.add(stool);
    }

    // Floor-to-ceiling Matte Black Kitchen Cabinetry
    const cabinets = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 3.4, 5.0),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35 })
    );
    cabinets.position.set(8.8, 2.1, -2.5);
    cabinets.castShadow = true;
    this.interiorFitoutGroup.add(cabinets);
  }

  // ----------------------------------------------------
  // 12 — LUXURY FURNITURE & INTERIOR DESIGN
  // ----------------------------------------------------
  private buildLuxuryFurniture() {
    const boucléMat = new THREE.MeshStandardMaterial({ color: 0xede8e1, roughness: 0.85 }); // Warm ivory bouclé
    const velvetMat = new THREE.MeshStandardMaterial({ color: 0x23372f, roughness: 0.7 }); // JSG signature deep emerald green
    const marbleCoffeeMat = this.calacattaMat;

    // 1. Curved Plush Bouclé L-Shaped Sectional Sofa
    const sofaMain = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.75, 1.4), boucléMat);
    sofaMain.position.set(-2.5, 0.8, 2.0);
    sofaMain.castShadow = true;
    this.luxuryFurnitureGroup.add(sofaMain);

    const sofaChaise = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.75, 3.0), boucléMat);
    sofaChaise.position.set(-4.2, 0.8, 3.2);
    sofaChaise.castShadow = true;
    this.luxuryFurnitureGroup.add(sofaChaise);

    // Emerald velvet throw cushions
    [-3.8, -2.5, -1.2].forEach((cx) => {
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.25), velvetMat);
      cushion.position.set(cx, 1.35, 1.5);
      cushion.rotation.x = -0.2;
      this.luxuryFurnitureGroup.add(cushion);
    });

    // 2. Sculptural Marble & Bronze Coffee Table with art book
    const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.38, 1.1), marbleCoffeeMat);
    coffeeTable.position.set(-2.5, 0.6, 3.5);
    coffeeTable.castShadow = true;
    this.luxuryFurnitureGroup.add(coffeeTable);

    // 3. Plush High-Pile Wool Area Rug
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.05, 5.0),
      new THREE.MeshStandardMaterial({ color: 0xded8cc, roughness: 0.95 })
    );
    rug.position.set(-2.5, 0.45, 3.2);
    rug.receiveShadow = true;
    this.luxuryFurnitureGroup.add(rug);

    // 4. Grand Dining Area (8-Seater Smoked Glass & Bronze Table)
    const diningTable = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.1, 1.5),
      new THREE.MeshPhysicalMaterial({ color: 0x222222, transmission: 0.6, roughness: 0.1 })
    );
    diningTable.position.set(1.5, 1.15, -3.0);
    diningTable.castShadow = true;
    this.luxuryFurnitureGroup.add(diningTable);

    // Sculptural Branching Brass Chandelier above Dining
    const chandelier = new THREE.Group();
    chandelier.position.set(1.5, 3.2, -3.0);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), this.bronzeMat);
    chandelier.add(stem);

    for (let g = 0; g < 6; g++) {
      const angle = (g * Math.PI * 2) / 6;
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 8), this.bronzeMat);
      arm.position.set(Math.cos(angle) * 0.5, -0.3, Math.sin(angle) * 0.5);
      arm.rotation.z = Math.PI / 3;
      chandelier.add(arm);

      // Glowing frosted glass orb
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xfff0d0, emissive: 0xffdfaa, emissiveIntensity: 0.8 })
      );
      globe.position.set(Math.cos(angle) * 0.9, -0.4, Math.sin(angle) * 0.9);
      chandelier.add(globe);
    }
    this.luxuryFurnitureGroup.add(chandelier);

    // 5. Level 2 Master Bedroom Suite (King Bed with Fluted Upholstered Headboard)
    const bedGroup = new THREE.Group();
    bedGroup.position.set(-4.5, 4.4, 0);

    // Fluted headboard
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.8, 0.25), boucléMat);
    headboard.position.set(0, 0.9, -2.2);
    bedGroup.add(headboard);

    // King Mattress & Bedding
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.65, 2.6),
      new THREE.MeshStandardMaterial({ color: 0xf8f8f8, roughness: 0.7 })
    );
    mattress.position.set(0, 0.45, -0.8);
    mattress.castShadow = true;
    bedGroup.add(mattress);

    this.luxuryFurnitureGroup.add(bedGroup);
  }

  // ----------------------------------------------------
  // MACHINERY (Excavator, Tower Crane, Mixer Truck)
  // ----------------------------------------------------
  private buildMachinery() {
    // 1. Hydraulic Crawler Excavator
    this.excavator = createHydraulicExcavator();
    this.excavator.root.position.set(-11.5, 0.2, 5.0);
    this.excavator.root.rotation.y = Math.PI / 4;
    this.machineryGroup.add(this.excavator.root);

    // 2. High Tower Crane
    this.crane = createTowerCrane(34, 26);
    this.crane.root.position.set(15.0, 0.2, 13.0);
    this.machineryGroup.add(this.crane.root);

    // 3. Concrete Mixer Truck
    this.mixerTruck = createConcreteMixerTruck();
    this.mixerTruck.position.set(13.0, 0.2, -6.5);
    this.mixerTruck.rotation.y = -Math.PI / 3;
    this.machineryGroup.add(this.mixerTruck);
  }

  // ----------------------------------------------------
  // REALISTIC 3D WORKERS
  // ----------------------------------------------------
  private buildWorkers() {
    // 1. Surveyor with Leica Total Station & Tripod
    const surveyor = createConstructionWorker({
      vestColor: 0xff6600,
      helmetColor: 0xffd200,
      role: 'surveyor'
    });
    surveyor.position.set(-14.0, 0.2, -10.0);
    surveyor.rotation.y = Math.PI / 3;
    this.workersGroup.add(surveyor);

    // 2. Lead Structural Engineer with BIM Tablet & White Helmet
    const engineer = createConstructionWorker({
      vestColor: 0xd4e157, // High-vis lime
      helmetColor: 0xffffff, // Engineer white hard hat
      role: 'engineer'
    });
    engineer.position.set(7.0, 0.2, 8.0);
    engineer.rotation.y = -Math.PI / 2.5;
    this.workersGroup.add(engineer);

    // 3. Ironworker installing rebar & framework
    const ironworker = createConstructionWorker({
      vestColor: 0xff6600,
      helmetColor: 0xff4500, // Ironworker orange
      role: 'ironworker'
    });
    ironworker.position.set(-5.0, 0.2, 2.0);
    this.workersGroup.add(ironworker);

    // 4. Ground worker near excavation pit
    const groundWorker = createConstructionWorker({
      vestColor: 0xff6600,
      helmetColor: 0xffd200,
      role: 'general'
    });
    groundWorker.position.set(-8.5, 0.2, 7.5);
    groundWorker.rotation.y = Math.PI / 2;
    this.workersGroup.add(groundWorker);
  }

  // ----------------------------------------------------
  // CAMERA KINEMATICS & STAGE INTERPOLATION
  // ----------------------------------------------------
  public setScrollProgress(val: number) {
    this.targetProgress = Math.max(0, Math.min(1, val));
  }

  public resize() {
    if (!this.canvas) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  public dispose() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer.dispose();
  }

  // ----------------------------------------------------
  // INTERACTION EVENTS (360° Free Drag & Orbit)
  // ----------------------------------------------------
  private setupEvents() {
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!this.isInspectMode) return;
      this.isPointerDown = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      this.pointerStart = { x: clientX, y: clientY };
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!this.isInspectMode || !this.isPointerDown) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - this.pointerStart.x;
      const deltaY = clientY - this.pointerStart.y;
      this.pointerStart = { x: clientX, y: clientY };

      this.targetInspectRotation.y -= deltaX * 0.006;
      this.targetInspectRotation.x = Math.max(0.1, Math.min(Math.PI / 2.2, this.targetInspectRotation.x + deltaY * 0.006));
    };

    const onUp = () => {
      this.isPointerDown = false;
    };

    this.canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    this.canvas.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
  }

  // ----------------------------------------------------
  // UPDATE STAGES ACCORDING TO SCROLL PROGRESS
  // ----------------------------------------------------
  private updateStages(p: number) {
    // Active stage index for callbacks (0 to 7 across the 8 milestones)
    let stageIdx = 0;
    if (p < 0.12) stageIdx = 0;      // 01 LAND
    else if (p < 0.25) stageIdx = 1; // 02 FOUNDATION
    else if (p < 0.38) stageIdx = 2; // 03 STRUCTURE
    else if (p < 0.50) stageIdx = 3; // 04 WALLS
    else if (p < 0.64) stageIdx = 4; // 05 SERVICES
    else if (p < 0.78) stageIdx = 5; // 06 FACADE
    else if (p < 0.90) stageIdx = 6; // 07 INTERIOR
    else stageIdx = 7;               // 08 COMPLETE

    if (this.onStageChange) {
      this.onStageChange(stageIdx);
    }

    // 1. Excavation Group
    this.excavationGroup.visible = p >= 0.06 && p <= 0.88;
    if (this.excavationGroup.visible) {
      const pitScale = Math.min(1.0, (p - 0.06) / 0.1);
      this.excavationGroup.scale.set(1, Math.max(0.01, pitScale), 1);
    }

    // 2. Foundation Group
    this.foundationGroup.visible = p >= 0.12;
    if (this.foundationGroup.visible) {
      const fScale = Math.min(1.0, (p - 0.12) / 0.1);
      this.foundationGroup.scale.set(1, Math.max(0.01, fScale), 1);
    }

    // 3. Structural Steel Framework
    this.steelStructureGroup.visible = p >= 0.22;
    if (this.steelStructureGroup.visible) {
      const sScale = Math.min(1.0, (p - 0.22) / 0.12);
      this.steelStructureGroup.scale.set(1, Math.max(0.01, sScale), 1);
    }

    // 4. Concrete Slabs and Stairs
    this.concreteSlabsGroup.visible = p >= 0.32;
    if (this.concreteSlabsGroup.visible) {
      const cScale = Math.min(1.0, (p - 0.32) / 0.12);
      this.concreteSlabsGroup.scale.set(1, Math.max(0.01, cScale), 1);
    }

    // 5. Masonry Walls
    this.masonryWallsGroup.visible = p >= 0.42;
    if (this.masonryWallsGroup.visible) {
      const wScale = Math.min(1.0, (p - 0.42) / 0.12);
      this.masonryWallsGroup.scale.set(1, Math.max(0.01, wScale), 1);
    }

    // 6. MEP Services & Cutaway Anatomy
    this.mepServicesGroup.visible = p >= 0.50;
    // When in services stage (p: 0.52 to 0.68) or X-Ray mode, walls turn semi-transparent to reveal anatomy!
    const isServiceInspection = (p >= 0.50 && p <= 0.68) || this.isXRayMode;
    this.blockworkMat.transparent = isServiceInspection;
    this.blockworkMat.opacity = isServiceInspection ? 0.35 : 1.0;
    this.concreteMat.transparent = this.isXRayMode;
    this.concreteMat.opacity = this.isXRayMode ? 0.4 : 1.0;

    // 7. Facade Glazing and Windows
    this.facadeGlazingGroup.visible = p >= 0.64;

    // 8. Exterior Cladding (Travertine & Wood)
    this.exteriorCladdingGroup.visible = p >= 0.70;

    // 9. Landscaping, Pool & Driveway
    this.landscapeGroup.visible = p >= 0.74;

    // 10. Interior Fitout (Marble Floors, Ceilings, Kitchen Island)
    this.interiorFitoutGroup.visible = p >= 0.80;

    // 11. Luxury Furniture
    this.luxuryFurnitureGroup.visible = p >= 0.84;
    if (this.luxuryFurnitureGroup.visible) {
      const furnScale = Math.min(1.0, (p - 0.84) / 0.08);
      this.luxuryFurnitureGroup.scale.set(furnScale, furnScale, furnScale);
    }

    // Machinery & Workers fade out as the property completes
    const machineryFade = p < 0.88;
    this.machineryGroup.visible = machineryFade;
    this.workersGroup.visible = machineryFade;

    // Lighting transitions: Evening golden-hour & luxury uplights appear at completion
    const isEveningTurnkey = p >= 0.88;
    const nightFactor = isEveningTurnkey ? (p - 0.88) / 0.12 : 0;

    this.sunLight.intensity = THREE.MathUtils.lerp(1.8, 0.85, nightFactor);
    this.ambientLight.intensity = THREE.MathUtils.lerp(0.8, 0.45, nightFactor);
    this.scene.background = new THREE.Color().lerpColors(
      new THREE.Color(0xf6f8fa),
      new THREE.Color(0x131e28), // Deep Dubai twilight sky
      nightFactor
    );
    if (this.scene.fog) {
      (this.scene.fog as THREE.FogExp2).color.copy(this.scene.background);
    }

    // Interior warm lights glow softly
    this.interiorWarmLights.forEach((light) => {
      light.intensity = nightFactor * 2.2;
    });

    // Pool underwater illumination
    this.poolLight.intensity = nightFactor * 3.5;

    // Facade spotlights
    this.architecturalFacadeLights.forEach((spot) => {
      spot.intensity = nightFactor * 3.0;
    });
  }

  // ----------------------------------------------------
  // CINEMATIC ARCHITECTURAL CAMERA PATH
  // ----------------------------------------------------
  private updateCamera(p: number, time: number) {
    if (this.isInspectMode) {
      // 360° Orbit inspection around the building
      this.inspectRotation.x += (this.targetInspectRotation.x - this.inspectRotation.x) * 0.08;
      this.inspectRotation.y += (this.targetInspectRotation.y - this.inspectRotation.y) * 0.08;

      const radius = 32;
      const camX = radius * Math.sin(this.inspectRotation.y) * Math.cos(this.inspectRotation.x);
      const camY = radius * Math.sin(this.inspectRotation.x) + 4;
      const camZ = radius * Math.cos(this.inspectRotation.y) * Math.cos(this.inspectRotation.x);

      this.camera.position.set(camX, camY, camZ);
      this.camera.lookAt(0, 4, 0);
      return;
    }

    // Smooth Multi-Spline Camera Keyframes
    // Designed for true architectural cinematography:
    // 0.00: High drone surveying empty plot
    // 0.16: Close ground shot framing excavator & rebar
    // 0.32: Towering upward angle looking at rising steel framework & crane
    // 0.46: Architectural medium elevation framing brickwork & slabs
    // 0.60: Cutaway view highlighting MEP ducts and pipes
    // 0.74: Exterior reveal showing travertine facade & pool
    // 0.86: Camera smoothly glides INSIDE into the grand living salon & kitchen!
    // 0.98: Majestic 360° drone orbit around completed estate in the evening glow
    const keyframes = [
      { p: 0.00, pos: new THREE.Vector3(32, 18, 32), target: new THREE.Vector3(0, 1, 0), fov: 42 },
      { p: 0.15, pos: new THREE.Vector3(22, 9, 20), target: new THREE.Vector3(-4, 0, 2), fov: 44 },
      { p: 0.30, pos: new THREE.Vector3(26, 14, 24), target: new THREE.Vector3(0, 5, 0), fov: 40 },
      { p: 0.45, pos: new THREE.Vector3(24, 12, 22), target: new THREE.Vector3(1, 4.5, 0), fov: 38 },
      { p: 0.60, pos: new THREE.Vector3(16, 7.5, 14), target: new THREE.Vector3(1, 3.8, -1), fov: 36 },
      { p: 0.72, pos: new THREE.Vector3(26, 11, 24), target: new THREE.Vector3(1, 4, 3), fov: 39 },
      // Interior Walkthrough! Camera enters through terrace glass into salon
      { p: 0.86, pos: new THREE.Vector3(-1.0, 2.2, 5.8), target: new THREE.Vector3(-1.5, 1.8, 1.0), fov: 50 },
      // Final Finished Estate Sweeping Orbit
      { p: 1.00, pos: new THREE.Vector3(28, 12, 28), target: new THREE.Vector3(0, 4, 2), fov: 38 }
    ];

    // Find bounding keyframes
    let k1 = keyframes[0];
    let k2 = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (p >= keyframes[i].p && p <= keyframes[i + 1].p) {
        k1 = keyframes[i];
        k2 = keyframes[i + 1];
        break;
      }
    }

    const span = k2.p - k1.p;
    const localT = span > 0 ? (p - k1.p) / span : 0;
    // Smooth cubic ease
    const easeT = localT * localT * (3 - 2 * localT);

    const targetPos = new THREE.Vector3().lerpVectors(k1.pos, k2.pos, easeT);
    const targetLook = new THREE.Vector3().lerpVectors(k1.target, k2.target, easeT);
    const targetFov = THREE.MathUtils.lerp(k1.fov, k2.fov, easeT);

    // At completion (p > 0.94), add slow majestic cinematic orbit movement
    if (p > 0.94) {
      const orbitAngle = time * 0.15;
      const orbitDist = 34;
      targetPos.x = Math.sin(orbitAngle) * orbitDist;
      targetPos.z = Math.cos(orbitAngle) * orbitDist;
      targetPos.y = 13 + Math.sin(time * 0.2) * 2;
    }

    this.camera.position.lerp(targetPos, 0.08);
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, 0.08);
    this.camera.updateProjectionMatrix();

    // Look at target
    const currentTarget = new THREE.Vector3();
    this.camera.getWorldDirection(currentTarget);
    this.camera.lookAt(targetLook);
  }

  // ----------------------------------------------------
  // MAIN ANIMATION LOOP
  // ----------------------------------------------------
  private animate = (timeMs: number) => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    const time = timeMs * 0.001;

    // Smooth progress scrubbing
    this.progress += (this.targetProgress - this.progress) * 0.1;
    this.updateStages(this.progress);
    this.updateCamera(this.progress, time);

    // Dynamic machine animations (when active)
    if (this.machineryGroup.visible) {
      // Excavator bucket digging cycle
      if (this.excavator) {
        this.excavator.armGroup.rotation.z = -0.85 + Math.sin(time * 1.5) * 0.15;
        this.excavator.bucketGroup.rotation.z = 0.3 + Math.sin(time * 2.0) * 0.25;
      }
      // Crane slewing and trolley movement
      if (this.crane) {
        this.crane.jibGroup.rotation.y = Math.sin(time * 0.4) * 0.6;
        this.crane.trolley.position.x = 14 + Math.sin(time * 0.6) * 4;
      }
      // Floating dust particles
      if (this.dustParticles) {
        this.dustParticles.rotation.y = time * 0.02;
      }
    }

    this.renderer.render(this.scene, this.camera);
  };
}
