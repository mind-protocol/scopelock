# FalkorDB GET Query Examples

All these queries work with: `GET https://scopelock.onrender.com/api/graph/query?q=<encoded_query>`

## 1. Session Start - Get Today's Search Plan

**Cypher:**
```cypher
MATCH (m:U4_Work_Item {slug: 'search-plan-2025-11-07', work_type: 'milestone'})-[r:U4_DEPENDS_ON]->(t:U4_Work_Item {work_type: 'task'}) RETURN t.name, t.url, t.keywords, t.search_type, t.expected_quality, t.execution_priority, r.recommended_for ORDER BY t.execution_priority
```

**GET URL:**
```
https://scopelock.onrender.com/api/graph/query?q=MATCH%20(m%3AU4_Work_Item%20%7Bslug%3A%20%27search-plan-2025-11-07%27%2C%20work_type%3A%20%27milestone%27%7D)-%5Br%3AU4_DEPENDS_ON%5D-%3E(t%3AU4_Work_Item%20%7Bwork_type%3A%20%27task%27%7D)%20RETURN%20t.name%2C%20t.url%2C%20t.keywords%2C%20t.search_type%2C%20t.expected_quality%2C%20t.execution_priority%2C%20r.recommended_for%20ORDER%20BY%20t.execution_priority&limit=50
```

## 2. Log Search Execution

**Cypher:**
```cypher
CREATE (e:U4_Event {type_name: 'U4_Event', event_kind: 'upwork_search', name: 'Upwork Search: AI assistant customer support', slug: 'search-2025-11-07-001', description: 'Upwork search for AI assistant jobs', level: 'L2', scope_ref: 'scopelock', actor_ref: 'emma', search_query: 'build AI assistant customer support', jobs_filtered: 50, proposals_sent: 0, platform: 'upwork', timestamp: datetime(), created_by: 'emma', substrate: 'organizational', visibility: 'partners', policy_ref: 'l4://law/scopelock-tracking-policy', proof_uri: '', created_at: datetime(), updated_at: datetime(), valid_from: datetime(), valid_to: null}) RETURN e.slug
```

**GET URL:**
```
https://scopelock.onrender.com/api/graph/query?q=CREATE%20(e%3AU4_Event%20%7Btype_name%3A%20%27U4_Event%27%2C%20event_kind%3A%20%27upwork_search%27%2C%20name%3A%20%27Upwork%20Search%3A%20AI%20assistant%20customer%20support%27%2C%20slug%3A%20%27search-2025-11-07-001%27%2C%20description%3A%20%27Upwork%20search%20for%20AI%20assistant%20jobs%27%2C%20level%3A%20%27L2%27%2C%20scope_ref%3A%20%27scopelock%27%2C%20actor_ref%3A%20%27emma%27%2C%20search_query%3A%20%27build%20AI%20assistant%20customer%20support%27%2C%20jobs_filtered%3A%2050%2C%20proposals_sent%3A%200%2C%20platform%3A%20%27upwork%27%2C%20timestamp%3A%20datetime()%2C%20created_by%3A%20%27emma%27%2C%20substrate%3A%20%27organizational%27%2C%20visibility%3A%20%27partners%27%2C%20policy_ref%3A%20%27l4%3A%2F%2Flaw%2Fscopelock-tracking-policy%27%2C%20proof_uri%3A%20%27%27%2C%20created_at%3A%20datetime()%2C%20updated_at%3A%20datetime()%2C%20valid_from%3A%20datetime()%2C%20valid_to%3A%20null%7D)%20RETURN%20e.slug
```

## 3. Track Proposal Sent

