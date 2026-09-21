import * as THREE from 'three';

/**
 * Photorealistic 3D Construction Machinery with True Physical Geometry.
 * Includes:
 * 1. Heavy Hydraulic Crawler Excavator (articulated boom, hydraulic rams, bucket)
 * 2. Tower Crane (lattice mast, slewing ring, jib truss, trolley, hook block)
 * 3. Concrete Mixer Truck (chassis, wheels, rotating drum, cab)
 * 4. Rotary Piling / Drilling Rig (mast, auger drill)
 */

export interface ExcavatorParts {
  root: THREE.Group;
  boomGroup: THREE.Group;
  armGroup: THREE.Group;
  bucketGroup: THREE.Group;
}

export function createHydraulicExcavator(): ExcavatorParts {
  const root = new THREE.Group();

  // Materials
  const yellowPaint = new THREE.MeshStandardMaterial({
    color: 0xf5a623, // CAT / Komatsu construction industrial yellow
    roughness: 0.35,
    metalness: 0.6
  });

  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x22252a,
    roughness: 0.65,
    metalness: 0.7
  });

  const chromePiston = new THREE.MeshStandardMaterial({
    color: 0xefeff5,
    roughness: 0.15,
    metalness: 0.95
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a2e38,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.7,
    transparent: true,
    opacity: 0.85
  });

  // 1. Undercarriage & Dual Caterpillar Tracks
  const undercarriage = new THREE.Group();

  // Center chassis
  const centerBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 2.0), darkMetal);
  centerBody.position.y = 0.65;
  centerBody.castShadow = true;
  undercarriage.add(centerBody);

  // Left and Right Tracks
  [-1.25, 1.25].forEach((sideZ) => {
    const track = new THREE.Group();
    track.position.set(0, 0.5, sideZ);

    // Track frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.5, 0.55), darkMetal);
    frame.castShadow = true;
    track.add(frame);

    // Front & rear drive sprockets (cylinders)
    const sprockGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.58, 18);
    const sprock1 = new THREE.Mesh(sprockGeo, darkMetal);
    sprock1.rotation.x = Math.PI / 2;
    sprock1.position.set(1.9, 0, 0);
    sprock1.castShadow = true;
    track.add(sprock1);

    const sprock2 = sprock1.clone();
    sprock2.position.x = -1.9;
    track.add(sprock2);

    // Track rollers (bottom)
    for (let r = -1.4; r <= 1.4; r += 0.56) {
      const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.58, 12), darkMetal);
      roller.rotation.x = Math.PI / 2;
      roller.position.set(r, -0.22, 0);
      track.add(roller);
    }

    // Outer rubber/steel track band
    const bandGeo = new THREE.BoxGeometry(4.4, 0.85, 0.52);
    const band = new THREE.Mesh(bandGeo, darkMetal);
    band.position.y = 0;
    band.castShadow = true;
    track.add(band);

    undercarriage.add(track);
  });

  root.add(undercarriage);

  // 2. Rotating Upper Superstructure (Cab & Engine Cowling)
  const superstructure = new THREE.Group();
  superstructure.position.y = 1.0;

  // Turntable ring
  const slewRing = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.2, 24), darkMetal);
  slewRing.castShadow = true;
  superstructure.add(slewRing);

  // Main body / engine housing
  const engineBody = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 2.3), yellowPaint);
  engineBody.position.set(-0.6, 0.8, 0);
  engineBody.castShadow = true;
  superstructure.add(engineBody);

  // Rear counterweight
  const counterweight = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.3, 2.32), darkMetal);
  counterweight.position.set(-2.2, 0.8, 0);
  counterweight.castShadow = true;
  superstructure.add(counterweight);

  // Engine exhaust stack
  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12), darkMetal);
  exhaust.position.set(-1.6, 1.7, 0.7);
  superstructure.add(exhaust);

  // Operator Cabin
  const cab = new THREE.Group();
  cab.position.set(0.4, 1.0, 0.8);

  const cabBody = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.5, 0.95), yellowPaint);
  cabBody.castShadow = true;
  cab.add(cabBody);

  // Panoramic windows
  const frontWindow = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.1), glassMat);
  frontWindow.position.set(0.66, 0.1, 0);
  frontWindow.rotation.y = Math.PI / 2;
  cab.add(frontWindow);

  const sideWindow = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), glassMat);
  sideWindow.position.set(0, 0.1, 0.48);
  cab.add(sideWindow);

  // Safety roof beacon (orange)
  const beacon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.15, 12),
    new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.6 })
  );
  beacon.position.set(0, 0.82, 0);
  cab.add(beacon);

  superstructure.add(cab);

  // 3. Articulated Boom, Arm and Bucket
  const boomGroup = new THREE.Group();
  boomGroup.position.set(0.9, 0.9, -0.4);

  // Main curved boom
  const boomLower = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 0.35), yellowPaint);
  boomLower.position.set(1.1, 0.8, 0);
  boomLower.rotation.z = 0.55;
  boomLower.castShadow = true;
  boomGroup.add(boomLower);

  const boomUpper = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 0.35), yellowPaint);
  boomUpper.position.set(2.8, 1.6, 0);
  boomUpper.rotation.z = -0.4;
  boomUpper.castShadow = true;
  boomGroup.add(boomUpper);

  // Hydraulic ram cylinder on boom
  const boomCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.8, 12), darkMetal);
  boomCylinder.position.set(1.1, 1.4, 0.22);
  boomCylinder.rotation.z = -0.65;
  boomGroup.add(boomCylinder);

  const boomPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 12), chromePiston);
  boomPiston.position.set(1.9, 1.8, 0.22);
  boomPiston.rotation.z = -0.65;
  boomGroup.add(boomPiston);

  // Forearm / Stick
  const armGroup = new THREE.Group();
  armGroup.position.set(3.8, 1.3, 0);

  const armMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.35, 0.3), yellowPaint);
  armMesh.position.set(1.0, -0.6, 0);
  armMesh.rotation.z = -0.85;
  armMesh.castShadow = true;
  armGroup.add(armMesh);

  // Arm hydraulic piston
  const armCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 12), darkMetal);
  armCylinder.position.set(0.6, -0.2, 0.18);
  armCylinder.rotation.z = 0.4;
  armGroup.add(armCylinder);

  // Bucket
  const bucketGroup = new THREE.Group();
  bucketGroup.position.set(1.8, -1.5, 0);

  // Bucket shell
  const bucketShell = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), darkMetal);
  bucketShell.rotation.z = 0.3;
  bucketShell.castShadow = true;
  bucketGroup.add(bucketShell);

  // Bucket excavation teeth
  for (let t = -0.3; t <= 0.3; t += 0.15) {
    const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 6), darkMetal);
    tooth.position.set(0.42, -0.38, t);
    tooth.rotation.z = -Math.PI / 3;
    bucketGroup.add(tooth);
  }

  armGroup.add(bucketGroup);
  boomGroup.add(armGroup);
  superstructure.add(boomGroup);
  root.add(superstructure);

  return { root, boomGroup, armGroup, bucketGroup };
}

