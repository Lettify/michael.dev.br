import os
import subprocess
from PIL import Image

# 1. Update public/favicon.svg with the final approved Concept 1
with open("c:/Users/micha/OneDrive/Documentos/Meus Sites/michael.dev.br/scripts/concepts/concept1_crest.svg", "r", encoding="utf-8") as f:
    svg_content = f.read()

with open("c:/Users/micha/OneDrive/Documentos/Meus Sites/michael.dev.br/public/favicon.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Saved public/favicon.svg")

# 2. Create high-res render HTML template for Edge headless
render_html = '''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: 1024px;
    height: 1024px;
    background: transparent;
    overflow: hidden;
  }
  img {
    width: 1024px;
    height: 1024px;
    display: block;
  }
</style>
</head>
<body>
  <img src="file:///c:/Users/micha/OneDrive/Documentos/Meus Sites/michael.dev.br/public/favicon.svg" />
</body>
</html>'''

with open("c:/Users/micha/OneDrive/Documentos/Meus Sites/michael.dev.br/scripts/render_master.html", "w", encoding="utf-8") as f:
    f.write(render_html)

# 3. Render 1024x1024 master image using Edge headless
master_path = "c:/Users/micha/OneDrive/Documentos/Meus Sites/michael.dev.br/scripts/master_1024.png"
edge_cmd = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "--headless",
    "--disable-gpu",
    f"--screenshot={master_path}",
    "--window-size=1024,1024",
    "--default-background-color=00000000",
    "file:///c:/Users/micha/OneDrive/Documentos/Meus Sites/michael.dev.br/scripts/render_master.html"
]

print("Rendering 1024x1024 master vector with Chromium/Edge...")
subprocess.run(edge_cmd, check=True)

if not os.path.exists(master_path):
    raise FileNotFoundError("Master screenshot not generated!")

# 4. Open master with PIL and generate downsampled icons with Lanczos
master = Image.open(master_path).convert("RGBA")

# Crop to exact 1024x1024 in case of window padding
master = master.crop((0, 0, 1024, 1024))

def save_icon(target_size, output_path, is_maskable=False):
    if is_maskable:
        # Maskable icon requires safe zone padding
        canvas = Image.new("RGBA", (1024, 1024), (7, 4, 15, 255))
        # Scale down emblem to 80% to fit safe circle
        scaled = master.resize((int(1024 * 0.8), int(1024 * 0.8)), Image.Resampling.LANCZOS)
        offset = int(1024 * 0.1)
        canvas.paste(scaled, (offset, offset), scaled)
        final_img = canvas.resize((target_size, target_size), Image.Resampling.LANCZOS)
    else:
        final_img = master.resize((target_size, target_size), Image.Resampling.LANCZOS)
    
    final_img.save(output_path, "PNG", optimize=True)
    print(f"Generated {output_path} ({target_size}x{target_size})")
    return final_img

# Generate PNGs
fav16 = save_icon(16, "c:/Users/micha/OneDrive/Documentos/Meus Sites/michael.dev.br/public/favicon-16x16.png")
fav32 = save_icon(32, "c:/Users/micha/OneDrive/Documentos/Meus Sites/michael.dev.br/public/favicon-32x32.png")
fav48 = save_icon(48, "c:/Users/micha/OneDrive/Documentos/Meus Sites/michael.dev.br/scripts/favicon-48x48.png")
apple180 = save_icon(180, "c:/Users/micha/OneDrive/Documentos/Meus Sites/michael.dev.br/public/apple-touch-icon.png")
pwa192 = save_icon(192, "c:/Users/micha/OneDrive/Documentos/Meus Sites/michael.dev.br/public/pwa-192x192.png")
pwa512 = save_icon(512, "c:/Users/micha/OneDrive/Documentos/Meus Sites/michael.dev.br/public/pwa-512x512.png")
pwa_mask = save_icon(512, "c:/Users/micha/OneDrive/Documentos/Meus Sites/michael.dev.br/public/pwa-maskable-512x512.png", is_maskable=True)

# 5. Generate Multi-Size ICO file (public/favicon.ico) containing 16, 32, 48
fav48.save(
    "c:/Users/micha/OneDrive/Documentos/Meus Sites/michael.dev.br/public/favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)]
)
print("Generated public/favicon.ico (multi-resolution 16x16, 32x32, 48x48)")

print("ALL FAVICON ASSETS SUCCESSFULLY COMPILED!")
