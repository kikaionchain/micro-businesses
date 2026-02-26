# Notion Setup Guide — Turning Content Files Into Live Products
*How to take each product-content.md and create a real, shareable Notion template*

---

## Overview

Each product delivers via a Notion "duplicate" link. When a buyer purchases on For Crypto, they receive a link. Clicking it lets them add the full template to their own Notion workspace with one click.

This guide walks through building each Notion template from the product-content.md files.

---

## One-Time Setup

1. Create a dedicated Notion workspace for these products: `Products by [Brand Name]`
2. Do NOT use your personal WJP Notion — keep these in separate accounts matching each brand
3. Notion free plan is fine for template hosting
4. Use an email alias for each (e.g., kikaionchain+vessel@gmail.com)

---

## Building Each Template

### VESSEL — Token Launch Playbook

**Time to build:** ~45 minutes
**Notion page type:** Full-page template with nested databases

Steps:
1. Create a new Notion page titled "🚀 VESSEL — Token Launch Playbook"
2. Add a cover image (the cover.jpg from businesses/01-vessel/images/)
3. Build sections in order from product-content.md:
   - Add the opening quote as a callout block
   - "How to use this template" as a toggle
   - Section 1: Pre-Launch Checklist → use Notion checkbox blocks (not database)
   - Section 2: Community Building Framework → use toggle headers for each phase
   - Section 3: Narrative Worksheet → use text blocks with fill-in fields
   - Section 4: Announcement Templates → use code blocks or quote blocks
   - Section 5: Post-Launch Playbook → use a simple table or toggle list
   - Section 6: FAQ Template → use toggle blocks

**Share settings:** "Anyone with link" → "Can duplicate"
**Deliver as:** Share link → copy "Duplicate this page" URL

---

### DRAFT — 90 Days of Crypto Content

**Time to build:** ~30 minutes
**Notion page type:** Database (Gallery view) OR simple page with categories

Steps:
1. Create page titled "📝 DRAFT — 90 Days of Crypto Content"
2. Option A (simple): Each category as a toggle section, posts as numbered items
3. Option B (database): Create a database with fields: Post #, Category, Template Text, Platform, Usage Notes
4. Populate with all 90 templates from product-content.md
5. Add filter views: by Category (Hype / Education / Community / Market / Culture)

**Share settings:** "Anyone with link" → "Can duplicate"

---

### STACK — Crypto AI Prompt Vault

**Time to build:** ~45 minutes
**Notion page type:** Database (Table view, filterable by category)

Steps:
1. Create page titled "⚡ STACK — Crypto AI Prompt Vault"
2. Create a database with fields:
   - Prompt # (text)
   - Category (select: Community / Content / Investor / Research / Launch)
   - Use Case (text — brief description)
   - The Prompt (text — full prompt text)
   - Variables (text — list of [BRACKETS] to fill in)
   - Model Compatibility (multi-select: Claude / ChatGPT / Gemini)
   - Difficulty (select: Beginner / Intermediate / Advanced)
3. Add all 100 prompts from product-content.md
4. Create filtered views: by Category (5 views)
5. Add a "Favorites" filter view (filtered to starred items)

**Share settings:** "Anyone with link" → "Can duplicate"

---

### BLUEPRINT — Web3 Brand Starter Kit

**Time to build:** ~60 minutes
**Notion page type:** Document with embedded visual elements

Steps:
1. Create page titled "🎨 BLUEPRINT — Web3 Brand Starter Kit"
2. Structure:
   - Intro + how to use
   - Section 1: Color Systems (5 complete palettes) — use colored blocks or a table with hex codes
   - Section 2: Typography Guide (5 pairings) — use styled text to demonstrate each
   - Section 3: Logo Direction Worksheet — toggle with questions
   - Section 4: Social Media Sizing Guide — simple table
   - Section 5: Pitch Deck Outline (12 slides) — numbered toggles
   - Section 6: One-Pager Template — structured page template
   - Section 7: Brand Voice Worksheet — questions with fill-in space

**Note:** Add Canva template links when available (external). Mark as "BONUS: Open in Canva →"

