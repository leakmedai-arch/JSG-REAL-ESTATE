import subprocess
import os

print("--- Generating Pixel-Perfect JSG Real Estate 3D Gold Logo ---")

W = 1024
H = 1024

# 1. Create B&W Mask
mask_cmd = [
    'convert', '-size', f'{W}x{H}', 'xc:black',
    '-fill', 'white',
    # Left Element (House Gable Left + Pillar)
    '-draw', 'path "M 390,246 L 164,414 L 244,414 L 244,744 L 390,744 Z"',
    # Center Element (Apex Roof + S)
    '-draw', 'path "M 512,152 L 588,212 L 588,414 L 484,514 L 484,688 L 526,688 L 526,600 L 588,600 L 588,744 L 426,744 L 426,450 L 526,350 L 526,270 L 512,216 L 474,270 L 474,350 L 426,350 L 426,212 Z"',
    # Right Element (House Gable Right + G)
    '-draw', 'path "M 634,246 L 860,414 L 780,414 L 780,744 L 634,744 Z"',
    # REAL ESTATE Serif Text
    '-font', 'Liberation-Serif-Bold',
    '-pointsize', '68',
    '-kerning', '12',
    '-gravity', 'South',
    '-annotate', '+0+180', 'REAL ESTATE',
    # Cutouts (Black)
    '-fill', 'black',
    # Left inner slot
    '-draw', 'path "M 294,440 L 334,440 L 334,688 L 294,688 Z"',
    # Right inner cavity of G
    '-draw', 'path "M 684,350 L 730,384 L 730,460 L 684,460 Z"',
    '-draw', 'path "M 684,560 L 730,560 L 730,688 L 684,688 Z"',
    '/tmp/logo_mask.png'
]
subprocess.check_call(mask_cmd)
print("1. Mask generated")

# 2. Generate 1x256 Gold Gradient Palette with Python directly
# Deep bronze (shadows) -> Antique gold -> Vibrant rich gold -> Pale gold highlight -> White specular glint
stops = [
    (0,   (38, 22, 6)),      # darkest shadow
    (40,  (75, 48, 14)),     # deep bronze
    (90,  (140, 96, 26)),    # warm bronze
    (140, (186, 140, 48)),   # antique gold
    (185, (224, 180, 78)),   # vibrant rich gold
    (220, (247, 222, 138)),  # radiant gold
    (245, (255, 245, 196)),  # specular crest
    (255, (255, 255, 240))   # rim highlight
]

palette_rgba = bytearray()
for i in range(256):
    # Find matching segment
    for s in range(len(stops) - 1):
        x0, c0 = stops[s]
        x1, c1 = stops[s+1]
        if x0 <= i <= x1:
            t = (i - x0) / float(x1 - x0)
            r = int(c0[0] + t * (c1[0] - c0[0]))
            g = int(c0[1] + t * (c1[1] - c0[1]))
            b = int(c0[2] + t * (c1[2] - c0[2]))
            palette_rgba.extend([r, g, b, 255])
            break

with open('/tmp/gold_palette.rgba', 'wb') as f:
    f.write(palette_rgba)

subprocess.check_call([
    'convert', '-size', '1x256', '-depth', '8',
    'rgba:/tmp/gold_palette.rgba',
    '/tmp/gold_palette.png'
])
print("2. 256-color Gold palette generated")

# 3. Create 3D Beveled Normal & Lighting Shading
subprocess.check_call([
    'convert', '/tmp/logo_mask.png',
    '-blur', '0x3',
    '/tmp/logo_blurred.png'
])

# Generate top-left directional sunlight shade (135 deg azimuth, 42 deg elevation)
subprocess.check_call([
    'convert', '/tmp/logo_blurred.png',
    '-shade', '135x42',
    '/tmp/logo_shade_main.png'
])

# Colorize with gold palette CLUT
subprocess.check_call([
    'convert', '/tmp/logo_shade_main.png',
    '/tmp/gold_palette.png',
    '-clut',
    '/tmp/logo_gold_shaded.png'
])

# Mask the gold shading only to the emblem pixels
subprocess.check_call([
    'convert', '/tmp/logo_gold_shaded.png',
    '/tmp/logo_mask.png',
    '-alpha', 'off',
    '-compose', 'CopyOpacity',
    '-composite',
    '/tmp/logo_gold_isolated.png'
])
print("3. 3D Gold surface isolated")

# 4. Create Drop Shadow
subprocess.check_call([
    'convert', '/tmp/logo_mask.png',
    '-background', 'black',
    '-shadow', '40x8+3+6',
    '/tmp/logo_shadow.png'
])

# Overlay gold surface over shadow for transparent version
subprocess.check_call([
    'convert', '-size', f'{W}x{H}', 'xc:none',
    '/tmp/logo_shadow.png', '-geometry', '+0+0', '-composite',
    '/tmp/logo_gold_isolated.png', '-geometry', '+0+0', '-composite',
    'public/assets/jsg-logo-transparent.png'
])
print("4. Transparent PNG saved to public/assets/jsg-logo-transparent.png")

# 5. Composite onto luxury light background (#FAF9F6) matching user uploaded image
subprocess.check_call([
    'convert', '-size', f'{W}x{H}', 'xc:#faf8f5',
    'public/assets/jsg-logo-transparent.png',
    '-compose', 'Over',
    '-composite',
    'public/assets/jsg-logo.png'
])
# Also save to public/logo.png for favicon & OpenGraph
subprocess.check_call(['cp', 'public/assets/jsg-logo.png', 'public/logo.png'])

# Copy to dist for instant production preview
os.makedirs('dist/assets', exist_ok=True)
subprocess.check_call(['cp', 'public/assets/jsg-logo.png', 'dist/assets/jsg-logo.png'])
subprocess.check_call(['cp', 'public/assets/jsg-logo-transparent.png', 'dist/assets/jsg-logo-transparent.png'])
subprocess.check_call(['cp', 'public/logo.png', 'dist/logo.png'])

print("5. All PNG assets successfully generated and synced to public/ and dist/")
