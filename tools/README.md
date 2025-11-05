# ScopeLock Tools

Utilities for proposal automation and notifications.

---

## telegram-send.cjs ⭐ NEW

**General-purpose Telegram messenger for all citizens.**

Send any message to Telegram with smart formatting and chunking.

### Quick Start

```bash
# Simple message
node /home/mind-protocol/scopelock/tools/telegram-send.cjs "Task completed ✅"

# With HTML formatting
node telegram-send.cjs "<b>Build deployed:</b> scopelock.mindprotocol.ai"

# Pipe from command output
echo "Tests passed: 47/47" | node telegram-send.cjs

# Send file contents
node telegram-send.cjs "$(cat report.txt)"
```

### Features

- ✅ **HTML formatting** (bold, italic, links)
- ✅ **Smart chunking** (500 chars, paragraph-aware, sentence-aware)
- ✅ **Auto-escaping** (safe for any content)
- ✅ **Fallback** (plain text if HTML fails)
- ✅ **Emoji support**
- ✅ **No dependencies** (pure Node.js)

### HTML Formatting Examples

```bash
# Bold
node telegram-send.cjs "<b>Important update</b>"

# Italic
node telegram-send.cjs "<i>Note: This is optional</i>"

# Link
node telegram-send.cjs '<a href="https://example.com">Check deployment</a>'

# Combined
node telegram-send.cjs "<b>Deployment:</b> <a href=\"https://example.com\">Live</a> ✅"
```

### When to Use

**Use `telegram-send.cjs` for:**
- ✅ Quick status updates from any citizen
- ✅ Build/deployment notifications
- ✅ Error alerts
- ✅ Task completion messages
- ✅ SYNC.md updates to humans
- ✅ DevOps alerts (Rafael)
- ✅ QA completion notices (Sofia)
- ✅ Spec ready notifications (Inna)

**Use `telegram-notify.cjs` for:**
- ✅ Emma's proposal notifications (structured JSON format)

---

## telegram-notify.cjs

**Structured proposal notifications for Emma.**

Sends Emma's proposals to Telegram with rich formatting.

### Purpose

When Emma writes a proposal, she:
1. Saves `.txt` file (human-readable)
2. Saves `.json` file (structured data)
3. Calls this tool to notify humans via Telegram

### Environment Setup

Add to your shell profile (`.bashrc`, `.zshrc`):

```bash
export TELEGRAM_BOT_TOKEN="your-bot-token-from-botfather"
export TELEGRAM_CHAT_ID="your-chat-id"
```

**How to get these:**
1. **Bot Token:** Message [@BotFather](https://t.me/BotFather) on Telegram, create a new bot
2. **Chat ID:** Message [@userinfobot](https://t.me/userinfobot) to get your chat ID

### Usage

```bash
node /home/mind-protocol/scopelock/tools/telegram-notify.cjs \
  --proposal /home/mind-protocol/scopelock/citizens/emma/proposals/2025-11-05_upwork_title.json
```

### What Gets Sent

1. **Main message** with:
   - **Decision** (STRONG GO / QUALIFIED MAYBE) with emoji
   - **Platform**, confidence score
   - **Job title** (bold)
   - Budget range, bid amount
   - Client info (spent, rating, verification)
   - Portfolio match
   - **Full proposal text** (chunked naturally at 500 chars)
   - **Job URL** (clickable link)

2. **Questions** (if any):
   - Header message
   - One message per question (bold numbering)

### New Features (2025-11-05)

- ✅ **HTML formatting** for better visual hierarchy
- ✅ **Smart chunking** (500 chars, feels conversational)
- ✅ **Clickable links** (`<a href="...">`)
- ✅ **Bold headers** for sections
- ✅ **Paragraph-aware splitting** (natural message flow)
- ✅ **Sentence-aware splitting** (doesn't break mid-sentence)
- ✅ **Auto-fallback** to plain text if formatting fails

### Expected JSON Format

See `/home/mind-protocol/scopelock/citizens/emma/CLAUDE.md` section "Output File Requirement" for full schema.

**Minimal example:**

```json
{
  "timestamp": "2025-11-05T14:23:45Z",
  "platform": "upwork",
  "job_title": "Build AI Chat Widget",
  "job_url": "https://www.upwork.com/jobs/~021985...",
  "decision": "STRONG GO",
  "confidence": 85,
  "budget_range": "$5,000-$8,000",
  "proposal_text": "I noticed you need...",
  "questions": [
    "Which integration matters most: Stripe or custom payment gateway?"
  ],
  "bid_amount": 6500
}
```

### Error Handling

- Missing environment variables → Exits with error message
- Missing `--proposal` argument → Exits with usage instructions
- Invalid JSON → Exits with parse error
- Missing required fields → Exits with field name
- Telegram API error → Auto-retries with plain text, then exits with HTTP status

### Testing

Create a test proposal JSON and run:

```bash
node telegram-notify.cjs --proposal test-proposal.json
```

Check Telegram for formatted notifications.

---

## Implementation Notes (Rafael)

### Why HTML Mode Instead of MarkdownV2?

Based on Reddit research (Stack Overflow, GitHub issues, Telegram forums):

**MarkdownV2 problems:**
- 18 special characters need escaping: `_ * [ ] ( ) ~ ` > # + - = | { } . !`
- AI-generated content contains invisible characters that break parsing
- Double-escaping hell with backslashes
- Dots in variable names cause issues
- Hard to debug parsing errors

**HTML mode advantages:**
- Only 3 characters to escape: `<`, `>`, `&`
- More predictable with AI-generated content
- Better error messages
- Easier to debug
- Reddit consensus: "HTML mode for reliability"

### Smart Chunking Strategy

**Target:** 500 characters per message (feels conversational)

**Splitting logic:**
1. Split at paragraph boundaries (`\n\n`) first
2. If paragraph >500 chars, split at sentence boundaries (`. `, `! `, `? `)
3. If sentence >4096 chars (Telegram hard limit), force split

**Why this works:**
- Messages appear natural in chat flow
- Respects semantic boundaries (paragraphs, sentences)
- Never breaks mid-sentence (better UX)
- Multiple smaller messages > one giant wall of text

### Auto-Escaping

```javascript
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')   // Must be first!
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
```

**Critical:** Escape `&` first to avoid double-escaping.

### Fallback Strategy

If HTML parsing fails (Telegram returns `can't parse entities`):
1. Detect error in API response
2. Automatically retry with `parse_mode` undefined (plain text)
3. Warn user about fallback
4. Message still gets delivered

This ensures **zero message loss** even with malformed HTML.

---

## Future Tools

- `vollna-webhook.js` — Receive Vollna job posts and trigger Emma
- `proposal-stats.js` — Analyze win rates from proposal JSONs
- `client-tracker.js` — Track client responses and follow-ups

---

## Environment Variables Reference

All Telegram tools require:

```bash
# Required for all tools
export TELEGRAM_BOT_TOKEN="7734536118:AAEK_pX3GMgZzEo-FBGYH8RuMoZTXjg-Q3A"
export TELEGRAM_CHAT_ID="-1003129655007"
```

**Where to add:**
- `.bashrc` (Linux, Git Bash)
- `.zshrc` (macOS, Oh My Zsh)
- System environment variables (Windows)

**Verify setup:**
```bash
echo $TELEGRAM_BOT_TOKEN
echo $TELEGRAM_CHAT_ID
```

Both should output values.

---

**Last updated:** 2025-11-05
**Improved by:** Rafael (ScopeLock Code Generation & DevOps)
**Based on:** Reddit research, Telegram Bot API docs, user feedback
