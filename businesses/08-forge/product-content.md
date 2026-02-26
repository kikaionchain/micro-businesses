# FORGE — Web3 Founder Operations Kit
## Complete Notion Workspace Content

**Version:** 1.0  
**Price:** $59  
**By:** Dani Kowalski  
**Format:** Notion workspace template

---

# WELCOME PAGE COPY

> **Welcome to FORGE.**
>
> This workspace replaces the first 3 months of "I'll set this up later."
>
> You now have everything you need to operate a Web3 startup at a professional level:
> - A roadmap that your whole team can see and trust
> - A task board that doesn't require standing meetings to know what's happening
> - An investor CRM so no relationship slips through the cracks
> - Token economics that live in a model, not your head
> - A launch timeline that knows what day it is
> - Meeting notes that don't disappear
> - A hiring pipeline that scales
>
> Setup takes 2-3 hours. It will save you hundreds.
>
> **Start with the Setup Guide at the bottom of this page.**

---

# MODULE 1: ROADMAP TRACKER

## Database Name: `🗺️ Roadmap`

### All Properties / Columns

| Property | Type | Description |
|----------|------|-------------|
| Initiative Name | Title | Name of the roadmap item |
| Category | Select | See options below |
| Status | Select | Not Started / In Progress / Complete / Paused / Cancelled |
| Priority | Select | P0 (Critical) / P1 (High) / P2 (Medium) / P3 (Low) |
| Owner | Person | Who's responsible for this initiative |
| Target Quarter | Select | Q1 / Q2 / Q3 / Q4 + year (e.g., "Q2 2025") |
| Target Date | Date | Specific target completion date |
| Actual Completion | Date | When it was actually completed |
| Phase | Select | Pre-launch / Launch / Post-launch / Ongoing |
| Milestone Type | Select | Technical / Business / Community / Token / Legal/Compliance |
| Dependencies | Relation | Links to other Roadmap items this depends on |
| Linked Tasks | Relation | Links to Task Board items |
| Description | Text | Full description of what this initiative involves |
| Success Criteria | Text | How will you know this is done? Be specific. |
| Risks | Text | What could prevent or delay this? |
| Public? | Checkbox | Is this visible on your public roadmap? |
| Notes | Text | Freeform notes |

### Category Select Options
- Protocol Development
- Smart Contracts
- Frontend / App
- Infrastructure
- Security / Audit
- Token / Economics
- Community & Growth
- Partnerships
- Legal & Compliance
- Business Development
- Marketing
- Operations
- Fundraising

### Views to Create

**View 1: "Active Roadmap" (Default)**
- Filter: Status = In Progress OR Status = Not Started
- Group by: Target Quarter
- Sort: Priority within each group

**View 2: "By Team"**
- Group by: Category
- Sort: Priority

**View 3: "Board View"**
- Kanban board grouped by Status
- Cards show: Initiative, Owner, Priority, Target Date

**View 4: "Public Roadmap"**
- Filter: Public? = checked
- Timeline view with Target Date
- Share this URL with your community

**View 5: "Completed"**
- Filter: Status = Complete
- Sort: Actual Completion DESC
- Your record of what you've shipped

**View 6: "Overdue"**
- Filter: Target Date before today, Status ≠ Complete
- These need attention

---

## Sample Roadmap Data (5 entries)

**Entry 1**
- Initiative: Smart Contract Audit (Core Protocol)
- Category: Security / Audit
- Status: In Progress
- Priority: P0 (Critical)
- Owner: [CTO Name]
- Target Quarter: Q1 2025
- Target Date: January 31, 2025
- Phase: Pre-launch
- Milestone Type: Technical
- Success Criteria: Audit report published, all critical and high findings resolved
- Risks: Audit firm backlog may delay start. Secondary firm identified as backup.
- Public?: ✅

**Entry 2**
- Initiative: Token Economics Finalization
- Category: Token / Economics
- Status: In Progress
- Priority: P0 (Critical)
- Owner: [Founder Name]
- Target Quarter: Q1 2025
- Target Date: January 15, 2025
- Phase: Pre-launch
- Milestone Type: Token
- Success Criteria: Supply schedule, vesting, allocation, and value accrual fully modeled. Approved by legal and advisors.
- Risks: Legal clarity on token classification still pending in 2 jurisdictions.
- Public?: ❌

