const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/Users/kikai/clawd/projects/micro-businesses/assets/final-covers';

const products = [
  {
    id: 'vessel',
    name: 'VESSEL',
    price: '$47',
    subtitle: "The Crypto Creator's Writing OS",
    accent: '#D4891A',
    accentLight: '#F5A832',
    tagline: 'From idea to audience. In one space.',
    category: 'WRITING SYSTEM',
    features: [
      { icon: '✍️', title: 'Capture Everything', desc: 'Ideas, drafts, research — one home' },
      { icon: '🔄', title: 'Workflow Templates', desc: 'Pre-built flows for every content type' },
      { icon: '📤', title: 'Publish Ready', desc: 'Format once, post everywhere' },
      { icon: '🧠', title: 'Second Brain', desc: 'Your crypto knowledge, organized' },
    ],
    inside: [
      { label: 'Writing OS Template', value: 'Notion workspace setup' },
      { label: 'Content Database', value: '50+ categorized prompts' },
      { label: 'Publish Checklist', value: 'Platform-by-platform guide' },
      { label: 'Swipe File', value: '30 high-performing crypto posts' },
      { label: 'Video Walkthrough', value: '45 min setup guide' },
    ]
  },
  {
    id: 'draft',
    name: 'DRAFT',
    price: '$39',
    subtitle: '90-Day Crypto Content Templates',
    accent: '#F5C518',
    accentLight: '#FFD740',
    tagline: '90 days of content. Already written.',
    category: 'CONTENT TEMPLATES',
    features: [
      { icon: '📅', title: '90-Day Calendar', desc: 'Daily content schedule, pre-planned' },
      { icon: '📝', title: '270 Templates', desc: '3 variations per day, every format' },
      { icon: '🎯', title: 'Crypto-Native', desc: 'Built for Web3 audiences' },
      { icon: '⚡', title: 'Copy-Paste Ready', desc: 'Post in under 5 minutes' },
    ],
    inside: [
      { label: 'Template Library', value: '270 ready-to-post templates' },
      { label: 'Content Calendar', value: '90-day planned schedule' },
      { label: 'Hook Swipe File', value: '100 proven opening lines' },
      { label: 'Platform Guide', value: 'Twitter, Farcaster, Lens' },
      { label: 'Engagement Scripts', value: 'Reply frameworks' },
    ]
  },
  {
    id: 'stack',
    name: 'STACK',
    price: '$49',
    subtitle: '100 AI Prompts for Crypto Operators',
    accent: '#00C9A7',
    accentLight: '#00E5BF',
    tagline: '100 prompts. Zero blank page.',
    category: 'AI PROMPTS',
    features: [
      { icon: '🤖', title: '100 Battle-Tested Prompts', desc: 'For every crypto workflow' },
      { icon: '📊', title: 'Research Prompts', desc: 'Deep dive any protocol fast' },
      { icon: '✍️', title: 'Content Prompts', desc: 'Threads, tweets, newsletters' },
      { icon: '🚀', title: 'Launch Prompts', desc: 'Marketing, positioning, GTM' },
    ],
    inside: [
      { label: 'Prompt Categories', value: '10 modules x 10 prompts' },
      { label: 'Research Stack', value: 'Protocol analysis prompts' },
      { label: 'Content Stack', value: 'Writing + editing prompts' },
      { label: 'Ops Stack', value: 'Community + growth prompts' },
      { label: 'Chaining Guide', value: 'How to combine prompts' },
    ]
  },
  {
    id: 'blueprint',
    name: 'BLUEPRINT',
    price: '$79',
    subtitle: 'Crypto Brand Identity System',
    accent: '#4361EE',
    accentLight: '#6B81F5',
    tagline: 'Look like a protocol. Not a side project.',
    category: 'BRAND SYSTEM',
    features: [
      { icon: '🎨', title: 'Visual Identity', desc: 'Logo, colors, typography system' },
      { icon: '📣', title: 'Brand Voice', desc: 'Tone guide and messaging framework' },
      { icon: '🖼️', title: 'Asset Templates', desc: 'Banners, PFPs, cover images' },
      { icon: '📋', title: 'Brand Guidelines', desc: 'One doc, every rule' },
    ],
    inside: [
      { label: 'Brand Workbook', value: '50-page identity guide' },
      { label: 'Figma Templates', value: '40+ design assets' },
      { label: 'Color System', value: 'Web3-native palettes' },
      { label: 'Typography Guide', value: 'Font stack + usage rules' },
      { label: 'Launch Kit', value: 'First 30 days rollout plan' },
    ]
  },
  {
    id: 'ledger',
    name: 'LEDGER',
    price: '$29',
    subtitle: 'Crypto Portfolio Tracker',
    accent: '#00D68F',
    accentLight: '#00F5A5',
    tagline: 'Every trade. Every lesson. One place.',
    category: 'PORTFOLIO TRACKER',
    features: [
      { icon: '📊', title: 'Trade Log', desc: 'Every entry, exit, and P&L' },
      { icon: '📈', title: 'Performance Analytics', desc: 'See what is actually working' },
      { icon: '📓', title: 'Trade Journal', desc: 'Log emotions + lessons' },
      { icon: '🎯', title: 'Goal Tracking', desc: 'Monthly targets and review' },
    ],
    inside: [
      { label: 'Portfolio Dashboard', value: 'Notion + Sheets template' },
      { label: 'Trade Log', value: 'Automated P&L calculations' },
      { label: 'Monthly Review', value: 'Performance analysis template' },
      { label: 'Risk Calculator', value: 'Position sizing tool' },
      { label: 'Tax Export', value: 'CSV-ready format' },
    ]
  },
  {
    id: 'flow',
    name: 'FLOW',
    price: '$47',
    subtitle: 'Community Growth Playbook',
    accent: '#7B2FBE',
    accentLight: '#9B4FDE',
    tagline: 'From 0 to 10K. Step by step.',
    category: 'GROWTH PLAYBOOK',
    features: [
      { icon: '🌱', title: 'Launch Strategy', desc: 'First 100 members blueprint' },
      { icon: '🔥', title: 'Retention System', desc: 'Keep members coming back' },
      { icon: '📢', title: 'Growth Loops', desc: 'Viral mechanics for Web3' },
      { icon: '💎', title: 'Monetization', desc: 'Token + subscription models' },
    ],
    inside: [
      { label: 'Launch Checklist', value: 'Day 1-30 action plan' },
      { label: 'Content Calendar', value: '90 days of community content' },
      { label: 'Engagement Playbook', value: 'Daily activation system' },
      { label: 'Growth Templates', value: 'Announcements, events, AMAs' },
      { label: 'Case Studies', value: '5 communities analyzed' },
    ]
  },
  {
    id: 'pulse',
    name: 'PULSE',
    price: '$37',
    subtitle: 'Crypto Growth Playbook',
    accent: '#FF006E',
    accentLight: '#FF4096',
    tagline: '0 to 45K followers. The system.',
    category: 'GROWTH SYSTEM',
    features: [
      { icon: '📱', title: 'Platform Mastery', desc: 'Twitter, Farcaster, Lens tactics' },
      { icon: '📈', title: 'Growth System', desc: 'Repeatable daily actions' },
      { icon: '🎯', title: 'Niche Positioning', desc: 'Own your corner of crypto' },
      { icon: '🤝', title: 'Network Playbook', desc: 'Collab and co-marketing' },
    ],
    inside: [
      { label: 'Growth Roadmap', value: '0-1K, 1K-10K, 10K+ stages' },
      { label: 'Daily Routine', value: 'The 30-min growth stack' },
      { label: 'Content Strategy', value: 'Pillar content system' },
      { label: 'Analytics Guide', value: 'What to track and when' },
      { label: 'Network Map', value: 'Key accounts to engage' },
    ]
  },
  {
    id: 'forge',
    name: 'FORGE',
    price: '$59',
    subtitle: 'Web3 Startup Launch Kit',
    accent: '#FF6B35',
    accentLight: '#FF8C5A',
    tagline: 'Build. Launch. Ship.',
    category: 'LAUNCH KIT',
    features: [
      { icon: '🏗️', title: 'Build Framework', desc: 'From idea to MVP fast' },
      { icon: '🚀', title: 'Launch Playbook', desc: 'Pre-launch to day 30' },
      { icon: '📝', title: 'Pitch Templates', desc: 'Decks, one-pagers, TL;DRs' },
      { icon: '🌐', title: 'Go-to-Market', desc: 'Distribution strategy' },
    ],
    inside: [
      { label: 'Launch Checklist', value: '120-point pre-launch audit' },
      { label: 'Pitch Deck Template', value: '16-slide Web3 framework' },
      { label: 'GTM Playbook', value: 'Week-by-week launch plan' },
      { label: 'Community Kit', value: 'Discord setup + growth' },
      { label: 'PR Templates', value: 'Announcement + outreach' },
    ]
  }
];

