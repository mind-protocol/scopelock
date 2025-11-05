# Scopelock Query Cookbook

**Graph Name:** `scopelock`
**Graph Version:** 1.0.0 (Extracted November 5, 2025)
**Total Queries:** 36
**Prepared By:** GraphCare (Sage - Chief Documenter)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview) (5 queries)
2. [Service Discovery](#2-service-discovery) (5 queries)
3. [API Surface Exploration](#3-api-surface-exploration) (5 queries)
4. [Data Flow Mapping](#4-data-flow-mapping) (5 queries)
5. [Dependency Analysis](#5-dependency-analysis) (5 queries)
6. [Testing & Coverage](#6-testing--coverage) (5 queries)
7. [Security & Compliance](#7-security--compliance) (3 queries)
8. [Operational Queries](#8-operational-queries) (3 queries)

---

## How to Run Queries

### Option 1: WebSocket API (Production)

```python
import websocket
import json

ws = websocket.create_connection("wss://mindprotocol.ai/api/ws")

query_request = {
    "type": "docs.view.request",
    "graph_name": "scopelock",
    "view_type": "custom",
    "query": "MATCH (n:U4_Code_Artifact {kind: 'Service'}) RETURN n.name"
}

ws.send(json.dumps(query_request))
result = json.loads(ws.recv())
print(result)
```

### Option 2: Python Script (query_production.py)

```bash
cd /home/mind-protocol/graphcare
python3 tools/query_production.py "MATCH (n) RETURN count(n)"
```

### Option 3: FalkorDB REST API (Direct)

```bash
curl -X POST https://mindprotocol.onrender.com/admin/query \
  -H "X-API-Key: ${FALKORDB_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "graph": "scopelock",
    "query": "MATCH (n) RETURN count(n)"
  }'
```

---

## 1. Architecture Overview

### 1.1 Show All Architectural Layers

```cypher
// Get all architectural layers and their node counts
MATCH (layer)
WHERE layer.name =~ '.*_layer'
OPTIONAL MATCH (n)-[:IN_LAYER]->(layer)
RETURN layer.name AS Layer,
       count(n) AS NodeCount
ORDER BY NodeCount DESC
```

**Expected Result:**
```
Layer              | NodeCount
-------------------|----------
api_layer          | 13
notification_layer | 8
orchestration_layer| 5
automation_layer   | 4
```

**Use Case:** Quick overview of system architecture (how many components per layer)

---

### 1.2 Show Complete System Structure

```cypher
// Get all nodes grouped by kind
MATCH (n:U4_Code_Artifact)
WHERE n.kind IS NOT NULL
RETURN n.kind AS Type,
       count(n) AS Count,
       collect(n.name)[..5] AS Examples
ORDER BY Count DESC
```

**Expected Result:**
```
Type      | Count | Examples
----------|-------|----------------------------------------------
Service   | 17    | [TelegramBot, ClaudeRunner, UpworkProposalSubmitter, ...]
Schema    | 16    | [LeadEvaluation, ResponseDraft, Event, ...]
Endpoint  | 13    | [upwork_webhook, telegram_webhook, health_check, ...]
Model     | 3     | [Event, Draft, Lead]
```

**Use Case:** Understand what types of components exist in your system

---

### 1.3 Map Services to Layers

```cypher
// Show which services belong to which layer
MATCH (service {kind: 'Service'})-[:IN_LAYER]->(layer)
RETURN layer.name AS Layer,
       collect(service.name) AS Services
ORDER BY layer.name
```

**Expected Result:**
```
Layer               | Services
--------------------|--------------------------------------------------
api_layer           | [upwork_webhook, cloudmailin_webhook, ...]
automation_layer    | [ClaudeRunner, UpworkProposalSubmitter]
notification_layer  | [TelegramBot, send_draft_notification, ...]
orchestration_layer | [EventProcessor, LeadEvaluator, DraftGenerator]
```

**Use Case:** Understand architectural organization (which services are in which layers)

---

### 1.4 Count Nodes and Relationships

```cypher
// Graph size metrics
MATCH (n)
OPTIONAL MATCH ()-[r]->()
RETURN count(DISTINCT n) AS TotalNodes,
       count(DISTINCT r) AS TotalRelationships
```

**Expected Result:**
```
TotalNodes | TotalRelationships
-----------|-------------------
172        | 54
```

**Use Case:** Graph size metrics (for monitoring growth over time)

---

### 1.5 Show Technology Distribution

```cypher
// Languages used in codebase
MATCH (n:U4_Code_Artifact)
WHERE n.language IS NOT NULL
RETURN n.language AS Language,
       count(n) AS Count
ORDER BY Count DESC
```

**Expected Result:**
```
Language   | Count
-----------|------
python     | 64
typescript | 67
```

**Use Case:** Understand technology stack distribution

---

## 2. Service Discovery

### 2.1 Find All Services

```cypher
// List all services with descriptions
MATCH (service {kind: 'Service'})
RETURN service.name AS Service,
       service.description AS Description,
       service.path AS Location
ORDER BY service.name
```

**Expected Result:**
```
Service                 | Description                     | Location
------------------------|---------------------------------|---------------------------
ClaudeRunner            | Class: ClaudeRunner             | backend/app/runner.py
TelegramBot             | Class: TelegramBot              | backend/app/telegram.py
UpworkProposalSubmitter | Class: UpworkProposalSubmitter  | backend/app/browser_automation.py
...
```

**Use Case:** Discover what services exist in your system

---

### 2.2 Find Services by Name Pattern

```cypher
// Search for services matching a pattern (e.g., "Telegram")
MATCH (service {kind: 'Service'})
WHERE service.name CONTAINS 'Telegram'
RETURN service.name AS Service,
       service.path AS Location
```

**Expected Result:**
```
Service       | Location
--------------|-------------------------
TelegramBot   | backend/app/telegram.py
```

**Use Case:** Find specific services when you know part of the name

---

### 2.3 Find Services in a Specific Layer

```cypher
// Get all services in the automation layer
MATCH (service {kind: 'Service'})-[:IN_LAYER]->(layer {name: 'automation_layer'})
RETURN service.name AS Service,
       service.description AS Description
```

**Expected Result:**
```
Service                 | Description
------------------------|------------------------------------
ClaudeRunner            | AI-powered proposal generation
UpworkProposalSubmitter | Browser automation for Upwork
```

**Use Case:** Explore services by architectural layer

---

### 2.4 Find Services with No Tests

```cypher
// Identify untested services (critical for risk assessment)
MATCH (service {kind: 'Service'})
WHERE NOT (service)-[:U4_TESTED_BY]->()
RETURN service.name AS UntestedService,
       service.path AS Location
ORDER BY service.name
```

**Expected Result:**
```
UntestedService         | Location
------------------------|---------------------------
ClaudeRunner            | backend/app/runner.py
TelegramBot             | backend/app/telegram.py
UpworkProposalSubmitter | backend/app/browser_automation.py
...
```

**Use Case:** Identify testing gaps (priority for test coverage improvement)

---

### 2.5 Find Services by File Path

```cypher
// Find services in a specific directory
MATCH (service {kind: 'Service'})
WHERE service.path CONTAINS 'backend/app'
RETURN service.name AS Service,
       service.path AS Path
ORDER BY Path
```

**Expected Result:**
```
Service                 | Path
------------------------|---------------------------
ClaudeRunner            | backend/app/runner.py
TelegramBot             | backend/app/telegram.py
UpworkProposalSubmitter | backend/app/browser_automation.py
```

**Use Case:** Explore services by file location

---

## 3. API Surface Exploration

### 3.1 List All API Endpoints

```cypher
// Get all API endpoints with HTTP methods
MATCH (endpoint {kind: 'Endpoint'})
RETURN endpoint.name AS Endpoint,
       endpoint.method AS Method,
       endpoint.path AS Path,
       endpoint.description AS Description
ORDER BY Path
```

**Expected Result:**
```
Endpoint          | Method | Path              | Description
------------------|--------|-------------------|----------------------------
health_check      | GET    | /health_check     | Function: health_check
upwork_webhook    | POST   | /upwork_webhook   | Parameters: request
telegram_webhook  | POST   | /telegram_webhook | Parameters: update
...
```

**Use Case:** Document all public-facing endpoints

---

### 3.2 Find Endpoints by HTTP Method

```cypher
// Get all POST endpoints (webhooks)
MATCH (endpoint {kind: 'Endpoint'})
WHERE endpoint.method = 'POST'
RETURN endpoint.name AS Endpoint,
       endpoint.path AS Path
ORDER BY endpoint.name
```

**Expected Result:**
```
Endpoint          | Path
------------------|-------------------
cloudmailin_webhook| /cloudmailin_webhook
telegram_webhook  | /telegram_webhook
upwork_webhook    | /upwork_webhook
vollna_webhook    | /vollna_webhook
```

**Use Case:** Find all webhook endpoints (POST requests)

---

### 3.3 Find Endpoints Using a Specific Schema

```cypher
// Which endpoints use the ResponseDraft schema?
MATCH (endpoint {kind: 'Endpoint'})-[:USES_SCHEMA]->(schema {name: 'ResponseDraft'})
RETURN endpoint.name AS Endpoint,
       endpoint.path AS Path,
       schema.name AS Schema
```

**Expected Result:**
```
Endpoint      | Path            | Schema
--------------|-----------------|---------------
notify_draft  | /notify_draft   | ResponseDraft
...
```

**Use Case:** Understand data contracts (which endpoints use which schemas)

---

### 3.4 Map API Layer Components

```cypher
// Show all components in the API layer
MATCH (component)-[:IN_LAYER]->(layer {name: 'api_layer'})
RETURN component.name AS Component,
       component.kind AS Type,
       component.path AS Location
ORDER BY Type, Component
```

**Expected Result:**
```
Component         | Type     | Location
------------------|----------|------------------------
health_check      | Endpoint | backend/app/main.py
root              | Endpoint | backend/app/main.py
upwork_webhook    | Endpoint | backend/app/webhooks.py
telegram_webhook  | Endpoint | backend/app/webhooks.py
...
```

**Use Case:** Explore all API layer entry points

---

### 3.5 Find Unused Endpoints

```cypher
// Find endpoints that are not called by any other code
MATCH (endpoint {kind: 'Endpoint'})
WHERE NOT ()-[:U4_CALLS]->(endpoint)
RETURN endpoint.name AS UnusedEndpoint,
       endpoint.path AS Path
```

**Expected Result:**
(May vary - depends on call graph extraction)

**Use Case:** Identify potentially deprecated or unused endpoints

---

## 4. Data Flow Mapping

### 4.1 Trace Upwork Webhook Flow

```cypher
// Map the complete flow from upwork_webhook to downstream calls
MATCH path = (webhook {name: 'upwork_webhook'})-[:U4_CALLS*1..3]->(target)
RETURN path
```

**Expected Result:**
```
upwork_webhook → run_rafael → _run_claude
```

**Use Case:** Understand the complete workflow from webhook to AI processing

---

### 4.2 Find All Functions Called by a Service

```cypher
// What does TelegramBot call?
MATCH (bot {name: 'TelegramBot'})-[:U4_CALLS]->(target)
RETURN bot.name AS Service,
       collect(target.name) AS CallsTargets
```

**Expected Result:**
```
Service       | CallsTargets
--------------|----------------------------------
TelegramBot   | [send_message, edit_message, answer_callback]
```

**Use Case:** Map service dependencies (what does a service depend on)

---

### 4.3 Find All Callers of a Function

```cypher
// Who calls send_draft_notification?
MATCH (caller)-[:U4_CALLS]->(func {name: 'send_draft_notification'})
RETURN collect(caller.name) AS Callers,
       func.name AS Function
```

**Expected Result:**
```
Callers                           | Function
----------------------------------|----------------------------
[notify_draft, upwork_webhook]    | send_draft_notification
```

**Use Case:** Understand upstream dependencies (who depends on this function)

---

### 4.4 Map Telegram Notification Flow

```cypher
// Trace how Telegram notifications are sent
MATCH path = (webhook)-[:U4_CALLS*1..5]->(send_message {name: 'send_message'})
RETURN path
LIMIT 5
```

**Expected Result:**
```
upwork_webhook → run_rafael → send_draft_notification → TelegramBot.send_message
```

**Use Case:** Understand notification delivery flow

---

### 4.5 Find Multi-Step Workflows

```cypher
// Find all 3-step call chains
MATCH path = (a)-[:U4_CALLS]->(b)-[:U4_CALLS]->(c)
RETURN a.name AS Step1,
       b.name AS Step2,
       c.name AS Step3
LIMIT 10
```

**Expected Result:**
```
Step1          | Step2           | Step3
---------------|-----------------|------------------
upwork_webhook | run_rafael      | _run_claude
telegram_webhook| handle_approval | TelegramBot.edit_message
...
```

**Use Case:** Discover complex workflows (multi-step processes)

---

## 5. Dependency Analysis

### 5.1 Find Most-Called Functions

```cypher
// Which functions are called most often? (central to the system)
MATCH ()-[r:U4_CALLS]->(target)
RETURN target.name AS Function,
       count(r) AS CalledByCount
ORDER BY CalledByCount DESC
LIMIT 10
```

**Expected Result:**
```
Function        | CalledByCount
----------------|---------------
send_message    | 3
_run_claude     | 2
edit_message    | 2
...
```

**Use Case:** Identify critical functions (most dependencies = high impact if broken)

---

### 5.2 Find Functions that Call Many Others

```cypher
// Which functions have the most outgoing calls? (high complexity)
MATCH (source)-[r:U4_CALLS]->()
RETURN source.name AS Function,
       count(r) AS CallsCount
ORDER BY CallsCount DESC
LIMIT 10
```

**Expected Result:**
```
Function         | CallsCount
-----------------|------------
handle_approval  | 2
run_rafael       | 1
...
```

**Use Case:** Identify complex functions (many outgoing calls = high complexity)

---

### 5.3 Find Isolated Components

```cypher
// Find nodes with no connections (isolated)
MATCH (n)
WHERE NOT (n)-[]-()
RETURN n.name AS IsolatedNode,
       n.kind AS Type
LIMIT 20
```

**Expected Result:**
(May vary - TypeScript frontend artifacts may be isolated from Python backend)

**Use Case:** Identify components not integrated into the system

---

### 5.4 Find Circular Dependencies

```cypher
// Find circular call patterns (A calls B, B calls A)
MATCH (a)-[:U4_CALLS]->(b)-[:U4_CALLS]->(a)
RETURN a.name AS Function1,
       b.name AS Function2
```

**Expected Result:**
(Likely none - good design should avoid circular calls)

**Use Case:** Detect circular dependencies (code smell)

---

### 5.5 Map Schema Usage

```cypher
// Which schemas are used by which endpoints?
MATCH (endpoint {kind: 'Endpoint'})-[:USES_SCHEMA]->(schema {kind: 'Schema'})
RETURN endpoint.name AS Endpoint,
       collect(schema.name) AS UsesSchemas
ORDER BY endpoint.name
```

**Expected Result:**
```
Endpoint        | UsesSchemas
----------------|-------------------------------
notify_draft    | [ResponseDraft]
notify_proposal | [ResponseDraft]
upwork_webhook  | [UpworkResponseWebhook]
```

**Use Case:** Understand data contracts between endpoints and schemas

---

## 6. Testing & Coverage

### 6.1 Identify All Untested Code

```cypher
// Find all code artifacts without tests
MATCH (code:U4_Code_Artifact)
WHERE NOT (code)-[:U4_TESTED_BY]->()
  AND code.kind IS NOT NULL
RETURN code.kind AS Type,
       count(code) AS UntestedCount,
       collect(code.name)[..5] AS Examples
ORDER BY UntestedCount DESC
```

**Expected Result:**
```
Type      | UntestedCount | Examples
----------|---------------|------------------------------------------
Service   | 17            | [TelegramBot, ClaudeRunner, UpworkProposalSubmitter, ...]
Schema    | 16            | [LeadEvaluation, ResponseDraft, Event, ...]
Endpoint  | 13            | [upwork_webhook, telegram_webhook, health_check, ...]
Model     | 3             | [Event, Draft, Lead]
```

**Use Case:** Prioritize test coverage improvements

---

### 6.2 Find Critical Untested Paths

```cypher
// Find untested functions that are called by many others (high impact)
MATCH (func)-[:U4_CALLS*0..1]->(critical)
WHERE NOT (critical)-[:U4_TESTED_BY]->()
WITH critical, count(DISTINCT func) AS CalledByCount
WHERE CalledByCount > 1
RETURN critical.name AS CriticalUntestedFunction,
       CalledByCount
ORDER BY CalledByCount DESC
```

**Expected Result:**
```
CriticalUntestedFunction | CalledByCount
-------------------------|---------------
send_message             | 3
_run_claude              | 2
```

**Use Case:** Prioritize testing for critical, widely-used functions

---

### 6.3 Coverage by Layer

```cypher
// Test coverage breakdown by architectural layer
MATCH (layer)
WHERE layer.name =~ '.*_layer'
OPTIONAL MATCH (code)-[:IN_LAYER]->(layer)
OPTIONAL MATCH (code)-[:U4_TESTED_BY]->()
WITH layer.name AS Layer,
     count(code) AS TotalComponents,
     count(CASE WHEN (code)-[:U4_TESTED_BY]->() THEN 1 END) AS TestedComponents
RETURN Layer,
       TotalComponents,
       TestedComponents,
       (TestedComponents * 100 / TotalComponents) AS CoveragePercent
ORDER BY CoveragePercent ASC
```

**Expected Result:**
```
Layer               | TotalComponents | TestedComponents | CoveragePercent
--------------------|-----------------|------------------|----------------
api_layer           | 13              | 0                | 0%
automation_layer    | 4               | 0                | 0%
notification_layer  | 8               | 0                | 0%
orchestration_layer | 5               | 0                | 0%
```

**Use Case:** Understand which layers have the worst test coverage

---

### 6.4 Find Most Complex Untested Code

```cypher
// Find high-complexity untested functions (highest risk)
MATCH (func)
WHERE NOT (func)-[:U4_TESTED_BY]->()
  AND func.complexity IS NOT NULL
RETURN func.name AS Function,
       func.complexity AS Complexity,
       func.path AS Location
ORDER BY Complexity DESC
LIMIT 10
```

**Expected Result:**
(Complexity property may not be extracted yet)

**Use Case:** Prioritize testing for complex, risky code

---

### 6.5 Find Test Gaps for Services

```cypher
// Which services have no tests?
MATCH (service {kind: 'Service'})
WHERE NOT (service)-[:U4_TESTED_BY]->()
RETURN service.name AS UntestedService,
       service.path AS Location
ORDER BY service.name
```

**Expected Result:**
```
UntestedService         | Location
------------------------|---------------------------
ClaudeRunner            | backend/app/runner.py
TelegramBot             | backend/app/telegram.py
UpworkProposalSubmitter | backend/app/browser_automation.py
...
```

**Use Case:** Create test suite for all services

---

## 7. Security & Compliance

### 7.1 Find All Authentication Functions

```cypher
// Find functions related to authentication or credentials
MATCH (func)
WHERE func.name CONTAINS 'auth' OR
      func.name CONTAINS 'verify' OR
      func.name CONTAINS 'signature' OR
      func.name CONTAINS 'credential'
RETURN func.name AS Function,
       func.description AS Description,
       func.path AS Location
```

**Expected Result:**
```
Function                  | Description                  | Location
--------------------------|------------------------------|----------------------
verify_webhook_signature  | Parameters: request, x_...   | backend/app/auth.py
_setup_credentials        | Parameters: self             | backend/app/runner.py
```

**Use Case:** Security audit (find all auth-related code)

---

### 7.2 Find Functions with Sensitive Parameters

```cypher
// Find functions with "password" or "token" parameters
MATCH (func)
WHERE func.description CONTAINS 'password' OR
      func.description CONTAINS 'token' OR
      func.description CONTAINS 'secret'
RETURN func.name AS Function,
       func.description AS Parameters,
       func.path AS Location
```

**Expected Result:**
```
Function           | Parameters                         | Location
-------------------|------------------------------------|--------------------------
__init__           | Parameters: self, token, chat_id   | backend/app/telegram.py
login_to_upwork    | Parameters: self, email, password  | backend/app/browser_automation.py
```

**Use Case:** Security audit (ensure sensitive params are handled securely)

---

### 7.3 Find Database Models (Data Storage)

```cypher
// Find all database models (where sensitive data might be stored)
MATCH (model {kind: 'Model'})
RETURN model.name AS Model,
       model.description AS Description,
       model.path AS Location
```

**Expected Result:**
```
Model  | Description       | Location
-------|-------------------|---------------------
Event  | Inherits from: Base | backend/app/database.py
Draft  | Inherits from: Base | backend/app/database.py
Lead   | Inherits from: Base | backend/app/database.py
```

**Use Case:** GDPR audit (where is user data stored?)

---

## 8. Operational Queries

### 8.1 Find All Health Check Functions

```cypher
// Find health check and monitoring code
MATCH (func)
WHERE func.name CONTAINS 'health' OR
      func.name CONTAINS 'status' OR
      func.name CONTAINS 'check'
RETURN func.name AS Function,
       func.kind AS Type,
       func.path AS Location
```

**Expected Result:**
```
Function           | Type      | Location
-------------------|-----------|---------------------
health_check       | Endpoint  | backend/app/main.py
check_login_status | Service   | backend/app/browser_automation.py
HealthCheckResult  | Schema    | backend/app/contracts.py
```

**Use Case:** Identify monitoring and health check endpoints

---

### 8.2 Find All Webhook Handlers

```cypher
// Find all webhook endpoints
MATCH (webhook)
WHERE webhook.name CONTAINS 'webhook'
RETURN webhook.name AS Webhook,
       webhook.kind AS Type,
       webhook.path AS Location
ORDER BY webhook.name
```

**Expected Result:**
```
Webhook             | Type      | Location
--------------------|-----------|-------------------------
cloudmailin_webhook | Endpoint  | backend/app/webhooks.py
telegram_webhook    | Endpoint  | backend/app/webhooks.py
upwork_webhook      | Endpoint  | backend/app/webhooks.py
vollna_webhook      | Endpoint  | backend/app/webhooks.py
```

**Use Case:** Document all webhook integrations

---

### 8.3 Find Error Handling Code

```cypher
// Find error handling and exception code
MATCH (func)
WHERE func.name CONTAINS 'error' OR
      func.name CONTAINS 'exception' OR
      func.name CONTAINS 'handler'
RETURN func.name AS Function,
       func.description AS Description,
       func.path AS Location
```

**Expected Result:**
```
Function               | Description              | Location
-----------------------|--------------------------|------------------
global_exception_handler| Parameters: request, exc | backend/app/main.py
ErrorResponse          | Inherits from: BaseModel | backend/app/contracts.py
```

**Use Case:** Review error handling patterns

---

## Advanced Queries

### Find Long Call Chains (Potential Performance Issues)

```cypher
// Find call chains longer than 4 steps (may indicate performance issues)
MATCH path = (start)-[:U4_CALLS*4..6]->(end)
RETURN [node IN nodes(path) | node.name] AS CallChain,
       length(path) AS ChainLength
ORDER BY ChainLength DESC
LIMIT 5
```

**Use Case:** Identify deeply nested function calls (potential performance bottlenecks)

---

### Find All Python vs TypeScript Components

```cypher
// Compare Python backend vs TypeScript frontend component counts
MATCH (n:U4_Code_Artifact)
WHERE n.language IS NOT NULL
RETURN n.language AS Language,
       count(n) AS ComponentCount,
       collect(DISTINCT n.kind) AS ComponentTypes
ORDER BY ComponentCount DESC
```

**Use Case:** Understand language distribution in your codebase

---

### Export Full Graph Structure (JSON)

```cypher
// Export all nodes and relationships for external analysis
MATCH (n)
OPTIONAL MATCH (n)-[r]->(m)
RETURN n, collect({type: type(r), target: m}) AS relationships
```

**Use Case:** Export graph data for external tools (data science, visualization)

---

## Query Tips

### Performance Optimization

1. **Use LIMIT** - Always limit results when exploring
   ```cypher
   MATCH (n) RETURN n LIMIT 100
   ```

2. **Filter Early** - Apply WHERE clauses early to reduce result set
   ```cypher
   MATCH (n:U4_Code_Artifact)
   WHERE n.kind = 'Service'  // Filter before collecting
   RETURN n
   ```

3. **Use Indexes** - Query by indexed properties (name, kind, path)

### Common Patterns

**Count Pattern:**
```cypher
MATCH (n)
WHERE n.kind = 'Service'
RETURN count(n) AS ServiceCount
```

**Collect Pattern:**
```cypher
MATCH (service {kind: 'Service'})
RETURN collect(service.name) AS AllServices
```

**Optional Match Pattern:**
```cypher
MATCH (n)
OPTIONAL MATCH (n)-[:U4_CALLS]->(target)
RETURN n.name, collect(target.name) AS Calls
```

---

## Need More Queries?

**Custom Query Requests:** hello@graphcare.ai

We can create custom queries tailored to your specific use cases:
- Performance analysis queries
- Security audit queries
- Migration planning queries
- Dependency impact analysis
- Custom reporting queries

**Pricing:** $500 per 10 custom queries (one-time)

---

**GraphCare** | Knowledge Extraction Service
*Your code, always documented. Always queryable.*
