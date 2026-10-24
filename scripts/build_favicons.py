import math
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SVG_FAVICON = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <!-- Background Cosmic Space Gradient -->
    <linearGradient id="bgCosmic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180b33"/>
      <stop offset="55%" stop-color="#0b0417"/>
      <stop offset="100%" stop-color="#040108"/>
    </linearGradient>

    <!-- Glowing Perimeter Rim for Contrast on Dark & Light Browser Chrome -->
    <linearGradient id="rimGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0abfc"/>
      <stop offset="35%" stop-color="#c084fc"/>
      <stop offset="70%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#581c87"/>
    </linearGradient>

    <!-- Monogram Fill Gradient (Starlight White to Lilac Neon) -->
    <linearGradient id="monoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#fdf4ff"/>
      <stop offset="75%" stop-color="#f0abfc"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>

    <!-- Radial Core Nebula -->
    <radialGradient id="nebulaCore" cx="50%" cy="50%" r="52%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.45"/>
      <stop offset="50%" stop-color="#7c3aed" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#07040f" stop-opacity="0"/>
    </radialGradient>

    <!-- Soft Ambient Glow Filter -->
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- High-Contrast Squircle Badge -->
  <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#bgCosmic)" stroke="url(#rimGlow)" stroke-width="2.2"/>
  
  <!-- Central Nebula Glow -->
  <circle cx="32" cy="32" r="23" fill="url(#nebulaCore)"/>

  <!-- Signature Starlight ✦ Spark (Top Right Brand Accent) -->
  <path d="M 48 10.5 Q 48 14 51.5 14 Q 48 14 48 17.5 Q 48 14 44.5 14 Q 48 14 48 10.5 Z" fill="#f0abfc"/>
  <circle cx="48" cy="14" r="0.8" fill="#ffffff"/>

  <!-- Razor-Sharp Mathematical Vector Monogram MS -->
  <g fill="url(#monoGrad)" filter="url(#softGlow)">
    <!-- Letter M -->
    <path d="
      M 11 46
      L 11 20
      C 11 18.8 12.2 18 13.2 18.7
      L 22.8 27.8
      C 23.4 28.4 24.6 28.4 25.2 27.8
      L 34.8 18.7
      C 35.8 18 37 18.8 37 20
      L 37 46
      C 37 46.8 36.3 47.5 35.5 47.5
      L 31.5 47.5
      C 30.7 47.5 30 46.8 30 46
      L 30 29
      L 25.2 33.5
      C 24.5 34.2 23.5 34.2 22.8 33.5
      L 18 29
      L 18 46
      C 18 46.8 17.3 47.5 16.5 47.5
      L 12.5 47.5
      C 11.7 47.5 11 46.8 11 46
      Z
    "/>

    <!-- Letter S -->
    <path d="
      M 43 19
      L 51 19
      C 52.1 19 53 19.9 53 21
      L 53 24.5
      C 53 25.3 52.3 26 51.5 26
      L 45 26
      C 43.6 26 42.8 26.8 42.8 28.2
      C 42.8 29.5 43.6 30.2 45 30.5
      L 49 31.3
      C 52.2 32 54 34.2 54 37.5
      C 54 44.5 49 47.5 42.5 47.5
      L 35 47.5
      C 33.9 47.5 33 46.6 33 45.5
      L 33 42
      C 33 41.2 33.7 40.5 34.5 40.5
      L 42.5 40.5
      C 44.2 40.5 45.5 39.6 45.5 38
      C 45.5 36.4 44.2 35.6 42.5 35
      L 38.5 34.2
      C 35.2 33.4 33.5 31.2 33.5 28
      C 33.5 21 38.5 19 43 19
      Z
    "/>
  </g>
