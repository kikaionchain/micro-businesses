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
    accentDim: 'rgba(212,137,26,0.15)',
    tagline: 'From idea to audience. In one space.',
    category: 'WRITING SYSTEM',
    notionContent: {
      sidebar: ['📝 Writing OS', '🗂 Content DB', '📤 Publish Queue', '🧠 Brain Dump', '📅 Calendar', '💡 Ideas', '🔗 Resources'],
      title: 'Content Pipeline — November 2024',
      properties: [
        { key: 'Status', value: '● In Progress' },
        { key: 'Format', value: 'Twitter Thread' },
        { key: 'Topic', value: 'DeFi Mechanics' },
        { key: 'Deadline', value: 'Nov 15, 2024' },
      ],
      blocks: [
        '# Thread: Why DeFi yields are misunderstood',
        '↳ Hook draft: "Everyone chasing APY is doing it wrong..."',
        '↳ Point 1: The difference between real and inflationary yield',
        '↳ Point 2: Protocol revenue as the signal',
        '↳ CTA: Newsletter link + Farcaster cast',
      ]
    },
    uniqueElement: 'cursor',
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
    accent: '#FF4F00',
    accentLight: '#FF6B2B',
    accentDim: 'rgba(255,79,0,0.15)',
    tagline: '90 days of content. Already written.',
    category: 'CONTENT TEMPLATES',
    notionContent: {
      sidebar: ['📅 90-Day Calendar', '📝 Template Library', '🎣 Hook Swipe', '📊 Analytics', '🐦 Twitter', '🔮 Farcaster', '📧 Newsletter'],
      title: 'Week 12 Content — Day 78–84',
      properties: [
        { key: 'Theme', value: 'Market Psychology' },
        { key: 'Posts Ready', value: '21 templates' },
        { key: 'Platform', value: 'Twitter + Farcaster' },
        { key: 'Status', value: '✅ Ready to post' },
      ],
      blocks: [
        '# Day 78 — Monday Drop',
        '↳ [Thread] "The 3 emotions that kill portfolios"',
        '↳ [Tweet] Stat hook: "87% of traders lose to themselves"',
        '↳ [Reply bait] "Unpopular opinion: patience is the edge"',
        '↳ Day 79 → Market update template loaded',
      ]
    },
    uniqueElement: 'lines',
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
    accentDim: 'rgba(0,201,167,0.15)',
    tagline: '100 prompts. Zero blank page.',
    category: 'AI PROMPTS',
    notionContent: {
      sidebar: ['🤖 Prompt Library', '📊 Research Stack', '✍️ Content Stack', '🚀 Launch Stack', '🏗 Ops Stack', '🔗 Chaining Guide', '⭐ Favorites'],
      title: 'Research Stack — Protocol Analysis',
      properties: [
        { key: 'Category', value: 'Research · 10 prompts' },
        { key: 'Model', value: 'Claude 3.5 / GPT-4o' },
        { key: 'Use Case', value: 'Protocol Deep Dive' },
        { key: 'Tested', value: '✅ Battle-tested' },
      ],
      blocks: [
        '# Prompt #R-01: Protocol Revenue Analysis',
        '↳ "Analyze [PROTOCOL] revenue streams. Break down..."',
        '# Prompt #R-02: Competitive Landscape',
        '↳ "Map [PROTOCOL]\'s top 5 competitors with TVL data..."',
        '↳ Chain: R-01 → R-02 → C-05 (content output)',
      ]
    },
    uniqueElement: 'cards',
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
    accentDim: 'rgba(67,97,238,0.15)',
    tagline: 'Look like a protocol. Not a side project.',
    category: 'BRAND SYSTEM',
    notionContent: {
      sidebar: ['🎨 Brand Identity', '📣 Voice Guide', '🖼 Asset Library', '📋 Guidelines', '🎯 Positioning', '🌐 Web Presence', '🚀 Launch Kit'],
      title: 'Brand Identity — Core System',
      properties: [
        { key: 'Version', value: 'v2.0 Final' },
        { key: 'Assets', value: '40+ Figma files' },
        { key: 'Formats', value: 'PNG · SVG · Figma' },
        { key: 'Status', value: '● Production ready' },
      ],
      blocks: [
        '# Primary Color System',
        '↳ Primary: #4361EE · Secondary: #7B2FBE',
        '# Typography Stack',
        '↳ Display: Space Grotesk Bold 64px',
        '↳ Body: Inter Regular 16px · Line-height 1.6',
      ]
    },
    uniqueElement: 'grid',
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
    accentDim: 'rgba(0,214,143,0.15)',
    tagline: 'Every trade. Every lesson. One place.',
    category: 'PORTFOLIO TRACKER',
    notionContent: {
      sidebar: ['📊 Dashboard', '📈 Trade Log', '📓 Journal', '🎯 Goals', '📅 Monthly Review', '⚖️ Risk Calc', '📤 Tax Export'],
      title: 'Portfolio Dashboard — Q4 2024',
      properties: [
        { key: 'Total PnL', value: '+$4,280 (↑ 23.4%)' },
        { key: 'Win Rate', value: '67% · 48 trades' },
        { key: 'Best Trade', value: 'SOL +$1,240' },
        { key: 'Avg Hold', value: '12 days' },
      ],
      blocks: [
        '# November Performance',
        '↳ Realized: +$1,840 · Unrealized: +$2,440',
        '# Top Positions',
        '↳ ETH: 2.4 ETH @ $2,890 entry · +18%',
        '↳ SOL: 45 SOL @ $142 entry · +31%',
      ]
    },
    uniqueElement: 'bars',
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
    accent: '#8B5CF6',
    accentLight: '#A78BFA',
    accentDim: 'rgba(139,92,246,0.15)',
    tagline: 'From 0 to 10K. Step by step.',
    category: 'GROWTH PLAYBOOK',
    notionContent: {
      sidebar: ['🌱 Launch Plan', '🔥 Retention', '📢 Growth Loops', '💎 Monetize', '📊 Analytics', '🤝 Partnerships', '📅 Events'],
      title: 'Community Roadmap — Phase 2: Growth',
      properties: [
        { key: 'Members', value: '2,847 → target 10K' },
        { key: 'Phase', value: '2 of 4 · Growth' },
        { key: 'DAU Rate', value: '34% · ↑ from 18%' },
        { key: 'Next Event', value: 'AMA · Nov 20' },
      ],
      blocks: [
        '# Week 8 Growth Loop',
        '↳ Monday: Drop exclusive alpha post',
        '↳ Wednesday: Member spotlight thread',
        '↳ Friday: Community AMA + recap',
        '↳ Referral system: 3 invites → exclusive role',
      ]
    },
    uniqueElement: 'gradient-sweep',
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
    subtitle: 'Crypto Social Media System',
    accent: '#FF006E',
    accentLight: '#FF4D94',
    accentDim: 'rgba(255,0,110,0.15)',
    tagline: 'Stay visible. Stay relevant. Ship daily.',
    category: 'SOCIAL MEDIA SYSTEM',
    notionContent: {
      sidebar: ['📡 Command Center', '📅 Daily Posts', '📊 Analytics', '🔥 Trending', '💬 Engagement', '📈 Growth Log', '⭐ Best Performers'],
      title: 'Social Command Center — Live',
      properties: [
        { key: 'Streak', value: '47 days posting' },
        { key: 'Avg Reach', value: '12,400 / post' },
        { key: 'Best Format', value: 'Threads · 3.2x' },
        { key: 'Today', value: '● Post queued' },
      ],
      blocks: [
        '# Today\'s Content — Nov 12',
        '↳ 9AM: Market open thread (scheduled)',
        '↳ 2PM: Reply to trending threads · 30 min',
        '↳ 6PM: Evening insight post',
        '↳ Tomorrow: Weekly wrap-up template #W47',
      ]
    },
    uniqueElement: 'rings',
    features: [
      { icon: '📡', title: 'Daily System', desc: 'Post every day without burnout' },
      { icon: '📊', title: 'Analytics Tracker', desc: 'Know what is growing you' },
      { icon: '🔥', title: 'Trending Alerts', desc: 'Never miss a moment to post' },
      { icon: '💬', title: 'Engagement Scripts', desc: 'Reply templates that build audience' },
    ],
    inside: [
      { label: 'Daily Posting System', value: '30-min-a-day framework' },
      { label: 'Content Templates', value: '120 ready-to-use posts' },
      { label: 'Analytics Dashboard', value: 'Track growth over time' },
      { label: 'Trending Tracker', value: 'Crypto narrative monitor' },
      { label: 'Engagement Playbook', value: 'Build community, not followers' },
    ]
  },
  {
    id: 'forge',
    name: 'FORGE',
    price: '$57',
    subtitle: 'Crypto Project Launch System',
    accent: '#FF6B35',
    accentLight: '#FF8C5A',
    accentDim: 'rgba(255,107,53,0.15)',
    tagline: 'Launch without the guesswork.',
    category: 'LAUNCH SYSTEM',
    notionContent: {
      sidebar: ['🔥 Launch HQ', '📋 Roadmap', '🎯 GTM Strategy', '👥 Community', '📣 Marketing', '⚙️ Operations', '📊 Metrics'],
      title: 'Launch Timeline — T-30 to Launch Day',
      properties: [
        { key: 'Launch Date', value: 'Dec 1, 2024' },
        { key: 'Days Out', value: '19 days' },
        { key: 'Tasks Done', value: '34 / 52 complete' },
        { key: 'Status', value: '🟡 On Track' },
      ],
      blocks: [
        '# T-19 Checklist',
        '↳ ✅ Whitepaper v2 published',
        '↳ ✅ Discord set up + moderated',
        '↳ ⬜ TGE announcement thread drafted',
        '↳ ⬜ KOL outreach: 12 of 20 confirmed',
      ]
    },
    uniqueElement: 'embers',
    features: [
      { icon: '🔥', title: 'Launch Playbook', desc: '90-day step-by-step system' },
      { icon: '📋', title: 'Task Tracker', desc: 'Every launch task, sequenced' },
      { icon: '📣', title: 'Marketing Templates', desc: 'Announcements, threads, AMAs' },
      { icon: '📊', title: 'Metrics Dashboard', desc: 'Track what matters at launch' },
    ],
    inside: [
      { label: 'Launch Roadmap', value: '90-day action plan' },
      { label: 'GTM Template', value: 'Go-to-market strategy doc' },
      { label: 'Community Playbook', value: 'Discord + Twitter setup guide' },
      { label: 'Marketing Kit', value: '50 launch post templates' },
      { label: 'Post-Launch Review', value: 'Retrospective template' },
    ]
  },
];

