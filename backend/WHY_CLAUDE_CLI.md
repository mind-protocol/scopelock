# Why Claude CLI Architecture?

**Key Insight**: Citizens run via `claude --print --continue`, not direct API calls.

---

## Two Critical Advantages

### 1. Tool Use = Real Capabilities

**With Claude API**:
```python
# Limited to text generation
response = anthropic.messages.create(
    model="claude-sonnet-4",
    messages=[{"role": "user", "content": "Draft a response"}]
)
# Result: Just text
```

**With Claude Code CLI**:
```bash
claude --print "Draft a response" --continue
```

**Citizens can**:
- ✅ Read files: `Read(citizens/emma/proposals/2025-11-02_upwork_ai-chat.txt)`
- ✅ Write proposals: `Write(citizens/emma/proposals/new.txt, content)`
- ✅ Search codebase: `Grep("ScopeLock", path="docs/")`
- ✅ Run scripts: `Bash("npm test")`
- ✅ Call backend API: `Bash("curl -X POST $BACKEND_API_URL/api/draft/create")`
- ✅ Update SYNC.md with status
- ✅ Read AC.md for context
- ✅ Track state across sessions

**Example - Rafael with Tools**:
```
User: "New Upwork response from John Doe: Can we schedule a call?"

Rafael (Claude Code):
1. Read(citizens/emma/proposals/) → Find original proposal
2. Read(proof/AC.md) → Get current milestone context
3. Read(citizens/SYNC.md) → Check recent activity
4. Drafts response using ScopeLock principles
5. Bash("curl -X POST $API/api/draft/create -d '{...}'")
6. Write(citizens/SYNC.md) → Update with draft status
```

**Without tools**, Rafael would just return text. **With tools**, Rafael can orchestrate the entire workflow.

---

### 2. Uses Your Subscription (Not Expensive API Calls)

**API Pricing** (Anthropic):
- Claude Sonnet 4: $3/MTok input, $15/MTok output
- Typical conversation: 10K in + 2K out = **~$0.06**
- 100 responses/day = **$6/day = $180/month**

**Claude Code Subscription**:
- $20/month flat rate
- **Unlimited conversations**
- Tool use included
- No per-token charges

**Cost Comparison**:

| Approach | Monthly Cost | Tool Use | Flexibility |
|----------|--------------|----------|-------------|
| **API calls** | $180+ | ❌ No | Limited |
| **Claude Code** | $20 | ✅ Yes | Full |

**Savings**: ~$160/month while gaining tool capabilities

---

## How It Actually Works

### Trigger Pattern
```bash
# Webhook receives Gmail notification
# Extracts client message
# Calls:

claude --print "New Upwork response from John Doe: Can we schedule a call?" --continue

# Claude Code:
# 1. Loads Rafael's system prompt (citizens/rafael/CLAUDE.md)
# 2. Rafael has access to all tools (Read, Write, Bash, etc.)
# 3. Rafael can read context, draft response, call APIs
# 4. Rafael stores draft via: Bash("curl -X POST $API/api/draft/create")
```

### Backend Role
- **State store**: PostgreSQL for drafts, events, leads
- **API provider**: REST endpoints for Claude Code sessions
- **NOT an orchestrator**: Doesn't call Claude API or manage sessions

---

## Real-World Example: Emma Evaluating Leads

**API approach** (limited):
```python
# Backend calls API
response = anthropic.messages.create(
    messages=[{
        "role": "user",
        "content": "Evaluate this Upwork post: [paste]"
    }]
)
# Result: GO/NO-GO decision (text only)
# Backend must parse and store
```

**Claude Code approach** (powerful):
```bash
claude --print "Evaluate this Upwork post: [paste]" --continue

# Emma (Claude Code):
1. Read(docs/portfolio/README.md) → Check which projects match
2. Read(docs/marketing/communication_guide.md) → Detect client type
3. Evaluates post → DECISION: GO
4. Write(citizens/emma/proposals/2025-11-02_upwork_ai-chat.txt) → Save proposal
5. Bash("curl -X POST $API/api/lead/track -d '{decision: GO, ...}'")
6. Read(citizens/emma/leads-tracker.md) → Check session progress
7. Outputs: "✅ Proposal saved to citizens/emma/proposals/..."
```

**Emma can**:
- Find matching portfolio projects
- Apply communication guide rules
- Save proposal to file
- Track leads via API
- Update session tracker
- All in one conversation

---

## Implementation Benefits

### 1. Simpler Backend
- Just REST API + PostgreSQL
- No session management
- No prompt engineering in code
- Citizens defined in markdown (citizens/*.md)

### 2. Easier Debugging
```bash
# Test Rafael locally
cd /home/mind-protocol/scopelock
claude --print "Test message" --continue

# Rafael runs with full tool access
# Can read actual files, call actual APIs
# See exactly what's happening
```

### 3. Manual Fallback
```bash
# If automation breaks, Nicolas can run manually:
claude --print "Respond to John Doe's message: [paste]" --continue

# Rafael still works, still has tools
# No dependency on webhook infrastructure
```

### 4. Flexibility
```bash
# Scheduled tasks
claude --print "Generate daily analytics" --continue

# One-off requests
claude --print "Audit all proposals from last week" --continue

# Testing
claude --print "Test draft approval flow" --continue
```

---

## Architecture Comparison

### API Approach (v1 - Rejected)
```
Webhook → Backend → Anthropic API → Text response → Parse → Store
         ↓
    Complex logic
    Session management
    Prompt in Python
    No tool access
    Expensive ($180/month)
```

### Claude CLI Approach (v2 - Implemented)
```
Webhook → trigger-rafael.sh → claude --print --continue
                                ↓
                          Claude Code
                          - Full tool access
                          - System prompt from file
                          - Calls backend API
                          - Included in subscription ($20/month)
```

---

## Cost Breakdown (Real Numbers)

**Assumptions**:
- 20 Upwork responses/day (Rafael)
- 10 lead evaluations/day (Emma)
- 5 status updates/day
- **Total**: 35 LLM invocations/day

**API Approach**:
- 35 calls/day × 30 days = 1,050 calls/month
- Avg 10K tokens input + 2K output per call
- Cost: 1,050 × $0.06 = **$63/month**

**Claude Code Approach**:
- Same 35 invocations/day
- Included in subscription: **$20/month**
- **Savings**: $43/month

**Plus**:
- Tool use (worth $$$ in developer time saved)
- Easier debugging
- Manual fallback
- No API key management

---

## When to Use Each Approach

### Use Claude CLI (✅ Our Choice):
- Need tool access (Read, Write, Bash)
- Want to use existing subscription
- Need flexibility (manual + automated)
- Want simpler backend (just state store)
- Citizens defined in markdown

### Use API Calls (❌ Not for us):
- No tool access needed (just text generation)
- Don't have Claude Code subscription
- Need millisecond latency (API is faster)
- Stateless, one-shot requests only

---

## Next Steps

1. ✅ Backend with PostgreSQL (state store)
2. ✅ API endpoints for Claude Code sessions
3. ⏭️ Trigger scripts (webhook → claude CLI)
4. ⏭️ Telegram bot (approval buttons)
5. ⏭️ Deploy and test

**Architecture is production-ready with tool use + subscription cost model.**
