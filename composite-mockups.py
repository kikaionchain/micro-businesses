"""
Real mockup compositor using official Apple device frames + Playwright screenshots.
Composites actual product UI screenshots into transparent device frame PNGs.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os, sys

BASE = "/Users/kikai/clawd/projects/micro-businesses"
FRAMES = f"{BASE}/assets/frames"
SCREENSHOTS = f"{BASE}/assets/screenshots"

PRODUCTS = [
    {"id": "02-draft",     "name": "DRAFT",     "color": (245, 197, 24),  "price": "$19", "tag": "Content Templates"},
    {"id": "03-stack",     "name": "STACK",     "color": (167, 139, 250), "price": "$27", "tag": "Prompt Library"},
    {"id": "04-blueprint", "name": "BLUEPRINT", "color": (201, 168, 76),  "price": "$37", "tag": "Brand Kit"},
    {"id": "05-ledger",    "name": "LEDGER",    "color": (62, 207, 142),  "price": "$17", "tag": "Notion Template"},
    {"id": "06-flow",      "name": "FLOW",      "color": (255, 107, 107), "price": "$29", "tag": "Playbook"},
    {"id": "07-pulse",     "name": "PULSE",     "color": (74, 158, 255),  "price": "$24", "tag": "Twitter Templates"},
]

def find_screen_area(frame_img):
    """Find the transparent screen area in a device frame PNG."""
    w, h = frame_img.size
    pixels = frame_img.load()
    
    # Scan for the transparent region (alpha < 10)
    min_x, min_y, max_x, max_y = w, h, 0, 0
    for y in range(h):
        for x in range(0, w, 4):  # sample every 4px for speed
            r, g, b, a = pixels[x, y]
            if a < 10:  # transparent = screen area
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    
    return (min_x, min_y, max_x - min_x, max_y - min_y)

def composite_into_frame(screenshot_path, frame_path, output_path, bg_color=(10, 10, 10)):
    """Composite a screenshot into device frame's transparent screen area."""
    frame = Image.open(frame_path).convert("RGBA")
    fw, fh = frame.size
    
    # Find screen area by looking for the dark/transparent region in center
    # For MacBook Pro 14 frame (3944x2564), screen is approximately:
    # These are calibrated values for the specific frame
    if "macbook" in frame_path.lower():
        # MacBook Pro 14 screen area (calibrated)
        sx, sy, sw, sh = 386, 124, 3172, 1990
    elif "iphone" in frame_path.lower():
        # iPhone 16 Pro frame (calibrated)
        sx, sy, sw, sh = 82, 82, 756, 1636
    else:
        sx, sy, sw, sh = int(fw*0.1), int(fh*0.05), int(fw*0.8), int(fh*0.7)

    # Load and resize screenshot to fit screen
    if os.path.exists(screenshot_path):
        screenshot = Image.open(screenshot_path).convert("RGBA")
        screenshot = screenshot.resize((sw, sh), Image.LANCZOS)
    else:
        # Placeholder if screenshot missing
        screenshot = Image.new("RGBA", (sw, sh), (20, 20, 40, 255))

    # Create base image with dark background
    result = Image.new("RGBA", (fw, fh), (*bg_color, 255))
    
    # Paste screenshot at screen position (behind the frame)
    result.paste(screenshot, (sx, sy))
    
    # Overlay the frame on top
    result.paste(frame, (0, 0), frame)
    
    # Save as JPEG
    result_rgb = result.convert("RGB")
    result_rgb.save(output_path, "JPEG", quality=95)
    print(f"  → {os.path.basename(output_path)}")

def make_cover(product, output_path, w=1200, h=630):
    """Make a premium cover image — typography + accent color, no device."""
    img = Image.new("RGB", (w, h), (8, 8, 8))
    draw = ImageDraw.Draw(img)
    
    r, g, b = product["color"]
    
    # Background gradient effect (dark to slightly lighter)
    for y in range(h):
        factor = y / h
        gray = int(8 + factor * 12)
        for x in range(w):
            img.putpixel((x, y), (gray, gray, gray))
    
    # Accent color glow (top-left corner)
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([-200, -200, 600, 500], fill=(*product["color"], 25))
    img_rgba = img.convert("RGBA")
    img_rgba = Image.alpha_composite(img_rgba, glow)
    img = img_rgba.convert("RGB")
    draw = ImageDraw.Draw(img)
    
    # Bottom right accent line
    draw.rectangle([w-4, 0, w, h], fill=tuple(product["color"]))
    
    # Large product name - bold
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 140)
        font_med = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 28)
        font_small = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 20)
    except:
        font_large = ImageFont.load_default()
        font_med = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Product name — massive, left aligned
    name = product["name"]
    draw.text((72, 160), name, fill=(255, 255, 255), font=font_large)
    
    # Accent color underline under name
    bbox = draw.textbbox((72, 160), name, font=font_large)
    draw.rectangle([72, bbox[3] + 8, bbox[2], bbox[3] + 14], fill=tuple(product["color"]))
    
    # Tag line
    draw.text((76, bbox[3] + 36), product["tag"].upper(), fill=(*product["color"],), font=font_med)
    
    # Price bottom left
    draw.text((76, h - 80), product["price"], fill=(255, 255, 255), font=font_med)
    
    # Horizontal rule at bottom
    draw.rectangle([72, h - 95, 200, h - 93], fill=(60, 60, 60))

    img.save(output_path, "JPEG", quality=95)
    print(f"  → {os.path.basename(output_path)}")