**Entry 3**
- Initiative: Discord Community Launch
- Category: Community & Growth
- Status: Not Started
- Priority: P1 (High)
- Owner: [Community Lead]
- Target Quarter: Q1 2025
- Target Date: February 1, 2025
- Phase: Pre-launch
- Milestone Type: Community
- Success Criteria: 500 genuine members by launch day. Daily active conversations happening.
- Public?: ✅

**Entry 4**
- Initiative: Series A Fundraise
- Category: Fundraising
- Status: Not Started
- Priority: P1 (High)
- Owner: [CEO]
- Target Quarter: Q2 2025
- Phase: Post-launch
- Milestone Type: Business
- Success Criteria: $5-10M raised at appropriate valuation from strategic investors.
- Risks: Market conditions, audit delays, traction metrics needed.
- Public?: ❌

**Entry 5**
- Initiative: V1 Protocol Mainnet Launch
- Category: Protocol Development
- Status: Not Started
- Priority: P0 (Critical)
- Owner: [CTO]
- Target Quarter: Q2 2025
- Target Date: April 15, 2025
- Phase: Launch
- Milestone Type: Technical
- Dependencies: Smart Contract Audit, Token Economics Finalization
- Success Criteria: Protocol live on mainnet. $500K TVL within 30 days. Zero critical bugs.
- Public?: ✅

---

# MODULE 2: TEAM TASK BOARD

## Database Name: `✅ Tasks`

### All Properties / Columns

| Property | Type | Description |
|----------|------|-------------|
| Task Name | Title | Specific, actionable task name |
| Status | Select | See status options below |
| Priority | Select | P0 / P1 / P2 / P3 |
| Assignee | Person | Who owns this task |
| Reporter | Person | Who created / is tracking this task |
| Due Date | Date | When this should be done |
| Estimated Time | Select | < 1hr / 1-4hrs / Half day / Full day / 2-3 days / 1 week+ |
| Sprint | Select | Sprint 1 / Sprint 2 / etc. (or week date) |
| Category | Select | Engineering / Design / Marketing / Community / Ops / Legal / Finance |
| Roadmap Item | Relation | Links to parent Roadmap initiative |
| Blocked By | Relation | Links to other tasks that must complete first |
| Tags | Multi-select | Bug / Feature / Research / Admin / Urgent |
| Description | Text | Full task description + acceptance criteria |
| Notes | Text | Progress notes, updates, blockers |
| Completion Date | Date | When was it actually completed |

### Status Options
- 🔲 Backlog — not prioritized yet
- 📋 Todo — prioritized, not started
- 🔄 In Progress — actively being worked on
- 👀 In Review — needs review or approval
- ✅ Done — completed
- 🚫 Blocked — can't proceed without something external
- ❌ Cancelled — no longer needed

### Views to Create

**View 1: "Sprint Board" (Default)**
- Board view grouped by Status
- Filter: Sprint = current sprint
- Cards show: Task Name, Assignee, Due Date, Priority

**View 2: "My Tasks"**
- Filter: Assignee = me
- Sort: Due Date ASC, Priority DESC
- View for individual team members

**View 3: "All Open Tasks"**
- Filter: Status ≠ Done, Status ≠ Cancelled
- Sort: Priority DESC, Due Date ASC

**View 4: "Overdue"**
- Filter: Due Date before today, Status ≠ Done
- Alert view for team leads

**View 5: "Blocked Tasks"**
- Filter: Status = Blocked
- These need active attention

**View 6: "Backlog"**
- Filter: Status = Backlog
- Group by: Category
- For sprint planning sessions

**View 7: "Done This Week"**
- Filter: Completion Date = This Week, Status = Done
- For weekly standups and progress tracking

---

# MODULE 3: INVESTOR CRM

## Database Name: `💼 Investor CRM`

### All Properties / Columns

| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Investor or firm name |
| Contact Name | Text | Primary contact person at the firm |
| Contact Email | Email | Primary contact email |
| Twitter | URL | Their Twitter profile |
| LinkedIn | URL | Their LinkedIn |
| Type | Select | VC / Angel / Family Office / Strategic / Accelerator |
| Stage Focus | Multi-select | Pre-seed / Seed / Series A / Series B / Growth |
| Sector Focus | Text | What verticals they invest in |
| Check Size (Min) | Number | Minimum check size in USD |
| Check Size (Max) | Number | Maximum check size in USD |
| Status | Select | See pipeline stages below |
| Priority | Select | A-tier / B-tier / C-tier / Strategic |
| Lead Source | Text | How you know them / how you were introduced |
| Portfolio Companies | Text | Relevant portfolio cos — helps with warm intros |
| Last Contact Date | Date | When did you last speak? |
| Next Action | Text | What is the specific next step? |
| Next Action Date | Date | By when? |
| Meeting Count | Number | How many meetings have you had? |
| Conviction (1-5) | Select | Your sense of their interest level |
| Term Interest | Number | If they've indicated interest, how much in $? |
| Notes | Text | Detailed notes on every interaction |
| Intro Source | Text | Who introduced you? |
| DD Status | Select | Not started / Requested / In Progress / Complete |
| Pass Reason | Text | If they passed, why? (valuable for patterns) |
| Documents Shared | Multi-select | Deck / Whitepaper / Tokenomics / Data Room |
| Warm Intro Available? | Checkbox | Do you have a mutual contact? |

### Status Pipeline Options
- 🎯 Target — haven't contacted yet, researched and want to
- 📧 Outreach Sent — first outreach made, awaiting response
- 💬 First Response — responded, relationship started
- 📅 Meeting Scheduled — first meeting on calendar
- 🤝 First Meeting Done — had initial call
- 🔄 Active Diligence — they're actively doing due diligence
- 📄 Term Sheet Stage — term sheet discussions
- 💸 Closing — docs being finalized
- ✅ Closed — investment completed
- ❌ Passed — they declined
- ⏸️ On Hold — timing issue, circle back later
- 🗃️ Archive — no longer relevant

### Views to Create

**View 1: "Active Pipeline" (Default)**
- Filter: Status ≠ Archive, Status ≠ Passed
- Group by: Status
- Sort: Priority DESC

**View 2: "Needs Follow-up"**
- Filter: Next Action Date before or on today, Status = active statuses
- Sort: Next Action Date ASC
- These are your daily priorities

**View 3: "A-Tier Investors"**
- Filter: Priority = A-tier
- Sort: Status (by pipeline stage)

**View 4: "By Check Size"**
- Sort: Check Size Max DESC
- Helps you understand your funding potential

**View 5: "Passed — Learnings"**
- Filter: Status = Passed
- Group by: Pass Reason
- Use this to understand objection patterns

**View 6: "Warm Intro Available"**
- Filter: Warm Intro Available? = checked, Status = Target
- Start with these — warm intros have 5x the conversion rate of cold outreach

---

## Investor CRM Sample Data (5 entries)

**Entry 1**
- Name: Paradigm
- Contact Name: Research Team
- Type: VC
- Stage Focus: Seed, Series A
- Sector Focus: DeFi infrastructure, crypto-native protocols
- Check Size Range: $1M - $20M
- Status: Target
- Priority: A-tier
- Notes: Top-tier crypto-native VC. Our protocol is aligned with their thesis. Need warm intro — checking network. No direct contact yet.
- Warm Intro Available?: checking

**Entry 2**
- Name: Alex Hernandez (Angel)
- Contact Name: Alex Hernandez
- Twitter: @[handle]
- Type: Angel
- Stage Focus: Pre-seed, Seed
- Sector Focus: DeFi, infrastructure, tooling
- Check Size: $25K - $150K
- Status: First Meeting Done
- Priority: A-tier
- Last Contact: [DATE]
- Meeting Count: 1
- Conviction: 4/5
- Next Action: Send tokenomics model + data room access
- Next Action Date: [3 days out]
- Notes: 45-min intro call. Strong interest. Former founder, understands our tech. Main question was around unit economics and path to profitability. Address in follow-up.
- Documents Shared: Deck

**Entry 3**
- Name: Multicoin Capital
- Contact Name: [Partner Name if known]
- Type: VC
- Stage Focus: Seed, Series A
- Sector Focus: Layer 1, DeFi, Web3 infra
- Check Size: $500K - $10M
- Status: Outreach Sent
- Priority: A-tier
- Lead Source: Cold — through their published thesis alignment
- Last Contact: [DATE]
- Next Action: Follow up if no response in 7 days
- Notes: Sent cold email to [contact@]. Their published investment thesis strongly aligns with our approach to [our thesis]. Waiting for response.

