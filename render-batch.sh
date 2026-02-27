#!/bin/bash
set -e
cd /Users/kikai/clawd/projects/micro-businesses

PRODUCTS=("02-draft" "03-stack" "04-blueprint" "05-ledger" "06-flow" "07-pulse")

for product in "${PRODUCTS[@]}"; do
    echo "=== Rendering $product ==="
    
    hero_img="assets/screenshots/${product}-hero.png"
    feat1_img="assets/screenshots/${product}-feat1.png"
    
    out_dir="businesses/${product}/images"
    mkdir -p "$out_dir"
    
    # Preview (hero angle)
    echo "  preview.jpg..."
    blender --background --python render-v3.py -- "$hero_img" "$out_dir/preview.jpg" hero 2>&1 | tail -3
    
    # Feature 1 (front angle)
    echo "  feature-1.jpg..."
    blender --background --python render-v3.py -- "$hero_img" "$out_dir/feature-1.jpg" front 2>&1 | tail -3
    
    # Feature 2 (left angle with feat1 screenshot)
    echo "  feature-2.jpg..."
    blender --background --python render-v3.py -- "$feat1_img" "$out_dir/feature-2.jpg" left 2>&1 | tail -3
    
    echo "  ✓ $product done"
done

echo "=== All renders complete ==="
