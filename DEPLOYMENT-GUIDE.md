# Deployment Guide — Micro Businesses on For Crypto
**Status:** Pre-launch (all assets built, WJP review required before publish)
**Last Updated:** 2026-02-23

---

## Pre-Flight Checklist (Do Before Anything)

- [ ] WJP reviews all 8 businesses and approves each
- [ ] For Crypto has seller account functionality live (post-PR #7 merge)
- [ ] DNS fixed (forcrypto.market working)
- [ ] Create personal WJP seller wallet (separate from treasury)
- [ ] Test one product end-to-end: list → buy → download → use

---

## Launch Sequence

### Step 1: Seller Account Setup
Create 8 separate seller profiles on For Crypto. One per brand. Each gets:
- Seller name from `seller-personas.md`
- Bio from brand.md persona section
- Profile image: minimal avatar matching brand palette
- No profile photos (personas are semi-anonymous)

### Step 2: Product Listing (in this order)

Launch in waves — don't flood the marketplace at once.

**Week 1 — The Low-Risk Entry**
1. **LEDGER** ($29) — easiest impulse buy, proves the model
   - Files: `businesses/05-ledger/`
   - Cover: `05-ledger/images/cover.jpg`
   - Banner: `05-ledger/images/preview.jpg`
   
**Week 2 — The Content Play**
2. **DRAFT** ($39) — recurring appeal, content teams buy this
3. **PULSE** ($37) — Twitter crowd, easy share

**Week 3 — The Operator Stack**
4. **STACK** ($49) — AI operator crowd
5. **FLOW** ($47) — community managers

**Week 4 — The Premium Tier**
6. **VESSEL** ($47) — token founders (highest intent buyer)
7. **FORGE** ($59) — startup ops crowd
8. **BLUEPRINT** ($79) — highest ticket, save for last

### Step 3: Product Delivery Setup

Each product delivers via Notion template link. Workflow:
1. Create a Notion page with the full product content (from product-content.md)
2. Share page with "Anyone with link can duplicate"
3. Copy the share link
4. Add link to For Crypto listing as the download
5. Test: open link in incognito → confirm it lets you duplicate

### Step 4: Cosell Setup

After all 8 are live, set cosell commissions:
- LEDGER, DRAFT, PULSE, STACK, FLOW: **20%** (volume play)
- VESSEL, FORGE, BLUEPRINT: **15%** (higher ticket)

Then: personal outreach to 10-15 For Crypto sellers with relevant audiences.
Use cosell pitch copy from `launch-copy.md`.

---

## Product Delivery Notes

### For Notion Template Products (VESSEL, LEDGER, FLOW, FORGE, STACK)
1. Create Notion workspace
2. Build template from `product-content.md` (copy/paste structure)
3. Set to "Duplicate to workspace" share setting
4. Link in For Crypto listing as the download URL

### For Content Pack Products (DRAFT, PULSE)
1. Create Notion page or Google Doc from product-content.md
2. Share as "Anyone with link can view + duplicate"
3. OR: Export as PDF and host on a simple file host (Google Drive, Gumroad, etc.)
4. Deliver link post-purchase via For Crypto's delivery mechanism

### For BLUEPRINT
1. PDF from product-content.md (Canva template links included)
2. Host PDF on Google Drive (public link)
3. Deliver link post-purchase

---

## Post-Launch: Week 1 Metrics to Track

| Metric | Tool | Target (Week 1) |
|--------|------|----------------|
| Listing views | For Crypto analytics | 50+ per product |
| Conversion rate | Views → purchases | 2-5% |
| First sale | — | Within 48h of launch |
| Cosell partners | — | 3+ signed up |
| Total revenue | Wallet | $200-500 Week 1 |

---

## Quality Assurance (Before Each Launch)

For each product, verify:
- [ ] Notion template duplicates correctly (test in incognito)
- [ ] All [BRACKETS] are clearly marked (nothing left blank)
- [ ] Product content is complete and doesn't feel "AI-generated generic"
- [ ] Brand identity is distinct from other 7 products
- [ ] Listing copy is compelling — reads like a real person wrote it
- [ ] Images: cover (1024x1024) and preview (1024x576) look good
- [ ] Price matches pricing-strategy.md
- [ ] Seller persona is consistent (name, bio, tone match brand.md)

---

## Files Per Product — Final Status

| Product | brand.md | product-content.md | listing.md | cover.jpg | preview.jpg | social.jpg |
|---------|----------|--------------------|-----------|-----------|-------------|------------|
| VESSEL | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| DRAFT | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| STACK | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| BLUEPRINT | ✅ | ⏳ | ⏳ | ✅ | ✅ | ✅ |
| LEDGER | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| FLOW | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| PULSE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| FORGE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Revenue Tracker (Post-Launch)

Update weekly in `projects/micro-businesses.md`.

| Week | VESSEL | DRAFT | STACK | BLUEPRINT | LEDGER | FLOW | PULSE | FORGE | Total |
|------|--------|-------|-------|-----------|--------|------|-------|-------|-------|
| 1 | - | - | - | - | - | - | - | - | - |
| 2 | - | - | - | - | - | - | - | - | - |
| 4 | - | - | - | - | - | - | - | - | - |
| 8 | - | - | - | - | - | - | - | - | - |
| 12 | - | - | - | - | - | - | - | - | - |
