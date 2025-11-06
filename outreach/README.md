# ScopeLock Telegram Outreach Automation

Automated proof-first outreach system for Telegram prospects.

## 📋 Quick Start

**Read this first:** [`START_HERE.txt`](./START_HERE.txt)

**Then follow:** [`YOUR_ACTION_CHECKLIST_V2.txt`](./YOUR_ACTION_CHECKLIST_V2.txt)

## 📂 Files

### Core Documentation
- **START_HERE.txt** — Navigation guide (read this first)
- **YOUR_ACTION_CHECKLIST_V2.txt** — Step-by-step setup instructions
- **FINAL_OUTREACH_READY_V2.txt** — Complete project summary
- **BEFORE_AFTER_COMPARISON.txt** — Why proof-first approach wins

### Automation
- **telegram_outreach_sender_v2.py** — Main script (handles chunked messages)
- **.env.example** — Credentials template (copy to `.env` and fill in)

### Rewritten Messages (Proof-First)
- **outreach_batch_1_rewritten.txt** — 17 contacts (Priority Tier 1)
- **outreach_batch_2_rewritten.txt** — 6 contacts
- **outreach_batch_4_rewritten.txt** — 20 contacts
- **outreach_batch_5_rewritten.txt** — 24 contacts

### Generated Files (gitignored)
- `.env` — Your Telegram API credentials
- `outreach_contacts_chunked.json` — Generated contact list
- `outreach_log.csv` — Send tracking log
- `scopelock_sender.session` — Telegram auth session

## 🚀 Usage

```bash
# 1. Install dependencies
pip install telethon python-dotenv

# 2. Get Telegram API credentials from https://my.telegram.org/apps

# 3. Create .env file
cp .env.example .env
# Edit .env with your credentials

# 4. Generate contacts JSON
python3 telegram_outreach_sender_v2.py --generate

# 5. Test (dry-run)
python3 telegram_outreach_sender_v2.py --dry-run

# 6. Send messages live
python3 telegram_outreach_sender_v2.py
```

## 📊 What This Does

- **Sends 59 qualified prospect messages** (validated from 2.3M Telegram conversations)
- **Proof-first approach** (live system links + metrics upfront)
- **Chunked delivery** (2-4 messages per contact, 5-10s apart, appears human)
- **Rate limited** (2.5-3.5 min between contacts, Telegram-safe)
- **Technical depth** (shows real expertise to pass "burned founder" filter tests)

## 🎯 Expected Results

- **Reply rate:** 15-25% (vs 2-5% for generic templates)
- **Replies:** 9-15 out of 59 contacts
- **Quality:** Technical questions, project details
- **Timeline:** Replies within 24-48 hours

## 🔗 Proof Links Used

Live Production Systems:
- therapykin.ai (121+ deployments, 6mo production)
- serenissima.ai (97+ agents, 99.7% uptime)
- konginvest.ai ($7M capital, Solana trading)
- kinos.kinprotocol.ai (97+ agents, open-source)

GitHub Verification:
- github.com/nlr-ai/terminal-velocity (1,051 stars)
- github.com/nlr-ai (65K commits in 2024)
- github.com/mind-protocol (23 repos)

Process Documentation:
- scopelock.mindprotocol.ai/

## 📖 Learn More

**Strategic context:** [../docs/marketing/outreach-improvement-analysis.md](../docs/marketing/outreach-improvement-analysis.md)

Explains "burned founder" psychology and why proof-first messaging wins.

## ⚠️ Important Notes

- **Never commit `.env`** (contains your Telegram credentials)
- **Backup before mass-sending** (test with `--dry-run` first)
- **Monitor Telegram for replies** (check the app regularly)
- **Track results** in `outreach_log.csv`

## 🔒 Security

- Uses official Telegram MTProto API (via Telethon)
- Session stored locally (not in cloud)
- Credentials in `.env` (gitignored)
- Rate limiting prevents account flags

## 🏆 Top 10 Priorities (Send First)

1. CodeSensei (Solana/web3 dev, asked for work)
2. ØPTIMUS ONE (Builder, collaboration interest)
3. Mike (Looking for help)
4. Emil (AI/crypto, security-minded)
5. ying (Budget + project discussion)
6. Mel (Builder energy)
7. Leo© (Committed collaborator)
8. 5w4v3ry (Technical focus)
9. Etienne (Collaboration signals)
10. pdx (Solana + token projects)

---

**Created:** 2025-11-06
**Version:** 2.0 (Proof-First Chunked Messages)
**Status:** ✅ Ready to send