---

### LEDGER — Crypto Portfolio Tracker

**Time to build:** ~60 minutes (most technically involved)
**Notion page type:** Workspace with 5 linked databases

Steps:
1. Create parent page: "📊 LEDGER — Crypto Portfolio Tracker"
2. Create 5 databases (follow exact property specs from product-content.md):
   - Portfolio database (23 properties)
   - Trade Log database (18 properties)
   - Token Watchlist database (22 properties)
   - Decision Journal database
   - Monthly Review database
3. Add all 5 sample data entries (ETH, SOL, LINK, PENDLE, DOGE) to Portfolio
4. Link databases using Relation properties
5. Create the Dashboard page with linked views
6. Add formulas exactly as specified (P&L calculations)
7. Test all formulas work with sample data

**Critical:** Test all Relation links and formulas before sharing.

---

### FLOW — Community Growth Bible

**Time to build:** ~20 minutes
**Notion page type:** Long-form document (simpler than others)

Steps:
1. Create page titled "🌊 FLOW — Community Growth Bible"
2. Paste content from product-content.md with Notion formatting:
   - Phase headers as H1
   - Section headers as H2/H3
   - Tactics as numbered lists
   - Scripts in quote blocks or code blocks
   - Checklists as checkbox lists
3. Add a table of contents at the top (Notion TOC block)

---

### PULSE — Crypto Twitter Mastery Pack

**Time to build:** ~30 minutes
**Notion page type:** Database OR document

Steps:
1. Create page titled "⚡ PULSE — Crypto Twitter Mastery Pack"
2. Part 1 — Thread Templates: Use a database with fields:
   - Template # / Category / Hook (first tweet) / Full Thread / Tags
3. Part 2 — Growth Guide: Long-form document after the database
4. Create filtered views by category (Alpha / Opinion / Educational / Storytelling / Hot Takes)

---

### FORGE — Web3 Founder Operations Kit

**Time to build:** ~90 minutes (most complex)
**Notion page type:** Full workspace with 7 interconnected databases

Steps:
1. Create parent workspace: "⚒️ FORGE — Web3 Founder Ops"
2. Create 7 databases:
   - Roadmap Tracker (18 props)
   - Task Board (14 props)
   - Investor CRM (25+ props)
   - Token Economics Model (tables + formulas)
   - Launch Timeline (120-day countdown)
   - Meeting Notes (database + template)
   - Hiring Pipeline (25+ props)
3. Add all 30+ sample data entries
4. Build filtered views for each database (6-7 views each)
5. Create a master Dashboard page linking all databases
6. Add setup guide and maintenance cadence as a final section

**Critical:** FORGE is complex. Set up in a test workspace first, verify everything works, then duplicate to the "live" workspace.

---

## Sharing and Delivery

### Getting the Duplicate Link

1. Open the Notion page
2. Click "Share" in the top right
3. Toggle "Share to web" ON
4. Allow "Duplicate"
5. Copy the link — this is your delivery URL

### Testing Before Launch

ALWAYS test your delivery link:
1. Open the link in an incognito/private browser window
2. Confirm it shows a "Duplicate this page" button
3. Click it and verify the full template copies correctly
4. Check all linked databases and formulas work in the duplicate

### Updating Products Post-Launch

If you update a product (add content, fix errors):
1. Update the source Notion page
2. The delivery link automatically serves the updated version
3. Existing buyers get the update automatically (this is a feature, not a bug)
4. Post in your seller profile: "Product updated — [what changed]"

---

## Build Time Summary

| Product | Est. Build Time | Complexity |
|---------|----------------|------------|
| VESSEL | 45 min | Medium |
| DRAFT | 30 min | Low |
| STACK | 45 min | Medium |
| BLUEPRINT | 60 min | Medium-High |
| LEDGER | 60 min | High |
| FLOW | 20 min | Low |
| PULSE | 30 min | Low-Medium |
| FORGE | 90 min | Very High |
| **Total** | **~6.5 hours** | — |

Kikai can build all 8 once approved. Can be done in a single sub-agent session per product.
