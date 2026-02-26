#!/bin/bash
# Generate all product preview images for micro-businesses

source ~/.zshrc 2>/dev/null

BASE="/Users/kikai/clawd/projects/micro-businesses/businesses"
API="https://fal.run/fal-ai/flux/schnell"

TOTAL=0
FAILED=0

gen() {
  local PRODUCT=$1
  local IMG_TYPE=$2
  local SIZE=$3
  local PROMPT=$4
  local OUT="$BASE/$PRODUCT/images/$IMG_TYPE"
  
  mkdir -p "$BASE/$PRODUCT/images"
  
  echo "  Generating $PRODUCT/$IMG_TYPE..."
  URL=$(curl -s -X POST "$API" \
    -H "Authorization: Key $FAL_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"prompt\":$(echo "$PROMPT" | jq -Rs .),\"image_size\":\"$SIZE\",\"num_images\":1}" | jq -r '.images[0].url // empty')
  
  if [ -n "$URL" ] && [ "$URL" != "null" ]; then
    curl -s -o "$OUT" "$URL"
    echo "  ✓ $PRODUCT/$IMG_TYPE saved"
    TOTAL=$((TOTAL + 1))
  else
    echo "  ✗ FAILED: $PRODUCT/$IMG_TYPE"
    FAILED=$((FAILED + 1))
  fi
  sleep 0.5
}

echo "=== VESSEL (01-vessel) - Notion Writing OS ==="
gen "01-vessel" "cover.jpg" "landscape_16_9" "VESSEL — Notion writing OS for creators, minimal dark background deep black #0a0a0a, large bold white sans-serif typography, soft blue accent color #4a9eff geometric elements, abstract light streaks, award-winning design editorial premium professional, ultra detailed, no people"
gen "01-vessel" "preview.jpg" "landscape_16_9" "space gray Apple MacBook Pro open on sleek desk, screen displaying dark Notion workspace with writing dashboard, sidebar navigation, clean content layout, blue accent highlights, studio photography dark background soft dramatic lighting, photorealistic ultra detailed professional product photography award-winning design"
gen "01-vessel" "feature-1.jpg" "landscape_16_9" "silver iPhone 15 Pro floating against dark background, screen showing dark Notion page with writing template, clean typography hierarchy, blue accent color elements, dramatic lighting professional product shot, photorealistic ultra detailed award-winning design"
gen "01-vessel" "feature-2.jpg" "landscape_16_9" "iPad Pro space gray landscape orientation floating, screen displaying dark Notion database with content calendar grid view, blue accent color tags and status indicators, minimal dark background soft shadow premium product photography, photorealistic ultra detailed award-winning design"
gen "01-vessel" "social.jpg" "square_hd" "VESSEL minimal square graphic, deep black background, bold white uppercase text, blue accent color #4a9eff geometric circle element, creator tool branding, Instagram card style, clean minimal design, award-winning design professional ultra detailed"

echo "=== DRAFT (02-draft) - 90-day crypto content templates ==="
gen "02-draft" "cover.jpg" "landscape_16_9" "DRAFT — 90-day crypto content template system, dark premium background deep black, large bold white typography, golden yellow accent color #f5c518 geometric elements calendar grid abstract, award-winning design editorial premium professional, ultra detailed, no people"
gen "02-draft" "preview.jpg" "landscape_16_9" "space gray Apple MacBook Pro on dark desk, screen showing dark content calendar dashboard with 90-day grid, tweet templates organized by day, yellow accent color highlights, studio photography dark background soft dramatic lighting, photorealistic ultra detailed professional product photography award-winning design"
gen "02-draft" "feature-1.jpg" "landscape_16_9" "silver iPhone 15 Pro floating dark background, screen displaying dark content template card with structured writing sections, golden accent color elements, dramatic lighting professional product shot, photorealistic ultra detailed award-winning design"
gen "02-draft" "feature-2.jpg" "landscape_16_9" "iPad Pro space gray landscape, screen showing dark editorial content database with organized crypto tweet templates row by row, yellow accent tags, minimal background soft shadow premium product photography, photorealistic ultra detailed award-winning design"
gen "02-draft" "social.jpg" "square_hd" "DRAFT minimal square graphic, deep black background, bold white uppercase text, golden yellow accent #f5c518 geometric horizontal line element, 90-day system branding, clean minimal social card, award-winning design professional ultra detailed"

