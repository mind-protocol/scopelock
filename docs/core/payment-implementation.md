# ScopeLock Payment Implementation (Solana)

**Version:** 1.0
**Last Updated:** 2025-11-05
**Owner:** Nicolas (Operations)
**Method:** Solana (SOL) direct payments

---

## Why Solana (SOL) Direct

**Advantages over traditional methods:**

| Feature | Solana (SOL) | USDC | Wise | Bank Wire | Payoneer |
|---------|--------------|------|------|-----------|----------|
| **Speed** | **Instant** (2-5 sec) | Instant | 1-2 days | 3-7 days | 1-3 days |
| **Fees** | **~$0.0001/tx** | ~$0.001 | 0.5-1.5% | €15-30 | 2-3% |
| **Automation** | **Fully scriptable** | Scriptable | API | Manual | Limited |
| **Transparency** | **On-chain (public)** | On-chain | Platform | Private | Platform |
| **Works without banks** | **Yes** | Yes | Needs bank | Needs bank | Needs account |
| **Conversion step** | **None** | Need to buy USDC | N/A | N/A | N/A |

**Why SOL instead of USDC:**
- ✅ No conversion needed (you likely hold SOL already from konginvest.ai)
- ✅ Even lower fees (~$0.0001 vs $0.001 for USDC)
- ✅ Team can choose: hold SOL or convert to stablecoin
- ✅ Simpler (one token, not two)
- ⚠️ Slight volatility (SOL price fluctuates, but payment amount in $ is fixed)

**For ScopeLock:**
- ✅ Team gets paid **same day** Nicolas receives Upwork funds
- ✅ Costs **$0.0003 total** to pay 3 people (vs $20-50 for Wise/banks)
- ✅ Fully automatable (script can send payments automatically)
- ✅ Transparent (team can verify transactions on blockchain)
- ✅ Nicolas has Solana experience (konginvest.ai runs on Solana)

---

## Setup (One-Time)

### Step 1: Nicolas Wallet Setup (5 min)

**Option A: Use existing wallet** (Recommended)
If you already have a Solana wallet with SOL (likely from konginvest.ai):
- ✅ Use that wallet
- ✅ Ensure it has enough SOL for payments + fees
- ✅ Example: For 10 missions @ $600 avg = need ~$1800 in SOL for team payments

**Option B: Create new payment wallet**
If you want separate wallet for ScopeLock payments:

1. **Install Phantom wallet** (most popular Solana wallet)
   - Download: phantom.app
   - Create new wallet
   - **CRITICAL:** Backup seed phrase (12 words) - write on paper, store safely

2. **Fund with SOL** (for payments + fees)
   - Buy SOL on Binance/Kraken/Coinbase
   - Withdraw to Phantom wallet address
   - Keep buffer for payments (see "Funding Strategy" below)

### Step 2: Team Wallet Setup (10 min each)

**Send this message to team (Telegram):**

```
📬 Payment Setup - Solana Wallet (One-Time)

We're using Solana (SOL) for instant payments (no banks needed,
received in seconds vs 1-3 days).

SETUP (takes 10 minutes):

1. Download Phantom wallet
   - Mobile: phantom.app (iOS/Android)
   - Desktop: phantom.app/download

2. Create wallet
   - Write down 12-word seed phrase on paper
   - NEVER share this with anyone (not even me)
   - If you lose it, you lose access to funds

3. Send me your wallet address
   - In Phantom: tap "Receive"
   - Copy the address (starts with letters/numbers, ~44 chars)
   - Send to me via Telegram

That's it! When mission pays, you'll receive SOL instantly.

To cash out SOL → NGN/XOF:
- Use Binance (most common in Nigeria/Côte d'Ivoire)
- Sell SOL directly for NGN, or convert SOL → USDC → NGN
- Tutorial: [I'll send detailed guide after setup]

Questions? Let me know.

- Nicolas
```

**What you'll receive from each:**
```
Kara: 7xK9...4Dz2 (Solana wallet address)
Reanance: 9mP3...8Fk1
Bigbosexf: 2hR7...6Nn4
```

**Verify addresses:**
- Must be ~44 characters
- Case-sensitive
- Starts with letters/numbers (base58 encoding)
- Test with $1 USDC first before large payments

---

## Sending Payments (Per Mission)

### Manual Method (Phase 2 - Now)

**When Upwork pays you $600:**

1. **Calculate splits in USD** (use spreadsheet or calculator)
   ```
   Mission #47: $600
   - Kara: $90 (15%)
   - Reanance: $54 (9%)
   - Bigbosexf: $36 (6%)
   ```

