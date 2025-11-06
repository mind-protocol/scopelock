# ScopeLock Payment Structure

**Version:** 1.0
**Last Updated:** 2025-11-05
**Owner:** Alexis (Strategy) + Nicolas (Operations)

---

## Overview

ScopeLock operates on **pure commission model** - team members earn a fixed percentage of each mission's revenue. No hourly tracking, no timesheets, no employment contracts. Payment occurs when Nicolas receives funds from client.

**Payment method:** Solana (SOL) - instant, near-zero fees, fully automatable.

---

## Commission Structure

**Revenue split per mission (4-way breakdown):**

| Recipient | % (varies by volume) | Purpose |
|-----------|----------------------|---------|
| **Team** | **30%** (fixed) | Kara 15%, Reanance 9%, Bigbosexf 6% |
| **Upwork** | **10%** (fixed) | Platform fee |
| **Organization (Mind Protocol)** | **Variable** (35% @ low volume → 10% @ high volume) | AI costs ($1500/month), Claude Code ($600/month), infrastructure |
| **Nicolas** | **Variable** (25% @ low volume → 50% @ high volume) | Profit margin, risk premium, capital |

---

### How Organization % Works

**Fixed monthly costs:** $2100/month ($1500 AI + $600 Claude Code)

**As percentage of revenue:**
- 10 missions @ $600 = $6000/month → Org = 35% ($2100)
- 15 missions @ $800 = $12,000/month → Org = 17.5% ($2100)
- 20 missions @ $1000 = $20,000/month → Org = 10.5% ($2100)

**Why this structure:**
- Team gets fixed % (predictable earnings)
- Upwork gets fixed % (platform fee)
- Organization covers fixed costs (infrastructure)
- Nicolas gets residual (profit scales with volume)

---

## Payment Examples

### $400 Mission

**4-Way Split:**
- **Team:** $120 (30%)
  - Kara: $60 (15%) — 10h = $6/hr nominal, **$30-60/hr PPP**
  - Reanance: $36 (9%) — 2.5h = $14/hr, **$70-140/hr PPP**
  - Bigbosexf: $24 (6%) — 4.5h = $5/hr, **$25-50/hr PPP**
- **Upwork:** $40 (10%)
- **Organization:** $210 (52.5%) — AI + Claude Code costs
- **Nicolas:** $30 (7.5%) — Profit margin

**Note:** At low mission values, org costs (fixed $210) eat most margin

### $600 Mission

**4-Way Split:**
- **Team:** $180 (30%)
  - Kara: $90 (15%) — 10h = $9/hr nominal, **$45-90/hr PPP**
  - Reanance: $54 (9%) — 2.5h = $22/hr, **$110-220/hr PPP**
  - Bigbosexf: $36 (6%) — 4.5h = $8/hr, **$40-80/hr PPP**
- **Upwork:** $60 (10%)
- **Organization:** $210 (35%) — AI + Claude Code costs
- **Nicolas:** $150 (25%) — Profit margin

### $1000 Mission

**4-Way Split:**
- **Team:** $300 (30%)
  - Kara: $150 (15%) — 10h = $15/hr nominal, **$75-150/hr PPP**
  - Reanance: $90 (9%) — 2.5h = $36/hr, **$180-360/hr PPP**
  - Bigbosexf: $60 (6%) — 4.5h = $13/hr, **$65-130/hr PPP**
- **Upwork:** $100 (10%)
- **Organization:** $210 (21%) — AI + Claude Code costs
- **Nicolas:** $390 (39%) — Profit margin

### $2000 Mission

**4-Way Split:**
- **Team:** $600 (30%)
  - Kara: $300 (15%) — 10h = $30/hr nominal, **$150-300/hr PPP**
  - Reanance: $180 (9%) — 2.5h = $72/hr, **$360-720/hr PPP**
  - Bigbosexf: $120 (6%) — 4.5h = $27/hr, **$135-270/hr PPP**
- **Upwork:** $200 (10%)
- **Organization:** $210 (10.5%) — AI + Claude Code costs
- **Nicolas:** $990 (49.5%) — Profit margin

