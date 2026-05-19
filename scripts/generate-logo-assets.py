"""
Generate all logo assets from the uploaded Islamediaku logo.
Removes white background, creates transparent versions, and generates all icon sizes.
"""
from PIL import Image
import os
import sys

# Path to the uploaded logo image
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
PUBLIC_DIR = os.path.join(PROJECT_ROOT, 'public')

# The uploaded logo file path - passed as argument or auto-detect
if len(sys.argv) > 1:
    INPUT_PATH = sys.argv[1]
else:
    # Try to find the uploaded logo
    possible_paths = [
        os.path.join(PROJECT_ROOT, 'logo-upload.png'),
        os.path.join(PUBLIC_DIR, 'logo-upload.png'),
    ]
    INPUT_PATH = None
    for p in possible_paths:
        if os.path.exists(p):
            INPUT_PATH = p
            break
    if not INPUT_PATH:
        print("ERROR: No input logo found. Pass path as argument.")
        sys.exit(1)

print(f"Loading logo from: {INPUT_PATH}")
img = Image.open(INPUT_PATH).convert("RGBA")
print(f"Original size: {img.size}")

# Remove white background
data = img.getdata()
new_data = []
for item in data:
    r, g, b, a = item
    # If pixel is white or near-white, make transparent
    if r > 240 and g > 240 and b > 240:
        new_data.append((r, g, b, 0))
    else:
        new_data.append(item)
img.putdata(new_data)

# Crop to content (remove transparent padding)
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)
    print(f"Cropped to: {img.size}")

# Save full transparent logo
full_path = os.path.join(PUBLIC_DIR, 'logo-islamediaku-transparent.png')
img.save(full_path, 'PNG')
print(f"Saved: {full_path}")

# Also save as the main logo.png (replacing old one)
main_path = os.path.join(PUBLIC_DIR, 'logo.png')
# Create a square version with padding for the main logo
max_dim = max(img.size)
square = Image.new('RGBA', (max_dim, max_dim), (0, 0, 0, 0))
offset_x = (max_dim - img.size[0]) // 2
offset_y = (max_dim - img.size[1]) // 2
square.paste(img, (offset_x, offset_y), img)
square_512 = square.resize((512, 512), Image.LANCZOS)
square_512.save(main_path, 'PNG')
print(f"Saved main logo: {main_path}")

# Generate icon-only version (without text) for small icons
# The logo has the mosque/arch icon on top and "ISLAMEDIAKU" text below
# For small icons, we want just the icon part (top ~65% of the image)
icon_crop_height = int(img.size[1] * 0.72)  # Icon is roughly top 72%
icon_img = img.crop((0, 0, img.size[0], icon_crop_height))
icon_bbox = icon_img.getbbox()
if icon_bbox:
    icon_img = icon_img.crop(icon_bbox)

# Make icon square
icon_max = max(icon_img.size)
padding = int(icon_max * 0.08)
icon_square = Image.new('RGBA', (icon_max + padding * 2, icon_max + padding * 2), (0, 0, 0, 0))
icon_ox = (icon_max + padding * 2 - icon_img.size[0]) // 2
icon_oy = (icon_max + padding * 2 - icon_img.size[1]) // 2
icon_square.paste(icon_img, (icon_ox, icon_oy), icon_img)

# Generate all required sizes
sizes = {
    'favicon.png': 32,
    'apple-touch-icon.png': 180,
    'icon-192.png': 192,
    'icon-512.png': 512,
}

for filename, size in sizes.items():
    resized = icon_square.resize((size, size), Image.LANCZOS)
    out_path = os.path.join(PUBLIC_DIR, filename)
    resized.save(out_path, 'PNG')
    print(f"Saved {filename}: {size}x{size}")

# Also create a navbar-sized logo (just the icon, no text)
navbar_logo = icon_square.resize((64, 64), Image.LANCZOS)
navbar_path = os.path.join(PUBLIC_DIR, 'logo-icon.png')
navbar_logo.save(navbar_path, 'PNG')
print(f"Saved navbar icon: logo-icon.png (64x64)")

print("\nAll logo assets generated successfully!")