**Cypher:**
```cypher
CREATE (p:U3_Deal {type_name: 'U3_Deal', deal_kind: 'service', name: 'Proposal: Build AI Chatbot MVP', slug: 'proposal-2025-11-07-chatbot', description: 'Proposal for AI chatbot with Stripe integration', level: 'L2', scope_ref: 'scopelock', state: 'Proposed', job_title: 'Build AI Chatbot MVP', job_url: 'https://upwork.com/jobs/123', platform: 'upwork', amount_value: 5000.0, amount_ccy: 'USD', budget_cents: 500000, client_name: 'John Doe', client_spent: 12500.50, client_rating: 4.9, client_hires: 15, client_payment_verified: true, client_country: 'United States', proposal_text: 'Full proposal content...', decision: 'STRONG GO', confidence: 0.85, client_type: 'process-skeptical', portfolio_match: 'TherapyKin', urgency: 8, pain: 9, created_by: 'emma', substrate: 'organizational', visibility: 'partners', policy_ref: 'l4://law/scopelock-tracking-policy', proof_uri: '', created_at: datetime(), updated_at: datetime(), valid_from: datetime(), valid_to: null}) RETURN p.slug
```

**GET URL:**
```
https://scopelock.onrender.com/api/graph/query?q=CREATE%20(p%3AU3_Deal%20%7Btype_name%3A%20%27U3_Deal%27%2C%20deal_kind%3A%20%27service%27%2C%20name%3A%20%27Proposal%3A%20Build%20AI%20Chatbot%20MVP%27%2C%20slug%3A%20%27proposal-2025-11-07-chatbot%27%2C%20description%3A%20%27Proposal%20for%20AI%20chatbot%20with%20Stripe%20integration%27%2C%20level%3A%20%27L2%27%2C%20scope_ref%3A%20%27scopelock%27%2C%20state%3A%20%27Proposed%27%2C%20job_title%3A%20%27Build%20AI%20Chatbot%20MVP%27%2C%20job_url%3A%20%27https%3A%2F%2Fupwork.com%2Fjobs%2F123%27%2C%20platform%3A%20%27upwork%27%2C%20amount_value%3A%205000.0%2C%20amount_ccy%3A%20%27USD%27%2C%20budget_cents%3A%20500000%2C%20client_name%3A%20%27John%20Doe%27%2C%20client_spent%3A%2012500.50%2C%20client_rating%3A%204.9%2C%20client_hires%3A%2015%2C%20client_payment_verified%3A%20true%2C%20client_country%3A%20%27United%20States%27%2C%20proposal_text%3A%20%27Full%20proposal%20content...%27%2C%20decision%3A%20%27STRONG%20GO%27%2C%20confidence%3A%200.85%2C%20client_type%3A%20%27process-skeptical%27%2C%20portfolio_match%3A%20%27TherapyKin%27%2C%20urgency%3A%208%2C%20pain%3A%209%2C%20created_by%3A%20%27emma%27%2C%20substrate%3A%20%27organizational%27%2C%20visibility%3A%20%27partners%27%2C%20policy_ref%3A%20%27l4%3A%2F%2Flaw%2Fscopelock-tracking-policy%27%2C%20proof_uri%3A%20%27%27%2C%20created_at%3A%20datetime()%2C%20updated_at%3A%20datetime()%2C%20valid_from%3A%20datetime()%2C%20valid_to%3A%20null%7D)%20RETURN%20p.slug
```

## 4. Link Search to Proposals

**Cypher:**
```cypher
MATCH (search:U4_Event {slug: 'search-2025-11-07-001'}) MATCH (proposal:U3_Deal {slug: 'proposal-2025-11-07-chatbot'}) CREATE (search)-[r:U4_LEADS_TO {forming_mindstate: 'evaluating', goal: 'Convert search to proposals', confidence: 0.85, energy: 0.8, created_by: 'emma', substrate: 'organizational', visibility: 'partners', created_at: datetime(), updated_at: datetime(), valid_from: datetime(), valid_to: null}]->(proposal) RETURN type(r)
```

**GET URL:**
```
https://scopelock.onrender.com/api/graph/query?q=MATCH%20(search%3AU4_Event%20%7Bslug%3A%20%27search-2025-11-07-001%27%7D)%20MATCH%20(proposal%3AU3_Deal%20%7Bslug%3A%20%27proposal-2025-11-07-chatbot%27%7D)%20CREATE%20(search)-%5Br%3AU4_LEADS_TO%20%7Bforming_mindstate%3A%20%27evaluating%27%2C%20goal%3A%20%27Convert%20search%20to%20proposals%27%2C%20confidence%3A%200.85%2C%20energy%3A%200.8%2C%20created_by%3A%20%27emma%27%2C%20substrate%3A%20%27organizational%27%2C%20visibility%3A%20%27partners%27%2C%20created_at%3A%20datetime()%2C%20updated_at%3A%20datetime()%2C%20valid_from%3A%20datetime()%2C%20valid_to%3A%20null%7D%5D-%3E(proposal)%20RETURN%20type(r)
```