**PPP = Purchasing Power Parity** (adjusting for cost of living in Nigeria/Côte d'Ivoire vs France)

---

## Monthly Revenue Projections

### 10 missions/month @ $600 avg

**Total revenue:** $6000/month

**4-Way Split:**
- **Team:** $1800 (30%)
  - Kara: $900 (100h work = $9/hr nominal, **$45-90/hr PPP**)
  - Reanance: $540 (25h work = $22/hr, **$110-220/hr PPP**)
  - Bigbosexf: $360 (45h work = $8/hr, **$40-80/hr PPP**)
- **Upwork:** $600 (10%)
- **Organization:** $2100 (35%) — $1500 AI + $600 Claude Code
- **Nicolas:** $1500 (25%)

### 15 missions/month @ $800 avg

**Total revenue:** $12,000/month

**4-Way Split:**
- **Team:** $3600 (30%)
  - Kara: $1800 (150h = $12/hr nominal, **$60-120/hr PPP**)
  - Reanance: $1080 (37.5h = $29/hr, **$145-290/hr PPP**)
  - Bigbosexf: $720 (67.5h = $11/hr, **$55-110/hr PPP**)
- **Upwork:** $1200 (10%)
- **Organization:** $2100 (17.5%) — $1500 AI + $600 Claude Code
- **Nicolas:** $5100 (42.5%)

### 20 missions/month @ $1000 avg

**Total revenue:** $20,000/month

**4-Way Split:**
- **Team:** $6000 (30%)
  - Kara: $3000 (200h = $15/hr nominal, **$75-150/hr PPP**)
  - Reanance: $1800 (50h = $36/hr, **$180-360/hr PPP**)
  - Bigbosexf: $1200 (90h = $13/hr, **$65-130/hr PPP**)
- **Upwork:** $2000 (10%)
- **Organization:** $2100 (10.5%) — $1500 AI + $600 Claude Code
- **Nicolas:** $9900 (49.5%)

---

## Payment Timing

**Trigger:** Nicolas receives payment from Upwork/client

**Timeline:**
```
Day 0: Mission starts
Day 7: AC Green delivered to client
Day 21: Upwork releases funds to Nicolas
Day 21 (same day): Nicolas sends SOL payments to team (instant)
```

**Payment window:** Within **4 hours** of receiving Upwork funds

**Method:** Solana (SOL) - see `payment-implementation.md`

---

## Quality Gates & Penalties

### Payment Holds

**If Sofia finds critical bugs (DoD fails):**
- Developer commission **held** until bugs fixed
- Once fixed and re-verified → payment released

**If client rejects delivery (AC.md not met):**
- **No commission** until client accepts
- If requires major rework → mission treated as failed, no payment

**If mission fails entirely (client cancels, refund issued):**
- Team receives **$0** for that mission
- Nicolas absorbs the loss (risk premium in 70% split)

### Speed Bonuses (Optional - Phase 3)

**If mission delivered in <50% estimated time:**
- Team commission **+10%** bonus
- Example: $600 mission, 7 days estimated, delivered in 3 days
  - Kara: $90 + $9 = $99
  - Reanance: $54 + $5.40 = $59.40
  - Bigbosexf: $36 + $3.60 = $39.60

**Not implemented yet** - waiting for team to prove baseline performance first.

---

## Transparency & Tracking

### What Team Sees

**After each mission completion:**
```
📊 Mission #47 Payment Breakdown

Mission: OpenAI chatbot integration
Client paid: $600
Date: 2025-11-05
SOL price at payment: $180

YOUR EARNINGS:
✅ Kara: $90 (15%) = 0.5 SOL
✅ Reanance: $54 (9%) = 0.3 SOL
✅ Bigbosexf: $36 (6%) = 0.2 SOL

4-WAY BREAKDOWN:
- Team: $180 (30%)
- Upwork: $60 (10%)
- Organization: $210 (35%)
- Nicolas: $150 (25%)

PAYMENT SENT:
✅ 0.5 SOL (~$90) → Kara's wallet (7xK9...)
✅ 0.3 SOL (~$54) → Reanance's wallet (9mP3...)
✅ 0.2 SOL (~$36) → Bigbosexf's wallet (2hR7...)

Transaction IDs: [Solscan links]

You can hold SOL, convert to USDC, or cash out to NGN via Binance.
```

### Monthly Summary

**Sent to team on 1st of month:**
```
📈 October 2025 Summary

Total missions: 12
Total revenue: $7200

YOUR EARNINGS:
Kara: $1080 (from 12 missions)
Reanance: $648
Bigbosexf: $432

Average per mission:
Kara: $90
Reanance: $54
Bigbosexf: $36

Top mission: #52 ($1200 - AI automation)
Fastest delivery: #47 (3 days)
```

---

## Why This Structure Works

### For Team

**1. Competitive rates (3-10x local market)**
- Nigeria median dev salary: ~$300-500/month
- Kara earning: $900-3000/month (3-10x)
- Reanance/Bigbosexf: 2-6x local rates

**2. Purchasing Power Parity advantage**
- $900/month in Nigeria = $4500-9000/month lifestyle (doctor/engineer salary)
- $600/month in Côte d'Ivoire = $3000-6000/month lifestyle

**3. Performance incentives**
- Speed → higher effective $/hr
- Quality → more missions/month
- Higher-value missions → higher absolute earnings

**4. Zero overhead**
- No time tracking
- No timesheets
- No employment paperwork
- Just ship missions, get paid

### For Nicolas

**1. Fair profit margin (25-50% depending on volume)**
- Margin scales with volume (fixed org costs = lower % at higher revenue)
- Fronts all capital (team paid immediately, Nicolas waits 1-3 weeks for Upwork)
- Absorbs all failures (client doesn't pay = Nicolas loss, team protected)
- Built entire Mind Protocol infrastructure (years of R&D)
- Lives in expensive market (Lyon = 11x cost of living vs Lagos)

**Economic reality:** At 10 missions/month, Nicolas earns $1500 (25%) = ~0.9 months living expenses in Lyon. Team earns $900-1800 (30% split) = 3-6 months living expenses in Nigeria/Côte d'Ivoire. Everyone wins, but team has better purchasing power until scale.

**2. Scalable margins**
- Higher prices → better margins (team % stays same, absolute $ increases)
- More missions → economies of scale
- Team gets more efficient → higher $/hr for everyone

**3. Simple operations**
- No payroll
- No employment law
- No benefits/taxes
- Just revenue splits

---

## Purchasing Power Context

**Why team earns "less" nominally but wins massively:**

| Item | France (Nicolas) | Nigeria (Team) | Ratio |
|------|------------------|----------------|-------|
| Rent (1br apt) | €800/month | ₦80k (~$50) | **16x cheaper** |
| Meal at restaurant | €15 | ₦2k (~$1.30) | **11x cheaper** |
| Internet (fiber) | €30/month | ₦10k (~$6.50) | **4.6x cheaper** |
| Transportation | €60/month | ₦15k (~$10) | **6x cheaper** |
| **Total cost of living** | **€1500+/month** | **₦200k (~$130)/month** | **11x cheaper** |

**Economic comparison (10 missions @ $600 avg):**
- Nicolas needs ~€1500 ($1640)/month just to survive in Lyon
- Kara needs ~₦200k ($130)/month to survive in Lagos

**Monthly earnings:**
- Kara: $900 = **6.9 months** of living expenses
- Nicolas: $1500 = **0.9 months** of living expenses

**Why this is fair:**
- Team gets 30% fixed (predictable, high purchasing power)
- Nicolas gets variable margin (25-50%) that scales with volume
- Organization costs ($2100/month) reduce Nicolas's margin at low volume
- At scale (20 missions), Nicolas's margin improves (49.5%) while team still wins massively on purchasing power

---

## Future Adjustments

### When to increase team %:

**Scenario A: Revenue >$20k/month consistently (3+ months)**
- Consider increasing team % to 35% (split: 17%/11%/7%)
- Nicolas still maintains healthy margin at 65%

**Scenario B: Team takes on more responsibility**
- If team starts handling client calls → Reanance +2%
- If team starts finding clients → Bigbosexf +2%
- If team starts architecting solutions → Kara +2%

**Scenario C: After 6+ months proven performance**
- Add base salary component ($200-400/month) + lower commission
- Provides stability while maintaining performance incentives

---

## Payment Structure Summary

**Current (Phase 2 - First 3-6 months):**
- **4-way split:** Team 30% / Upwork 10% / Organization variable / Nicolas variable
- **Team breakdown:** Kara 15% / Reanance 9% / Bigbosexf 6%
- **Organization:** Fixed $2100/month (AI + Claude Code) = 35% @ low volume → 10% @ high volume
- **Nicolas:** Residual profit = 25% @ low volume → 50% @ high volume
- Payment via Solana (SOL) - instant, near-zero fees
- Pay when Nicolas receives Upwork funds

**Future (Phase 3 - After proven track record):**
- Consider base salary + commission hybrid
- Consider speed bonuses (+10% for <50% time)
- Consider referral bonuses (10% of first mission)

**Target state (Phase 4 - Scaled agency):**
- 15-20 missions/month
- Team earning $1500-3000/month each
- Nicolas NET $5000-10,000/month (after all costs)
- Predictable, sustainable, scalable

---

**Questions or adjustments needed? Update this doc and notify team via Telegram.**

---

## Related Documents

- **Implementation:** `/docs/core/payment-implementation.md` (how to execute SOL payments)
- **Team Structure:** `/citizens/CLAUDE.md` (roles and responsibilities)
- **Financial Tracking:** `/citizens/alexis/TODOS.md` (monthly revenue monitoring)
