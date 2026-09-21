import * as THREE from 'three';

/**
 * Anatomically proportioned 3D construction workers with high-visibility safety vests,
 * hard hats, reflective safety bands, harnesses, tool belts, work boots, and specialized equipment.
 */

export interface WorkerOptions {
  vestColor?: number;      // High-vis Orange (0xff6600) or High-vis Lime/Yellow (0xd4e157)
  helmetColor?: number;    // White (Engineers), Yellow (General/Riggers), Orange (Ironworkers)
  role?: 'surveyor' | 'engineer' | 'ironworker' | 'general' | 'craftsman';
}

export function createConstructionWorker(options: WorkerOptions = {}): THREE.Group {
  const {
    vestColor = 0xff6600,
    helmetColor = 0xffd200,
    role = 'general'
  } = options;

  const worker = new THREE.Group();

  // Materials
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.6 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 }); // Navy work shirt
  const vestMat = new THREE.MeshStandardMaterial({ color: vestColor, roughness: 0.5 });
  const reflectiveMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.2,
    metalness: 0.6,
    emissive: 0x777777,
    emissiveIntensity: 0.3
  });
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }); // Denim work pants
  const bootsMat = new THREE.MeshStandardMaterial({ color: 0x5a3818, roughness: 0.7 }); // Tan leather safety boots
  const helmetMat = new THREE.MeshStandardMaterial({ color: helmetColor, roughness: 0.3, metalness: 0.2 });
  const beltMat = new THREE.MeshStandardMaterial({ color: 0x472d17, roughness: 0.5 }); // Leather tool belt
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });

  // Overall human height ~ 1.80m
  // 1. Boots (Left & Right)
  [-0.14, 0.14].forEach((legX) => {
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.15, 0.26), bootsMat);
    boot.position.set(legX, 0.075, 0.03);
    boot.castShadow = true;
    worker.add(boot);

    // Legs (Thigh + Shin)
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.85, 12), pantsMat);
    leg.position.set(legX, 0.5, 0);
    leg.castShadow = true;
    worker.add(leg);

    // Knee pad reinforcement patch
    const kneePad = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.03), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    kneePad.position.set(legX, 0.45, 0.08);
    worker.add(kneePad);
  });

  // 2. Torso / Waist with Tool Belt
  const waist = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.1, 0.24), beltMat);
  waist.position.y = 0.95;
  worker.add(waist);

  // Tool pouch & hammer loop on belt
  const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.1), beltMat);
  pouch.position.set(0.2, 0.93, 0.04);
  worker.add(pouch);

  const hammer = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8), metalMat);
  hammer.position.set(-0.2, 0.9, 0);
  hammer.rotation.x = 0.2;
  worker.add(hammer);

  // Chest / Torso with High-Vis Safety Vest
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.55, 0.26), vestMat);
  torso.position.y = 1.25;
  torso.castShadow = true;
  worker.add(torso);

  // Reflective Stripes (Horizontal & Vertical cross braces)
  const horizStripe = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.05, 0.27), reflectiveMat);
  horizStripe.position.y = 1.15;
  worker.add(horizStripe);

  const vertStripeL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.45, 0.272), reflectiveMat);
  vertStripeL.position.set(-0.12, 1.3, 0);
  worker.add(vertStripeL);

  const vertStripeR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.45, 0.272), reflectiveMat);
  vertStripeR.position.set(0.12, 1.3, 0);
  worker.add(vertStripeR);

  // 3. Neck and Head
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.1, 10), skinMat);
  neck.position.y = 1.55;
  worker.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 12), skinMat);
  head.position.y = 1.68;
  head.castShadow = true;
  worker.add(head);

  // Hard Hat Helmet with visor brim
  const helmetDome = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 12, 0, Math.PI * 2, 0, Math.PI / 2), helmetMat);
  helmetDome.position.y = 1.72;
  helmetDome.castShadow = true;
  worker.add(helmetDome);

  const helmetBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 16), helmetMat);
  helmetBrim.position.set(0, 1.72, 0.02);
  worker.add(helmetBrim);

  // 4. Arms & Posed Hands based on Role
  const gloveMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 }); // Heavy leather safety gloves

  if (role === 'surveyor') {
    // Left arm down, right arm touching the total station
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.55, 10), shirtMat);
    armL.position.set(-0.26, 1.25, 0);
    worker.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.55, 10), shirtMat);
    armR.position.set(0.22, 1.3, 0.2);
    armR.rotation.x = -Math.PI / 3;
    worker.add(armR);

    // Surveyor Leica Total Station on Tripod
    const stationGroup = new THREE.Group();
    stationGroup.position.set(0.3, 0, 0.6);

    // Tripod 3 legs
    const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.45, 8);
    const tripodMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 }); // Leica yellow

    for (let a = 0; a < 3; a++) {
      const angle = (a * Math.PI * 2) / 3;
      const tLeg = new THREE.Mesh(legGeo, tripodMat);
      tLeg.position.set(Math.cos(angle) * 0.25, 0.7, Math.sin(angle) * 0.25);
      tLeg.rotation.z = Math.cos(angle) * 0.25;
      tLeg.rotation.x = Math.sin(angle) * 0.25;
      tLeg.castShadow = true;
      stationGroup.add(tLeg);
    }

    // Tribrach and Total Station Instrument Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.28, 0.18), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 }));
    body.position.y = 1.5;
    body.castShadow = true;
    stationGroup.add(body);

    // Telescope lens
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.25, 12), metalMat);
    lens.position.set(0, 1.52, 0);
    lens.rotation.x = Math.PI / 2;
    stationGroup.add(lens);

    worker.add(stationGroup);
  } else if (role === 'engineer') {
    // Arms holding digital tablet
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.45, 10), shirtMat);
    armL.position.set(-0.2, 1.25, 0.15);
    armL.rotation.x = -Math.PI / 3.5;
    armL.rotation.z = 0.3;
    worker.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.45, 10), shirtMat);
    armR.position.set(0.2, 1.25, 0.15);
    armR.rotation.x = -Math.PI / 3.5;
    armR.rotation.z = -0.3;
    worker.add(armR);

    // Digital Tablet / Blueprint
    const tablet = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.02, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 })
    );
    tablet.position.set(0, 1.18, 0.28);
    tablet.rotation.x = 0.3;
    worker.add(tablet);

    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.24, 0.17),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 }) // glowing blue BIM blueprint on screen
    );
    screen.position.set(0, 1.192, 0.28);
    screen.rotation.x = -Math.PI / 2 + 0.3;
    worker.add(screen);
  } else {
    // General / Ironworker with active pose
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.55, 10), shirtMat);
    armL.position.set(-0.25, 1.25, 0);
    worker.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.55, 10), shirtMat);
    armR.position.set(0.25, 1.25, 0);
    worker.add(armR);

    const gloveL = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), gloveMat);
    gloveL.position.set(-0.25, 0.95, 0);
    worker.add(gloveL);

    const gloveR = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), gloveMat);
    gloveR.position.set(0.25, 0.95, 0);
    worker.add(gloveR);
  }

  return worker;
}