function makeHeroHTML(p, width, height) {
  const isSquare = width === 1080;
  const nameFontSize = isSquare ? 160 : 140;
  const subtitleFontSize = isSquare ? 22 : 20;
  const taglineFontSize = isSquare ? 26 : 24;
  const categoryFontSize = isSquare ? 13 : 12;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${width}px;
    height: ${height}px;
    background: #0A0A0A;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    overflow: hidden;
    position: relative;
  }
  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .bg-glow {
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, ${p.accent}22 0%, transparent 70%);
    right: -100px;
    bottom: -100px;
  }
  .bg-glow-2 {
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, ${p.accent}11 0%, transparent 70%);
    left: -50px;
    top: -50px;
  }
  .content {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: ${isSquare ? '56px' : '48px 64px'};
  }
  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .category {
    font-size: ${categoryFontSize}px;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: ${p.accent};
    text-transform: uppercase;
    border: 1px solid ${p.accent}66;
    padding: 6px 14px;
    border-radius: 4px;
  }
  .price {
    font-size: ${categoryFontSize + 2}px;
    font-weight: 700;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.1em;
  }
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: ${isSquare ? '20px 0' : '10px 0'};
  }
  .product-name {
    font-size: ${nameFontSize}px;
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 0.9;
    background: linear-gradient(135deg, #FFFFFF 0%, ${p.accentLight} 60%, ${p.accent} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: ${isSquare ? '20px' : '16px'};
  }
  .accent-bar {
    width: 60px;
    height: 4px;
    background: ${p.accent};
    margin-bottom: ${isSquare ? '24px' : '20px'};
    border-radius: 2px;
  }
  .subtitle {
    font-size: ${subtitleFontSize}px;
    font-weight: 400;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.08em;
    margin-bottom: ${isSquare ? '14px' : '12px'};
    text-transform: uppercase;
  }
  .tagline {
    font-size: ${taglineFontSize}px;
    font-weight: 700;
    color: rgba(255,255,255,0.9);
    line-height: 1.3;
    max-width: 600px;
  }
  .bottom-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${p.accent};
  }
  .brand {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.25);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
