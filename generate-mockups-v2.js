/**
 * generate-mockups-v2.js
 * Professional product imagery pipeline — real content, varied compositions, editorial quality
 * 
 * 5 image types per product:
 * 1. cover.jpg (1200x630) — pure typography/brand, NO device, editorial
 * 2. preview.jpg (1200x630) — MacBook at perspective angle, gradient glow bg
 * 3. feature-1.jpg (1200x630) — zoomed-in actual product content (readable templates/prompts)
 * 4. feature-2.jpg (1200x630) — iPhone frame OR multi-pane composition
 * 5. social.jpg (1080x1080) — square, bold, impact-first
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = '/Users/kikai/clawd/projects/micro-businesses';

// ─── Product Definitions ──────────────────────────────────────────────────────
// Each product has: brand colors, key content excerpts for feature images,
// and composition style hints

const PRODUCTS = [
  {
    id: '01-vessel',
    name: 'VESSEL',
    tagline: 'Token Launch Toolkit',
    subtitle: 'Carry your culture from day one.',
    accent: '#B7922A',
    accentDark: '#8B6A1A',
    accentLight: '#D4A832',
    bg: '#0D0D0D',
    coverLayout: 'A', // Large centered, geometric grid lines
    coverShape: 'circle',
    stat: '100-point\nLaunch Checklist',
    statSub: 'Nothing launches without it',
    featureContent: {
      title: 'LAUNCH CHECKLIST — PRE-LAUNCH',
      subtitle: 'Section 1 of 4',
      items: [
        { num: '01', text: 'Founding document written', sub: 'What are you building and why? 1-2 pages. Internal only.' },
        { num: '02', text: 'Community Lead named', sub: 'A specific person with a specific mandate. Not "whoever has time."' },
        { num: '03', text: 'Discord/Telegram tested with 5-10 founding members', sub: 'All channels, all automation, all welcome flows.' },
        { num: '04', text: '3 credible accounts aware before launch', sub: 'Not paid shills. People who find it genuinely interesting.' },
        { num: '05', text: 'Contingency plan written for delay', sub: 'What do you post if you push the date? Written out right now.' },
      ]
    },
    feature2Content: {
      title: 'PHASE 1: FOUNDATION',
      timeline: 'Weeks -8 to -4 Before Launch',
      goal: 'Build the container before you fill it.',
      points: [
        'Write your community founding document',
        'Set up channels with 5-10 founding members',
        'Test all automated messages',
        'Designate a named Community Lead',
        'Complete 1 internal event before launch',
      ]
    }
  },
  {
    id: '02-draft',
    name: 'DRAFT',
    tagline: '90 Days of Crypto Content',
    subtitle: 'Post something real.',
    accent: '#F5E642',
    accentDark: '#C4B820',
    accentLight: '#FAF070',
    bg: '#0A0A0A',
    coverLayout: 'B', // Split dark/accent
    coverShape: 'lines',
    stat: '90\nPost Templates',
    statSub: 'Platform-native. Ready to ship.',
    featureContent: {
      title: 'CATEGORY 1: HYPE & LAUNCH',
      subtitle: '20 templates for announcement moments',
      items: [
        { num: '001', text: 'The Launch Drop', sub: '[PROJECT NAME] is live.\n[ONE LINE ON WHAT IT DOES.]\n[LINK]\n\nUsage: Most minimal launch post. Drop it first. Let it breathe.' },
        { num: '002', text: 'The Milestone Post', sub: '[SPECIFIC NUMBER] [UNIT — holders / users / transactions].\n\nWe didn\'t celebrate [SMALLER MILESTONE] publicly. We\'re celebrating this one.\n\nUsage: When you hit a genuine milestone. Specificity is credibility.' },
        { num: '003', text: 'The Countdown', sub: '[X] days until [EVENT/LAUNCH/DROP].\n\nIf you\'ve been watching: you already know.\n\nUsage: Post 3-7 days before a major event.' },
      ]
    },
    feature2Content: {
      title: 'INSIDE THE VAULT',
      categories: [
        { name: 'Hype & Launch', count: '20 templates' },
        { name: 'Community & Culture', count: '15 templates' },
        { name: 'Education & Alpha', count: '20 templates' },
        { name: 'FUD Response', count: '10 templates' },
        { name: 'Milestone Posts', count: '15 templates' },
        { name: 'Thread Frameworks', count: '10 templates' },
      ]
    }
  },
  {
    id: '03-stack',
    name: 'STACK',
    tagline: 'Crypto AI Prompt Vault',
    subtitle: 'Stop prompting. Start producing.',
    accent: '#00FF66',
    accentDark: '#00CC52',
    accentLight: '#33FF88',
    bg: '#080808',
    coverLayout: 'C', // Terminal/grid aesthetic
    coverShape: 'grid',
    stat: '100\nProduction Prompts',
    statSub: 'GPT-4, Claude, Gemini — all work',
    featureContent: {
      title: 'SECTION 1: COMMUNITY MANAGEMENT',
      subtitle: '20 prompts for Discord/Telegram teams',
      items: [
        { num: '001', text: 'New Member Welcome Generator', sub: 'You are the community manager for [PROJECT NAME]. Write a warm, specific welcome message that feels human and personal — not automated. Reference [1-2 SPECIFIC THINGS] about the community.\n\n→ CUSTOMIZE: Add community culture notes for more personalized output.' },
        { num: '002', text: 'FUD Response Framework', sub: 'A member has posted: "[FUD CONTENT]". Write a calm, factual response that: (1) acknowledges the concern, (2) provides evidence, (3) doesn\'t over-explain.\n\n→ CUSTOMIZE: Add project specifics and evidence links.' },
      ]
    },
    feature2Content: {
      title: 'PROMPT CATEGORIES',
      categories: [
        { name: 'Community Management', count: '20 prompts' },
        { name: 'Content Creation', count: '20 prompts' },
        { name: 'Research & Analysis', count: '15 prompts' },
        { name: 'Investor Relations', count: '10 prompts' },
        { name: 'Crisis Management', count: '10 prompts' },
        { name: 'Growth & Outreach', count: '15 prompts' },
        { name: 'Documentation', count: '10 prompts' },
      ]
    }
  },
  {
    id: '04-blueprint',
    name: 'BLUEPRINT',
    tagline: 'Web3 Brand Starter Kit',
    subtitle: 'Build a brand worth believing in.',
    accent: '#C9A84C',
    accentDark: '#9A7A30',
    accentLight: '#E0C066',
    bg: '#0B1221',
    coverLayout: 'D', // Architectural / navy+gold
    coverShape: 'arch',
    stat: 'Complete\nBrand System',
    statSub: 'Identity. Tokens. Design assets.',
    featureContent: {
      title: 'BRAND IDENTITY SYSTEM',
      subtitle: 'Module 1 of 6 — Foundation',
      items: [
        { num: 'NAMING', text: 'Project Name Framework', sub: 'Test: Is it memorable in 5 seconds? Can it be said aloud without confusion? Does it survive translation to three languages? Is the .com (or .xyz) available?' },
        { num: 'COLOR', text: 'Primary Palette Architecture', sub: 'Rule of 3: One dominant (60%), one secondary (30%), one accent (10%). Your accent color is the one people remember. Choose it deliberately.' },
        { num: 'TYPE', text: 'Typography Stack', sub: 'Headline: Weight and personality. Body: Invisible — it just carries information. Mono: For addresses, code, technical data. Three typefaces maximum.' },
      ]
    },
    feature2Content: {
      title: 'KIT CONTENTS',
      categories: [
        { name: 'Brand Identity System', count: '6 modules' },
        { name: 'Token Design Templates', count: '12 templates' },
        { name: 'Social Media Kit', count: '24 assets' },
        { name: 'Discord Server Setup', count: '8 templates' },
        { name: 'Website Copy Framework', count: '5 sections' },
        { name: 'Launch Announcement Pack', count: '10 templates' },
      ]
    }
  },
  {
    id: '05-ledger',
    name: 'LEDGER',
    tagline: 'Crypto Portfolio Tracker',
    subtitle: 'Your portfolio. Your proof.',
    accent: '#3FFFA8',
    accentDark: '#00CC80',
    accentLight: '#66FFBB',
    bg: '#1C1C1E',
    coverLayout: 'E', // Data/table aesthetic
    coverShape: 'bars',
    stat: 'Track Every\nPosition',
    statSub: 'P&L. Conviction. Decision journal.',
    featureContent: {
      title: 'PORTFOLIO DATABASE',
      subtitle: 'Notion-ready. 22 tracked fields.',
      items: [
        { num: 'TRACK', text: 'Core Position Fields', sub: 'Token Name · Ticker · Chain · Category · Quantity · Avg Buy Price · Current Price · Current Value (USD) · Unrealized P&L ($) · Unrealized P&L (%) · Portfolio Weight' },
        { num: 'MANAGE', text: 'Decision Framework Fields', sub: 'Thesis (1-2 sentence investment case) · Conviction Level (1-5) · Risk Level (Low/Medium/High/Degen) · Target Price · Stop Level · Entry Date' },
        { num: 'REVIEW', text: 'Pre-built Portfolio Views', sub: 'Active Holdings (default) · By Category · By Risk Level · Gains & Losses · Needs Review (stale prices) · Full History' },
      ]
    },
    feature2Content: {
      title: 'TRADE LOG ENTRY',
      trade: {
        token: 'SOL',
        action: 'BUY',
        price: '$142.00',
        qty: '25',
        value: '$3,550',
        thesis: 'Ecosystem growth + Firedancer upgrade. High conviction DCA position.',
        conviction: 4,
        risk: 'Medium',
        target: '$280',
        stop: '$90',
      }
    }
  },
  {
    id: '06-flow',
    name: 'FLOW',
    tagline: 'Community Growth Bible',
    subtitle: "Build a community that can't stop talking about you.",
    accent: '#FFB347',
    accentDark: '#CC8A20',
    accentLight: '#FFC870',
    bg: '#0C0A08',
    coverLayout: 'A',
    coverShape: 'wave',
    stat: '0 → 10K\nMember Playbook',
    statSub: 'Real tactics. No fluff.',
    featureContent: {
      title: 'THE 5-PHASE FRAMEWORK',
      subtitle: 'From zero to 10,000 engaged members',
      items: [
        { num: '01', text: 'Foundation — Weeks -8 to -4', sub: 'Build the container before you fill it. Write your founding document. Recruit 5-10 founding members. Run 1 internal event.' },
        { num: '02', text: 'Seeding — Weeks -4 to -1', sub: 'Find people who join because they believe, not because they\'re farming an airdrop. Application process. Founding member designation.' },
        { num: '03', text: 'Activation — Week 0 to Month 1', sub: 'Your public launch. Everything from Phases 1-2 determines how this lands. Community Lead runs every event personally.' },
        { num: '04', text: 'Momentum — Months 2-4', sub: 'Daily presence from the team. Weekly events minimum. Monthly milestone celebration. Culture before growth.' },
        { num: '05', text: 'Scale — Month 5+', sub: 'Delegate to power users. Build moderator team. Install self-sustaining rituals. You stop being the culture — the community is.' },
      ]
    },
    feature2Content: {
      title: 'ENGAGEMENT SYSTEMS',
      categories: [
        { name: 'Daily Activation Rituals', count: '12 frameworks' },
        { name: 'Weekly Event Templates', count: '8 formats' },
        { name: 'Crisis Playbooks', count: '6 scenarios' },
        { name: 'Moderator Training', count: '1 full guide' },
        { name: 'Growth Metrics Dashboard', count: 'Notion-ready' },
        { name: 'Community Health Checklist', count: '30-point audit' },
      ]
    }
  },
  {
    id: '07-pulse',
    name: 'PULSE',
    tagline: 'Crypto Twitter Mastery Pack',
    subtitle: 'Say something worth following.',
    accent: '#00A3FF',
    accentDark: '#007ACC',
    accentLight: '#33B8FF',
    bg: '#060A10',
    coverLayout: 'B',
    coverShape: 'lines',
    stat: '50\nThread Templates',
    statSub: 'Hooks. Formats. Audience systems.',
    featureContent: {
      title: 'HOOK FORMULA VAULT',
      subtitle: '12 proven opening structures',
      items: [
        { num: 'H-01', text: 'The Contrarian Setup', sub: '"Everyone says [CONVENTIONAL WISDOM].\n\nThey\'re wrong.\n\nHere\'s what actually happens when [SPECIFIC SCENARIO]:"\n\nBest for: Technical corrections, myth-busting, alpha.' },
        { num: 'H-02', text: 'The Number Drop', sub: '"[SURPRISING STATISTIC] about [TOPIC].\n\nMost people have no idea this is happening.\n\nBreaking it down 🧵"\n\nBest for: Data reveals, market analysis, ecosystem stats.' },
        { num: 'H-03', text: 'The Stakes Frame', sub: '"In [TIMEFRAME], [THING] will either [GOOD OUTCOME] or [BAD OUTCOME].\n\nHere\'s how to tell which one is coming:"\n\nBest for: Market calls, ecosystem predictions, turning points.' },
      ]
    },
    feature2Content: {
      title: 'CONTENT CALENDAR SYSTEM',
      categories: [
        { name: 'Daily Tweet Templates', count: '30 templates' },
        { name: 'Thread Frameworks', count: '20 structures' },
        { name: 'Hook Formulas', count: '12 proven types' },
        { name: 'Engagement Reply Scripts', count: '15 templates' },
        { name: 'Profile Optimization Guide', count: '1 full guide' },
        { name: '30-Day Growth Sprint', count: 'Day-by-day plan' },
      ]
    }
  },
  {
    id: '08-forge',
    name: 'FORGE',
    tagline: 'Web3 Operations System',
    subtitle: 'Build what lasts.',
    accent: '#FF6B1A',
    accentDark: '#CC4D00',
    accentLight: '#FF8A44',
    bg: '#0A0704',
    coverLayout: 'C',
    coverShape: 'grid',
    stat: 'Complete\nOps Playbook',
    statSub: 'SOPs. Systems. Built for scale.',
    featureContent: {
      title: 'CORE SYSTEMS LIBRARY',
      subtitle: '8 operational domains covered',
      items: [
        { num: 'OPS-1', text: 'Treasury Management SOP', sub: 'Multi-sig setup. Spending authorization levels. Monthly reconciliation process. Emergency procedures. Who can move funds and under what conditions.' },
        { num: 'OPS-2', text: 'Contributor Onboarding System', sub: 'Application to first contribution in 7 days. Role definitions. Access provisioning. First-week checklist. 30-day check-in protocol.' },
        { num: 'OPS-3', text: 'Incident Response Playbook', sub: 'Smart contract exploit. Social engineering attack. Key person departure. Exchange delisting. PR crisis. Six scenarios. All pre-written.' },
      ]
    },
    feature2Content: {
      title: 'WHAT\'S INSIDE',
      categories: [
        { name: 'Treasury & Finance SOPs', count: '6 procedures' },
        { name: 'Team & Contributor Ops', count: '8 templates' },
        { name: 'Incident Response', count: '6 playbooks' },
        { name: 'Governance Frameworks', count: '4 models' },
        { name: 'Legal & Compliance Guides', count: '5 templates' },
        { name: 'Founder\'s Operations Journal', count: '12-month template' },
      ]
    }
  },
];

// ─── HTML Templates ────────────────────────────────────────────────────────────

// COVER: 5 distinct editorial layouts
function coverHtml(product) {
  const { name, tagline, accent, accentLight, bg, coverLayout, coverShape } = product;
  
  const layouts = {
    'A': coverLayoutA(product),
    'B': coverLayoutB(product),
    'C': coverLayoutC(product),
    'D': coverLayoutD(product),
    'E': coverLayoutE(product),
  };
  
  return layouts[coverLayout] || layouts['A'];
}

// Layout A: Large name, diagonal rule, geometric accent circle
function coverLayoutA(p) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1200px; height: 630px; background: ${p.bg}; overflow: hidden; font-family: 'Inter', sans-serif; position: relative; }
    .grid { position: absolute; inset: 0; background-image: linear-gradient(${p.accent}18 1px, transparent 1px), linear-gradient(90deg, ${p.accent}18 1px, transparent 1px); background-size: 60px 60px; }
    .noise { position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); }
    .accent-circle { position: absolute; right: -80px; top: -80px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, ${p.accent}22 0%, transparent 70%); border: 1px solid ${p.accent}33; }
    .accent-circle-2 { position: absolute; right: 60px; bottom: 40px; width: 120px; height: 120px; border-radius: 50%; border: 2px solid ${p.accent}44; }
    .rule { position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, ${p.accent}44, transparent); }
    .content { position: absolute; bottom: 60px; left: 80px; right: 300px; }
    .label { font-size: 11px; font-weight: 600; letter-spacing: 4px; color: ${p.accent}; text-transform: uppercase; margin-bottom: 24px; }
    .name { font-family: 'Playfair Display', serif; font-size: 120px; font-weight: 900; color: #ffffff; line-height: 0.85; letter-spacing: -4px; }
    .tagline { font-size: 18px; font-weight: 300; color: rgba(255,255,255,0.5); margin-top: 20px; letter-spacing: 1px; }
    .top-right { position: absolute; top: 50px; right: 80px; text-align: right; }
    .index { font-size: 80px; font-weight: 900; color: ${p.accent}11; letter-spacing: -3px; font-family: 'Inter', sans-serif; }
    .cat-tag { display: inline-block; border: 1px solid ${p.accent}55; color: ${p.accent}; font-size: 10px; font-weight: 600; letter-spacing: 3px; padding: 6px 14px; text-transform: uppercase; }
  </style></head><body>
  <div class="grid"></div>
  <div class="noise"></div>
  <div class="accent-circle"></div>
  <div class="accent-circle-2"></div>
  <div class="rule"></div>
  <div class="top-right">
    <div class="index">${p.name.substring(0,1)}</div>
    <div class="cat-tag">Digital Product</div>
  </div>
  <div class="content">
    <div class="label">${p.tagline}</div>
    <div class="name">${p.name}</div>
    <div class="tagline">${p.subtitle}</div>
  </div>
  </body></html>`;
}

// Layout B: Split — left accent color block, right dark with text
function coverLayoutB(p) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1200px; height: 630px; overflow: hidden; font-family: 'Inter', sans-serif; display: flex; }
    .left { width: 380px; background: ${p.accent}; position: relative; display: flex; align-items: flex-end; padding: 50px; flex-shrink: 0; }
    .left-name { font-family: 'Playfair Display', serif; font-size: 72px; font-weight: 900; color: ${p.bg}; line-height: 0.85; letter-spacing: -2px; writing-mode: vertical-rl; transform: rotate(180deg); }
    .left-line { position: absolute; top: 50px; left: 50px; width: 2px; height: 80px; background: ${p.bg}88; }
    .right { flex: 1; background: ${p.bg}; padding: 60px; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
    .right-top { }
    .product-label { font-size: 10px; font-weight: 700; letter-spacing: 5px; color: ${p.accent}88; text-transform: uppercase; margin-bottom: 40px; }
    .tagline { font-size: 42px; font-weight: 700; color: #ffffff; line-height: 1.1; letter-spacing: -1px; max-width: 500px; }
    .tagline em { color: ${p.accent}; font-style: normal; }
    .right-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
    .subtitle { font-size: 16px; color: rgba(255,255,255,0.4); font-weight: 300; }
    .grid-lines { position: absolute; right: 0; top: 0; bottom: 0; width: 200px; background-image: linear-gradient(${p.accent}15 1px, transparent 1px); background-size: 100% 60px; }
    .badge { border: 1px solid ${p.accent}40; color: ${p.accent}; font-size: 10px; font-weight: 600; letter-spacing: 3px; padding: 8px 16px; text-transform: uppercase; }
  </style></head><body>
  <div class="left">
    <div class="left-line"></div>
    <div class="left-name">${p.name}</div>
  </div>
  <div class="right">
    <div class="grid-lines"></div>
    <div class="right-top">
      <div class="product-label">${p.tagline} — Digital Product</div>
      <div class="tagline">${p.subtitle.replace(/(\w+\.)/, '<em>$1</em>')}</div>
    </div>
    <div class="right-bottom">
      <div class="subtitle">${p.stat.replace('\n', ' — ')}</div>
      <div class="badge">Preview Inside</div>
    </div>
  </div>
  </body></html>`;
}

// Layout C: Terminal / monospace grid aesthetic
function coverLayoutC(p) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1200px; height: 630px; background: ${p.bg}; overflow: hidden; font-family: 'JetBrains Mono', monospace; position: relative; }
    .scanlines { position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, ${p.accent}05 2px, ${p.accent}05 4px); pointer-events: none; }
    .glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 400px; background: radial-gradient(ellipse, ${p.accent}15 0%, transparent 70%); }
    .header { position: absolute; top: 50px; left: 80px; right: 80px; display: flex; justify-content: space-between; align-items: center; }
    .prompt { color: ${p.accent}; font-size: 12px; }
    .cursor { display: inline-block; width: 8px; height: 14px; background: ${p.accent}; vertical-align: middle; animation: blink 1s step-end infinite; }
    .main { position: absolute; top: 50%; left: 80px; transform: translateY(-50%); }
    .slash { font-size: 160px; font-weight: 700; color: ${p.accent}10; position: absolute; left: -20px; top: -60px; line-height: 1; }
    .name { font-size: 100px; font-weight: 700; color: ${p.accent}; line-height: 0.9; letter-spacing: -4px; position: relative; z-index: 1; }
    .tagline-txt { font-size: 20px; color: rgba(255,255,255,0.6); margin-top: 16px; letter-spacing: 1px; }
    .bottom { position: absolute; bottom: 50px; left: 80px; right: 80px; display: flex; justify-content: space-between; border-top: 1px solid ${p.accent}30; padding-top: 20px; }
    .stat-item { color: rgba(255,255,255,0.3); font-size: 11px; letter-spacing: 2px; }
    .stat-item span { color: ${p.accent}; }
  </style></head><body>
  <div class="scanlines"></div>
  <div class="glow"></div>
  <div class="header">
    <div class="prompt">$ ${p.name.toLowerCase()} --initialize<div class="cursor"></div></div>
    <div class="prompt" style="color: rgba(255,255,255,0.3)">v1.0.0</div>
  </div>
  <div class="main">
    <div class="slash">//</div>
    <div class="name">${p.name}</div>
    <div class="tagline-txt">${p.tagline} — ${p.subtitle}</div>
  </div>
  <div class="bottom">
    <div class="stat-item">PRODUCT <span>${p.stat.replace('\n', ' ')}</span></div>
    <div class="stat-item">STATUS <span>READY</span></div>
    <div class="stat-item">FORMAT <span>DIGITAL DOWNLOAD</span></div>
  </div>
  </body></html>`;
}

// Layout D: Architectural / refined, navy + gold lines
function coverLayoutD(p) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1200px; height: 630px; background: ${p.bg}; overflow: hidden; font-family: 'Inter', sans-serif; position: relative; }
    .blueprint-grid { position: absolute; inset: 0; background-image: linear-gradient(${p.accent}12 1px, transparent 1px), linear-gradient(90deg, ${p.accent}12 1px, transparent 1px); background-size: 40px 40px; }
    .blueprint-grid-major { position: absolute; inset: 0; background-image: linear-gradient(${p.accent}20 1px, transparent 1px), linear-gradient(90deg, ${p.accent}20 1px, transparent 1px); background-size: 160px 160px; }
    .frame { position: absolute; inset: 40px; border: 1px solid ${p.accent}55; }
    .frame-corner { position: absolute; width: 20px; height: 20px; }
    .fc-tl { top: -1px; left: -1px; border-top: 2px solid ${p.accent}; border-left: 2px solid ${p.accent}; }
    .fc-tr { top: -1px; right: -1px; border-top: 2px solid ${p.accent}; border-right: 2px solid ${p.accent}; }
    .fc-bl { bottom: -1px; left: -1px; border-bottom: 2px solid ${p.accent}; border-left: 2px solid ${p.accent}; }
    .fc-br { bottom: -1px; right: -1px; border-bottom: 2px solid ${p.accent}; border-right: 2px solid ${p.accent}; }
    .center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; width: 800px; }
    .label { font-size: 10px; font-weight: 600; letter-spacing: 8px; color: ${p.accent}; text-transform: uppercase; margin-bottom: 30px; }
    .rule-line { width: 80px; height: 1px; background: ${p.accent}; margin: 0 auto 30px; }
    .name { font-family: 'Playfair Display', serif; font-size: 110px; font-weight: 900; color: #ffffff; line-height: 0.85; letter-spacing: -3px; }
    .tagline { font-size: 20px; color: rgba(255,255,255,0.45); margin-top: 24px; font-weight: 300; letter-spacing: 3px; }
    .subtitle-gold { font-size: 13px; color: ${p.accent}; font-weight: 600; letter-spacing: 4px; margin-top: 30px; text-transform: uppercase; }
    .side-text { position: absolute; left: 60px; top: 50%; transform: translateY(-50%) rotate(-90deg); transform-origin: center; font-size: 9px; letter-spacing: 6px; color: ${p.accent}44; text-transform: uppercase; white-space: nowrap; }
  </style></head><body>
  <div class="frame">
    <div class="frame-corner fc-tl"></div>
    <div class="frame-corner fc-tr"></div>
    <div class="frame-corner fc-bl"></div>
    <div class="frame-corner fc-br"></div>
  </div>
  <div class="blueprint-grid"></div>
  <div class="blueprint-grid-major"></div>
  <div class="side-text">Digital Product — ${p.tagline}</div>
  <div class="center">
    <div class="label">${p.tagline}</div>
    <div class="rule-line"></div>
    <div class="name">${p.name}</div>
    <div class="tagline">${p.subtitle}</div>
    <div class="subtitle-gold">${p.stat.replace('\n', ' · ')}</div>
  </div>
  </body></html>`;
}

// Layout E: Data/dashboard aesthetic
function coverLayoutE(p) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1200px; height: 630px; background: ${p.bg}; overflow: hidden; font-family: 'Inter', sans-serif; position: relative; }
    .bars { position: absolute; bottom: 0; left: 0; right: 0; height: 300px; display: flex; align-items: flex-end; gap: 4px; padding: 0 40px; opacity: 0.15; }
    .bar { flex: 1; background: ${p.accent}; border-radius: 2px 2px 0 0; }
    .glow { position: absolute; top: 0; left: 0; right: 0; height: 300px; background: radial-gradient(ellipse at 60% -20%, ${p.accent}25 0%, transparent 60%); }
    .header-bar { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, ${p.accent}, ${p.accentLight}, transparent); }
    .content { position: absolute; left: 80px; top: 80px; }
    .tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${p.accent}; letter-spacing: 2px; margin-bottom: 20px; background: ${p.accent}15; padding: 6px 12px; display: inline-block; border-radius: 2px; }
    .name { font-size: 100px; font-weight: 900; color: #ffffff; line-height: 0.85; letter-spacing: -4px; }
    .tagline { font-size: 22px; font-weight: 300; color: rgba(255,255,255,0.5); margin-top: 20px; max-width: 500px; }
    .stats-row { position: absolute; bottom: 70px; left: 80px; right: 80px; display: flex; gap: 60px; }
    .stat { }
    .stat-num { font-size: 32px; font-weight: 900; color: ${p.accent}; font-family: 'JetBrains Mono', monospace; line-height: 1; }
    .stat-label { font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
    .divider { width: 1px; background: ${p.accent}25; align-self: stretch; }
  </style></head><body>
  <div class="header-bar"></div>
  <div class="glow"></div>
  <div class="bars">
    ${[40,65,30,80,55,90,45,70,35,85,50,75,60,95,40,70,55,80,45,65,35,90,50,75,60,85].map(h => `<div class="bar" style="height:${h}%"></div>`).join('')}
  </div>
  <div class="content">
    <div class="tag">${p.tagline.toUpperCase()}</div>
    <div class="name">${p.name}</div>
    <div class="tagline">${p.subtitle}</div>
  </div>
  <div class="stats-row">
    <div class="stat"><div class="stat-num">22</div><div class="stat-label">Tracked Fields</div></div>
    <div class="divider"></div>
    <div class="stat"><div class="stat-num">6</div><div class="stat-label">Portfolio Views</div></div>
    <div class="divider"></div>
    <div class="stat"><div class="stat-num">5+</div><div class="stat-label">Chains Tracked</div></div>
    <div class="divider"></div>
    <div class="stat"><div class="stat-num">∞</div><div class="stat-label">Positions</div></div>
  </div>
  </body></html>`;
}

// PREVIEW: MacBook at perspective angle with actual product content
function previewHtml(product, contentHtml) {
  const { accent, accentLight, bg } = product;
  
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      width: 1200px; height: 630px; 
      background: ${bg};
      overflow: hidden; 
      font-family: 'Inter', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .bg-glow { 
      position: absolute; 
      top: -100px; left: 50%; 
      transform: translateX(-50%);
      width: 900px; height: 600px; 
      background: radial-gradient(ellipse at 50% 30%, ${accent}30 0%, ${accent}08 40%, transparent 70%); 
    }
    .bg-glow-2 { 
      position: absolute; 
      bottom: -200px; right: -100px;
      width: 600px; height: 600px; 
      background: radial-gradient(circle, ${accent}10 0%, transparent 60%); 
    }
    .scene {
      perspective: 1800px;
      position: relative;
      z-index: 2;
      margin-top: -30px;
    }
    .macbook-wrap {
      transform: rotateX(4deg) rotateY(-15deg) rotateZ(-1deg);
      transform-style: preserve-3d;
      filter: drop-shadow(0 60px 80px rgba(0,0,0,0.7)) drop-shadow(0 20px 40px rgba(0,0,0,0.5));
    }
    .macbook {
      position: relative;
      width: 780px;
    }
    .screen-outer {
      background: #1a1a1a;
      border-radius: 16px 16px 4px 4px;
      padding: 12px 12px 8px 12px;
      position: relative;
    }
    .screen-inner {
      background: #0a0a0a;
      border-radius: 8px;
      overflow: hidden;
      width: 756px;
      height: 472px;
      position: relative;
    }
    .notch {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 22px;
      background: #1a1a1a;
      border-radius: 0 0 12px 12px;
      z-index: 10;
    }
    .camera-dot {
      position: absolute;
      top: 5px;
      left: 50%;
      transform: translateX(-50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #333;
    }
    .screen-content {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .base {
      background: linear-gradient(180deg, #2a2a2a 0%, #1d1d1d 60%, #252525 100%);
      height: 16px;
      border-radius: 0 0 6px 6px;
      position: relative;
    }
    .hinge {
      background: #333;
      height: 4px;
      width: 100%;
      position: absolute;
      top: 0;
    }
    .bottom-base {
      background: linear-gradient(180deg, #2a2a2a 0%, #1e1e1e 100%);
      height: 22px;
      border-radius: 0 0 12px 12px;
      position: relative;
    }
    .trackpad-bump {
      position: absolute;
      bottom: 3px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 4px;
      background: rgba(0,0,0,0.2);
      border-radius: 2px;
    }
    .label-area {
      position: absolute;
      left: 80px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 3;
    }
    .product-name { font-size: 13px; font-weight: 700; color: ${accent}; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
    .product-desc { font-size: 28px; font-weight: 700; color: white; line-height: 1.2; max-width: 180px; }
  </style></head><body>
  <div class="bg-glow"></div>
  <div class="bg-glow-2"></div>
  <div class="scene">
    <div class="macbook-wrap">
      <div class="macbook">
        <div class="screen-outer">
          <div class="notch"><div class="camera-dot"></div></div>
          <div class="screen-inner">
            <div class="screen-content">
              ${contentHtml}
            </div>
          </div>
        </div>
        <div class="base"><div class="hinge"></div></div>
        <div class="bottom-base"><div class="trackpad-bump"></div></div>
      </div>
    </div>
  </div>
  </body></html>`;
}

// The content rendered inside the MacBook screen
function macbookScreenContent(product) {
  const { name, tagline, accent, featureContent } = product;
  const items = featureContent.items;
  
  return `
  <div style="background: #0d0d0d; width: 100%; height: 100%; overflow: hidden; padding: 30px 36px; font-family: 'Inter', sans-serif; color: white; position: relative;">
    <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, ${accent}, transparent);"></div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px;">
      <div>
        <span style="font-size: 10px; font-weight: 700; letter-spacing: 3px; color: ${accent}; text-transform: uppercase;">${name}</span>
        <div style="font-size: 18px; font-weight: 800; color: white; margin-top: 4px; letter-spacing: -0.5px;">${featureContent.title}</div>
      </div>
      <div style="font-size: 10px; color: rgba(255,255,255,0.35); letter-spacing: 1px; text-align: right; max-width: 200px;">${featureContent.subtitle}</div>
    </div>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${items.slice(0, 2).map((item, i) => `
      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-left: 3px solid ${accent}${i === 0 ? '' : '88'}; border-radius: 8px; padding: 16px 18px;">
        <div style="display: flex; gap: 14px; align-items: flex-start;">
          <div style="font-size: 11px; font-weight: 800; color: ${accent}; letter-spacing: 1px; min-width: 40px; padding-top: 2px; font-family: monospace;">${item.num}</div>
          <div style="flex: 1;">
            <div style="font-size: 15px; font-weight: 700; color: rgba(255,255,255,0.98); margin-bottom: 6px;">${item.text}</div>
            <div style="font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.5; font-family: monospace;">${item.sub.split('\n')[0].substring(0, 120)}</div>
          </div>
        </div>
      </div>
      `).join('')}
    </div>
    <div style="position: absolute; bottom: 22px; left: 36px; right: 36px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 14px;">
      <div style="font-size: 10px; color: rgba(255,255,255,0.25); letter-spacing: 2px;">DIGITAL PRODUCT · INSTANT DOWNLOAD</div>
      <div style="font-size: 11px; color: ${accent}; letter-spacing: 1px; font-weight: 600;">+ ${items.length - 2} MORE →</div>
    </div>
  </div>`;
}

// FEATURE-1: Zoomed-in actual product content — editorial card layout
function feature1Html(product) {
  const { name, accent, accentLight, bg, featureContent } = product;
  const items = featureContent.items;
  
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      width: 1200px; height: 630px; 
      background: ${bg}; 
      overflow: hidden; 
      font-family: 'Inter', sans-serif;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .bg-dots { position: absolute; inset: 0; background-image: radial-gradient(${accent}20 1px, transparent 1px); background-size: 30px 30px; }
    .bg-fade { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, transparent 30%, ${bg} 80%); }
    .glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 400px; background: radial-gradient(ellipse, ${accent}12 0%, transparent 70%); }
    .container { position: relative; z-index: 2; width: 1080px; }
    .header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; }
    .header-left .eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 4px; color: ${accent}; text-transform: uppercase; margin-bottom: 6px; }
    .header-left .title { font-size: 28px; font-weight: 800; color: white; letter-spacing: -0.5px; }
    .header-right { font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 2px; }
    .cards { display: flex; gap: 16px; }
    .card { 
      flex: 1; 
      background: rgba(255,255,255,0.03); 
      border: 1px solid rgba(255,255,255,0.08); 
      border-radius: 12px; 
      padding: 20px; 
      position: relative;
      overflow: hidden;
    }
    .card-accent { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: ${accent}; }
    .card-num { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: ${accent}; letter-spacing: 2px; margin-bottom: 10px; }
    .card-title { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.95); margin-bottom: 10px; line-height: 1.3; }
    .card-body { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.6; }
    .card-body em { color: ${accent}88; font-style: normal; }
    .footnote { margin-top: 16px; text-align: center; font-size: 9px; color: rgba(255,255,255,0.15); letter-spacing: 3px; text-transform: uppercase; }
  </style></head><body>
  <div class="bg-dots"></div>
  <div class="bg-fade"></div>
  <div class="glow"></div>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <div class="eyebrow">${name} — Inside the Product</div>
        <div class="title">${featureContent.title}</div>
      </div>
      <div class="header-right">${featureContent.subtitle}</div>
    </div>
    <div class="cards">
      ${items.slice(0, 3).map(item => `
      <div class="card">
        <div class="card-accent"></div>
        <div class="card-num">${item.num}</div>
        <div class="card-title">${item.text}</div>
        <div class="card-body">${item.sub.replace(/\n/g, '<br>').replace(/\[([A-Z\s/]+)\]/g, '<em>[$1]</em>')}</div>
      </div>
      `).join('')}
    </div>
    <div class="footnote">${product.tagline} · Digital Product · Instant Download</div>
  </div>
  </body></html>`;
}

// FEATURE-2: iPhone mockup for products with categories, trade view for data products
function feature2Html(product) {
  const { name, accent, accentLight, accentDark, bg, feature2Content } = product;
  
  if (feature2Content.categories) {
    // Category grid — shows what's inside
    return feature2CategoryHtml(product);
  } else if (feature2Content.trade) {
    // Trade log entry — for LEDGER
    return feature2TradeHtml(product);
  } else if (feature2Content.points) {
    // Phase detail — for VESSEL  
    return feature2PhaseHtml(product);
  }
  return feature2CategoryHtml(product);
}

function feature2CategoryHtml(p) {
  const { name, accent, bg, feature2Content } = p;
  const cats = feature2Content.categories || [];
  
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      width: 1200px; height: 630px; 
      background: ${bg}; 
      overflow: hidden; 
      font-family: 'Inter', sans-serif;
      display: flex;
      position: relative;
    }
    .left-panel { 
      width: 420px; 
      background: ${accent}08; 
      border-right: 1px solid ${accent}20;
      padding: 60px 50px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      flex-shrink: 0;
    }
    .left-glow { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse at -20% 50%, ${accent}18 0%, transparent 60%); pointer-events: none; }
    .left-top .eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 4px; color: ${accent}; text-transform: uppercase; margin-bottom: 20px; }
    .left-top .main-title { font-size: 48px; font-weight: 900; color: white; line-height: 0.9; letter-spacing: -2px; margin-bottom: 16px; }
    .left-top .desc { font-size: 16px; color: rgba(255,255,255,0.45); line-height: 1.5; }
    .left-bottom .total-badge { 
      background: ${accent}15; border: 1px solid ${accent}40; 
      padding: 14px 20px; border-radius: 8px;
      font-size: 24px; font-weight: 800; color: ${accent};
    }
    .left-bottom .total-label { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 4px; letter-spacing: 2px; }
    .right-panel { flex: 1; padding: 50px 50px; }
    .section-label { font-size: 10px; font-weight: 700; letter-spacing: 4px; color: rgba(255,255,255,0.3); text-transform: uppercase; margin-bottom: 24px; }
    .cat-list { display: flex; flex-direction: column; gap: 10px; }
    .cat-row { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding: 14px 18px;
      border-radius: 8px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
    }
    .cat-row:first-child { border-left: 2px solid ${accent}; background: rgba(255,255,255,0.05); }
    .cat-name { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.85); }
    .cat-count { font-size: 12px; font-weight: 600; color: ${accent}; letter-spacing: 1px; }
  </style></head><body>
  <div class="left-panel">
    <div class="left-glow"></div>
    <div class="left-top">
      <div class="eyebrow">${p.tagline}</div>
      <div class="main-title">${p.name}</div>
      <div class="desc">${feature2Content.title}</div>
    </div>
    <div class="left-bottom">
      <div class="total-badge">${cats.length} Sections</div>
      <div class="total-label">Everything you need</div>
    </div>
  </div>
  <div class="right-panel">
    <div class="section-label">What's Inside</div>
    <div class="cat-list">
      ${cats.map((c, i) => `
      <div class="cat-row">
        <div class="cat-name">${c.name}</div>
        <div class="cat-count">${c.count}</div>
      </div>`).join('')}
    </div>
  </div>
  </body></html>`;
}

function feature2TradeHtml(p) {
  const t = p.feature2Content.trade;
  const { accent, bg } = p;
  
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1200px; height: 630px; background: ${bg}; overflow: hidden; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; position: relative; }
    .glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-60%); width: 700px; height: 500px; background: radial-gradient(ellipse, ${accent}15 0%, transparent 65%); }
    .panel { position: relative; z-index: 2; width: 1000px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
    .panel-header { background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 20px 28px; display: flex; justify-content: space-between; align-items: center; }
    .panel-title { font-size: 12px; font-weight: 700; letter-spacing: 3px; color: rgba(255,255,255,0.5); text-transform: uppercase; }
    .action-badge { background: ${accent}20; color: ${accent}; font-size: 11px; font-weight: 700; letter-spacing: 2px; padding: 6px 14px; border-radius: 4px; border: 1px solid ${accent}40; }
    .panel-body { display: grid; grid-template-columns: 1fr 1px 1fr 1px 1fr; gap: 0; }
    .col { padding: 28px; }
    .divider { background: rgba(255,255,255,0.06); }
    .field { margin-bottom: 20px; }
    .field-label { font-size: 9px; font-weight: 700; letter-spacing: 3px; color: rgba(255,255,255,0.3); text-transform: uppercase; margin-bottom: 4px; }
    .field-value { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700; color: white; }
    .field-value.green { color: ${accent}; }
    .field-value.accent { color: ${accent}; }
    .field-value.small { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.4; }
    .stars { color: ${accent}; font-size: 16px; letter-spacing: 2px; }
    .footer { border-top: 1px solid rgba(255,255,255,0.06); padding: 16px 28px; display: flex; justify-content: space-between; }
    .footer-item { font-size: 10px; color: rgba(255,255,255,0.25); letter-spacing: 2px; }
    .footer-item span { color: ${accent}; }
  </style></head><body>
  <div class="glow"></div>
  <div class="panel">
    <div class="panel-header">
      <div class="panel-title">${p.name} — Trade Log Entry</div>
      <div class="action-badge">BUY</div>
    </div>
    <div class="panel-body">
      <div class="col">
        <div class="field"><div class="field-label">Token</div><div class="field-value">${t.token}</div></div>
        <div class="field"><div class="field-label">Entry Price</div><div class="field-value">${t.price}</div></div>
        <div class="field"><div class="field-label">Quantity</div><div class="field-value">${t.qty}</div></div>
        <div class="field"><div class="field-label">Total Value</div><div class="field-value green">${t.value}</div></div>
      </div>
      <div class="divider"></div>
      <div class="col">
        <div class="field"><div class="field-label">Investment Thesis</div><div class="field-value small">${t.thesis}</div></div>
        <div class="field"><div class="field-label">Conviction</div><div class="stars">${'★'.repeat(t.conviction)}${'☆'.repeat(5-t.conviction)}</div></div>
        <div class="field"><div class="field-label">Risk Level</div><div class="field-value accent">${t.risk}</div></div>
      </div>
      <div class="divider"></div>
      <div class="col">
        <div class="field"><div class="field-label">Price Target</div><div class="field-value green">${t.target}</div></div>
        <div class="field"><div class="field-label">Stop Level</div><div class="field-value" style="color:rgba(255,100,100,0.8)">${t.stop}</div></div>
        <div class="field"><div class="field-label">Status</div><div class="field-value accent" style="font-size:14px">Active · Watching</div></div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-item">LEDGER · CRYPTO PORTFOLIO TRACKER</div>
      <div class="footer-item">NOTION TEMPLATE · <span>INSTANT ACCESS</span></div>
    </div>
  </div>
  </body></html>`;
}

function feature2PhaseHtml(p) {
  const fc = p.feature2Content;
  const { accent, bg } = p;
  
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1200px; height: 630px; background: ${bg}; overflow: hidden; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; position: relative; }
    .left-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: linear-gradient(180deg, ${accent}, ${accent}00); }
    .content { width: 1000px; position: relative; z-index: 2; }
    .header { margin-bottom: 40px; }
    .eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 4px; color: ${accent}; text-transform: uppercase; margin-bottom: 10px; }
    .main-title { font-size: 40px; font-weight: 900; color: white; letter-spacing: -1.5px; }
    .sub { font-size: 16px; color: rgba(255,255,255,0.4); margin-top: 6px; }
    .points { display: flex; flex-direction: column; gap: 12px; }
    .point { display: flex; align-items: center; gap: 18px; padding: 14px 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; }
    .point-num { width: 28px; height: 28px; border-radius: 50%; background: ${accent}20; border: 1px solid ${accent}60; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: ${accent}; flex-shrink: 0; }
    .point-text { font-size: 15px; color: rgba(255,255,255,0.8); font-weight: 500; }
    .glow { position: absolute; left: -200px; top: 50%; transform: translateY(-50%); width: 600px; height: 400px; background: radial-gradient(circle, ${accent}12 0%, transparent 70%); }
    .footer-bar { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px 100px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; justify-content: space-between; align-items: center; }
    .footer-product { font-size: 11px; color: rgba(255,255,255,0.25); letter-spacing: 3px; text-transform: uppercase; }
    .footer-cta { background: ${accent}; color: ${p.bg}; font-size: 11px; font-weight: 800; letter-spacing: 2px; padding: 10px 22px; border-radius: 4px; }
  </style></head><body>
  <div class="left-bar"></div>
  <div class="glow"></div>
  <div class="content">
    <div class="header">
      <div class="eyebrow">${p.name} — ${p.tagline}</div>
      <div class="main-title">${fc.title}</div>
      <div class="sub">${fc.timeline} · ${fc.goal}</div>
    </div>
    <div class="points">
      ${fc.points.map((pt, i) => `
      <div class="point">
        <div class="point-num">${String(i+1).padStart(2,'0')}</div>
        <div class="point-text">${pt}</div>
      </div>`).join('')}
    </div>
  </div>
  <div class="footer-bar">
    <div class="footer-product">${p.tagline} · Digital Product</div>
    <div class="footer-cta">GET INSTANT ACCESS</div>
  </div>
  </body></html>`;
}

// SOCIAL: Square, bold, impact-first
function socialHtml(product) {
  const { name, tagline, accent, accentLight, accentDark, bg, stat, statSub } = product;
  
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      width: 1080px; height: 1080px; 
      background: ${bg}; 
      overflow: hidden; 
      font-family: 'Inter', sans-serif; 
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 100px;
    }
    .bg-accent { 
      position: absolute; inset: 0; 
      background: radial-gradient(ellipse at 80% 20%, ${accent}20 0%, transparent 60%),
                  radial-gradient(ellipse at 20% 90%, ${accent}10 0%, transparent 50%); 
    }
    .top-line { position: absolute; top: 0; left: 0; right: 0; height: 5px; background: ${accent}; }
    .content { position: relative; z-index: 2; }
    .product-tag { 
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 12px; font-weight: 700; letter-spacing: 4px; color: ${accent}; 
      text-transform: uppercase; margin-bottom: 40px;
    }
    .product-tag::before { content: ''; display: block; width: 24px; height: 2px; background: ${accent}; }
    .stat-block { margin-bottom: 40px; }
    .stat-number { 
      font-family: 'Playfair Display', serif;
      font-size: 140px; font-weight: 900; color: white; 
      line-height: 0.85; letter-spacing: -5px;
      white-space: pre-line;
    }
    .stat-sub { font-size: 24px; color: rgba(255,255,255,0.5); font-weight: 300; margin-top: 24px; letter-spacing: 1px; }
    .bottom { position: absolute; bottom: 80px; left: 100px; right: 100px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; }
    .product-name { font-size: 22px; font-weight: 900; color: white; letter-spacing: 4px; }
    .buy-cta { background: ${accent}; color: ${bg}; font-size: 13px; font-weight: 800; letter-spacing: 2px; padding: 14px 28px; border-radius: 4px; }
  </style></head><body>
  <div class="bg-accent"></div>
  <div class="top-line"></div>
  <div class="content">
    <div class="product-tag">${tagline}</div>
    <div class="stat-block">
      <div class="stat-number">${stat}</div>
      <div class="stat-sub">${statSub}</div>
    </div>
  </div>
  <div class="bottom">
    <div class="product-name">${name}</div>
    <div class="buy-cta">GET IT NOW</div>
  </div>
  </body></html>`;
}

// ─── Main Execution ────────────────────────────────────────────────────────────

async function run() {
  console.log('🎨 generate-mockups-v2.js — Professional Product Imagery Pipeline');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
  
  async function shot(htmlContent, outPath, w, h) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500); // font load
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 96 });
    await page.close();
  }
  
  for (const product of PRODUCTS) {
    const imgDir = path.join(BASE, `businesses/${product.id}/images`);
    if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
    
    console.log(`\n📦 ${product.name} (${product.id})`);
    
    // 1. cover.jpg
    const coverPath = path.join(imgDir, 'cover.jpg');
    await shot(coverHtml(product), coverPath, 1200, 630);
    console.log(`  ✓ cover.jpg`);
    
    // 2. social.jpg
    const socialPath = path.join(imgDir, 'social.jpg');
    await shot(socialHtml(product), socialPath, 1080, 1080);
    console.log(`  ✓ social.jpg`);
    
    // 3. preview.jpg — MacBook at angle with product content
    const screenContent = macbookScreenContent(product);
    const previewHtmlContent = previewHtml(product, screenContent);
    const previewPath = path.join(imgDir, 'preview.jpg');
    await shot(previewHtmlContent, previewPath, 1200, 630);
    console.log(`  ✓ preview.jpg`);
    
    // 4. feature-1.jpg — zoomed content cards
    const feat1Path = path.join(imgDir, 'feature-1.jpg');
    await shot(feature1Html(product), feat1Path, 1200, 630);
    console.log(`  ✓ feature-1.jpg`);
    
    // 5. feature-2.jpg — category list or data view
    const feat2Path = path.join(imgDir, 'feature-2.jpg');
    await shot(feature2Html(product), feat2Path, 1200, 630);
    console.log(`  ✓ feature-2.jpg`);
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ All images generated. Verifying...');
  
  // Verify all outputs exist and have reasonable size
  let allGood = true;
  for (const product of PRODUCTS) {
    const imgDir = path.join(BASE, `businesses/${product.id}/images`);
    for (const img of ['cover.jpg', 'preview.jpg', 'feature-1.jpg', 'feature-2.jpg', 'social.jpg']) {
      const f = path.join(imgDir, img);
      if (fs.existsSync(f)) {
        const sz = fs.statSync(f).size;
        if (sz < 10000) { console.log(`  ⚠️  ${product.id}/${img} — small file (${sz} bytes)`); allGood = false; }
      } else {
        console.log(`  ❌ MISSING: ${product.id}/${img}`);
        allGood = false;
      }
    }
  }
  
  if (allGood) console.log('✅ All 40 images verified — good file sizes');
  else console.log('⚠️  Some issues found above');
}

run().catch(console.error);