function buildNotionMockupHTML(product) {
  const { notionContent, accent } = product;
  const sidebarItems = notionContent.sidebar.map(item =>
    `<div style="padding:4px 8px;border-radius:4px;font-size:11px;color:rgba(255,255,255,0.6);white-space:nowrap;overflow:hidden;">${item}</div>`
  ).join('');
  const propertyRows = notionContent.properties.map(p =>
    `<div style="display:flex;gap:12px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
      <span style="font-size:10px;color:rgba(255,255,255,0.4);min-width:80px;">${p.key}</span>
      <span style="font-size:10px;color:rgba(255,255,255,0.65);">${p.value}</span>
    </div>`
  ).join('');
  const contentBlocks = notionContent.blocks.map(b =>
    `<div style="padding:2px 0;font-size:10px;color:rgba(255,255,255,0.55);font-family:'Courier New',monospace;">${b}</div>`
  ).join('');

  return `
    <div style="display:flex;width:100%;height:100%;font-family:Inter,sans-serif;">
      <!-- Sidebar -->
      <div style="width:160px;min-width:160px;background:rgba(255,255,255,0.03);border-right:1px solid rgba(255,255,255,0.06);padding:16px 8px;display:flex;flex-direction:column;gap:2px;">
        <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:1px;margin-bottom:8px;padding:0 8px;">WORKSPACE</div>
        ${sidebarItems}
      </div>
      <!-- Content -->
      <div style="flex:1;padding:20px 24px;overflow:hidden;">
        <div style="font-size:16px;font-weight:700;color:rgba(255,255,255,0.7);margin-bottom:12px;">${notionContent.title}</div>
        <!-- Properties -->
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:10px 12px;margin-bottom:12px;">
          ${propertyRows}
        </div>
        <!-- Content blocks -->
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${contentBlocks}
        </div>
      </div>
    </div>
  `;
}

