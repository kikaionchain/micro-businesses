# LEDGER — Crypto Portfolio & Token Tracker Pro
## Complete Notion Template Content

**Version:** 1.0  
**Price:** $29  
**Format:** Notion template (duplicate to your workspace)

---

# WELCOME PAGE COPY

> **Welcome to LEDGER.**
>
> This workspace is designed to give you total clarity on your crypto portfolio. Every token. Every trade. Every decision. All in one place.
>
> Before you start: read the setup guide at the bottom of this page. It takes 10 minutes to configure and will save you hours every month.
>
> **The system has 5 components:**
> 1. Portfolio Overview — your live holdings snapshot
> 2. Trade Log — every entry and exit recorded
> 3. Token Watchlist — tokens on your radar
> 4. Decision Journal — the why behind your moves
> 5. Monthly Review — your performance debrief
>
> Let's go.

---

# SECTION 1: PORTFOLIO OVERVIEW DATABASE

## Database Name: `📊 Portfolio`

### All Properties / Columns

| Property Name | Type | Description / Usage |
|--------------|------|---------------------|
| Token Name | Title | Full name (e.g., "Ethereum") |
| Ticker | Text | Symbol (e.g., ETH) |
| Category | Select | See options below |
| Chain | Select | Which blockchain it lives on |
| Wallet / Exchange | Select | Where you're holding it |
| Quantity Held | Number | How many tokens you own |
| Average Buy Price (USD) | Number | Your avg cost basis per token |
| Current Price (USD) | Number | Update manually or note source |
| Current Value (USD) | Formula | `Quantity Held × Current Price` |
| Total Invested (USD) | Formula | `Quantity Held × Average Buy Price` |
| Unrealized P&L (USD) | Formula | `Current Value - Total Invested` |
| Unrealized P&L (%) | Formula | `((Current Price - Average Buy Price) / Average Buy Price) × 100` |
| Portfolio Weight (%) | Number | % of total portfolio - update during reviews |
| Status | Select | Active / Sold / Staking / Locked |
| Risk Level | Select | Low / Medium / High / Degen |
| Conviction Level | Select | 1-5 stars |
| Entry Date | Date | When you first bought |
| Target Price | Number | Your take-profit target |
| Stop Level | Number | Price where you'd reconsider the position |
| Thesis | Text | 1-2 sentence investment thesis |
| Related Trades | Relation | Links to Trade Log entries |
| Notes | Text | Any additional context |
| Last Updated | Date | When you last updated prices |

### Category Select Options
- Layer 1
- Layer 2
- DeFi
- NFT / Gaming
- Infrastructure
- Stablecoin
- Meme
- AI / Data
- RWA
- Other

### Chain Select Options
- Ethereum
- Solana
- Bitcoin
- Base
- Arbitrum
- Optimism
- Avalanche
- BSC
- Sui
- Aptos
- Cosmos
- Polkadot
- Other

### Wallet / Exchange Select Options
- Coinbase
- Binance
- Kraken
- MetaMask
- Phantom
- Ledger (Hardware)
- Cold Storage
- Staking Contract
- Other

### Views to Create

**View 1: "Active Holdings" (Default)**
- Filter: Status = Active
- Sort: Current Value (USD) DESC
- Show properties: Token Name, Ticker, Quantity, Avg Buy, Current Price, Current Value, P&L %, Portfolio Weight

**View 2: "By Category"**
- Group by: Category
- Sort: Current Value DESC within each group

**View 3: "By Risk Level"**
- Group by: Risk Level
- Color coded

**View 4: "Gains / Losses"**
- Sort: Unrealized P&L (%) DESC
- Shows full P&L picture

**View 5: "Needs Review"**
- Filter: Last Updated is before [7 days ago]
- Reminder to keep prices fresh

---

# SECTION 2: TRADE LOG DATABASE

## Database Name: `📋 Trade Log`

### All Properties / Columns