**Entry 4**
- Name: Solana Ventures
- Type: Strategic / VC
- Stage Focus: Pre-seed through Series A
- Sector Focus: Solana ecosystem
- Check Size: $250K - $5M
- Status: Meeting Scheduled
- Priority: B-tier
- Meeting Count: 0 (first meeting Friday)
- Next Action: Prep for meeting — review portfolio, prepare technical Q&A
- Notes: Building on Solana. Strategic investor makes sense. Prep by reviewing their portfolio companies — don't pitch against their existing investments. Strategic value beyond capital: ecosystem support, co-marketing.
- Documents Shared: Deck, Whitepaper

**Entry 5**
- Name: Crypto Fund II (name TBD)
- Type: Family Office
- Stage Focus: Seed
- Check Size: $100K - $1M
- Status: Passed
- Pass Reason: Stage mismatch — want to see more traction
- Priority: B-tier
- Notes: Good call. Genuinely interested in the space. Not a fit right now — want to see $1M TVL before reinvesting time. Keep warm — follow up in 3 months. Left on good terms.

---

# MODULE 4: TOKEN ECONOMICS TEMPLATE

## Page Name: `🪙 Token Economics Model`

---

## TOKEN OVERVIEW

**Token Name:** [TOKEN NAME]  
**Ticker:** [$TICKER]  
**Network:** [CHAIN]  
**Token Standard:** [ERC-20 / SPL / etc.]  
**Total Supply:** [NUMBER]  
**Launch Date (TGE):** [DATE or "TBD"]  
**Token Type:** [Utility / Governance / Revenue-share / Hybrid]

---

## SUPPLY BREAKDOWN

| Category | Allocation (%) | Tokens | Vesting | Notes |
|----------|---------------|--------|---------|-------|
| **Team** | [15-20%] | [CALC] | 12-month cliff, 36-month vest | Core contributors |
| **Investors (Seed)** | [10-15%] | [CALC] | 6-month cliff, 24-month vest | Seed round investors |
| **Investors (Series A)** | [8-12%] | [CALC] | 3-month cliff, 18-month vest | Series A round |
| **Ecosystem / Treasury** | [20-25%] | [CALC] | Unlocked over 48 months per governance | DAO/Protocol treasury |
| **Community Incentives** | [15-20%] | [CALC] | Released per emissions schedule | Liquidity mining, staking rewards |
| **Airdrop / Retroactive** | [5-10%] | [CALC] | Released at TGE or short vesting | Early user rewards |
| **Public Sale / IDO** | [5-10%] | [CALC] | Partial unlock at TGE, rest vested | Public raise |
| **Advisors** | [3-5%] | [CALC] | 6-month cliff, 24-month vest | Strategic advisors |
| **Liquidity** | [3-5%] | [CALC] | Available at TGE | DEX liquidity pools |
| **Marketing / Partnerships** | [3-5%] | [CALC] | 12-month release schedule | Marketing, BD, strategic partnerships |
| **TOTAL** | **100%** | **[TOTAL SUPPLY]** | — | |

---

## VESTING SCHEDULE DETAIL

### Example Vesting Timeline (Months 0-48)

| Month | Team | Seed Investors | Series A | Ecosystem | Community | Circulating Total |
|-------|------|---------------|----------|-----------|-----------|------------------|
| 0 (TGE) | 0 | 0 | 0 | 5% of alloc | Per schedule | [CALC]% |
| 3 | 0 | 0 | cliff ends | — | Per schedule | [CALC]% |
| 6 | 0 | cliff ends | vesting | — | Per schedule | [CALC]% |
| 12 | cliff ends | vesting | vesting | monthly | Per schedule | [CALC]% |
| 24 | vesting | fully vested | fully vested | monthly | Per schedule | [CALC]% |
| 36 | vesting | — | — | monthly | Per schedule | [CALC]% |
| 48 | fully vested | — | — | monthly | Per schedule | [CALC]% |

**Note:** Fill in your specific numbers. Keep a live version of this in a spreadsheet linked here.

---

## CIRCULATING SUPPLY AT LAUNCH