</style>
</head>
<body>
<div class="bg-grid"></div>
<div class="bg-glow"></div>
<div class="bg-glow-2"></div>
<div class="content">
  <div class="top-row">
    <div class="category">${p.category}</div>
    <div class="price">${p.price}</div>
  </div>
  <div class="main">
    <div class="product-name">${p.name}</div>
    <div class="accent-bar"></div>
    <div class="subtitle">${p.subtitle}</div>
    <div class="tagline">${p.tagline}</div>
  </div>
  <div class="bottom-row">
    <div class="dot"></div>
    <div class="brand">Digital Product</div>
  </div>
</div>
</body>
</html>`;
}

function makeFeatures1HTML(p) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1280px;
    height: 720px;
    background: #0A0A0A;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    overflow: hidden;
    position: relative;
  }
  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .accent-line {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${p.accent}, ${p.accentLight}, transparent);
  }
  .content {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 56px 72px;
    gap: 40px;
  }
  .header {
    display: flex;
    align-items: baseline;
    gap: 20px;
  }
  .product-name {
    font-size: 52px;
    font-weight: 900;
    letter-spacing: -0.03em;
    color: ${p.accent};
  }
  .header-tag {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
  }
  .section-title {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    flex: 1;
  }
  .feature-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    overflow: hidden;
  }
  .feature-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px;
    height: 100%;
    background: ${p.accent};
    opacity: 0.6;
  }
  .feature-icon {
    font-size: 28px;
    line-height: 1;
  }
  .feature-title {
    font-size: 20px;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: -0.01em;
  }
  .feature-desc {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255,255,255,0.5);
    line-height: 1.5;
  }
</style>
</head>
<body>
<div class="bg-grid"></div>
<div class="accent-line"></div>
<div class="content">
  <div class="header">
    <div class="product-name">${p.name}</div>
    <div class="header-tag">Key Features</div>
  </div>
  <div class="section-title">What you get</div>
  <div class="features-grid">
    ${p.features.map(f => `
    <div class="feature-card">
      <div class="feature-icon">${f.icon}</div>
      <div class="feature-title">${f.title}</div>
      <div class="feature-desc">${f.desc}</div>
    </div>`).join('')}
  </div>
</div>
</body>
</html>`;
}