function getUniqueElement(product, isSquare) {
  const { uniqueElement, accent } = product;
  
  if (uniqueElement === 'cursor') {
    return `
      <!-- Cursor/quill elements -->
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:100%;height:100%;pointer-events:none;opacity:0.12;">
        ${[...Array(6)].map((_, i) => `<div style="position:absolute;left:${10+i*15}%;top:${20+Math.sin(i)*30}%;width:2px;height:40px;background:${accent};border-radius:2px;transform:rotate(${-10+i*3}deg);"></div>`).join('')}
        <div style="position:absolute;right:15%;top:40%;font-size:80px;color:${accent};opacity:0.4;transform:rotate(-15deg);">|</div>
      </div>`;
  }
  
  if (uniqueElement === 'lines') {
    const lineCount = isSquare ? 20 : 14;
    return `
      <!-- Draft paper lines -->
      <div style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0.08;">
        ${[...Array(lineCount)].map((_, i) => `<div style="position:absolute;left:5%;right:5%;top:${(i+1) * (100/lineCount)}%;height:1px;background:${accent};"></div>`).join('')}
      </div>`;
  }
  
  if (uniqueElement === 'cards') {
    return `
      <!-- Stacked cards -->
      <div style="position:absolute;top:50%;right:${isSquare?'10%':'8%'};transform:translateY(-50%);opacity:0.15;pointer-events:none;">
        <div style="width:${isSquare?120:160}px;height:${isSquare?80:100}px;background:transparent;border:1px solid ${accent};border-radius:8px;transform:rotate(-6deg) translate(8px,8px);position:absolute;"></div>
        <div style="width:${isSquare?120:160}px;height:${isSquare?80:100}px;background:transparent;border:1px solid ${accent};border-radius:8px;transform:rotate(-3deg) translate(4px,4px);position:absolute;"></div>
        <div style="width:${isSquare?120:160}px;height:${isSquare?80:100}px;background:rgba(255,255,255,0.03);border:1px solid ${accent};border-radius:8px;position:absolute;"></div>
      </div>`;
  }
  
  if (uniqueElement === 'grid') {
    return `
      <!-- Blueprint grid -->
      <div style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0.07;background-image:linear-gradient(${accent} 1px,transparent 1px),linear-gradient(90deg,${accent} 1px,transparent 1px);background-size:40px 40px;"></div>`;
  }
  
  if (uniqueElement === 'bars') {
    const barHeights = [30, 55, 40, 70, 45, 80, 60, 75, 50, 65];
    const barWidth = isSquare ? 28 : 36;
    return `
      <!-- Bar chart -->
      <div style="position:absolute;bottom:60px;left:50%;transform:translateX(-50%);display:flex;align-items:flex-end;gap:${isSquare?8:12}px;opacity:0.1;pointer-events:none;">
        ${barHeights.map(h => `<div style="width:${barWidth}px;height:${(isSquare?1.2:1.5)*h}px;background:${accent};border-radius:3px 3px 0 0;"></div>`).join('')}
      </div>`;
  }
  
  if (uniqueElement === 'gradient-sweep') {
    return `
      <!-- Horizontal gradient sweep -->
      <div style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;background:linear-gradient(90deg,transparent 0%,rgba(139,92,246,0.08) 30%,rgba(167,139,250,0.12) 60%,transparent 100%);"></div>
      <div style="position:absolute;top:30%;left:0;width:100%;height:40%;pointer-events:none;background:linear-gradient(90deg,transparent 0%,rgba(139,92,246,0.06) 50%,transparent 100%);filter:blur(20px);"></div>`;
  }
  
  if (uniqueElement === 'rings') {
    const cx = isSquare ? 50 : 50;
    const cy = isSquare ? 50 : 50;
    return `
      <!-- Sonar rings -->
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;">
        ${[200,320,450,580,720].map((r, i) => `
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${r}px;height:${r}px;border-radius:50%;border:1px solid ${accent};opacity:${0.12-i*0.02};"></div>
        `).join('')}
      </div>`;
  }
  
  if (uniqueElement === 'embers') {
    const sparks = [...Array(20)].map((_, i) => {
      const x = 10 + Math.random() * 80;
      const y = 50 + Math.random() * 45;
      const size = 2 + Math.random() * 4;
      return `<div style="position:absolute;left:${x}%;bottom:${100-y}%;width:${size}px;height:${size}px;border-radius:50%;background:${i%2?accent:'#FFD700'};opacity:${0.3+Math.random()*0.4};"></div>`;
    }).join('');
    return `
      <!-- Ember glow + sparks -->
      <div style="position:absolute;bottom:0;left:0;width:100%;height:40%;background:linear-gradient(to top,rgba(255,107,53,0.15) 0%,transparent 100%);pointer-events:none;filter:blur(20px);"></div>
      <div style="position:absolute;bottom:0;left:0;width:100%;height:100%;pointer-events:none;">${sparks}</div>`;
  }
  
  return '';
}