2. **Check current SOL price** (Phantom shows it, or check coinmarketcap.com)
   ```
   Example: SOL = $180/coin

   Kara: $90 ÷ $180 = 0.5 SOL
   Reanance: $54 ÷ $180 = 0.3 SOL
   Bigbosexf: $36 ÷ $180 = 0.2 SOL
   ```

3. **Open Phantom wallet**
   - Click "Send"
   - Select "SOL" (native Solana token)
   - Paste Kara's address: `7xK9...4Dz2`
   - Amount: `0.5` SOL
   - Click "Send" → Confirm
   - **Cost: ~$0.0001, Time: 2-5 seconds**

4. **Repeat for Reanance and Bigbosexf**
   - Reanance: 0.3 SOL
   - Bigbosexf: 0.2 SOL
   - Total time: ~2 minutes
   - Total fees: ~$0.0003

5. **Copy transaction IDs** (for records)
   - After each send, Phantom shows transaction ID
   - Copy and paste into payment tracker spreadsheet

6. **Notify team (Telegram)**
   ```
   ✅ Mission #47 payments sent!

   Kara: 0.5 SOL (~$90 at current rate)
   Reanance: 0.3 SOL (~$54)
   Bigbosexf: 0.2 SOL (~$36)

   Should arrive in your Phantom wallets in ~30 seconds.

   You can hold SOL or convert to USDC/NGN immediately.

   Transaction: solscan.io/tx/[TX_ID]
   ```

**Total time:** 3-5 minutes per mission

---

### Automated Method (Phase 3 - Later)

**Once you're doing 10+ missions/month, automate with script:**

**Setup (one-time, 2 hours):**

1. **Install Solana CLI** (or use `@solana/web3.js` in Node.js)
2. **Create payment script** (`scripts/pay-team.ts`)
3. **Store team wallet addresses in config**
4. **Run script with mission details**

**Usage:**
```bash
# Pay for mission #47
npm run pay-team -- --mission 47 --revenue 600

# Script automatically:
# - Calculates splits (15%/9%/6%)
# - Sends USDC to 3 wallets
# - Logs transactions
# - Sends Telegram notifications
```

**I can build this script for you later** (4-8 hours work). Not needed yet.

---

## Team Cashing Out (SOL → Local Currency)

**Team receives SOL in Phantom wallet. How do they get NGN/XOF cash?**

### Method 1: Binance Direct (Recommended)

**Most popular in Nigeria/Côte d'Ivoire:**

**Steps for team:**

1. **Create Binance account** (binance.com)
   - Free signup
   - Verify ID (takes 10 min)
   - Binance supports SOL → NGN directly