echo "=== STACK (03-stack) - 200+ crypto AI prompts ==="
gen "03-stack" "cover.jpg" "landscape_16_9" "STACK — 200 plus crypto AI prompt library, dark premium background deep black, large bold white typography stacked, purple accent color #a78bfa geometric elements glowing particles abstract, award-winning design editorial premium professional ultra detailed no people"
gen "03-stack" "preview.jpg" "landscape_16_9" "space gray Apple MacBook Pro open laptop, screen displaying dark prompt library interface with organized categories, purple accent color tags, clean list view with icons, studio photography dark background soft dramatic lighting, photorealistic ultra detailed professional product photography award-winning design"
gen "03-stack" "feature-1.jpg" "landscape_16_9" "silver iPhone 15 Pro floating dark background, screen showing dark prompt card with structured AI instruction template, purple accent color elements and category pill, dramatic lighting professional product shot, photorealistic ultra detailed award-winning design"
gen "03-stack" "feature-2.jpg" "landscape_16_9" "iPad Pro space gray landscape, screen displaying dark grid of AI prompt categories with purple accent icons, organized prompt library view, minimal background soft shadow premium product photography, photorealistic ultra detailed award-winning design"
gen "03-stack" "social.jpg" "square_hd" "STACK minimal square graphic, deep black background, bold white uppercase text, purple accent #a78bfa glowing dot matrix element, AI prompt library branding, clean minimal social card, award-winning design professional ultra detailed"

echo "=== BLUEPRINT (04-blueprint) - Web3 brand starter kit ==="
gen "04-blueprint" "cover.jpg" "landscape_16_9" "BLUEPRINT — Web3 brand starter kit, dark premium deep black background, large bold white architecture typography, gold accent color #c9a84c geometric blueprint grid lines abstract technical drawing, award-winning design editorial premium professional ultra detailed no people"
gen "04-blueprint" "preview.jpg" "landscape_16_9" "space gray Apple MacBook Pro laptop on designer desk, screen showing dark brand kit overview with logo variations, typography system, gold accent color palette swatches displayed in grid, studio photography dark background soft dramatic lighting, photorealistic ultra detailed professional product photography award-winning design"
gen "04-blueprint" "feature-1.jpg" "landscape_16_9" "silver iPhone 15 Pro floating dark background, screen displaying dark brand identity page with logo system and gold color palette, clean elegant layout, dramatic lighting professional product shot, photorealistic ultra detailed award-winning design"
gen "04-blueprint" "feature-2.jpg" "landscape_16_9" "iPad Pro space gray landscape orientation, screen showing dark design system page with typography hierarchy and gold accent brand elements, minimal background soft shadow premium product photography, photorealistic ultra detailed award-winning design"
gen "04-blueprint" "social.jpg" "square_hd" "BLUEPRINT minimal square graphic, deep black background, bold white uppercase text, gold accent #c9a84c thin grid line geometric element, brand kit branding, clean minimal social card, award-winning design professional ultra detailed"

echo "=== LEDGER (05-ledger) - Crypto portfolio tracker ==="
gen "05-ledger" "cover.jpg" "landscape_16_9" "LEDGER — crypto portfolio tracker Notion template, dark premium background deep black, large bold white finance typography, emerald green accent color #3ecf8e glowing chart line abstract, award-winning design editorial premium professional ultra detailed no people"
gen "05-ledger" "preview.jpg" "landscape_16_9" "space gray Apple MacBook Pro open on desk, screen displaying dark Notion portfolio dashboard with crypto asset tables, P&L columns, green accent highlighted gains, charts and metrics, studio photography dark background soft dramatic lighting, photorealistic ultra detailed professional product photography award-winning design"
gen "05-ledger" "feature-1.jpg" "landscape_16_9" "silver iPhone 15 Pro floating dark background, screen showing dark portfolio tracker view with coin holdings and green percentage gains, clean data layout, dramatic lighting professional product shot, photorealistic ultra detailed award-winning design"
gen "05-ledger" "feature-2.jpg" "landscape_16_9" "iPad Pro space gray landscape, screen displaying dark financial dashboard with emerald green chart, portfolio breakdown pie chart, asset allocation view, minimal background soft shadow premium product photography, photorealistic ultra detailed award-winning design"
gen "05-ledger" "social.jpg" "square_hd" "LEDGER minimal square graphic, deep black background, bold white uppercase text, emerald green accent #3ecf8e upward trending line element, crypto portfolio branding, clean minimal social card, award-winning design professional ultra detailed"