function buildHeroHTML(product, width, height) {
  const isSquare = width === 1080;
  const titleSize = isSquare ? 160 : 210;
  const notionMockup = buildNotionMockupHTML(product);
  const uniqueEl = getUniqueElement(product, isSquare);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: ${width}px; height: ${height}px; overflow: hidden; background: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', sans-serif; }
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
</style>
</head>
<body>
<div style="position:relative;width:${width}px;height:${height}px;background:#0A0A0A;overflow:hidden;">

  <!-- Notion UI background layer -->
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0.18;pointer-events:none;overflow:hidden;">
    ${notionMockup}
  </div>

  <!-- Radial gradient overlay (text readability) -->
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at center, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.85) 100%);pointer-events:none;"></div>

  <!-- Unique visual element -->
  ${uniqueEl}

  <!-- Ambient glow -->
  <div style="position:absolute;top:${isSquare?'35%':'30%'};left:50%;transform:translate(-50%,-50%);width:${isSquare?600:800}px;height:${isSquare?600:400}px;background:radial-gradient(ellipse,${product.accentDim} 0%,transparent 70%);pointer-events:none;filter:blur(40px);"></div>

  <!-- Top bar: category + price -->
  <div style="position:absolute;top:${isSquare?40:32}px;left:${isSquare?40:48}px;right:${isSquare?40:48}px;display:flex;justify-content:space-between;align-items:center;">
    <div style="font-size:${isSquare?11:12}px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.4);text-transform:uppercase;">${product.category}</div>
    <div style="font-size:${isSquare?14:16}px;font-weight:700;color:${product.accent};letter-spacing:1px;">${product.price}</div>
  </div>

  <!-- Hero product name -->
  <div style="position:absolute;${isSquare?'top:50%;left:50%;transform:translate(-50%,-55%)':'top:50%;left:48px;transform:translateY(-55%)'};${isSquare?'text-align:center;width:100%':''};z-index:10;">
    <div style="font-size:${titleSize}px;font-weight:900;line-height:0.88;letter-spacing:-6px;color:${product.accent};text-shadow:0 0 60px ${product.accentDim}, 0 0 120px ${product.accentDim};-webkit-text-fill-color:${product.accent};">${product.name}</div>
    <div style="margin-top:${isSquare?20:16}px;font-size:${isSquare?18:20}px;font-weight:400;color:rgba(255,255,255,0.55);letter-spacing:0.5px;${isSquare?'':'max-width:500px;'}">${product.tagline}</div>
  </div>

  <!-- Bottom: subtitle -->
  <div style="position:absolute;bottom:${isSquare?40:32}px;${isSquare?'left:50%;transform:translateX(-50%);text-align:center;':'left:48px;'};right:${isSquare?40:48}px;">
    <div style="font-size:${isSquare?13:14}px;font-weight:400;color:rgba(255,255,255,0.3);letter-spacing:1px;">${product.subtitle}</div>
  </div>

  <!-- Accent line -->
  <div style="position:absolute;${isSquare?'bottom:72px;left:50%;transform:translateX(-50%);width:60px':'bottom:72px;left:48px;width:48px'};height:2px;background:${product.accent};border-radius:2px;opacity:0.8;"></div>