## 5. Update Search Task Status

**Cypher:**
```cypher
MATCH (t:U4_Work_Item {slug: 'search-task-ai-assistant'}) SET t.state = 'done', t.updated_at = datetime(), t.jobs_reviewed = 50, t.proposals_sent = 5 RETURN t.slug, t.state
```

**GET URL:**
```
https://scopelock.onrender.com/api/graph/query?q=MATCH%20(t%3AU4_Work_Item%20%7Bslug%3A%20%27search-task-ai-assistant%27%7D)%20SET%20t.state%20%3D%20%27done%27%2C%20t.updated_at%20%3D%20datetime()%2C%20t.jobs_reviewed%20%3D%2050%2C%20t.proposals_sent%20%3D%205%20RETURN%20t.slug%2C%20t.state
```

## 6. Get Proposals Needing Follow-up

**Cypher:**
```cypher
MATCH (p:U3_Deal {state: 'Proposed'}) WHERE duration.between(p.created_at, datetime()).days >= 14 RETURN p.slug, p.job_title, p.client_name, p.amount_value, p.created_at ORDER BY p.created_at DESC
```

**GET URL:**
```
https://scopelock.onrender.com/api/graph/query?q=MATCH%20(p%3AU3_Deal%20%7Bstate%3A%20%27Proposed%27%7D)%20WHERE%20duration.between(p.created_at%2C%20datetime()).days%20%3E%3D%2014%20RETURN%20p.slug%2C%20p.job_title%2C%20p.client_name%2C%20p.amount_value%2C%20p.created_at%20ORDER%20BY%20p.created_at%20DESC&limit=50
```

## 7. Analytics - Win Rate by Search Type

**Cypher:**
```cypher
MATCH (search:U4_Event {event_kind: 'upwork_search'})-[:U4_LEADS_TO]->(p:U3_Deal) WITH search.search_query as query, count(p) as total_proposals, sum(CASE WHEN p.state = 'Confirmed' THEN 1 ELSE 0 END) as wins RETURN query, total_proposals, wins, (wins * 1.0 / total_proposals) as win_rate ORDER BY win_rate DESC
```

**GET URL:**
```
https://scopelock.onrender.com/api/graph/query?q=MATCH%20(search%3AU4_Event%20%7Bevent_kind%3A%20%27upwork_search%27%7D)-%5B%3AU4_LEADS_TO%5D-%3E(p%3AU3_Deal)%20WITH%20search.search_query%20as%20query%2C%20count(p)%20as%20total_proposals%2C%20sum(CASE%20WHEN%20p.state%20%3D%20%27Confirmed%27%20THEN%201%20ELSE%200%20END)%20as%20wins%20RETURN%20query%2C%20total_proposals%2C%20wins%2C%20(wins%20*%201.0%20%2F%20total_proposals)%20as%20win_rate%20ORDER%20BY%20win_rate%20DESC&limit=50
```

## 8a. Update Proposal State - Mark as Confirmed

**Cypher:**
```cypher
MATCH (p:U3_Deal {slug: 'proposal-2025-11-07-chatbot'}) SET p.state = 'Confirmed', p.updated_at = datetime(), p.response_at = datetime() RETURN p.slug, p.state
```

**GET URL:**
```
https://scopelock.onrender.com/api/graph/query?q=MATCH%20(p%3AU3_Deal%20%7Bslug%3A%20%27proposal-2025-11-07-chatbot%27%7D)%20SET%20p.state%20%3D%20%27Confirmed%27%2C%20p.updated_at%20%3D%20datetime()%2C%20p.response_at%20%3D%20datetime()%20RETURN%20p.slug%2C%20p.state
```

## 8b. Update Proposal State - Mark as Rejected