| Category | % Unlocked at TGE | Tokens at TGE |
|----------|------------------|---------------|
| Public Sale | 100% | [CALC] |
| Liquidity | 100% | [CALC] |
| Airdrop | [X%] | [CALC] |
| Community (month 0) | [X%] | [CALC] |
| All others | 0% | 0 |
| **TOTAL AT TGE** | **~[X%] of supply** | **[CALC]** |

**Circulating supply at TGE:** [X]% of total supply — [CALCULATE and verify this is reasonable. Anything over 30% risks severe selling pressure at launch.]

---

## VALUE ACCRUAL MECHANICS

*How does the $[TICKER] token benefit from protocol growth?*

| Mechanism | Description | % of Protocol Revenue / Value |
|-----------|-------------|-------------------------------|
| [Mechanism 1, e.g., "Fee Share"] | [How it works] | [X%] |
| [Mechanism 2, e.g., "Governance Rights"] | [What governance controls] | — |
| [Mechanism 3, e.g., "Staking Yield"] | [Source of yield] | [X%] |
| [Mechanism 4, e.g., "Burn Mechanism"] | [How tokens are burned] | [% of revenue] |

**Token utility summary:**
1. [Utility 1]
2. [Utility 2]
3. [Utility 3]

---

## VALUATION FRAMEWORK