| Property Name | Type | Description |
|--------------|------|-------------|
| Trade ID | Title | Auto: e.g., "TRD-001" - number sequentially |
| Token | Text | Which token (e.g., "SOL") |
| Direction | Select | Buy / Sell / Swap |
| Date | Date | When the trade executed |
| Quantity | Number | How many tokens |
| Price Per Token (USD) | Number | Execution price |
| Total Value (USD) | Formula | `Quantity × Price Per Token` |
| Fee (USD) | Number | Gas / exchange fee |
| Net Value (USD) | Formula | `Total Value - Fee (for sells)` |
| Exchange / Platform | Select | Where executed |
| Trade Type | Select | Spot / Limit / DCA / Swing / Arbitrage |
| Realized P&L (USD) | Number | Fill in when closing a position |
| Realized P&L (%) | Number | Fill in when closing a position |
| Linked Portfolio Entry | Relation | Links back to Portfolio database |
| Trigger / Signal | Text | What triggered this trade? |
| Thesis | Text | Why did you make this trade? |
| Outcome Notes | Text | After the fact: what happened, what you learned |
| Rating | Select | Great / Good / Neutral / Mistake / Disaster |
| Tax Lot | Text | For tax tracking (e.g., "FIFO-2024-03") |

### Direction Select Options
- Buy
- Sell
- Swap (token to token)
- Transfer In
- Transfer Out

### Trade Type Select Options
- Spot (Market)
- Limit Order
- DCA Entry
- DCA Exit
- Swing Trade
- Long-term Position
- Arbitrage
- Airdrop / Claim

### Platform Select Options
(Same as Portfolio: Coinbase, Binance, Kraken, MetaMask, Phantom, Uniswap, Jupiter, Other)

### Rating Select Options
- 🏆 Great — executed perfectly
- ✅ Good — solid trade, minor issues
- ➖ Neutral — breakeven or minor gain/loss
- ⚠️ Mistake — shouldn't have made it
- 💀 Disaster — major loss or bad process

### Views to Create

**View 1: "All Trades" (Default)**
- Sort: Date DESC
- Shows: Token, Direction, Date, Quantity, Price, Total Value, Rating

**View 2: "This Month"**
- Filter: Date = This Month
- Group by: Direction

**View 3: "Sells Only"**
- Filter: Direction = Sell
- Sort: Realized P&L % DESC

**View 4: "Mistakes Log"**
- Filter: Rating = Mistake OR Rating = Disaster
- Use this for your monthly review learnings

**View 5: "By Token"**
- Group by: Token
- See all trade history per token

---

# SECTION 3: TOKEN WATCHLIST DATABASE

## Database Name: `👀 Watchlist`

### All Properties / Columns

| Property Name | Type | Description |
|--------------|------|-------------|
| Token Name | Title | Full name |
| Ticker | Text | Symbol |
| Category | Select | Same options as Portfolio |
| Chain | Select | Same as Portfolio |
| Why I'm Watching | Text | Your initial thesis / interest |
| Current Price | Number | Spot price when you added |
| Target Entry Price | Number | Price you'd want to buy at |
| Alert Set? | Checkbox | Have you set a price alert? |
| Market Cap | Number | In millions USD |
| FDV | Number | Fully diluted valuation in millions |
| MC / FDV Ratio | Formula | `Market Cap / FDV` |
| Launch Date | Date | TGE or mainnet launch |
| Vesting Status | Text | Key lockup/unlock info |
| Website | URL | Project website |
| Twitter | URL | Official Twitter |
| Discord | URL | Official Discord |
| Whitepaper | URL | Whitepaper or docs |
| Added Date | Date | When you added to watchlist |
| Status | Select | Watching / Passed / Bought / Too Late |
| Priority | Select | Hot / Medium / Low / Archive |
| Research Notes | Text | Freeform notes on the project |
| Risk Factors | Text | What could go wrong? |
| Competitors | Text | Who are they competing with? |
| Edge | Text | What's their actual edge? |

### Status Select Options
- 🔥 Watching — actively monitoring
- ⏸️ Passed — decided not to invest
- ✅ Bought — moved to Portfolio
- 📉 Too Late — missed the entry
- 🗃️ Archive — no longer relevant

### Priority Select Options
- 🔴 Hot — check daily
- 🟡 Medium — check weekly
- 🟢 Low — casual interest
- ⬛ Archive

### Views to Create

**View 1: "Active Watchlist"**
- Filter: Status = Watching
- Sort: Priority (Hot first)

**View 2: "Hot Opportunities"**
- Filter: Priority = Hot, Status = Watching

**View 3: "Research Queue"**
- Filter: Research Notes is empty AND Status = Watching
- These need more work

**View 4: "Passed / Archive"**
- Filter: Status = Passed OR Archived
- Your decision history

---

# SECTION 4: DECISION JOURNAL

## Template Name: `📓 Decision Journal Entry`

### How to Use
Create a new page in a "Decision Journal" database (Title property only, Date added). Each entry uses this template.

