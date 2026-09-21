import * as THREE from 'three';

/**
 * Creates high-performance procedural canvas textures for Three.js PBR materials
 * without requiring external network image downloads.
 */

// 1. Travertine / Limestone Facade Texture
export function createTravertineTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base warm limestone
  ctx.fillStyle = '#f4efe8';
  ctx.fillRect(0, 0, width, height);

  // Subtle horizontal sedimentary layers
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(235, 226, 215, 0.4)');
  gradient.addColorStop(0.3, 'rgba(248, 245, 240, 0.6)');
  gradient.addColorStop(0.7, 'rgba(230, 220, 206, 0.3)');
  gradient.addColorStop(1, 'rgba(240, 233, 224, 0.5)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Pores and subtle linear veining
  ctx.fillStyle = 'rgba(195, 180, 160, 0.15)';
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const w = 4 + Math.random() * 25;
    const h = 1 + Math.random() * 2;
    ctx.fillRect(x, y, w, h);
  }

  // Stone panel reveal joints (subtle grid)
  ctx.strokeStyle = 'rgba(160, 145, 125, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let y = 0; y < height; y += 128) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  for (let x = 0; x < width; x += 256) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Calacatta Gold Interior Marble Texture
export function createCalacattaMarbleTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Pure luminous marble ground
  ctx.fillStyle = '#fdfdfc';
  ctx.fillRect(0, 0, width, height);

  // Large sweeping smoky grey veins
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(180, 185, 190, 0.18)';
  ctx.filter = 'blur(4px)';

  ctx.beginPath();
  ctx.moveTo(0, 80);
  ctx.bezierCurveTo(width * 0.3, 140, width * 0.6, 60, width, 240);
  ctx.bezierCurveTo(width * 0.7, 340, width * 0.3, 400, width, 460);
  ctx.stroke();

  // Distinct Gold & Amber Veins
  ctx.filter = 'none';
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(195, 145, 65, 0.45)';
  ctx.beginPath();
  ctx.moveTo(30, 0);
  ctx.bezierCurveTo(120, 160, 240, 220, 360, 320);
  ctx.bezierCurveTo(420, 380, 480, 420, width, 500);
  ctx.stroke();

  // Delicate feather branch veins
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(180, 140, 70, 0.3)';
  for (let i = 0; i < 5; i++) {
    const startX = 100 + i * 70;
    const startY = 120 + i * 60;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + 40 + Math.random() * 30, startY - 30 - Math.random() * 20);
    ctx.stroke();
  }

  // Large slab tile borders
  ctx.strokeStyle = 'rgba(210, 205, 195, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(1, 1, width - 2, height - 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 3. Fair-Faced Architectural Concrete Texture
export function createConcreteTexture(width = 256, height = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#9e9fa3';
  ctx.fillRect(0, 0, width, height);

  // Aggregate grain noise
  for (let i = 0; i < 2500; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const bright = Math.random() > 0.5;
    ctx.fillStyle = bright ? 'rgba(220, 222, 225, 0.15)' : 'rgba(70, 72, 75, 0.15)';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Formwork tie-rod circular indentations
  ctx.fillStyle = 'rgba(60, 62, 65, 0.4)';
  const holes = [
    [32, 32], [width - 32, 32],
    [32, height - 32], [width - 32, height - 32]
  ];
  holes.forEach(([hx, hy]) => {
    ctx.beginPath();
    ctx.arc(hx, hy, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 4. AAC Masonry Blocks / Brickwork Texture
export function createBlockworkTexture(width = 512, height = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Mortar joint background
  ctx.fillStyle = '#c7c3bd';
  ctx.fillRect(0, 0, width, height);

  const blockW = 64;
  const blockH = 32;
  const mortar = 3;

  // Draw staggered running bond AAC blocks
  for (let y = 0; y < height; y += blockH) {
    const rowIndex = Math.floor(y / blockH);
    const offsetX = (rowIndex % 2 === 0) ? 0 : blockW / 2;

    for (let x = -blockW; x < width + blockW; x += blockW) {
      // Subtle block color variation
      const shade = 215 + Math.floor(Math.random() * 20);
      ctx.fillStyle = `rgb(${shade}, ${shade - 2}, ${shade - 6})`;
      ctx.fillRect(x + offsetX + mortar, y + mortar, blockW - mortar * 2, blockH - mortar * 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 5. Earth / Excavation Strata Soil Texture
export function createSoilTexture(width = 256, height = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base earth tone
  ctx.fillStyle = '#6b4f32';
  ctx.fillRect(0, 0, width, height);

  // Layered strata bands
  for (let y = 0; y < height; y += 24) {
    const r = 90 + Math.floor(Math.random() * 30);
    const g = 65 + Math.floor(Math.random() * 25);
    const b = 40 + Math.floor(Math.random() * 15);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, y, width, 24);
  }

  // Stone and soil speckles
  for (let i = 0; i < 1200; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(40, 25, 15, 0.4)' : 'rgba(160, 130, 90, 0.3)';
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 6. Water Ripple Normal Map for Swimming Pool
export function createWaterNormalTexture(width = 256, height = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Neutral tangent normal vector (128, 128, 255)
  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, width, height);

  // Concentric ripple perturbation
  for (let i = 0; i < 18; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const radius = 20 + Math.random() * 50;

    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
    grad.addColorStop(0, 'rgba(150, 110, 245, 0.6)');
    grad.addColorStop(0.5, 'rgba(110, 150, 250, 0.4)');
    grad.addColorStop(1, 'rgba(128, 128, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 7. Finished Architectural Stucco / White Paint Texture
export function createStuccoRenderTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Warm luxury architectural white
  ctx.fillStyle = '#faf7f2';
  ctx.fillRect(0, 0, width, height);

  // Micro fine sand plaster grain
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const dark = Math.random() > 0.6;
    ctx.fillStyle = dark ? 'rgba(215, 205, 195, 0.18)' : 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(x, y, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 8. Asphalt Road & Motor Court Pavement
export function createAsphaltRoadTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2b2d31';
  ctx.fillRect(0, 0, width, height);

  // Fine stone aggregate specks
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(180, 185, 195, 0.2)' : 'rgba(15, 15, 20, 0.3)';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Crisp white road boundary line
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(20, 0, 8, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 9. Lush Variegated Emerald Lawn Texture
export function createLawnTexture(width = 256, height = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2f6d38';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const isBright = Math.random() > 0.45;
    ctx.fillStyle = isBright ? 'rgba(74, 158, 86, 0.3)' : 'rgba(28, 68, 36, 0.35)';
    ctx.fillRect(x, y, 1.5, 2.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 10. Site Boundary Fence Banner
export function createFenceBannerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // JSG signature dark emerald green
  ctx.fillStyle = '#17362f';
  ctx.fillRect(0, 0, 1024, 128);

  // Gold borders
  ctx.strokeStyle = '#b58b4a';
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, 1012, 116);

  // Brand typography
  ctx.fillStyle = '#d9bf8c';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('JSG REAL ESTATE  •  SIGNATURE RESIDENCE DEVELOPMENT', 40, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = '16px sans-serif';
  ctx.fillText('DLD PERMIT #948210  •  LUXURY TURNKEY VILLA  •  AUTHORIZED ACCESS ONLY', 42, 88);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

