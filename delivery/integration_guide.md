# Scopelock Integration Guide

**Graph Name:** `scopelock`
**Graph Version:** 1.0.0 (Extracted November 5, 2025)
**Purpose:** Programmatic access to your knowledge graph
**Prepared By:** GraphCare (Sage - Chief Documenter)

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Access Methods](#access-methods)
3. [WebSocket API](#websocket-api-recommended)
4. [Python Integration](#python-integration)
5. [JavaScript/TypeScript Integration](#javascripttypescript-integration)
6. [REST API (Direct FalkorDB)](#rest-api-direct-falkordb)
7. [Common Use Cases](#common-use-cases)
8. [Rate Limits & Best Practices](#rate-limits--best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 30-Second Test

```python
import websocket
import json

# Connect to Mind Protocol WebSocket API
ws = websocket.create_connection("wss://mindprotocol.ai/api/ws")

# Query Scopelock graph
request = {
    "type": "docs.view.request",
    "graph_name": "scopelock",
    "view_type": "custom",
    "query": "MATCH (n {kind: 'Service'}) RETURN n.name LIMIT 5"
}

ws.send(json.dumps(request))
result = json.loads(ws.recv())
print(result)

ws.close()
```

**Expected Output:**
```json
{
  "type": "docs.view.response",
  "data": [
    ["TelegramBot"],
    ["ClaudeRunner"],
    ["UpworkProposalSubmitter"]
  ]
}
```

---

## Access Methods

| Method | Best For | Response Time | Complexity |
|--------|----------|---------------|------------|
| **WebSocket API** | Real-time queries, interactive apps | <1s | Medium |
| **Python SDK** | Scripts, automation, data analysis | <1s | Low |
| **REST API** | One-off queries, cURL, Postman | <1s | Low |
| **JavaScript SDK** | Web apps, dashboards | <1s | Medium |

---

## WebSocket API (Recommended)

### Why WebSocket?

✅ **Persistent Connection** - No overhead of repeated HTTP handshakes
✅ **Real-Time** - Sub-second query response
✅ **Bi-Directional** - Server can push updates
✅ **Production-Ready** - Used by GraphCare's own infrastructure

### Connection

**Endpoint:** `wss://mindprotocol.ai/api/ws`

**Authentication:** None (graph name-based access control)

### Message Protocol

**Request Format:**
```json
{
  "type": "docs.view.request",
  "graph_name": "scopelock",
  "view_type": "custom",  // or "architecture", "api", "coverage", "index"
  "query": "<Cypher query>"  // Only for view_type="custom"
}
```

**Response Format:**
```json
{
  "type": "docs.view.response",
  "view_type": "custom",
  "graph_name": "scopelock",
  "data": [...],  // Query results
  "execution_time_ms": 234
}
```

**Error Format:**
```json
{
  "type": "error",
  "error": "invalid_query",
  "message": "Syntax error in Cypher query",
  "details": {...}
}
```

### Python Example

```python
import websocket
import json

class ScopelockGraph:
    def __init__(self):
        self.ws = websocket.create_connection("wss://mindprotocol.ai/api/ws")

    def query(self, cypher_query):
        """Execute a Cypher query against Scopelock graph"""
        request = {
            "type": "docs.view.request",
            "graph_name": "scopelock",
            "view_type": "custom",
            "query": cypher_query
        }
        self.ws.send(json.dumps(request))
        response = json.loads(self.ws.recv())

        if response.get("type") == "error":
            raise Exception(f"Query failed: {response['message']}")

        return response["data"]

    def close(self):
        self.ws.close()

# Usage
graph = ScopelockGraph()

# Find all services
services = graph.query("MATCH (n {kind: 'Service'}) RETURN n.name")
print(f"Found {len(services)} services:", services)

# Find all API endpoints
endpoints = graph.query("MATCH (n {kind: 'Endpoint'}) RETURN n.name, n.path")
print("Endpoints:", endpoints)

graph.close()
```

---

## Python Integration

### Installation

```bash
pip install websocket-client requests
```

### Complete Example

```python
import websocket
import json
from typing import List, Dict, Any

class ScopelockClient:
    """
    Client for querying Scopelock knowledge graph.

    Example:
        client = ScopelockClient()
        services = client.get_services()
        print(services)
        client.close()
    """

    def __init__(self, ws_url: str = "wss://mindprotocol.ai/api/ws"):
        self.ws = websocket.create_connection(ws_url)
        self.graph_name = "scopelock"

    def query(self, cypher: str) -> List[List[Any]]:
        """Execute custom Cypher query"""
        request = {
            "type": "docs.view.request",
            "graph_name": self.graph_name,
            "view_type": "custom",
            "query": cypher
        }
        self.ws.send(json.dumps(request))
        response = json.loads(self.ws.recv())

        if response.get("type") == "error":
            raise Exception(f"Query failed: {response['message']}")

        return response["data"]

    def get_services(self) -> List[Dict]:
        """Get all services"""
        results = self.query("""
            MATCH (n {kind: 'Service'})
            RETURN n.name, n.path, n.description
        """)
        return [
            {"name": r[0], "path": r[1], "description": r[2]}
            for r in results
        ]

    def get_endpoints(self) -> List[Dict]:
        """Get all API endpoints"""
        results = self.query("""
            MATCH (n {kind: 'Endpoint'})
            RETURN n.name, n.path, n.method
        """)
        return [
            {"name": r[0], "path": r[1], "method": r[2]}
            for r in results
        ]

    def get_service_dependencies(self, service_name: str) -> List[str]:
        """Get all functions called by a service"""
        results = self.query(f"""
            MATCH (s {{name: '{service_name}'}})-[:U4_CALLS]->(target)
            RETURN target.name
        """)
        return [r[0] for r in results]

    def get_architecture_layers(self) -> Dict[str, List[str]]:
        """Get all components grouped by architectural layer"""
        results = self.query("""
            MATCH (component)-[:IN_LAYER]->(layer)
            RETURN layer.name, collect(component.name)
        """)
        return {r[0]: r[1] for r in results}

    def close(self):
        """Close WebSocket connection"""
        self.ws.close()

# Usage Example
if __name__ == "__main__":
    client = ScopelockClient()

    print("=== Services ===")
    for service in client.get_services():
        print(f"- {service['name']} ({service['path']})")

    print("\n=== API Endpoints ===")
    for endpoint in client.get_endpoints():
        print(f"- {endpoint['method']} {endpoint['path']}")

    print("\n=== TelegramBot Dependencies ===")
    deps = client.get_service_dependencies("TelegramBot")
    print(deps)

    print("\n=== Architecture Layers ===")
    layers = client.get_architecture_layers()
    for layer, components in layers.items():
        print(f"{layer}: {len(components)} components")

    client.close()
```

---

## JavaScript/TypeScript Integration

### Installation

```bash
npm install ws
```

### Example (TypeScript)

```typescript
import WebSocket from 'ws';

interface QueryRequest {
  type: string;
  graph_name: string;
  view_type: string;
  query: string;
}

interface QueryResponse {
  type: string;
  data: any[][];
  execution_time_ms: number;
}

class ScopelockClient {
  private ws: WebSocket;
  private graphName = 'scopelock';

  constructor(wsUrl: string = 'wss://mindprotocol.ai/api/ws') {
    this.ws = new WebSocket(wsUrl);
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws.on('open', () => resolve());
      this.ws.on('error', (err) => reject(err));
    });
  }

  async query(cypher: string): Promise<any[][]> {
    const request: QueryRequest = {
      type: 'docs.view.request',
      graph_name: this.graphName,
      view_type: 'custom',
      query: cypher,
    };

    return new Promise((resolve, reject) => {
      this.ws.send(JSON.stringify(request));

      this.ws.once('message', (data) => {
        const response: QueryResponse = JSON.parse(data.toString());

        if (response.type === 'error') {
          reject(new Error(response.message));
        } else {
          resolve(response.data);
        }
      });
    });
  }

  async getServices() {
    const results = await this.query(`
      MATCH (n {kind: 'Service'})
      RETURN n.name, n.path
    `);
    return results.map(([name, path]) => ({ name, path }));
  }

  close() {
    this.ws.close();
  }
}

// Usage
(async () => {
  const client = new ScopelockClient();
  await client.connect();

  const services = await client.getServices();
  console.log('Services:', services);

  client.close();
})();
```

---

## REST API (Direct FalkorDB)

### Endpoint

**URL:** `https://mindprotocol.onrender.com/admin/query`

**Method:** POST

**Authentication:** API Key (X-API-Key header)

### cURL Example

```bash
curl -X POST https://mindprotocol.onrender.com/admin/query \
  -H "X-API-Key: ${FALKORDB_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "graph": "scopelock",
    "query": "MATCH (n {kind: \"Service\"}) RETURN n.name LIMIT 5"
  }'
```

**Response:**
```json
{
  "results": [
    ["TelegramBot"],
    ["ClaudeRunner"],
    ["UpworkProposalSubmitter"]
  ],
  "execution_time_ms": 12
}
```

### Python (requests)

```python
import requests

FALKORDB_API_KEY = "Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU"
FALKORDB_URL = "https://mindprotocol.onrender.com/admin/query"

def query_graph(cypher_query):
    response = requests.post(
        FALKORDB_URL,
        headers={"X-API-Key": FALKORDB_API_KEY},
        json={"graph": "scopelock", "query": cypher_query}
    )
    response.raise_for_status()
    return response.json()["results"]

# Usage
services = query_graph("MATCH (n {kind: 'Service'}) RETURN n.name")
print("Services:", services)
```

---

## Common Use Cases

### Use Case 1: Onboarding Dashboard

**Goal:** Build a dashboard for new developers showing system overview

```python
client = ScopelockClient()

# Get architecture overview
layers = client.query("""
    MATCH (layer)
    WHERE layer.name =~ '.*_layer'
    OPTIONAL MATCH (n)-[:IN_LAYER]->(layer)
    RETURN layer.name, count(n)
""")

# Get service list
services = client.query("""
    MATCH (s {kind: 'Service'})
    RETURN s.name, s.description
    ORDER BY s.name
""")

# Get API endpoints
endpoints = client.query("""
    MATCH (e {kind: 'Endpoint'})
    RETURN e.name, e.path, e.method
    ORDER BY e.path
""")

client.close()

# Build dashboard (pseudo-code)
render_dashboard({
    "layers": layers,
    "services": services,
    "endpoints": endpoints
})
```

---

### Use Case 2: Dependency Impact Analysis

**Goal:** Before refactoring a function, see what depends on it

```python
def analyze_impact(function_name: str):
    client = ScopelockClient()

    # Direct callers
    direct_callers = client.query(f"""
        MATCH (caller)-[:U4_CALLS]->(func {{name: '{function_name}'}})
        RETURN caller.name
    """)

    # Indirect callers (2-3 levels deep)
    indirect_callers = client.query(f"""
        MATCH (root)-[:U4_CALLS*2..3]->(func {{name: '{function_name}'}})
        RETURN DISTINCT root.name
    """)

    client.close()

    return {
        "function": function_name,
        "direct_impact": len(direct_callers),
        "indirect_impact": len(indirect_callers),
        "direct_callers": [c[0] for c in direct_callers],
        "indirect_callers": [c[0] for c in indirect_callers]
    }

# Usage
impact = analyze_impact("send_message")
print(f"Refactoring 'send_message' will impact:")
print(f"  - {impact['direct_impact']} direct callers")
print(f"  - {impact['indirect_impact']} indirect callers")
```

---

### Use Case 3: Test Coverage Report

**Goal:** Generate weekly test coverage report

```python
def generate_coverage_report():
    client = ScopelockClient()

    # Overall coverage
    coverage = client.query("""
        MATCH (code:U4_Code_Artifact)
        WHERE code.kind IS NOT NULL
        WITH code.kind AS Type,
             count(code) AS Total,
             count(CASE WHEN (code)-[:U4_TESTED_BY]->() THEN 1 END) AS Tested
        RETURN Type, Total, Tested, (Tested * 100 / Total) AS Percent
        ORDER BY Percent ASC
    """)

    # Critical untested functions
    critical = client.query("""
        MATCH (func)-[:U4_CALLS*0..1]->(critical)
        WHERE NOT (critical)-[:U4_TESTED_BY]->()
        WITH critical, count(DISTINCT func) AS CalledBy
        WHERE CalledBy > 1
        RETURN critical.name, CalledBy
        ORDER BY CalledBy DESC
        LIMIT 10
    """)

    client.close()

    return {
        "coverage_by_type": coverage,
        "critical_untested": critical
    }

# Usage
report = generate_coverage_report()
print("Coverage Report:")
for type, total, tested, percent in report["coverage_by_type"]:
    print(f"  {type}: {percent}% ({tested}/{total})")
```

---

## Rate Limits & Best Practices

### Rate Limits

| API Type | Limit | Window |
|----------|-------|--------|
| WebSocket | 100 queries | 1 minute |
| REST API | 60 requests | 1 minute |

**429 Response:**
```json
{
  "error": "rate_limit_exceeded",
  "retry_after": 60
}
```

### Best Practices

**1. Connection Pooling (WebSocket)**
```python
# Bad: Create new connection per query
for i in range(100):
    client = ScopelockClient()
    client.query("...")
    client.close()

# Good: Reuse connection
client = ScopelockClient()
for i in range(100):
    client.query("...")
client.close()
```

**2. Batch Queries**
```python
# Bad: Multiple round-trips
services = client.query("MATCH (n {kind: 'Service'}) RETURN n.name")
endpoints = client.query("MATCH (n {kind: 'Endpoint'}) RETURN n.name")

# Good: Single query
results = client.query("""
    MATCH (n)
    WHERE n.kind IN ['Service', 'Endpoint']
    RETURN n.kind, n.name
""")
```

**3. Use LIMIT**
```python
# Bad: Return all results (could be thousands)
results = client.query("MATCH (n) RETURN n")

# Good: Limit results
results = client.query("MATCH (n) RETURN n LIMIT 100")
```

**4. Cache Results**
```python
import time

class CachedClient:
    def __init__(self):
        self.client = ScopelockClient()
        self.cache = {}
        self.cache_ttl = 300  # 5 minutes

    def query(self, cypher):
        cache_key = cypher
        if cache_key in self.cache:
            cached_at, results = self.cache[cache_key]
            if time.time() - cached_at < self.cache_ttl:
                return results

        results = self.client.query(cypher)
        self.cache[cache_key] = (time.time(), results)
        return results
```

---

## Troubleshooting

### Connection Issues

**Error:** `WebSocketException: Connection refused`

**Solution:**
1. Check internet connection
2. Verify WebSocket URL: `wss://mindprotocol.ai/api/ws`
3. Check firewall (allow outbound HTTPS/WSS)

---

### Query Syntax Errors

**Error:** `Syntax error in Cypher query`

**Solution:**
1. Test query in Query Cookbook first
2. Check for unescaped quotes in query strings
3. Use parameterized queries:
   ```python
   # Bad (SQL injection risk)
   query = f"MATCH (n {{name: '{user_input}'}}) RETURN n"

   # Good (safe)
   query = "MATCH (n {name: $name}) RETURN n"
   params = {"name": user_input}
   ```

---

### Empty Results

**Error:** Query returns `[]` but you expected results

**Solution:**
1. Verify graph name: `scopelock` (not `Scopelock` or `scope-lock`)
2. Check node properties exist:
   ```cypher
   // Debug: Show all properties
   MATCH (n) RETURN n LIMIT 1
   ```
3. Case-sensitive property matching:
   ```cypher
   // Case-sensitive
   MATCH (n {kind: 'Service'}) RETURN n  // Works
   MATCH (n {kind: 'service'}) RETURN n  // Returns empty
   ```

---

### Authentication Issues

**Error:** `401 Unauthorized` (REST API)

**Solution:**
1. Verify API key is correct
2. Check header name: `X-API-Key` (not `X-Api-Key` or `Authorization`)
3. API key should start with `Sxv...`

---

## Support

**Questions?** hello@graphcare.ai
**Bug Reports?** Slack: #scopelock-support
**Feature Requests?** Email us with use case

**Documentation:**
- Query Cookbook: `query_cookbook.md`
- API Reference: `api_reference.md`
- Architecture Guide: `architecture_narrative.md`

---

**GraphCare** | Knowledge Extraction Service
*Your code, always documented. Always queryable.*