function makeFeatures2HTML(p) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1280px;
    height: 720px;
    background: #0A0A0A;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    overflow: hidden;
    position: relative;
  }
  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .bg-glow {
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, ${p.accent}18 0%, transparent 70%);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .content {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    gap: 80px;
    padding: 56px 72px;
    align-items: center;
  }
  .left {
    flex: 0 0 300px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: ${p.accent};
    text-transform: uppercase;
  }
  .product-name {
    font-size: 72px;
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 0.9;
    color: #FFFFFF;
  }
  .divider {
    width: 48px;
    height: 3px;
    background: ${p.accent};
    border-radius: 2px;
  }
  .tagline {
    font-size: 18px;
    font-weight: 600;
    color: rgba(255,255,255,0.6);
    line-height: 1.4;
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .section-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.25em;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .inside-item {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 8px;
    gap: 16px;
  }
  .item-num {
    font-size: 11px;
    font-weight: 700;
    color: ${p.accent};
    opacity: 0.7;
    min-width: 20px;
    font-variant-numeric: tabular-nums;
  }
  .item-label {
    font-size: 15px;
    font-weight: 600;
    color: #FFFFFF;
    flex: 1;
  }
  .item-value {
    font-size: 13px;
    font-weight: 400;
    color: rgba(255,255,255,0.4);
  }
  .item-arrow {
    color: ${p.accent};
    font-size: 14px;
    opacity: 0.6;
  }
</style>
</head>
<body>
<div class="bg-grid"></div>
<div class="bg-glow"></div>
<div class="content">
  <div class="left">
    <div class="label">${p.category}</div>
    <div class="product-name">${p.name}</div>
    <div class="divider"></div>
    <div class="tagline">${p.tagline}</div>
  </div>
  <div class="right">
    <div class="section-label">What's Inside</div>
    ${p.inside.map((item, i) => `
    <div class="inside-item">
      <div class="item-num">0${i+1}</div>
      <div class="item-label">${item.label}</div>
      <div class="item-value">${item.value}</div>
      <div class="item-arrow">arrow</div>
    </div>`).join('')}
  </div>
</div>
</body>
</html>`;
}

async function generateImages() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const p of products) {
    console.log(`\nGenerating ${p.id}...`);
    const page = await browser.newPage();

    // 1. Hero 1280x720
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
    await page.setContent(makeHeroHTML(p, 1280, 720), { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: `${OUTPUT_DIR}/${p.id}-01-hero.jpg`, type: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: 1280, height: 720 } });
    console.log(`  hero done`);

    // 2. Features panel
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
    await page.setContent(makeFeatures1HTML(p), { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: `${OUTPUT_DIR}/${p.id}-02-features.jpg`, type: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: 1280, height: 720 } });
    console.log(`  features done`);

    // 3. Inside panel
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
    await page.setContent(makeFeatures2HTML(p), { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: `${OUTPUT_DIR}/${p.id}-03-inside.jpg`, type: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: 1280, height: 720 } });
    console.log(`  inside done`);

    // 4. Square 1080x1080
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
    await page.setContent(makeHeroHTML(p, 1080, 1080), { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: `${OUTPUT_DIR}/${p.id}-04-square.jpg`, type: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
    console.log(`  square done`);

    await page.close();
  }

  await browser.close();
  console.log('\nAll 32 images generated!');
}

generateImages().catch(console.error);