**Cypher:**
```cypher
MATCH (p:U3_Deal {slug: 'proposal-2025-11-07-chatbot'}) SET p.state = 'Rejected', p.updated_at = datetime(), p.response_at = datetime() RETURN p.slug, p.state
```

**GET URL:**
```
https://scopelock.onrender.com/api/graph/query?q=MATCH%20(p%3AU3_Deal%20%7Bslug%3A%20%27proposal-2025-11-07-chatbot%27%7D)%20SET%20p.state%20%3D%20%27Rejected%27%2C%20p.updated_at%20%3D%20datetime()%2C%20p.response_at%20%3D%20datetime()%20RETURN%20p.slug%2C%20p.state
```

## 9. Check Today's Progress

**Cypher:**
```cypher
MATCH (p:U3_Deal) WHERE date(p.created_at) = date(datetime()) RETURN count(p) as proposals_today, sum(CASE WHEN p.decision = 'STRONG GO' THEN 1 ELSE 0 END) as strong_go, sum(CASE WHEN p.decision = 'QUALIFIED MAYBE' THEN 1 ELSE 0 END) as qualified_maybe, avg(p.confidence) as avg_confidence
```

**GET URL:**
```
https://scopelock.onrender.com/api/graph/query?q=MATCH%20(p%3AU3_Deal)%20WHERE%20date(p.created_at)%20%3D%20date(datetime())%20RETURN%20count(p)%20as%20proposals_today%2C%20sum(CASE%20WHEN%20p.decision%20%3D%20%27STRONG%20GO%27%20THEN%201%20ELSE%200%20END)%20as%20strong_go%2C%20sum(CASE%20WHEN%20p.decision%20%3D%20%27QUALIFIED%20MAYBE%27%20THEN%201%20ELSE%200%20END)%20as%20qualified_maybe%2C%20avg(p.confidence)%20as%20avg_confidence
```

## 10a. Update Search Plan Milestone - Mark as In Progress

**Cypher:**
```cypher
MATCH (m:U4_Work_Item {slug: 'search-plan-2025-11-07', work_type: 'milestone'}) SET m.state = 'doing', m.updated_at = datetime() RETURN m.slug, m.state
```

**GET URL:**
```
https://scopelock.onrender.com/api/graph/query?q=MATCH%20(m%3AU4_Work_Item%20%7Bslug%3A%20%27search-plan-2025-11-07%27%2C%20work_type%3A%20%27milestone%27%7D)%20SET%20m.state%20%3D%20%27doing%27%2C%20m.updated_at%20%3D%20datetime()%20RETURN%20m.slug%2C%20m.state
```

## 10b. Update Search Plan Milestone - Mark as Complete

**Cypher:**
```cypher
MATCH (m:U4_Work_Item {slug: 'search-plan-2025-11-07', work_type: 'milestone'}) SET m.state = 'done', m.updated_at = datetime(), m.completed_at = datetime() RETURN m.slug, m.state
```

**GET URL:**
```
https://scopelock.onrender.com/api/graph/query?q=MATCH%20(m%3AU4_Work_Item%20%7Bslug%3A%20%27search-plan-2025-11-07%27%2C%20work_type%3A%20%27milestone%27%7D)%20SET%20m.state%20%3D%20%27done%27%2C%20m.updated_at%20%3D%20datetime()%2C%20m.completed_at%20%3D%20datetime()%20RETURN%20m.slug%2C%20m.state
```

---

## Helper: URL Encoding

To convert any Cypher query to a GET URL:

**Python:**
```python
from urllib.parse import quote

cypher = "MATCH (n) RETURN n"
url = f"https://scopelock.onrender.com/api/graph/query?q={quote(cypher)}&limit=50"
print(url)
```

**JavaScript:**
```javascript
const cypher = "MATCH (n) RETURN n";
const url = `https://scopelock.onrender.com/api/graph/query?q=${encodeURIComponent(cypher)}&limit=50`;
console.log(url);
```

**Online Tool:**
- Go to: https://www.urlencoder.org/
- Paste your Cypher query
- Click "Encode"
- Prepend: `https://scopelock.onrender.com/api/graph/query?q=`