---

## DECISION JOURNAL TEMPLATE

```
# [DECISION TITLE] — [DATE]

## The Decision
*What exactly am I deciding?*

→ 

## Context
*What's happening in the market right now? What information am I working with?*

→ 

## My Thesis
*Why do I believe this is the right move?*

1. 
2. 
3. 

## Opposing View
*What would a smart person who disagrees with me say?*

→ 

## What I'm Doing
- [ ] Buy [AMOUNT] of [TOKEN] at [PRICE]
- [ ] Set stop at [PRICE]
- [ ] Set take-profit at [PRICE]
- [ ] Review in [TIMEFRAME]

## Risk Assessment
| Factor | My Assessment |
|--------|---------------|
| Position size | % of portfolio |
| Max loss I'm ok with | $ |
| Time horizon | |
| Liquidity | |
| Conviction (1-10) | |

## What Would Make Me Wrong?
*What are the specific conditions where this thesis breaks down?*

→ 

## Exit Plan
**Take Profit:** 
**Stop Loss:** 
**Time-based exit:** (if nothing happens in X months)
**Thesis invalidation:** (if [condition], I sell regardless of price)

---

## POST-DECISION REVIEW (fill in later)
**Date of Review:** 
**What actually happened:**
**Was my thesis right?** Yes / Partially / No
**What I'd do differently:**
**Key lesson:**
```

---

# SECTION 5: MONTHLY REVIEW TEMPLATE

## Template Name: `📅 Monthly Review`

```
# Monthly Review — [MONTH YEAR]

---

## PORTFOLIO SNAPSHOT

| Metric | Start of Month | End of Month | Change |
|--------|---------------|--------------|--------|
| Total Portfolio Value | | | |
| # of Positions | | | |
| Largest Position | | | |
| Cash / Stables % | | | |
| BTC Correlation | | | |

---

## PERFORMANCE

**Total P&L This Month:**
- Unrealized: $____
- Realized: $____
- Total: $____ (____%)

**Best Performer:**
- Token: 
- Return: %
- Why it worked:

**Worst Performer:**
- Token: 
- Return: %
- What went wrong:

**Trades Made This Month:** ____
**Winning Trades:** ____ (___%)
**Losing Trades:** ____ (___%)

---

## ALLOCATION REVIEW

*Fill in your top holdings by % of portfolio:*

| Token | % of Portfolio | vs. Last Month | Notes |
|-------|---------------|----------------|-------|
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

**Am I over-concentrated anywhere?**
→ 

**Any position I'm uncomfortable with?**
→ 

---

## DECISIONS REVIEW

**Trades I'm proud of:**
1. 
2. 

**Trades I regret:**
1. 
2. 

**Trades I almost made but didn't (and should have / shouldn't have):**
→ 

---

## MARKET CONTEXT

**What was the macro backdrop this month?**
→ 

**Key narratives that moved markets:**
1. 
2. 
3. 

**My read vs. what actually happened:**
→ 

---

## WATCHLIST ACTIONS

**Tokens I added to watchlist this month:**
→ 

**Tokens I removed:**
→ 

**Positions I entered:**
→ 

**Positions I exited:**
→ 

---

## NEXT MONTH PLAN

**Market conditions I'm watching:**
→ 

**Positions I might add to:**
→ 

**Positions I might reduce:**
→ 

**Research I need to do:**
- [ ] 
- [ ] 
- [ ] 

**My conviction level heading into next month (1-10):** 
**Why:**

---

## RULES CHECK

*Review your personal trading rules. Did you follow them this month?*

| Rule | Followed? | Notes |
|------|-----------|-------|
| Never invest more than X% in one token | ✅/❌ | |
| Always set a stop before entering | ✅/❌ | |
| Never trade on FOMO | ✅/❌ | |
| Do your own research before buying | ✅/❌ | |
| [Your rule] | ✅/❌ | |

**Overall process grade this month: A / B / C / D / F**
**Why:**

---

## ONE KEY LESSON

*The single most important thing you learned this month:*

→ 

```

---

# SECTION 6: DASHBOARD SETUP INSTRUCTIONS

## Building Your LEDGER Dashboard

The Dashboard is a Notion page that uses **linked database views** to give you a command center view of your entire portfolio. Here's how to set it up:

---

### Step 1: Create the Dashboard Page
1. Create a new page at the top level of your LEDGER workspace
2. Name it `📊 Dashboard`
3. Add the following emoji header: 📊 LEDGER
4. Add a text block: *"Last updated: [DATE]"* (update this when you refresh prices)