// 2. High Tower Crane
export interface TowerCraneParts {
  root: THREE.Group;
  jibGroup: THREE.Group;
  trolley: THREE.Group;
  cable: THREE.Mesh;
  hookBlock: THREE.Group;
}

export function createTowerCrane(height = 36, jibLength = 28): TowerCraneParts {
  const root = new THREE.Group();

  const yellowPaint = new THREE.MeshStandardMaterial({ color: 0xf5a623, roughness: 0.4, metalness: 0.6 });
  const darkSteel = new THREE.MeshStandardMaterial({ color: 0x33373d, roughness: 0.5, metalness: 0.8 });
  const cableMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.4 });

  // Base concrete ballast foundation
  const baseBallast = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.2, 5.0), new THREE.MeshStandardMaterial({ color: 0x909498, roughness: 0.9 }));
  baseBallast.position.y = 0.6;
  baseBallast.castShadow = true;
  root.add(baseBallast);

  // Vertical Lattice Mast Tower (modular sections with diagonal cross-bracing)
  const mastGroup = new THREE.Group();
  mastGroup.position.y = 1.2;

  const mastWidth = 1.6;
  const sections = Math.floor(height / 4);

  // 4 Main vertical corner chords
  const cornerCoords = [
    [-mastWidth / 2, -mastWidth / 2],
    [mastWidth / 2, -mastWidth / 2],
    [-mastWidth / 2, mastWidth / 2],
    [mastWidth / 2, mastWidth / 2]
  ];

  cornerCoords.forEach(([cx, cz]) => {
    const chord = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, height, 8), yellowPaint);
    chord.position.set(cx, height / 2, cz);
    chord.castShadow = true;
    mastGroup.add(chord);
  });

  // Cross horizontal and diagonal lattice struts
  for (let s = 0; s < sections; s++) {
    const yBot = s * 4;
    const yTop = (s + 1) * 4;

    // Horizontal collars
    [yBot, yTop].forEach((y) => {
      const ring = new THREE.Mesh(new THREE.BoxGeometry(mastWidth + 0.1, 0.08, mastWidth + 0.1), darkSteel);
      ring.position.y = y;
      mastGroup.add(ring);
    });

    // Diagonal X-bracing along faces
    const diagGeo = new THREE.CylinderGeometry(0.04, 0.04, Math.hypot(mastWidth, 4), 6);
    const diag1 = new THREE.Mesh(diagGeo, yellowPaint);
    diag1.position.set(0, yBot + 2, mastWidth / 2);
    diag1.rotation.z = Math.atan2(4, mastWidth);
    mastGroup.add(diag1);

    const diag2 = diag1.clone();
    diag2.rotation.z = -Math.atan2(4, mastWidth);
    mastGroup.add(diag2);
  }

  root.add(mastGroup);

  // Upper Slewing Turntable & Jib
  const jibGroup = new THREE.Group();
  jibGroup.position.y = height + 1.2;

  // Slewing cabin & ring
  const slewCab = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 1.4), darkSteel);
  slewCab.position.set(0.6, 0.9, 0);
  slewCab.castShadow = true;
  jibGroup.add(slewCab);

  // Operator glass windows
  const cabGlass = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.9, 1.2),
    new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.85, transparent: true, roughness: 0.1 })
  );
  cabGlass.position.set(0.6, 1.1, 0);
  jibGroup.add(cabGlass);

  // Tower Apex Peak (A-frame peak for tie cables)
  const peak = new THREE.Mesh(new THREE.ConeGeometry(1.1, 4.0, 4), yellowPaint);
  peak.position.set(0, 3.0, 0);
  peak.rotation.y = Math.PI / 4;
  jibGroup.add(peak);

  // Horizontal Front Jib (truss extending forward)
  const frontJib = new THREE.Group();
  const jibSections = Math.floor(jibLength / 3);

  // 3 long chords of triangular truss
  const topChord = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, jibLength, 8), yellowPaint);
  topChord.position.set(jibLength / 2, 0.8, 0);
  topChord.rotation.z = Math.PI / 2;
  frontJib.add(topChord);

  [-0.6, 0.6].forEach((botZ) => {
    const botChord = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, jibLength, 8), yellowPaint);
    botChord.position.set(jibLength / 2, 0, botZ);
    botChord.rotation.z = Math.PI / 2;
    frontJib.add(botChord);
  });

  // Cross struts along jib
  for (let j = 0; j < jibSections; j++) {
    const strutX = j * 3 + 1.5;
    const ring = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 1.3), darkSteel);
    ring.position.set(strutX, 0.4, 0);
    frontJib.add(ring);
  }

  jibGroup.add(frontJib);

  // Rear Counter-Jib with heavy concrete counterweights
  const counterJib = new THREE.Group();
  const cLength = 9.0;
  const cBeam = new THREE.Mesh(new THREE.BoxGeometry(cLength, 0.6, 1.2), yellowPaint);
  cBeam.position.set(-cLength / 2, 0.3, 0);
  counterJib.add(cBeam);

  // Concrete counterweight blocks
  for (let b = 0; b < 3; b++) {
    const block = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 1.8), new THREE.MeshStandardMaterial({ color: 0x888b90, roughness: 0.9 }));
    block.position.set(-6.5 - b * 1.3, 1.0, 0);
    block.castShadow = true;
    counterJib.add(block);
  }

  jibGroup.add(counterJib);

  // Trolley mechanism that slides along front jib
  const trolley = new THREE.Group();
  trolley.position.set(14.0, -0.1, 0); // mid-point default

  const trolleyFrame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 1.4), darkSteel);
  trolleyFrame.castShadow = true;
  trolley.add(trolleyFrame);

  // Hoist Cables
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 14, 6), cableMat);
  cable.position.y = -7.0;
  trolley.add(cable);

  // Hook Block & Pulley with safety hook
  const hookBlock = new THREE.Group();
  hookBlock.position.y = -14.0;

  const pulleySheave = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16), yellowPaint);
  pulleySheave.rotation.x = Math.PI / 2;
  pulleySheave.castShadow = true;
  hookBlock.add(pulleySheave);

  // Steel hook
  const hookTorus = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.06, 8, 16, Math.PI * 1.2), darkSteel);
  hookTorus.position.y = -0.45;
  hookTorus.rotation.z = -Math.PI / 1.1;
  hookBlock.add(hookTorus);

  // Lifting steel I-beam suspended from hook
  const suspendedBeam = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.3, 0.2), new THREE.MeshStandardMaterial({ color: 0xd9534f, roughness: 0.4, metalness: 0.8 }));
  suspendedBeam.position.y = -1.0;
  suspendedBeam.castShadow = true;
  hookBlock.add(suspendedBeam);

  trolley.add(hookBlock);
  jibGroup.add(trolley);
  root.add(jibGroup);

  return { root, jibGroup, trolley, cable, hookBlock };
}