2. **Deposit SOL from Phantom to Binance**
   - In Phantom: "Send" → Binance SOL deposit address
   - **CRITICAL:** Use Solana network (it's the only option for SOL)
   - Arrives in ~1 minute

3. **Option A: Sell SOL directly for NGN (Binance P2P)**
   - Binance P2P marketplace has SOL/NGN pairs
   - Typical rate: 1 SOL = ₦280,000 (at $180/SOL, ₦1560/$)
   - Fees: **0%** (P2P is free)
   - Time: 5-30 minutes (depends on finding buyer)
   - Receive NGN directly in local bank account

4. **Option B: Convert SOL → USDC → NGN (if no SOL/NGN buyer)**
   - Trade SOL for USDC on Binance spot market (0.1% fee)
   - Then use USDC P2P to get NGN (more liquidity)
   - Total time: 10-40 minutes

**Total time:** 30-60 minutes
**Total fees:** ~0.1-0.5% (via exchange rate spread)

**Tutorial I'll send team:**
```
📱 How to Cash Out SOL → NGN (Binance)

[Step-by-step screenshots]
[Video walkthrough for both Option A (SOL→NGN direct) and Option B (SOL→USDC→NGN)]
[Common issues & fixes]
```

---

### Method 2: Local Crypto Exchanges

**Nigeria-specific:**
- **Luno** (luno.com) - popular, supports SOL, higher fees (~2%)
- **Bundle Africa** - similar to Binance P2P
- **Yellow Card** - also supports SOL

**Côte d'Ivoire:**
- **Binance** (works everywhere, best rates)
- **Yellow Card** (West Africa focused)
- **CryptoLocally** (P2P marketplace)

**Process:** Similar to Binance - deposit SOL, sell for local currency, withdraw to bank.

---

### Method 3: Hold SOL or Convert to Stablecoin (Team choice)

**Team can choose what to do with SOL:**

**Option A: Hold SOL (if bullish on crypto)**
- Keep SOL in Phantom wallet
- Value fluctuates with market (could go up or down)
- Cash out later when needed

**Option B: Convert to USDC immediately (if want stability)**
- In Phantom: Swap SOL → USDC (0.3% fee, instant)
- USDC stays at $1 (no volatility)
- Cash out USDC to NGN via Binance P2P when needed

**Option C: Cash out immediately (if need money now)**
- Follow Method 1 above (SOL → NGN via Binance)
- Get local currency in bank same day

---

## Payment Tracking System

### Spreadsheet Template (Use This)

**Google Sheet: "ScopeLock Mission Payments"**

| Mission # | Date | Revenue | SOL Price | Kara ($90) | Kara (SOL) | Reanance ($54) | Reanance (SOL) | Bigbosexf ($36) | Bigbosexf (SOL) | TX ID (Kara) | TX ID (Reanance) | TX ID (Bigbosexf) | Payment Date |
|-----------|------|---------|-----------|------------|------------|----------------|----------------|-----------------|-----------------|--------------|------------------|------------------|--------------|
| 47 | 2025-11-05 | $600 | $180 | $90 | 0.5 | $54 | 0.3 | $36 | 0.2 | 5k3m...8x | 7n2p...4z | 9h4k...2w | 2025-11-05 |
| 48 | 2025-11-08 | $400 | $185 | $60 | 0.324 | $36 | 0.195 | $24 | 0.130 | 2m9k...1b | 4p3n...7c | 8z1h...5v | 2025-11-08 |

**Add formulas:**
- Kara USD: `= C2 * 0.15`
- Kara SOL: `= E2 / D2` (USD amount ÷ SOL price)
- Reanance USD: `= C2 * 0.09`
- Reanance SOL: `= G2 / D2`
- Bigbosexf USD: `= C2 * 0.06`
- Bigbosexf SOL: `= I2 / D2`

**Share with team** (view-only) for full transparency.

---

### Transaction Verification (Public Blockchain)

**Anyone can verify payments on Solscan:**

Example:
```
Nicolas sends 0.5 SOL (~$90) to Kara

Transaction link:
solscan.io/tx/5k3m8xB7nP2zH4vC9kF1dL6tR3wQ8yJ5mN4xS2pK1bV7cZ9h

Shows:
- From: [Nicolas's wallet]
- To: [Kara's wallet]
- Amount: 0.5 SOL
- Fee: 0.000005 SOL (~$0.0001)
- Time: 2025-11-05 14:32:18 UTC
- Status: ✅ Success
```

**Team can independently verify they received correct amounts.** Full transparency.

---

## Funding Strategy (Upwork → SOL)

**Nicolas receives Upwork payments in EUR. How to get SOL for payments?**

### Option A: Use Existing SOL (Recommended if you have konginvest.ai holdings)

**If you already hold SOL:**
1. ✅ Use existing SOL balance for payments
2. ✅ Keep buffer of ~$2000-3000 in SOL (covers 10-15 missions)
3. ✅ Replenish monthly from Upwork earnings

**Advantages:**
- No conversion needed immediately
- Pay team same day (instant)
- Simple operations

---

### Option B: Upwork → Bank → Exchange → SOL

**Flow:**
1. Upwork pays €600 → Nicolas's French bank account
2. SEPA transfer €600 → Kraken/Binance (free, 1 day)
3. Buy SOL with EUR on exchange (0.1% fee = €0.60)
4. Withdraw SOL to Phantom wallet (~$0.01 fee, 2 minutes)

**Total time:** 2-3 days
**Total fees:** ~0.2% (~€1.20 on €600)

---

### Option C: Keep SOL Buffer (Recommended for scaling)

**Strategy:**
1. **Initial setup:** Keep ~$2000-3000 in SOL (covers 10-15 missions @ $600 avg)
2. **Use buffer** to pay team immediately when missions complete
3. **Replenish monthly:** Convert Upwork earnings → SOL in batches

**Advantages:**
- ✅ Pay team **same day** (don't wait for bank transfers)
- ✅ Lower fees (batch conversions = fewer transactions)
- ✅ Smoother operations
- ✅ May benefit from SOL price appreciation (bonus upside)

**Example:**
```
Week 1: Mission pays $600 → Pay team $180 in SOL from buffer
Week 2: Mission pays $400 → Pay team $120 in SOL from buffer
Week 3: Mission pays $800 → Pay team $240 in SOL from buffer
Week 4: Mission pays $600 → Pay team $180 in SOL from buffer

Month end:
- Total paid to team: $720 in SOL
- Replenish buffer: Convert €700 → SOL once
- Fees: ~€1.40 (vs €5.60 if done per mission)
```

**Volatility note:** SOL price fluctuates, but payments are calculated in $ at time of sending, so team always gets correct $ value (even if SOL amount varies).

---

## Security Best Practices

### For Nicolas

**1. Wallet security:**
- ✅ Hardware wallet for large amounts (Ledger supports Solana)
- ✅ Keep seed phrase on paper, not digital
- ✅ Use separate wallet for ScopeLock (not personal funds)
- ✅ Enable 2FA on all exchanges

**2. Transaction verification:**
- ✅ Always double-check wallet addresses before sending
- ✅ Test with $1 first time sending to new address
- ✅ Copy-paste addresses (don't type manually)

**3. Private key management:**
- ❌ Never share seed phrase or private key
- ❌ Never store in cloud (Dropbox, Google Drive)
- ❌ Never send via Telegram/WhatsApp

---

### For Team

**Send this security guide:**

```
🔒 Wallet Security - CRITICAL

Your 12-word seed phrase = your money. If someone gets it,
they can steal everything.

DO:
✅ Write seed phrase on paper
✅ Store paper in safe place (locked drawer, safe)
✅ Make 2 copies (one backup)
✅ NEVER take photos of it
✅ NEVER store in phone notes, cloud, email

DON'T:
❌ Share seed phrase with ANYONE (including me)
❌ Store seed phrase digitally
❌ Click random links promising "free crypto"
❌ Connect wallet to unknown websites

If you lose seed phrase → you lose access forever (I can't help).
If someone steals seed phrase → they can take all your USDC.

Questions? Ask before doing anything risky.

- Nicolas
```

---

## Common Issues & Solutions

### Issue 1: "Insufficient SOL for transaction fee"

**Problem:** Phantom says "Not enough SOL"
**Solution:** Team needs tiny amount of SOL (~$0.50 worth) for fees

**Fix:**
```
Nicolas sends 0.1 SOL (~$20) to each team member (one-time)
- Kara: 0.1 SOL
- Reanance: 0.1 SOL
- Bigbosexf: 0.1 SOL

This covers ~10,000 transactions each (years of fees)
```

---

### Issue 2: "Wrong network selected"

**Problem:** Team tries to deposit USDC to Binance via Ethereum network (expensive!)
**Solution:** Always use **Solana network** for USDC transfers

**How to check:**
- Phantom shows "Solana USDC" (SPL token)
- Binance deposit: Select "SOL" network, not "ETH" or "BEP20"

---

### Issue 3: "Can't cash out in my country"

**Problem:** Binance P2P not available or low liquidity
**Solution:** Alternative exchanges

**Nigeria:** Luno, Bundle Africa, Yellow Card (all support NGN)
**Côte d'Ivoire:** Yellow Card, CryptoLocally, or Binance P2P (works globally)

---

### Issue 4: "Payment didn't arrive"

**Problem:** Team says "I didn't receive USDC"
**Solution:** Check transaction on Solscan

**Steps:**
1. Get transaction ID from Nicolas's Phantom wallet
2. Visit: `solscan.io/tx/[TX_ID]`
3. Check:
   - Status: Success?
   - To address: Matches team member's wallet?
   - Amount: Correct?
4. If successful → team needs to refresh Phantom app
5. If failed → check wallet address, resend

---

## Cost Comparison (Real Example)

**Scenario: Pay team for $600 mission**

### Traditional (Wise)

```
Kara: €90 → ₦140,400 NGN
- Wise fee: ~€1.35 (1.5%)
- Time: 1-2 days

Reanance: €54 → ₦84,240 NGN
- Wise fee: ~€0.81
- Time: 1-2 days

Bigbosexf: €36 → ₦56,160 NGN
- Wise fee: ~€0.54
- Time: 1-2 days

TOTAL:
- Fees: €2.70
- Time: 1-2 days
- Manual work: 15 minutes (3 separate transfers)
```

### Solana (SOL)

```
Kara: 0.5 SOL (~$90) → ₦140,400 NGN (via Binance)
- SOL fee: ~$0.0001
- Time: 2-5 seconds

Reanance: 0.3 SOL (~$54)
- SOL fee: ~$0.0001
- Time: 2-5 seconds

Bigbosexf: 0.2 SOL (~$36)
- SOL fee: ~$0.0001
- Time: 2-5 seconds

TOTAL:
- Fees: $0.0003 (~€0.00027)
- Time: Instant (2 minutes total including calculation)
- Manual work: 5 minutes
```

**Savings:** €2.70 - €0.00027 = **€2.70 per mission saved**

**At 10 missions/month:** €27/month saved = €324/year
**At 15 missions/month:** €40.50/month saved = €486/year

**Plus:** Team gets paid same day (vs 1-2 days wait)

**Savings ratio:** Wise costs **10,000x more** than SOL payments (€2.70 vs €0.00027)

---

## Automation Roadmap (Future)

### Phase 3: Semi-Automated (After 15+ missions/month)

**Build payment script:**
```typescript
// scripts/pay-team.ts

import { Connection, Keypair, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const TEAM_WALLETS = {
  kara: new PublicKey('7xK9...4Dz2'),
  reanance: new PublicKey('9mP3...8Fk1'),
  bigbosexf: new PublicKey('2hR7...6Nn4')
};

async function payTeam(missionRevenue: number, solPrice: number) {
  // Calculate USD splits
  const usdSplits = {
    kara: missionRevenue * 0.15,
    reanance: missionRevenue * 0.09,
    bigbosexf: missionRevenue * 0.06
  };

  // Convert to SOL amounts
  const solSplits = {
    kara: usdSplits.kara / solPrice,
    reanance: usdSplits.reanance / solPrice,
    bigbosexf: usdSplits.bigbosexf / solPrice
  };

  // Send SOL to each wallet
  for (const [member, solAmount] of Object.entries(solSplits)) {
    const tx = await sendSOL(TEAM_WALLETS[member], solAmount);
    console.log(`Paid ${member}: ${solAmount} SOL (~$${usdSplits[member]}) - TX: ${tx}`);
  }

  // Log to spreadsheet
  // Send Telegram notifications
}
```

**Usage:**
```bash
npm run pay-team -- --revenue 600 --sol-price 180
# Calculates and pays:
# - Kara: 0.5 SOL (~$90)
# - Reanance: 0.3 SOL (~$54)
# - Bigbosexf: 0.2 SOL (~$36)
```

**Time saved:** 5 minutes → 30 seconds

---

### Phase 4: Fully Automated (After 20+ missions/month)

**Integrate with Upwork webhook:**
```
Upwork payment received
  → Webhook triggers script
    → Calculates team splits
      → Sends USDC automatically
        → Logs to spreadsheet
          → Notifies team via Telegram

ZERO manual work
```

**Investment:** 8-16 hours to build
**ROI:** Worth it at 20+ missions/month (saves 2-3 hours/month)

---

## Getting Started (This Week)

**Action plan:**

1. **Nicolas: Setup wallet** (5 min)
   - Use existing Solana wallet (likely from konginvest.ai) OR install Phantom
   - Ensure ~$2000-3000 worth of SOL in wallet (buffer for 10-15 missions)
   - If needed: Buy SOL on exchange and withdraw to wallet

2. **Send setup message to team** (5 min)
   - Use template above (updated for SOL)
   - Ask for wallet addresses

3. **Test payments** (10 min)
   - Check current SOL price (example: $180)
   - Calculate test amount: $1 ÷ $180 = 0.0056 SOL
   - Send ~0.006 SOL to each team member
   - Verify they receive it
   - Confirm addresses are correct

4. **Send cash-out guide** (10 min)
   - Binance SOL → NGN tutorial (screenshots + video for both direct and via USDC)
   - Alternative exchanges for their countries
   - Security best practices

5. **Create payment tracker** (15 min)
   - Google Sheet with template above (includes SOL price column)
   - Add formulas for auto-calculating SOL amounts
   - Share view-only with team

**Total setup time: ~45 minutes**

**After first mission completes:** Test full payment flow with real amounts (calculate SOL at current price, send, verify team receives).

---

## Questions & Support

**For team:**
- Telegram: Ask Nicolas anytime
- Video calls available for wallet setup if needed

**For Nicolas:**
- Solana docs: docs.solana.com
- Phantom support: help.phantom.app
- Binance P2P guide: binance.com/en/support/faq/p2p

---

## Related Documents

- **Payment Structure:** `/docs/core/payment-structure.md` (commission %, examples, rationale)
- **Team Structure:** `/citizens/CLAUDE.md` (roles, responsibilities)
- **Financial Tracking:** `/citizens/alexis/TODOS.md` (monthly metrics)

---

**Ready to launch. Let's pay the team instantly. 🚀**