def make_social(product, output_path, w=1080, h=1080):
    """Square social card."""
    img = Image.new("RGB", (w, h), (8, 8, 8))
    
    # Accent color fill — top half
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, w, h//2], fill=tuple(product["color"]))
    
    # Product name in accent zone
    try:
        font_big = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 160)
        font_med = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 40)
        font_sm = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 28)
    except:
        font_big = ImageFont.load_default()
        font_med = ImageFont.load_default()
        font_sm = ImageFont.load_default()
    
    # Big name centered
    draw.text((w//2, h//2 - 60), product["name"], fill=(8, 8, 8),
              font=font_big, anchor="mm")
    
    # Price bottom half
    draw.text((w//2, h//2 + 100), product["price"], fill=(255, 255, 255),
              font=font_big, anchor="mm")
    
    # Tag
    draw.text((w//2, h - 80), product["tag"].upper(), fill=(100, 100, 100),
              font=font_sm, anchor="mm")
    
    img.save(output_path, "JPEG", quality=95)
    print(f"  → {os.path.basename(output_path)}")

def make_scaled_preview(frame_path, screenshot_path, output_path,
                         out_w=1200, out_h=630, bg_color=(8,8,8),
                         glow_color=None):
    """Composite + scale down to output size with optional glow bg."""
    frame = Image.open(frame_path).convert("RGBA")
    fw, fh = frame.size

    if "macbook" in frame_path.lower():
        sx, sy, sw, sh = 386, 124, 3172, 1990
    elif "iphone" in frame_path.lower():
        sx, sy, sw, sh = 82, 82, 756, 1636
    else:
        sx, sy, sw, sh = int(fw*0.1), int(fh*0.05), int(fw*0.8), int(fh*0.7)

    if os.path.exists(screenshot_path):
        screenshot = Image.open(screenshot_path).convert("RGBA")
        screenshot = screenshot.resize((sw, sh), Image.LANCZOS)
    else:
        screenshot = Image.new("RGBA", (sw, sh), (20, 20, 40, 255))

    # Full-size composite
    full = Image.new("RGBA", (fw, fh), (*bg_color, 255))
    if glow_color:
        glow = Image.new("RGBA", (fw, fh), (0,0,0,0))
        gd = ImageDraw.Draw(glow)
        cx, cy = fw//2, fh//2
        gd.ellipse([cx-fw//2, cy-fh//2, cx+fw//2, cy+fh//2], fill=(*glow_color, 18))
        full = Image.alpha_composite(full, glow)
    
    full.paste(screenshot, (sx, sy))
    full.paste(frame, (0, 0), frame)

    # Scale to output size (fit with padding)
    scale = min(out_w / fw, out_h / fh) * 0.88
    nw, nh = int(fw * scale), int(fh * scale)
    resized = full.resize((nw, nh), Image.LANCZOS)
    
    bg = Image.new("RGB", (out_w, out_h), bg_color)
    px = (out_w - nw) // 2
    py = (out_h - nh) // 2
    resized_rgb = resized.convert("RGBA")
    bg.paste(resized, (px, py), resized_rgb)
    
    # Soft drop shadow
    shadow = Image.new("RGBA", (out_w, out_h), (0,0,0,0))
    sd = ImageDraw.Draw(shadow)
    sd.rectangle([px+4, py+8, px+nw+4, py+nh+8], fill=(0,0,0,100))
    shadow = shadow.filter(ImageFilter.GaussianBlur(20))
    bg_rgba = bg.convert("RGBA")
    bg_rgba = Image.alpha_composite(bg_rgba, shadow)
    bg_rgba.paste(resized, (px, py), resized_rgb)
    
    bg_rgba.convert("RGB").save(output_path, "JPEG", quality=95)
    print(f"  → {os.path.basename(output_path)}")

# ── MAIN ──────────────────────────────────────────────────────────────
macbook_frame = f"{FRAMES}/macbook-pro-14.png"
iphone_frame  = f"{FRAMES}/iphone-16-pro.png"

for p in PRODUCTS:
    pid = p["id"]
    out_dir = f"{BASE}/businesses/{pid}/images"
    os.makedirs(out_dir, exist_ok=True)
    ss = f"{SCREENSHOTS}/{pid}"
    
    print(f"\n=== {p['name']} ===")
    
    # cover.jpg — typography, no device
    make_cover(p, f"{out_dir}/cover.jpg")
    
    # preview.jpg — MacBook with hero screenshot, centered + glow
    make_scaled_preview(
        macbook_frame, f"{ss}-hero.png",
        f"{out_dir}/preview.jpg",
        out_w=1200, out_h=630,
        bg_color=(8,8,8),
        glow_color=p["color"]
    )
    
    # feature-1.jpg — MacBook with feat1 screenshot
    make_scaled_preview(
        macbook_frame, f"{ss}-feat1.png",
        f"{out_dir}/feature-1.jpg",
        out_w=1200, out_h=630,
        bg_color=(12,12,12)
    )
    
    # feature-2.jpg — iPhone with mobile screenshot
    make_scaled_preview(
        iphone_frame, f"{ss}-mobile.png",
        f"{out_dir}/feature-2.jpg",
        out_w=1200, out_h=630,
        bg_color=(10,10,10),
        glow_color=p["color"]
    )
    
    # social.jpg — square bold card
    make_social(p, f"{out_dir}/social.jpg")

print("\nALL_DONE")