</div>
</body>
</html>`;
}

function buildFeaturesHTML(product, width, height) {
  const accentDim = product.accentDim;
  const notionMockup = buildNotionMockupHTML(product);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>* { margin:0;padding:0;box-sizing:border-box; } body { width:${width}px;height:${height}px;overflow:hidden;background:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Inter','Helvetica Neue',sans-serif; }</style>
</head>
<body>
<div style="position:relative;width:${width}px;height:${height}px;background:#0A0A0A;overflow:hidden;">

  <!-- Notion background -->
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0.12;pointer-events:none;overflow:hidden;">${notionMockup}</div>
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at center,rgba(10,10,10,0.75) 0%,rgba(10,10,10,0.5) 50%,rgba(10,10,10,0.9) 100%);pointer-events:none;"></div>

  <!-- Glow -->
  <div style="position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);width:900px;height:500px;background:radial-gradient(ellipse,${accentDim} 0%,transparent 70%);pointer-events:none;filter:blur(60px);"></div>

  <!-- Header -->
  <div style="position:absolute;top:48px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:center;">
    <div style="font-size:11px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.3);text-transform:uppercase;">${product.category}</div>
    <div style="font-size:${width===1080?32:36}px;font-weight:900;letter-spacing:-2px;color:${product.accent};">${product.name}</div>
    <div style="font-size:16px;font-weight:700;color:${product.accent};">${product.price}</div>
  </div>

  <!-- Section label -->
  <div style="position:absolute;top:${width===1080?130:120}px;left:64px;font-size:11px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.25);text-transform:uppercase;">WHAT'S INCLUDED</div>

  <!-- Feature grid -->
  <div style="position:absolute;top:${width===1080?160:148}px;left:64px;right:64px;display:grid;grid-template-columns:1fr 1fr;gap:${width===1080?20:24}px;">
    ${product.features.map(f => `
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:${width===1080?24:28}px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;width:3px;height:100%;background:${product.accent};opacity:0.6;border-radius:12px 0 0 12px;"></div>
      <div style="font-size:${width===1080?28:32}px;margin-bottom:10px;">${f.icon}</div>
      <div style="font-size:${width===1080?16:17}px;font-weight:700;color:rgba(255,255,255,0.9);margin-bottom:6px;">${f.title}</div>
      <div style="font-size:${width===1080?13:14}px;color:rgba(255,255,255,0.45);line-height:1.5;">${f.desc}</div>
    </div>`).join('')}
  </div>

</div>
</body>
</html>`;
}

