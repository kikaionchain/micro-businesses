/**
 * Professional Product Mockup Pipeline
 * Real screenshots + CSS device frames = Apple-level imagery
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = '/Users/kikai/clawd/projects/micro-businesses';

const PRODUCTS = [
  {
    id: '02-draft',
    name: 'DRAFT',
    tagline: '90 Days of Crypto Content',
    subtitle: 'Post something real.',
    accent: '#F5E642',
    accentText: '#111111',
    html: 'businesses/02-draft/90-Days-of-Crypto-Content.html',
    features: ['90 done-for-you post templates', 'Platform-native formats', 'Built for crypto teams'],
  },
  {
    id: '03-stack',
    name: 'STACK',
    tagline: 'Prompt Vault',
    subtitle: 'Stop prompting. Start producing.',
    accent: '#00FF66',
    accentText: '#000000',
    html: 'businesses/03-stack/STACK-Prompt-Vault.html',
    features: ['200+ battle-tested prompts', 'Organised by workflow', 'Copy, paste, done'],
  },
  {
    id: '04-blueprint',
    name: 'BLUEPRINT',
    tagline: 'Web3 Brand Starter Kit',
    subtitle: 'Build a brand worth believing in.',
    accent: '#C9A84C',
    accentText: '#000000',
    html: 'businesses/04-blueprint/Web3-Brand-Starter-Kit.html',
    features: ['Brand identity system', 'Token launch templates', 'Design-ready assets'],
  },
  {
    id: '05-ledger',
    name: 'LEDGER',
    tagline: 'Crypto Portfolio Tracker',
    subtitle: 'Your portfolio. Your proof.',
    accent: '#3FFFA8',
    accentText: '#000000',
    html: 'businesses/05-ledger/Crypto-Portfolio-Tracker.html',
    features: ['Track every position', 'P&L at a glance', 'Decision journal built-in'],
  },
  {
    id: '06-flow',
    name: 'FLOW',
    tagline: 'Community Growth Bible',
    subtitle: 'Build a community that can\'t stop talking about you.',
    accent: '#FFB347',
    accentText: '#000000',
    html: 'businesses/06-flow/Community-Growth-Bible.html',
    features: ['0 → 10K member playbook', 'Engagement frameworks', 'Real tactics, no fluff'],
  },
  {
    id: '07-pulse',
    name: 'PULSE',
    tagline: 'Crypto Twitter Mastery Pack',
    subtitle: 'Say something worth following.',
    accent: '#00A3FF',
    accentText: '#000000',
    html: 'businesses/07-pulse/Crypto-Twitter-Mastery-Pack.html',
    features: ['50 thread templates', 'Hook formulas that work', 'Audience growth system'],
  },
];

// Products without HTML — cover + social only
const SIMPLE_PRODUCTS = [
  {
    id: '01-vessel',
    name: 'VESSEL',
    tagline: 'Token Launch Toolkit',
    subtitle: 'Carry your culture from day one.',
    accent: '#4A5568',
    accentText: '#ffffff',
    features: ['Full launch checklist', 'Community setup guides', 'Day-1 content calendar'],
  },
  {
    id: '08-forge',
    name: 'FORGE',
    tagline: 'Web3 Operations System',
    subtitle: 'Build what lasts.',
    accent: '#FF6B1A',
    accentText: '#000000',
    features: ['SOPs for every function', 'Founder\'s ops playbook', 'Built for scale'],
  },
];

// ─── HTML Templates ───────────────────────────────────────────────────────────

function coverHtml(product) {
  const { name, tagline, subtitle, accent, accentText, features } = product;
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: #0a0a0a;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 64px;
  }
  .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
  .brand {
    font-size: 96px;
    font-weight: 900;
    letter-spacing: -5px;
    color: ${accent};
    line-height: 1;
    font-style: italic;
  }
  .badge {
    background: ${accent};
    color: ${accentText};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 10px 20px;
    border-radius: 2px;
  }
  .tagline {
    font-size: 40px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -1.5px;
    line-height: 1.1;
    max-width: 900px;
    margin-bottom: 16px;
  }
  .subtitle {
    font-size: 15px;
    color: #555;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 40px;
  }
  .features {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .feat {
    background: #141414;
    border: 1px solid #252525;
    border-left: 3px solid ${accent};
    color: #999;
    font-size: 13px;
    letter-spacing: 0.5px;
    padding: 12px 20px;
    border-radius: 2px;
    white-space: nowrap;
  }
  .line {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 4px;
    background: ${accent};
  }
</style>
</head>
<body>
  <div class="top">
    <div class="brand">${name}</div>
    <div class="badge">Digital Product</div>
  </div>
  <div class="tagline">${tagline}</div>
  <div class="subtitle">${subtitle}</div>
  <div class="features">
    ${features.map(f => `<div class="feat">${f}</div>`).join('')}
  </div>
  <div class="line"></div>
</body>
</html>`;
}

function socialHtml(product) {
  const { name, tagline, accent, accentText } = product;
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1080px; height: 1080px;
    background: #0a0a0a;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 80px;
  }
  .brand {
    font-size: 160px;
    font-weight: 900;
    letter-spacing: -8px;
    color: ${accent};
    line-height: 0.9;
    font-style: italic;
    margin-bottom: 40px;
  }
  .tagline {
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.5px;
    line-height: 1.3;
    max-width: 700px;
    margin-bottom: 48px;
  }
  .dot {
    width: 48px; height: 6px;
    background: ${accent};
    border-radius: 3px;
  }
  .corner {
    position: absolute;
    bottom: 60px; right: 60px;
    background: ${accent};
    color: ${accentText};
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 12px 24px;
    border-radius: 2px;
  }
</style>
</head>
<body>
  <div class="brand">${name}</div>
  <div class="tagline">${tagline}</div>
  <div class="dot"></div>
  <div class="corner">Digital Product</div>
</body>
</html>`;
}

function macbookMockupHtml(screenshotPath, accent) {
  // Encode screenshot as base64
  const imgData = fs.readFileSync(screenshotPath);
  const b64 = imgData.toString('base64');
  
  // Screen dimensions: lid 1060px wide, bezel inset 20px each side → 1020px
  // lid 580px tall, bezel inset 16px top + 20px bottom → 544px
  // Screenshot should be taken at exactly 1020x544 for 1:1 pixel rendering
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1400px; height: 900px;
    background: #080808;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .scene {
    position: relative;
    width: 1200px;
    height: 760px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* Subtle radial glow behind device */
  .glow {
    position: absolute;
    width: 900px; height: 500px;
    background: radial-gradient(ellipse at center, ${accent}18 0%, transparent 65%);
    border-radius: 50%;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
  }
  /* MacBook lid */
  .macbook {
    position: relative;
    width: 1060px;
  }
  .lid {
    position: relative;
    width: 1060px;
    height: 580px;
    background: linear-gradient(160deg, #343436 0%, #222224 30%, #1c1c1e 70%, #181818 100%);
    border-radius: 16px 16px 4px 4px;
    border: 1px solid #404042;
    box-shadow:
      0 0 0 1px #0a0a0a,
      0 40px 100px rgba(0,0,0,0.9),
      0 15px 40px rgba(0,0,0,0.7),
      inset 0 1px 0 #5a5a5c,
      inset 0 -1px 0 #111;
    overflow: hidden;
  }
  /* Screen bezel — tight Apple-style */
  .bezel {
    position: absolute;
    inset: 16px 20px 20px 20px;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
    /* Subtle inner shadow to simulate screen depth */
    box-shadow: inset 0 0 0 1px #1a1a1a, inset 0 2px 8px rgba(0,0,0,0.8);
  }
  /* Camera notch */
  .camera {
    position: absolute;
    top: 6px; left: 50%;
    transform: translateX(-50%);
    width: 10px; height: 10px;
    background: #1a1a1a;
    border-radius: 50%;
    border: 1px solid #282828;
    z-index: 10;
  }
  .camera::after {
    content: '';
    position: absolute;
    top: 2px; left: 2px;
    width: 4px; height: 4px;
    background: #0d0d0d;
    border-radius: 50%;
  }
  /* Screenshot displayed at 1:1 — clips naturally */
  .screen-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top left;
    display: block;
  }
  /* Subtle screen glare/reflection */
  .bezel::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 30%;
    background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%);
    pointer-events: none;
    z-index: 2;
    border-radius: 8px 8px 0 0;
  }
  /* MacBook base/trackpad */
  .base {
    position: relative;
    width: 1060px;
    height: 24px;
    background: linear-gradient(180deg, #2a2a2c 0%, #1e1e20 50%, #161618 100%);
    border-radius: 0 0 10px 10px;
    border: 1px solid #333335;
    border-top: 1px solid #111;
    box-shadow:
      0 15px 50px rgba(0,0,0,0.9),
      0 5px 20px rgba(0,0,0,0.6),
      inset 0 1px 0 rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* Hinge gap */
  .hinge {
    width: 300px;
    height: 4px;
    background: #0a0a0a;
    border-radius: 0 0 3px 3px;
    position: absolute;
    top: 0;
  }
  /* Bottom rubber feet */
  .feet {
    display: flex;
    justify-content: space-between;
    padding: 0 80px;
    width: 1060px;
  }
  .foot {
    width: 60px; height: 5px;
    background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
    border-radius: 0 0 5px 5px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.6);
  }
</style>
</head>
<body>
  <div class="scene">
    <div class="glow"></div>
    <div class="macbook">
      <div class="lid">
        <div class="camera"></div>
        <div class="bezel">
          <img class="screen-img" src="data:image/png;base64,${b64}" />
        </div>
      </div>
      <div class="base">
        <div class="hinge"></div>
      </div>
      <div class="feet">
        <div class="foot"></div>
        <div class="foot"></div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function iphoneMockupHtml(screenshotPath, accent) {
  const imgData = fs.readFileSync(screenshotPath);
  const b64 = imgData.toString('base64');
  
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 900px; height: 900px;
    background: #080808;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .scene {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .glow {
    position: absolute;
    width: 400px; height: 600px;
    background: radial-gradient(ellipse at center, ${accent}20 0%, transparent 70%);
    border-radius: 50%;
  }
  .phone {
    position: relative;
    width: 280px;
    height: 580px;
    background: linear-gradient(180deg, #2a2a2c 0%, #1c1c1e 100%);
    border-radius: 46px;
    border: 1px solid #3a3a3c;
    box-shadow:
      0 0 0 1px #111,
      0 40px 100px rgba(0,0,0,0.9),
      0 15px 40px rgba(0,0,0,0.6),
      inset 0 1px 0 #4a4a4c;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* Dynamic island */
  .island {
    position: absolute;
    top: 14px; left: 50%;
    transform: translateX(-50%);
    width: 90px; height: 28px;
    background: #000;
    border-radius: 20px;
    z-index: 10;
  }
  .screen {
    position: absolute;
    inset: 12px;
    background: #0a0a0a;
    border-radius: 36px;
    overflow: hidden;
  }
  .screen-img {
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: top center;
  }
  /* Side buttons */
  .btn-right {
    position: absolute;
    right: -3px; top: 160px;
    width: 4px; height: 80px;
    background: #2a2a2c;
    border-radius: 0 4px 4px 0;
  }
  .btn-left-1 {
    position: absolute;
    left: -3px; top: 120px;
    width: 4px; height: 36px;
    background: #2a2a2c;
    border-radius: 4px 0 0 4px;
  }
  .btn-left-2 {
    position: absolute;
    left: -3px; top: 170px;
    width: 4px; height: 60px;
    background: #2a2a2c;
    border-radius: 4px 0 0 4px;
  }
  .btn-left-3 {
    position: absolute;
    left: -3px; top: 244px;
    width: 4px; height: 60px;
    background: #2a2a2c;
    border-radius: 4px 0 0 4px;
  }
</style>
</head>
<body>
  <div class="scene">
    <div class="glow"></div>
    <div class="phone">
      <div class="island"></div>
      <div class="screen">
        <img class="screen-img" src="data:image/png;base64,${b64}" />
      </div>
      <div class="btn-right"></div>
      <div class="btn-left-1"></div>
      <div class="btn-left-2"></div>
      <div class="btn-left-3"></div>
    </div>
  </div>
</body>
</html>`;
}

// ─── Main Pipeline ────────────────────────────────────────────────────────────

async function run() {
  const browser = await chromium.launch();
  
  // Helper: screenshot an HTML string at given viewport
  async function shotHtml(htmlContent, outPath, width, height) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height });
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 95 });
    await page.close();
    console.log(`  ✓ ${path.basename(outPath)}`);
  }
  
  // Helper: screenshot a real HTML file at given scroll position
  async function shotFile(filePath, outPath, width, height, scrollY = 0) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height });
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });
    if (scrollY > 0) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(300);
    }
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 95 });
    await page.close();
    console.log(`  ✓ ${path.basename(outPath)} (scrollY=${scrollY})`);
  }

  // Helper: screenshot an HTML string to file
  async function shotHtmlFile(htmlContent, outPath, width, height) {
    const tmpPath = `/tmp/mockup-${Date.now()}.html`;
    fs.writeFileSync(tmpPath, htmlContent);
    const page = await browser.newPage();
    await page.setViewportSize({ width, height });
    await page.goto(`file://${tmpPath}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 95 });
    await page.close();
    fs.unlinkSync(tmpPath);
    console.log(`  ✓ ${path.basename(outPath)}`);
  }

  // ── Process products WITH HTML files ──────────────────────────────────────
  for (const product of PRODUCTS) {
    console.log(`\n▶ ${product.name}`);
    const htmlPath = path.join(BASE, product.html);
    const imgDir = path.join(BASE, 'businesses', product.id, 'images');
    const shotDir = path.join(BASE, 'assets/screenshots');
    fs.mkdirSync(imgDir, { recursive: true });

    // Get page height at the exact screen viewport size
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1020, height: 544 });
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.close();

    // MacBook screen area: lid 1060px wide, bezel inset 20px each side = 1020px wide
    // lid 580px tall, bezel inset 16px top + 20px bottom = 544px tall
    // Screenshot at EXACTLY these dims → 1:1 pixel rendering in mockup = readable text
    const SCREEN_W = 1020;
    const SCREEN_H = 544;

    // 1. Hero screenshot (top of page)
    const heroPath = path.join(shotDir, `${product.id}-hero.png`);
    await shotFile(htmlPath, heroPath, SCREEN_W, SCREEN_H, 0);

    // 2. Feature-1 screenshot (30% down)
    const feat1Path = path.join(shotDir, `${product.id}-feat1.png`);
    const scroll1 = Math.floor(pageHeight * 0.28);
    await shotFile(htmlPath, feat1Path, SCREEN_W, SCREEN_H, scroll1);

    // 3. Feature-2 screenshot (60% down)
    const feat2Path = path.join(shotDir, `${product.id}-feat2.png`);
    const scroll2 = Math.floor(pageHeight * 0.55);
    await shotFile(htmlPath, feat2Path, SCREEN_W, SCREEN_H, scroll2);

    // Also screenshot at mobile viewport for iPhone mockup
    const mobilePath = path.join(shotDir, `${product.id}-mobile.png`);
    await shotFile(htmlPath, mobilePath, 390, 844, 0);

    // 4. Cover (HTML/CSS card)
    const coverPath = path.join(imgDir, 'cover.jpg');
    await shotHtml(coverHtml(product), coverPath, 1200, 630);

    // 5. Social (square)
    const socialPath = path.join(imgDir, 'social.jpg');
    await shotHtml(socialHtml(product), socialPath, 1080, 1080);

    // 6. Preview = MacBook mockup with hero screenshot
    const macbookHtml = macbookMockupHtml(heroPath, product.accent);
    const previewPath = path.join(imgDir, 'preview.jpg');
    await shotHtmlFile(macbookHtml, previewPath, 1400, 900);

    // 7. Feature-1 = MacBook with feat1 screenshot
    const feat1MockupHtml = macbookMockupHtml(feat1Path, product.accent);
    const feature1Path = path.join(imgDir, 'feature-1.jpg');
    await shotHtmlFile(feat1MockupHtml, feature1Path, 1400, 900);

    // 8. Feature-2 = iPhone mockup with mobile screenshot
    const iphoneHtml = iphoneMockupHtml(mobilePath, product.accent);
    const feature2Path = path.join(imgDir, 'feature-2.jpg');
    await shotHtmlFile(iphoneHtml, feature2Path, 900, 900);
  }

  // ── Process simple products (no HTML) ─────────────────────────────────────
  for (const product of SIMPLE_PRODUCTS) {
    console.log(`\n▶ ${product.name} (cover only)`);
    const imgDir = path.join(BASE, 'businesses', product.id, 'images');
    fs.mkdirSync(imgDir, { recursive: true });

    // Cover
    const coverPath = path.join(imgDir, 'cover.jpg');
    await shotHtml(coverHtml(product), coverPath, 1200, 630);

    // Social
    const socialPath = path.join(imgDir, 'social.jpg');
    await shotHtml(socialHtml(product), socialPath, 1080, 1080);

    // Generate a minimal "coming soon" screen for device mockups
    const comingSoonHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1440px; height: 900px;
    background: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  .name {
    font-size: 180px;
    font-weight: 900;
    letter-spacing: -10px;
    color: ${product.accent};
    font-style: italic;
    opacity: 0.3;
  }
</style>
</head>
<body>
  <div class="name">${product.name}</div>
</body>
</html>`;

    const shotPath = `/tmp/${product.id}-placeholder.png`;
    await shotHtml(comingSoonHtml, shotPath, 1440, 900);

    const previewHtml = macbookMockupHtml(shotPath, product.accent);
    await shotHtmlFile(previewHtml, path.join(imgDir, 'preview.jpg'), 1400, 900);

    const feat1Html = macbookMockupHtml(shotPath, product.accent);
    await shotHtmlFile(feat1Html, path.join(imgDir, 'feature-1.jpg'), 1400, 900);

    const mobileShot = `/tmp/${product.id}-mobile.png`;
    const mobileHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 390px; height: 844px;
    background: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .name {
    font-size: 72px;
    font-weight: 900;
    letter-spacing: -4px;
    color: ${product.accent};
    font-style: italic;
    opacity: 0.3;
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }
</style>
</head>
<body>
  <div class="name">${product.name}</div>
</body>
</html>`;
    await shotHtml(mobileHtml, mobileShot, 390, 844);

    const feat2MHtml = iphoneMockupHtml(mobileShot, product.accent);
    await shotHtmlFile(feat2MHtml, path.join(imgDir, 'feature-2.jpg'), 900, 900);
  }

  await browser.close();
  console.log('\n✅ All mockups generated.');
}

run().catch(err => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