| Metric | Value | Notes |
|--------|-------|-------|
| Total Supply | [#] | |
| Circulating at TGE | [#] | |
| Target TGE Price | $[X] | |
| Market Cap at TGE | $[CALC] | = Circulating × Price |
| FDV at TGE | $[CALC] | = Total Supply × Price |
| MC / FDV Ratio | [CALC] | Should be > 0.15 ideally |
| Comparable MCs | | Projects in similar category |
| Implied Valuation Multiple | [X]x | vs. current protocol revenue |

**Comparable Projects (fill in 3 direct comparables):**

| Protocol | Market Cap | FDV | Revenue/Day | MC/Rev Multiple |
|----------|-----------|-----|-------------|----------------|
| [Comparable A] | $[MC] | $[FDV] | $[Rev] | [x] |
| [Comparable B] | $[MC] | $[FDV] | $[Rev] | [x] |
| [Comparable C] | $[MC] | $[FDV] | $[Rev] | [x] |
| **[YOUR PROJECT]** | **$[MC]** | **$[FDV]** | **$[Rev]** | **[x]** |

---

## TOKEN ECONOMICS RED FLAG CHECKLIST

Run through this before finalizing:

- [ ] MC/FDV at TGE is above 0.10 (ideally above 0.15)
- [ ] Team vesting is at least 12-month cliff + 24-month vest
- [ ] No single wallet controls more than 10% of supply at TGE
- [ ] Value accrual mechanism is clearly tied to protocol revenue, not circular
- [ ] Legal opinion obtained on token classification in primary markets
- [ ] Emissions schedule is modeled for at least 4 years
- [ ] Inflationary impact on early holders is clearly communicated
- [ ] Airdrop allocation is not so large it creates dump pressure at TGE
- [ ] Community/ecosystem allocation has a governance structure for disbursement
- [ ] Lock and cliff schedules are hardcoded in smart contracts, not promises

---

# MODULE 5: LAUNCH TIMELINE

## 90-DAY PRE-LAUNCH COUNTDOWN

*Customize the specific dates. This assumes [TGE DATE] as Day 0.*

---

### 🔴 CRITICAL PATH (-90 to -61 days)

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| -90 | Smart contract audit: submit code to auditor | CTO | |
| -90 | Token economics model: final draft complete | Founder | |
| -90 | Legal: jurisdiction analysis started | Legal | |
| -85 | Investor data room: all documents compiled | Ops | |
| -80 | Whitepaper: v1 complete and reviewed | Founder + CTO | |
| -75 | Smart contract audit: receive preliminary report | CTO | |
| -75 | Discord server: structure built, invite-only soft open | Community | |
| -70 | Token economics: reviewed by advisors | Founder | |
| -70 | Team page + website v1: live | Marketing | |
| -65 | Smart contract: all critical findings resolved | CTO | |
| -63 | Pitch deck: fundraising version complete | Founder | |
| -61 | Advisor agreements signed | Ops | |

---

### 🟡 BUILD PHASE (-60 to -31 days)

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| -60 | Discord: first public invite links released | Community | |
| -60 | Twitter: account active, posting 3x/week | Marketing | |
| -58 | Smart contract audit: final report published | CTO | |
| -55 | Community: first AMA hosted | Community | |
| -55 | Investor outreach: first wave sent | Founder | |
| -50 | Testnet: v1 live for internal testing | CTO | |
| -45 | Community: ambassador program launched | Community | |
| -45 | Marketing: partnership conversations active | Marketing | |
| -40 | Testnet: public beta opened to community | CTO | |
| -40 | Community: first trading competition or event | Community | |
| -35 | Tokenomics: public documentation published | Founder | |
| -35 | Investor pipeline: at least 10 active conversations | Founder | |
| -31 | Marketing: launch announcement asset ready | Marketing | |

---

### 🟢 LAUNCH PREP (-30 to -1 days)

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| -30 | "Launch date confirmed" announcement | All | |
| -28 | DEX liquidity: provider contracts confirmed | CTO + Legal | |
| -25 | KOL/influencer partnerships: confirmed and briefed | Marketing | |
| -21 | Community: Discord at target pre-launch members | Community | |
| -20 | Airdrop snapshot: criteria finalized and announced | Founder | |
| -14 | Press: embargo embargo lifted for tier-1 media | Marketing | |
| -14 | Exchange listings (if any): confirmed privately | Founder | |
| -10 | Final smart contract test on mainnet fork | CTO | |
| -7 | All team on standby for launch week | All | |
| -7 | Support documentation: complete and published | Ops | |
| -5 | Airdrop distribution: dry run tested | CTO | |
| -3 | Launch checklist: every item verified | All | |
| -1 | Team all-hands: final walkthrough, roles confirmed | Founder | |
| -1 | Social media: countdown posts scheduled | Marketing | |

---

### 🚀 LAUNCH DAY (Day 0)

**Hour -2:** Final go/no-go check with full team  
**Hour 0:** Smart contract deployment to mainnet  
**Hour 0:** Token airdrop: distribution begins  
**Hour 0:** DEX liquidity: pools seeded  
**Hour 0:** Twitter announcement thread posted  
**Hour 0:** Discord announcement sent  
**Hour +1:** Monitor on-chain activity, respond to issues  
**Hour +2:** KOL posts go live (coordinated window)  
**Hour +4:** First post-launch community AMA  
**Hour +8:** Team check-in: status update  
**Hour +24:** Day 1 report to investors and community  

---

### 📈 POST-LAUNCH (Days 1-30)

| Day | Task | Owner |
|-----|------|-------|
| +1 | Post-launch metrics report | Ops |
| +3 | Bug bounty program: launch | CTO |
| +3 | First post-launch AMA | Community |
| +7 | Week 1 metrics: share with community | All |
| +7 | Exchange listing applications: submit | Founder |
| +10 | Airdrop: confirm all distributions complete | CTO |
| +14 | First governance proposal: post for community vote | Founder |
| +21 | V1.1 patch: deploy any necessary fixes | CTO |
| +30 | Month 1 report: publish publicly | Founder |
| +30 | Fundraise: finalize and close (if in progress) | Founder |

---

# MODULE 6: MEETING NOTES TEMPLATE

## Template Name: `📝 Meeting Notes`

*Create a new page per meeting. Use this template.*

---

```
# Meeting: [MEETING TYPE] — [DATE]

**Date:** [DATE]
**Time:** [TIME] [TIMEZONE]
**Duration:** [X min]
**Format:** [In-person / Video call / Async]

**Attendees:**
- [Name] ([Role]) — [Company if external]
- [Name] ([Role])
- [Name] ([Role])

**Meeting Type:** Select one:
[ ] Investor Meeting   [ ] Team Standup   [ ] Team Planning   
[ ] Partner/BD   [ ] Advisor Session   [ ] Community Call
[ ] Legal / Compliance   [ ] 1:1   [ ] Other: ___________

---

## AGENDA
1. [Agenda item 1]
2. [Agenda item 2]
3. [Agenda item 3]

---

## NOTES

### [Agenda Item 1]: [TITLE]
[Notes from discussion]

Key points:
- 
- 
- 

### [Agenda Item 2]: [TITLE]
[Notes from discussion]

### [Agenda Item 3]: [TITLE]
[Notes from discussion]

---

## DECISIONS MADE
| Decision | Made By | Rationale |
|----------|---------|-----------|
| | | |
| | | |

---

## ACTION ITEMS
| # | Action | Owner | Due Date | Status |
|---|--------|-------|----------|--------|
| 1 | | | | ⬜ Open |
| 2 | | | | ⬜ Open |
| 3 | | | | ⬜ Open |

---

## OPEN QUESTIONS (unresolved — bring to next meeting)
- 
- 

---

## NEXT MEETING
**Date:** 
**Purpose:** 
**Prep required:**

---

*Notes taken by: [NAME]*
```

---

## Meeting Notes Database Properties

Create a database called `📝 Meeting Notes` to store all meeting pages:

| Property | Type | Description |
|----------|------|-------------|
| Meeting Title | Title | Auto-named format: "Meeting Type — Date" |
| Date | Date | When the meeting was held |
| Type | Select | Investor / Team / Partner / Legal / Advisor / Other |
| Attendees | Multi-select or Person | Who attended |
| Action Items Open | Formula | Count of open action items |
| Linked Project/Deal | Relation | Link to Roadmap item or Investor CRM |
| Outcome | Select | Productive / Neutral / Follow-up Required / Decision Made |

---

# MODULE 7: HIRING PIPELINE

## Database Name: `👥 Hiring Pipeline`

### All Properties / Columns

| Property | Type | Description |
|----------|------|-------------|
| Candidate Name | Title | Full name |
| Role | Select | See role options below |
| Source | Select | Where you found them |
| Status | Select | Pipeline stage (see below) |
| Priority | Select | Hot / Active / Low |
| Application Date | Date | When they applied / were sourced |
| Last Contact | Date | Most recent outreach or conversation |
| Next Action | Text | Specific next step |
| Next Action Date | Date | By when? |
| LinkedIn | URL | Profile link |
| Twitter | URL | Optional (useful for crypto-native roles) |
| Portfolio / GitHub | URL | Work samples |
| Location | Text | Where they're based |
| Remote OK? | Checkbox | |
| Compensation Range | Text | Expected comp range |
| Years Experience | Number | Relevant years |
| Interview Score | Number | 1-10 composite score |
| Technical Screen | Select | Not yet / Passed / Failed / Scheduled |
| Team Fit | Select | Strong / Moderate / Weak / Unknown |
| Offer Details | Text | Comp, equity, start date (if in offer stage) |
| Notes | Text | Interview notes, impressions, flags |
| Referral Source | Person | Who referred them (internal) |
| Reject Reason | Text | If declined — for pattern analysis |

### Role Select Options
- Smart Contract Engineer
- Frontend Engineer
- Backend Engineer
- Full Stack Engineer
- Security / Auditor
- Product Manager
- Design / UI/UX
- Community Manager
- Marketing
- Business Development
- Operations
- Chief of Staff
- Legal / Compliance
- Tokenomics / Research
- Head of Growth
- Other

### Source Select Options
- Referral (Team)
- Referral (Advisor)
- LinkedIn (inbound)
- LinkedIn (outbound)
- Twitter / CT
- Job Board (CryptoJobsList, etc.)
- AngelList / Wellfound
- Discord (community)
- Conference / Event
- Cold Email / DM
- Agency

### Status Pipeline Options
- 🎯 Sourced — identified, not contacted yet
- 📧 Outreach Sent — contacted, awaiting response
- 💬 Responded — showed interest
- 📋 Application Received — submitted materials
- 📞 Phone Screen Scheduled/Done
- 🧪 Technical Screen Scheduled/Done
- 👥 Team Interview Round 1
- 👥 Team Interview Round 2
- 🤝 Final Round / Reference Check
- 💼 Offer Extended
- ✅ Offer Accepted — Hiring!
- ❌ Declined by Candidate
- ❌ Declined by Us
- ⏸️ On Hold — revisit in future
- 🗃️ Archive

### Views to Create

**View 1: "Active Pipeline" (Default)**
- Filter: Status ≠ Archive, Status ≠ Declined
- Group by: Role
- Sort: Priority, then Last Contact

**View 2: "Needs Action"**
- Filter: Next Action Date ≤ today, Status = active
- Sort: Next Action Date ASC
- Daily recruiting task list

**View 3: "Interview Stage"**
- Filter: Status contains "Interview" or "Final Round"
- Active candidates in evaluation

**View 4: "By Role"**
- Group by: Role
- See pipeline health per role

**View 5: "Offer Stage"**
- Filter: Status = Offer Extended OR Accepted
- In-progress offers

**View 6: "Sourced — Not Contacted"**
- Filter: Status = Sourced
- Outreach queue

---

## Sample Hiring Data (3 entries)

**Entry 1**
- Candidate: Sarah Chen
- Role: Smart Contract Engineer
- Source: Referral (Advisor)
- Status: Team Interview Round 1
- Priority: Hot
- Last Contact: [recent date]
- Technical Screen: Passed
- Interview Score: 8/10
- Notes: Strong Solidity background, previously at [Protocol]. Aced technical screen — wrote clean code, asked smart questions. Compensation ask is on the high end ($180K) but within range for her experience. Potential flag: has two competing offers.
- Next Action: Schedule Round 2 — team fit session with full team
- Next Action Date: [2 days from now]

**Entry 2**
- Candidate: Marcus Osei
- Role: Community Manager
- Source: Discord (community member)
- Status: Phone Screen Done
- Priority: Active
- Technical Screen: N/A
- Notes: Active in our own Discord for 3 months. Unprompted — reached out asking if we were hiring. Strong organic understanding of our product. Has run communities for [Project A] and [Project B]. Not the most polished communicator but genuine and energetic. Worth a deeper look.
- Next Action: Structure a paid trial project — 2-week community moderation task
- Next Action Date: [1 week]

**Entry 3**
- Candidate: [Name TBD]
- Role: Full Stack Engineer
- Source: LinkedIn (outbound)
- Status: Outreach Sent
- Priority: Active
- Notes: Found via [connection] — background in Web3 tooling at [Company]. Relevant experience. Cold outreach sent. Personalized: mentioned their work on [specific project].
- Next Action: Follow up if no response in 5 days

---

# SETUP GUIDE

## How to Duplicate and Configure FORGE

### Step 1: Duplicate the Template
1. Open the FORGE template link
2. Click "Duplicate" (top right)
3. Select your workspace
4. The full workspace appears in your sidebar

### Step 2: Team Setup
- Navigate to "Team Settings" page
- Add your team members (invite them to your Notion workspace)
- Assign roles: Admin, Member, Viewer
- Each team member should have their own Notion account

### Step 3: Customize for Your Project
- Update the project name throughout (use Ctrl+F to find "[PROJECT NAME]")
- Configure your first sprint in the Task Board
- Add your actual roadmap items (delete sample data first)

### Step 4: Load Investor CRM
- Research and add your target investors
- Start with 20-30 targets, prioritized by tier
- Add any existing relationships immediately — don't lose warm contacts

### Step 5: Fill In Token Economics
- Work through the Token Economics template section by section
- The supply allocation table should be your first fill-in
- Get your vesting schedules into the timeline table
- Flag anything you haven't decided yet — these are conversation starters with advisors

### Step 6: Set Launch Timeline Dates
- Find [TGE DATE] in the Launch Timeline
- Count back from your target launch date
- Assign owners to every critical path item
- Set up a weekly review of the timeline with your team

### Step 7: Create First Meeting Notes
- Hold your first FORGE team kickoff meeting
- Use the Meeting Notes template to document it
- Review the action items and load them into the Task Board

### Step 8: Brief the Team
- Schedule 30 minutes with each team member
- Walk them through how to use their relevant modules
- Engineers: Task Board + Roadmap
- BD/Founder: Investor CRM + Roadmap
- Community: applicable items in Roadmap
- Everyone: Meeting Notes

---

## Maintenance Cadence

**Daily:**
- Task Board: check "My Tasks" view
- Investor CRM: check "Needs Follow-up" view

**Weekly (Monday team meeting):**
- Roadmap: review in-progress items, any blockers?
- Task Board: review completed vs. open, set sprint priorities
- Hiring: review pipeline, any offers to send?

**Weekly (Friday):**
- Launch timeline: are we on track? Any slippage?
- Meeting notes: all this week's notes filed?

**Monthly:**
- Token economics: any updates to model?
- Investor CRM: archive cold/dead leads, add new targets
- Roadmap: update any slipped items, celebrate shipped items

---

*FORGE v1.0 — Web3 Founder Operations Kit*  
*By Dani Kowalski*  
*"Build what lasts."*