---

### Step 2: Add the Portfolio Summary Section

Add these callout blocks at the top:
```
💰 Total Value: $[UPDATE MANUALLY]
📈 Total P&L: $[UPDATE MANUALLY] (+X%)
🏦 # Positions: [COUNT]
💵 Cash/Stables: X%
```

---

### Step 3: Add Linked Database Views

**Block 1: Active Holdings**
- Insert > Linked view of database > Portfolio
- Select the "Active Holdings" view
- Set to Gallery or Table view
- Show: Token, Value, P&L %

**Block 2: Recent Trades**
- Insert > Linked view > Trade Log
- Filter: Last 30 days
- Sort: Date DESC
- Show 5 items max

**Block 3: Hot Watchlist**
- Insert > Linked view > Watchlist
- Filter: Priority = Hot
- Show: Token, Entry Target, Why Watching

**Block 4: Open Decisions**
- Insert > Linked view > Decision Journal
- Filter: Status = Open (add a Status property to your journal)

---

### Step 4: Add a Weekly Wins / Losses Block

Add a simple table manually:
```
| Week | Best | Worst | Net |
|------|------|-------|-----|
| [Week 1] | | | |
```

---

### Step 5: Add Your Personal Trading Rules

Create a toggle block called "📏 My Rules" and list your personal rules inside:
```
1. Never put more than 10% in a single position
2. Always know why before you buy
3. Set your exit before you enter
4. Don't average down on -50%+ positions without a new thesis
5. Review every trade within 48 hours
```

---

# SECTION 7: SAMPLE DATA (5 EXAMPLE ENTRIES)

## Portfolio Sample Data

Use these 5 entries to populate your Portfolio database on setup:

---

**Entry 1**
- Token Name: Ethereum
- Ticker: ETH
- Category: Layer 1
- Chain: Ethereum
- Wallet: MetaMask + Ledger Hardware
- Quantity Held: 4.5
- Average Buy Price: $2,100
- Current Price: $3,400
- Current Value: $15,300
- Total Invested: $9,450
- Unrealized P&L: +$5,850 (+61.9%)
- Portfolio Weight: 35%
- Status: Active
- Risk Level: Medium
- Conviction: ⭐⭐⭐⭐⭐
- Entry Date: March 2023
- Target Price: $6,000
- Stop Level: $1,800
- Thesis: Core blue chip holding. Dominant smart contract platform with strong ETF tailwinds and growing L2 ecosystem.

---

**Entry 2**
- Token Name: Solana
- Ticker: SOL
- Category: Layer 1
- Chain: Solana
- Wallet: Phantom
- Quantity Held: 85
- Average Buy Price: $68
- Current Price: $172
- Current Value: $14,620
- Total Invested: $5,780
- Unrealized P&L: +$8,840 (+152.9%)
- Portfolio Weight: 33%
- Status: Active
- Risk Level: Medium
- Conviction: ⭐⭐⭐⭐⭐
- Entry Date: December 2022
- Target Price: $400
- Stop Level: $100
- Thesis: Consumer crypto rails. Fastest chain for retail, dominant in NFTs and consumer apps. High risk but asymmetric upside.

---

**Entry 3**
- Token Name: Chainlink
- Ticker: LINK
- Category: Infrastructure
- Chain: Ethereum
- Wallet: Coinbase
- Quantity Held: 200
- Average Buy Price: $8.50
- Current Price: $16.20
- Current Value: $3,240
- Total Invested: $1,700
- Unrealized P&L: +$1,540 (+90.6%)
- Portfolio Weight: 7.5%
- Status: Active
- Risk Level: Low
- Conviction: ⭐⭐⭐⭐
- Entry Date: June 2023
- Target Price: $40
- Stop Level: $10
- Thesis: Critical oracle infrastructure. Every DeFi protocol needs LINK. Relatively low risk compared to smaller alts.

---

**Entry 4**
- Token Name: Pendle Finance
- Ticker: PENDLE
- Category: DeFi
- Chain: Arbitrum
- Wallet: MetaMask
- Quantity Held: 1,500
- Average Buy Price: $4.20
- Current Price: $6.80
- Current Value: $10,200
- Total Invested: $6,300
- Unrealized P&L: +$3,900 (+61.9%)
- Portfolio Weight: 23.5%
- Status: Active
- Risk Level: High
- Conviction: ⭐⭐⭐⭐
- Entry Date: September 2023
- Target Price: $20
- Stop Level: $4.00
- Thesis: Yield trading protocol with genuine product-market fit. Growing TVL, strong team. Bet on yield tokenization becoming mainstream.

