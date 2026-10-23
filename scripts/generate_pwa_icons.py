import math
import os
from PIL import Image, ImageDraw, ImageFont

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

C_BG = hex_to_rgb('#07040f')
C_STOP0 = hex_to_rgb('#f0abfc')
C_STOP1 = hex_to_rgb('#a855f7')
C_STOP2 = hex_to_rgb('#3b0764')

def interpolate_color(t):
    if t <= 0.45:
        sub_t = t / 0.45
        return tuple(int(C_STOP0[i] + (C_STOP1[i] - C_STOP0[i]) * sub_t) for i in range(3))
    else:
        sub_t = (t - 0.45) / 0.55
        return tuple(int(C_STOP1[i] + (C_STOP2[i] - C_STOP1[i]) * sub_t) for i in range(3))

def create_icon(target_size, is_maskable=False, is_apple=False, is_favicon=False):
    # Render at 2x for supersampling
    scale = 2 if target_size >= 64 else 4
    w = target_size * scale
    h = target_size * scale

    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Base background
    if is_apple or is_maskable:
        # Full bleed square (iOS applies squircle, Android maskable masks it)
        draw.rectangle([(0, 0), (w, h)], fill=(*C_BG, 255))
    elif is_favicon:
        # Transparent background, just the orb or rounded rect
        corner_r = int(w * 0.22)
        draw.rounded_rectangle([(0, 0), (w, h)], radius=corner_r, fill=(*C_BG, 255))
    else:
        # Standard PWA icon: sleek rounded rect on dark bg
        corner_r = int(w * 0.22)
        draw.rounded_rectangle([(0, 0), (w, h)], radius=corner_r, fill=(*C_BG, 255))

    # Orb dimensions
    cx, cy = w / 2, h / 2
    if is_maskable:
        # Keep inside 80% safe zone: radius ~ 30% of dimension
        orb_r = w * 0.31
    else:
        orb_r = w * 0.36

    # Offset radial gradient center (simulating 3D light from top-left)
    light_x = cx - orb_r * 0.35
    light_y = cy - orb_r * 0.42

    # Draw radial gradient orb pixel by pixel or in fast concentric rings
    # For high quality and speed, concentric rings from outside in:
    orb_img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    orb_draw = ImageDraw.Draw(orb_img)

    steps = int(orb_r * 2)
    max_dist = orb_r * 1.55
    for r in range(steps, 0, -1):
        radius = (r / steps) * orb_r
        # Approximate gradient parameter
        t = min(1.0, max(0.0, radius / orb_r))
        col = interpolate_color(t)
        # Shift ring center towards light source as radius shrinks
        shift = 1.0 - (radius / orb_r)
        ring_cx = cx + (light_x - cx) * shift
        ring_cy = cy + (light_y - cy) * shift
        orb_draw.ellipse(
            [ring_cx - radius, ring_cy - radius, ring_cx + radius, ring_cy + radius],
            fill=(*col, 255)
        )

    # Mask orb to exact circle at (cx, cy)
    mask = Image.new('L', (w, h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([cx - orb_r, cy - orb_r, cx + orb_r, cy + orb_r], fill=255)
    img.paste(orb_img, (0, 0), mask)

    # Subtle inner glow / rim
    glow_draw = ImageDraw.Draw(img)
    glow_draw.ellipse(
        [cx - orb_r, cy - orb_r, cx + orb_r, cy + orb_r],
        outline=(255, 255, 255, 45),
        width=max(1, int(scale * 1.2))
    )

    # Monogram "MS"
    font_size = int(orb_r * 0.88)
    try:
        font = ImageFont.truetype("C:\\Windows\\Fonts\\ariblk.ttf", font_size)
    except Exception:
        font = ImageFont.load_default()

    text = "MS"
    bbox = font.getbbox(text)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    # Center text visually in orb
    tx = cx - (bbox[0] + bbox[2]) / 2
    ty = cy - (bbox[1] + bbox[3]) / 2

    # Subtle drop shadow for text
    shadow_offset = max(1, int(scale * 1.5))
    glow_draw.text((tx, ty + shadow_offset), text, font=font, fill=(30, 5, 55, 160))
    glow_draw.text((tx, ty), text, font=font, fill=(255, 255, 255, 255))

    # Downsample to target size with Lanczos
    res = img.resize((target_size, target_size), Image.Resampling.LANCZOS)
    return res

os.makedirs("public", exist_ok=True)

icons = [
    ("public/pwa-192x192.png", 192, False, False, False),
    ("public/pwa-512x512.png", 512, False, False, False),
    ("public/pwa-maskable-512x512.png", 512, True, False, False),
    ("public/apple-touch-icon.png", 180, False, True, False),
    ("public/favicon-32x32.png", 32, False, False, True),
    ("public/favicon-16x16.png", 16, False, False, True),
]

for path, size, maskable, apple, fav in icons:
    print(f"Generating {path} ({size}x{size})...")
    img = create_icon(size, is_maskable=maskable, is_apple=apple, is_favicon=fav)
    img.save(path, "PNG", optimize=True)

print("All PWA icons generated successfully!")