echo "=== FLOW (06-flow) - Community growth playbook ==="
gen "06-flow" "cover.jpg" "landscape_16_9" "FLOW — community growth playbook, dark premium background deep black, large bold white typography with flowing element, coral red accent color #ff6b6b abstract flowing lines geometric, award-winning design editorial premium professional ultra detailed no people"
gen "06-flow" "preview.jpg" "landscape_16_9" "space gray Apple MacBook Pro laptop open, screen displaying dark playbook overview with growth framework steps, red coral accent section headers, clean structured layout, studio photography dark background soft dramatic lighting, photorealistic ultra detailed professional product photography award-winning design"
gen "06-flow" "feature-1.jpg" "landscape_16_9" "silver iPhone 15 Pro floating dark background, screen showing dark community strategy page with growth tactics list, red accent color bullet markers, structured guide layout, dramatic lighting professional product shot, photorealistic ultra detailed award-winning design"
gen "06-flow" "feature-2.jpg" "landscape_16_9" "iPad Pro space gray landscape, screen displaying dark playbook chapter with coral red accent headers, community building framework diagram, minimal background soft shadow premium product photography, photorealistic ultra detailed award-winning design"
gen "06-flow" "social.jpg" "square_hd" "FLOW minimal square graphic, deep black background, bold white uppercase text, coral red accent #ff6b6b flowing wave element, community growth branding, clean minimal social card, award-winning design professional ultra detailed"

echo "=== PULSE (07-pulse) - Crypto Twitter mastery pack ==="
gen "07-pulse" "cover.jpg" "landscape_16_9" "PULSE — crypto Twitter mastery pack, dark premium background deep black, large bold white typography with pulse signal element, electric blue accent color #4a9eff waveform abstract signal graphic, award-winning design editorial premium professional ultra detailed no people"
gen "07-pulse" "preview.jpg" "landscape_16_9" "space gray Apple MacBook Pro open laptop, screen displaying dark Twitter content system with tweet templates organized by category, blue accent highlighted engagement metrics columns, studio photography dark background soft dramatic lighting, photorealistic ultra detailed professional product photography award-winning design"
gen "07-pulse" "feature-1.jpg" "landscape_16_9" "silver iPhone 15 Pro floating dark background, screen showing dark tweet template card with crypto content framework, electric blue accent elements, clean social template layout, dramatic lighting professional product shot, photorealistic ultra detailed award-winning design"
gen "07-pulse" "feature-2.jpg" "landscape_16_9" "iPad Pro space gray landscape, screen displaying dark content strategy database with tweet categories and blue accent tags, growth playbook view, minimal background soft shadow premium product photography, photorealistic ultra detailed award-winning design"
gen "07-pulse" "social.jpg" "square_hd" "PULSE minimal square graphic, deep black background, bold white uppercase text, electric blue accent #4a9eff pulse waveform line element, crypto Twitter branding, clean minimal social card, award-winning design professional ultra detailed"

echo "=== FORGE (08-forge) - Notion project management OS ==="
gen "08-forge" "cover.jpg" "landscape_16_9" "FORGE — Notion project management OS, dark premium background deep black, large bold white industrial typography, orange accent color #fb923c geometric forge spark abstract geometric shapes, award-winning design editorial premium professional ultra detailed no people"
gen "08-forge" "preview.jpg" "landscape_16_9" "space gray Apple MacBook Pro open on desk, screen displaying dark Notion project management workspace with kanban board, task database, sprint view, orange accent color status tags, studio photography dark background soft dramatic lighting, photorealistic ultra detailed professional product photography award-winning design"
gen "08-forge" "feature-1.jpg" "landscape_16_9" "silver iPhone 15 Pro floating dark background, screen showing dark Notion task view with project cards and orange accent status indicators, clean project tracking layout, dramatic lighting professional product shot, photorealistic ultra detailed award-winning design"
gen "08-forge" "feature-2.jpg" "landscape_16_9" "iPad Pro space gray landscape, screen displaying dark Notion project dashboard with roadmap timeline view, orange accent milestones and progress bars, minimal background soft shadow premium product photography, photorealistic ultra detailed award-winning design"
gen "08-forge" "social.jpg" "square_hd" "FORGE minimal square graphic, deep black background, bold white uppercase text, orange accent #fb923c sharp angular geometric element, project management OS branding, clean minimal social card, award-winning design professional ultra detailed"

echo ""
echo "=== COMPLETE: $TOTAL generated, $FAILED failed ==="