---

**Entry 5**
- Token Name: Dogecoin
- Ticker: DOGE
- Category: Meme
- Chain: Other
- Wallet: Coinbase
- Quantity Held: 5,000
- Average Buy Price: $0.095
- Current Price: $0.14
- Current Value: $700
- Total Invested: $475
- Unrealized P&L: +$225 (+47.4%)
- Portfolio Weight: 1%
- Status: Active
- Risk Level: Degen
- Conviction: ⭐⭐
- Entry Date: October 2023
- Target Price: $0.50
- Stop Level: $0.07
- Thesis: Meme play. Small position size. Cultural relevance and Musk factor. Would be happy with a 5x, don't need to bet the house.

---

## Sample Trade Log Entries

**Trade TRD-001**
- Token: ETH
- Direction: Buy
- Date: March 14, 2023
- Quantity: 2.0
- Price Per Token: $1,750
- Total Value: $3,500
- Fee: $12
- Platform: Coinbase
- Trade Type: Spot (Market)
- Thesis: Bottoming pattern after prolonged bear market. ETH/BTC ratio at historical lows. Starting a position.

**Trade TRD-002**
- Token: ETH
- Direction: Buy
- Date: July 7, 2023
- Quantity: 2.5
- Price Per Token: $2,350
- Total Value: $5,875
- Fee: $15
- Platform: MetaMask
- Trade Type: DCA Entry
- Thesis: Adding to ETH position on Ethereum ETF speculation heating up. Averaging up intentionally.

**Trade TRD-003**
- Token: SOL
- Direction: Buy
- Date: December 30, 2022
- Quantity: 85
- Price Per Token: $68
- Total Value: $5,780
- Fee: $8
- Platform: Coinbase
- Trade Type: Spot (Market)
- Thesis: Near total capitulation after FTX fallout. SOL beat FTX association risk, protocol kept running. Risk/reward extremely favorable at this price.

---

# SETUP GUIDE

## How to Duplicate and Configure LEDGER

### Step 1: Duplicate the Template
1. Open the LEDGER template link in your browser
2. Click the **"Duplicate"** button in the top right corner
3. Choose your Notion workspace
4. The template will appear in your sidebar

### Step 2: Rename It (Optional)
- Click the page title at the top
- Rename to something like "Portfolio OS" or keep "LEDGER"

### Step 3: Configure Your Settings
Navigate to the **Settings Page** (included) and fill in:
- Your name/handle
- Your portfolio start date
- Your portfolio target (e.g., "Reach $100K by EOY")
- Your personal trading rules (5-10 rules you commit to)
- Your risk tolerance (Conservative / Balanced / Aggressive / Degen)

### Step 4: Delete Sample Data
- Go to the Portfolio database
- Select all 5 sample entries
- Right-click > Delete

### Step 5: Enter Your First Real Position
- Navigate to Portfolio Overview
- Click "+ New"
- Fill in all properties for your largest holding
- Repeat for all positions

### Step 6: Set Up Your First Trade Log Entries
- For each position in your portfolio, log the original buy as a trade
- This gives you a complete history going forward

### Step 7: Bookmark Your Dashboard
- Right-click the Dashboard page in the sidebar
- "Add to Favorites"
- This should be the first thing you see when you open Notion

### Step 8: Set a Weekly Reminder
- Every Sunday: Update current prices in Portfolio
- Every Sunday: Add any trades from the week to Trade Log
- First of the month: Complete Monthly Review

---

## Maintenance Best Practices

**Daily (5 min):** 
- Check Dashboard if you made trades
- Log any new trades immediately (don't batch them)

**Weekly (15 min):**
- Update current prices for all active positions
- Review Watchlist for any new entries
- Update portfolio weight %

**Monthly (30-45 min):**
- Complete Monthly Review template
- Archive sold positions (Status = Sold)
- Clean up Watchlist
- Update your personal trading rules if needed

**Quarterly:**
- Deep dive into Trade Log — what patterns do you see?
- Calculate tax lot info for any realized gains
- Review conviction levels — are you still as bullish?

---

*LEDGER v1.0 — Built by Marcus Wei*
*"Your portfolio. Your proof."*