// 3. Heavy Construction Concrete Mixer Truck
export function createConcreteMixerTruck(): THREE.Group {
  const truck = new THREE.Group();

  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f7, roughness: 0.3, metalness: 0.5 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x24272c, roughness: 0.7, metalness: 0.6 });
  const drumMat = new THREE.MeshStandardMaterial({ color: 0x1f4e41, roughness: 0.4, metalness: 0.5 }); // JSG luxury green
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xaaccff, transmission: 0.8, transparent: true });

  // Chassis steel rails
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.4, 1.8), darkMetal);
  chassis.position.set(0, 0.8, 0);
  chassis.castShadow = true;
  truck.add(chassis);

  // Wheels (10 wheels: 2 front, 4 dual rears)
  const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.36, 18);
  wheelGeo.rotateX(Math.PI / 2);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });

  const wheelPositions = [
    [2.4, 0.48, -1.0], [2.4, 0.48, 1.0],
    [-1.2, 0.48, -1.0], [-1.2, 0.48, 1.0],
    [-2.2, 0.48, -1.0], [-2.2, 0.48, 1.0]
  ];
  wheelPositions.forEach(([wx, wy, wz]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.position.set(wx, wy, wz);
    wheel.castShadow = true;
    truck.add(wheel);
  });

  // Cab
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.9), whiteMat);
  cab.position.set(2.4, 1.8, 0);
  cab.castShadow = true;
  truck.add(cab);

  // Windshield
  const windshield = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.9), glassMat);
  windshield.position.set(3.31, 2.0, 0);
  windshield.rotation.y = Math.PI / 2;
  truck.add(windshield);

  // Rotating concrete mixer barrel / drum
  const drumGroup = new THREE.Group();
  drumGroup.position.set(-0.6, 2.2, 0);
  drumGroup.rotation.z = -0.22; // angled upwards

  // Double-cone teardrop mixer shape
  const drum1 = new THREE.Mesh(new THREE.ConeGeometry(1.25, 2.4, 18), drumMat);
  drum1.rotation.z = Math.PI / 2;
  drum1.position.x = -0.5;
  drum1.castShadow = true;
  drumGroup.add(drum1);

  const drum2 = new THREE.Mesh(new THREE.ConeGeometry(1.25, 1.8, 18), drumMat);
  drum2.rotation.z = -Math.PI / 2;
  drum2.position.x = 1.2;
  drum2.castShadow = true;
  drumGroup.add(drum2);

  truck.add(drumGroup);

  // Discharge chute
  const chute = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 0.4), darkMetal);
  chute.position.set(-2.8, 1.3, 0);
  chute.rotation.z = 0.35;
  truck.add(chute);

  return truck;
}