function buildInsideHTML(product, width, height) {
  const isSquare = width === 1080;
  const notionMockup = buildNotionMockupHTML(product);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>* { margin:0;padding:0;box-sizing:border-box; } body { width:${width}px;height:${height}px;overflow:hidden;background:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Inter','Helvetica Neue',sans-serif; }</style>
</head>
<body>
<div style="position:relative;width:${width}px;height:${height}px;background:#0A0A0A;overflow:hidden;">

  <!-- Notion background -->
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0.15;pointer-events:none;overflow:hidden;">${notionMockup}</div>
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at 50% 40%,rgba(10,10,10,0.7) 0%,rgba(10,10,10,0.45) 50%,rgba(10,10,10,0.88) 100%);pointer-events:none;"></div>
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:700px;background:radial-gradient(ellipse,${product.accentDim} 0%,transparent 70%);pointer-events:none;filter:blur(50px);"></div>

  <!-- Header -->
  <div style="position:absolute;top:48px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:center;">
    <div style="font-size:11px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.3);text-transform:uppercase;">${product.category}</div>
    <div style="font-size:${isSquare?32:36}px;font-weight:900;letter-spacing:-2px;color:${product.accent};">${product.name}</div>
    <div style="font-size:16px;font-weight:700;color:${product.accent};">${product.price}</div>
  </div>

  <!-- Section label -->
  <div style="position:absolute;top:${isSquare?130:120}px;left:64px;font-size:11px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.25);text-transform:uppercase;">INSIDE THE PACK</div>

  <!-- Items list -->
  <div style="position:absolute;top:${isSquare?160:148}px;left:64px;right:64px;display:flex;flex-direction:column;gap:${isSquare?18:20}px;">
    ${product.inside.map((item, i) => `
    <div style="display:flex;align-items:center;gap:20px;padding:${isSquare?16:18}px 20px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">
      <div style="width:28px;height:28px;border-radius:50%;background:${product.accentDim};border:1px solid ${product.accent};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <span style="font-size:11px;font-weight:900;color:${product.accent};">${String(i+1).padStart(2,'0')}</span>
      </div>
      <div style="flex:1;">
        <div style="font-size:${isSquare?14:15}px;font-weight:700;color:rgba(255,255,255,0.85);">${item.label}</div>
        <div style="font-size:${isSquare?12:13}px;color:rgba(255,255,255,0.4);margin-top:2px;">${item.value}</div>
      </div>
      <div style="width:6px;height:6px;border-radius:50%;background:${product.accent};opacity:0.6;flex-shrink:0;"></div>
    </div>`).join('')}
  </div>

</div>
</body>
</html>`;
}

async function generateCovers() {
  console.log('🚀 Starting cover generation v2...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
  });

  const page = await browser.newPage();
  let count = 0;

  for (const product of products) {
    console.log(`\n📦 Generating ${product.name}...`);

    // 01 — Hero 1280x720
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
    await page.setContent(buildHeroHTML(product, 1280, 720), { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${product.id}-01-hero.jpg`), type: 'jpeg', quality: 95 });
    count++;
    console.log(`  ✓ ${product.id}-01-hero.jpg`);

    // 02 — Features 1280x720
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
    await page.setContent(buildFeaturesHTML(product, 1280, 720), { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${product.id}-02-features.jpg`), type: 'jpeg', quality: 95 });
    count++;
    console.log(`  ✓ ${product.id}-02-features.jpg`);

    // 03 — Inside 1280x720
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
    await page.setContent(buildInsideHTML(product, 1280, 720), { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${product.id}-03-inside.jpg`), type: 'jpeg', quality: 95 });
    count++;
    console.log(`  ✓ ${product.id}-03-inside.jpg`);

    // 04 — Square hero 1080x1080
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
    await page.setContent(buildHeroHTML(product, 1080, 1080), { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${product.id}-04-square.jpg`), type: 'jpeg', quality: 95 });
    count++;
    console.log(`  ✓ ${product.id}-04-square.jpg`);
  }

  await browser.close();
  console.log(`\n✅ Done! Generated ${count} images.`);
}

generateCovers().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