</svg>'''

# Save clean SVG
with open("public/favicon.svg", "w", encoding="utf-8") as f:
    f.write(SVG_FAVICON)
print("Saved public/favicon.svg")

# Color palette helper
def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

C_BG0 = hex_to_rgb('#180b33')
C_BG1 = hex_to_rgb('#0b0417')
C_BG2 = hex_to_rgb('#040108')

C_RIM0 = hex_to_rgb('#f0abfc')
C_RIM1 = hex_to_rgb('#a855f7')
C_RIM2 = hex_to_rgb('#581c87')

C_FG0 = hex_to_rgb('#ffffff')
C_FG1 = hex_to_rgb('#f0abfc')
C_FG2 = hex_to_rgb('#c084fc')

def interpolate(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))

def render_high_res_badge(target_size, is_maskable=False, is_apple=False, is_fav_ico=False):
    # Render at 4x or 2x supersampling
    scale = 4 if target_size <= 64 else 2
    w = target_size * scale
    h = target_size * scale

    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Padding and geometry
    if is_apple or is_maskable:
        # Full bleed square (OS masks it)
        pad = int(w * 0.12) if is_maskable else int(w * 0.04)
        draw.rectangle([(0, 0), (w, h)], fill=(*C_BG1, 255))
    else:
        pad = int(w * 0.035)

    badge_w = w - (pad * 2)
    badge_h = h - (pad * 2)
    radius = int(badge_w * 0.25)

    # 1. Background gradient
    bg_img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg_img)

    # Draw gradient diagonally
    diag_steps = int(math.hypot(w, h))
    for step in range(diag_steps):
        t = step / diag_steps
        if t <= 0.55:
            col = interpolate(C_BG0, C_BG1, t / 0.55)
        else:
            col = interpolate(C_BG1, C_BG2, (t - 0.55) / 0.45)
        bg_draw.line([(step, 0), (0, step)], fill=(*col, 255), width=int(scale * 2))

    # Mask background into rounded squircle
    bg_mask = Image.new('L', (w, h), 0)
    mask_draw = ImageDraw.Draw(bg_mask)
    if is_apple or is_maskable:
        mask_draw.rectangle([(0, 0), (w, h)], fill=255)
    else:
        mask_draw.rounded_rectangle([(pad, pad), (w - pad, h - pad)], radius=radius, fill=255)
    img.paste(bg_img, (0, 0), bg_mask)

    # 2. Glowing perimeter rim (only for standard / favicon icons)
    if not is_apple and not is_maskable:
        rim_width = max(1, int(scale * 2.2))
        # Draw rim with subtle glow
        glow_draw = ImageDraw.Draw(img)
        glow_draw.rounded_rectangle(
            [(pad, pad), (w - pad, h - pad)],
            radius=radius,
            outline=(*C_RIM1, 200),
            width=rim_width
        )
        glow_draw.rounded_rectangle(
            [(pad, pad), (w - pad, h - pad)],
            radius=radius,
            outline=(*C_RIM0, 100),
            width=max(1, rim_width // 2)
        )

    # 3. Central cosmic nebula glow
    cx, cy = w // 2, h // 2
    nebula_r = int(badge_w * 0.42)
    nebula_img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    nebula_draw = ImageDraw.Draw(nebula_img)
    for r in range(nebula_r, 0, -1):
        alpha = int(90 * (1 - r / nebula_r))
        nebula_draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            fill=(*C_RIM1, alpha)
        )
    img = Image.alpha_composite(img, nebula_img)
    draw = ImageDraw.Draw(img)

    # 4. Signature Starlight ✦ Spark (Top Right)
    spark_cx = cx + int(badge_w * 0.28)
    spark_cy = cy - int(badge_h * 0.32)
    spark_r = int(badge_w * 0.07)
    spark_color = (*C_RIM0, 240)
    
    # 4-point star path
    spark_pts = [
        (spark_cx, spark_cy - spark_r),
        (spark_cx + spark_r * 0.25, spark_cy - spark_r * 0.25),
        (spark_cx + spark_r, spark_cy),
        (spark_cx + spark_r * 0.25, spark_cy + spark_r * 0.25),
        (spark_cx, spark_cy + spark_r),
        (spark_cx - spark_r * 0.25, spark_cy + spark_r * 0.25),
        (spark_cx - spark_r, spark_cy),
        (spark_cx - spark_r * 0.25, spark_cy - spark_r * 0.25)
    ]
    draw.polygon(spark_pts, fill=spark_color)
    draw.ellipse(
        [spark_cx - scale, spark_cy - scale, spark_cx + scale, spark_cy + scale],
        fill=(255, 255, 255, 255)
    )

    # 5. Crisp Bold Monogram MS
    # We will use Arial Black with optical adjustments, or vector glyphs
    font_size = int(badge_h * 0.52)
    try:
        font = ImageFont.truetype("C:\\Windows\\Fonts\\ariblk.ttf", font_size)
    except Exception:
        font = ImageFont.load_default()

    # Draw MS text with subtle 3D drop glow
    text = "MS"
    bbox = font.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    tx = cx - (bbox[0] + bbox[2]) / 2 - int(scale * 1.5)
    ty = cy - (bbox[1] + bbox[3]) / 2 + int(scale * 0.5)

    # Text shadow / ambient occlusion
    shadow_offset = max(1, int(scale * 1.5))
    draw.text((tx, ty + shadow_offset), text, font=font, fill=(15, 3, 25, 200))
    # Outer glow
    draw.text((tx - 1, ty), text, font=font, fill=(*C_RIM0, 90))
    draw.text((tx + 1, ty), text, font=font, fill=(*C_RIM0, 90))
    draw.text((tx, ty - 1), text, font=font, fill=(*C_RIM0, 90))
    draw.text((tx, ty + 1), text, font=font, fill=(*C_RIM0, 90))
    # Crisp white core
    draw.text((tx, ty), text, font=font, fill=(255, 255, 255, 255))

    # Downsample with Lanczos
    res = img.resize((target_size, target_size), Image.Resampling.LANCZOS)
    return res

# 1. Generate PNGs
print("Generating PNG favicons and app icons...")
fav16 = render_high_res_badge(16)
fav16.save("public/favicon-16x16.png", "PNG", optimize=True)

fav32 = render_high_res_badge(32)
fav32.save("public/favicon-32x32.png", "PNG", optimize=True)

fav48 = render_high_res_badge(48)

apple180 = render_high_res_badge(180, is_apple=True)
apple180.save("public/apple-touch-icon.png", "PNG", optimize=True)

pwa192 = render_high_res_badge(192)
pwa192.save("public/pwa-192x192.png", "PNG", optimize=True)

pwa512 = render_high_res_badge(512)
pwa512.save("public/pwa-512x512.png", "PNG", optimize=True)

pwa_mask = render_high_res_badge(512, is_maskable=True)
pwa_mask.save("public/pwa-maskable-512x512.png", "PNG", optimize=True)

# 2. Generate multi-resolution ICO file (public/favicon.ico)
print("Generating public/favicon.ico with 16x16, 32x32, 48x48...")
# Base icon for ICO
ico_img = render_high_res_badge(48)
ico_img.save(
    "public/favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)]
)

print("All favicon assets generated and built successfully!")
