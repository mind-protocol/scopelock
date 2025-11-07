"""
Seed test missions into FalkorDB for Mission Deck development

This script creates U4_Work_Item nodes matching the frontend mock missions
to enable testing chat functionality with real backend integration.

Usage:
    python3 backend/scripts/seed_test_missions.py

Environment:
    FALKORDB_API_URL: FalkorDB REST API endpoint
    FALKORDB_API_KEY: API key for authentication
    GRAPH_NAME: Graph name (default: scopelock)
"""

import requests
import json
import os
from datetime import datetime

# FalkorDB connection
FALKORDB_API_URL = os.getenv('FALKORDB_API_URL', 'https://mindprotocol.onrender.com/admin/query')
FALKORDB_API_KEY = os.getenv('FALKORDB_API_KEY', 'Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU')
GRAPH_NAME = os.getenv('GRAPH_NAME', 'scopelock')

# Test missions matching frontend mock data
# These are MISSIONS (internal tasks), not Jobs (client work)
# CORRECTED MODEL: No claiming, points-based, first to complete wins
TEST_MISSIONS = [
    {
        "slug": "47",
        "work_type": "mission",  # MISSION, not job
        "name": "Telegram Notifier",
        "client_name": "Acme Corp",
        "budget_cents": 30000,  # $300.00
        "due_date": "2025-11-08T23:59:59Z",
        "state": "active",
        "status": "available",  # Available (first to complete wins)
        "missionType": "other",  # 'proposal', 'social', 'recruitment', 'other'
        "points": 1,  # Points earned for completing (1 for proposals, varies by type)
        "emmaChatSessionId": None,  # Set when Emma validates completion
        "completedAt": None,  # Set when Emma validates
        "completedBy": None,  # Member who completed (first to finish)
        "actualPayment": None,  # Calculated at job payment time
        "paidWithJob": None,  # Job slug that triggered payment
        "stack_backend": "Python FastAPI",
        "stack_frontend": None,
        "stack_deploy_backend": "Render",
        "stack_deploy_frontend": None,
        "stack_database": "FalkorDB",
        "notes": "Client prefers inline buttons over separate commands.",
        "created_at": "2025-11-05T10:00:00Z",
        "scope_ref": "scopelock",
        "level": "L3",
        "visibility": "partners",
        "created_by": "nlr",
        "substrate": "organizational"
    },
    {
        "slug": "48",
        "work_type": "mission",
        "name": "Landing Page",
        "client_name": "Beta Inc",
        "budget_cents": 45000,  # $450.00
        "due_date": "2025-11-10T23:59:59Z",
        "state": "active",
        "status": "available",
        "missionType": "other",
        "points": 1,
        "emmaChatSessionId": None,
        "completedAt": None,
        "completedBy": None,
        "actualPayment": None,
        "paidWithJob": None,
        "stack_backend": None,
        "stack_frontend": "Next.js 14",
        "stack_deploy_backend": None,
        "stack_deploy_frontend": "Vercel",
        "stack_database": None,
        "notes": None,
        "created_at": "2025-11-05T11:00:00Z",
        "scope_ref": "scopelock",
        "level": "L3",
        "visibility": "partners",
        "created_by": "nlr",
        "substrate": "organizational"
    },
    {
        "slug": "49",
        "work_type": "mission",
        "name": "Dashboard Analytics",
        "client_name": "Gamma LLC",
        "budget_cents": 60000,  # $600.00
        "due_date": "2025-11-12T23:59:59Z",
        "state": "qa",
        "status": "completed",  # This one is completed
        "missionType": "other",
        "points": 1,
        "emmaChatSessionId": "chat-session-123",  # Emma validated this one
        "completedAt": "2025-11-06T15:00:00Z",
        "completedBy": "test-member-wallet",  # Member who completed it
        "actualPayment": None,  # Will be calculated when job completes
        "paidWithJob": None,  # Not paid yet
        "stack_backend": "Python FastAPI",
        "stack_frontend": "Next.js 14",
        "stack_deploy_backend": "Render",
        "stack_deploy_frontend": "Vercel",
        "stack_database": "PostgreSQL",
        "notes": None,
        "created_at": "2025-11-05T12:00:00Z",
        "scope_ref": "scopelock",
        "level": "L3",
        "visibility": "partners",
        "created_by": "nlr",
        "substrate": "organizational"
    }
]


def escape_cypher_value(value):
    """Escape value for inline Cypher query (FalkorDB doesn't support parameters)"""
    if value is None:
        return "null"
    elif isinstance(value, bool):
        return "true" if value else "false"
    elif isinstance(value, (int, float)):
        return str(value)
    elif isinstance(value, str):
        # Escape single quotes for Cypher strings
        escaped = value.replace("'", "\\'")
        return f"'{escaped}'"
    else:
        return str(value)


def query_falkordb(cypher: str, params: dict = None):
    """Execute Cypher query against FalkorDB REST API

    IMPORTANT: FalkorDB doesn't support parameterized queries, so parameters
    are inlined using string replacement.
    """
    # Inline parameters (FalkorDB doesn't support parameterized queries)
    if params:
        for key, value in params.items():
            escaped_value = escape_cypher_value(value)
            cypher = cypher.replace(f"${key}", escaped_value)

    response = requests.post(
        FALKORDB_API_URL,
        headers={'X-API-Key': FALKORDB_API_KEY},
        json={
            'graph_name': GRAPH_NAME,
            'query': cypher,
            'params': {}  # Always empty since we inline
        }
    )

    if response.status_code != 200:
        print(f"❌ FalkorDB error: {response.status_code}")
        print(response.text)
        return None

    return response.json()


def clear_existing_test_missions():
    """Remove existing test missions (slugs 47, 48, 49)"""
    print("🗑️  Clearing existing test missions...")

    cypher = """
    MATCH (m:U4_Work_Item)
    WHERE m.slug IN ['47', '48', '49'] AND m.scope_ref = 'scopelock'
    DELETE m
    RETURN count(m) as deleted_count
    """

    result = query_falkordb(cypher)
    if result:
        deleted = result['result'][1][0][0] if result['result'][1] else 0
        print(f"   Deleted {deleted} existing missions")


def create_mission(mission_data: dict):
    """Create a single mission in FalkorDB"""
    print(f"📝 Creating mission: {mission_data['slug']} - {mission_data['name']}")

    # Get current timestamp for updated_at
    updated_at = datetime.utcnow().isoformat() + 'Z'
    valid_from = datetime.utcnow().isoformat() + 'Z'

    # Build Cypher query with all required fields
    cypher = """
    CREATE (m:U4_Work_Item {
        slug: $slug,
        work_type: $work_type,
        name: $name,
        scope_ref: $scope_ref,
        level: $level,
        visibility: $visibility,
        created_by: $created_by,
        substrate: $substrate,
        created_at: $created_at,
        updated_at: $updated_at,
        valid_from: $valid_from
    })
    """

    # Add updated_at and valid_from to params
    mission_data['updated_at'] = updated_at
    mission_data['valid_from'] = valid_from

    # Add all mission-specific fields (CORRECTED: No claiming, points-based)
    cypher += "\nSET m.state = $state"
    cypher += "\nSET m.status = $status"
    cypher += "\nSET m.missionType = $missionType"
    cypher += "\nSET m.points = $points"
    cypher += "\nSET m.client_name = $client_name"
    cypher += "\nSET m.budget_cents = $budget_cents"
    cypher += "\nSET m.due_date = $due_date"

    # Add optional fields (only if not None)
    if mission_data.get('stack_backend'):
        cypher += "\nSET m.stack_backend = $stack_backend"
    if mission_data.get('stack_frontend'):
        cypher += "\nSET m.stack_frontend = $stack_frontend"
    if mission_data.get('stack_deploy_backend'):
        cypher += "\nSET m.stack_deploy_backend = $stack_deploy_backend"
    if mission_data.get('stack_deploy_frontend'):
        cypher += "\nSET m.stack_deploy_frontend = $stack_deploy_frontend"
    if mission_data.get('stack_database'):
        cypher += "\nSET m.stack_database = $stack_database"
    if mission_data.get('notes'):
        cypher += "\nSET m.notes = $notes"
    if mission_data.get('emmaChatSessionId'):
        cypher += "\nSET m.emmaChatSessionId = $emmaChatSessionId"
    if mission_data.get('completedAt'):
        cypher += "\nSET m.completedAt = $completedAt"
    if mission_data.get('completedBy'):
        cypher += "\nSET m.completedBy = $completedBy"
    if mission_data.get('actualPayment') is not None:
        cypher += "\nSET m.actualPayment = $actualPayment"
    if mission_data.get('paidWithJob'):
        cypher += "\nSET m.paidWithJob = $paidWithJob"

    cypher += "\nRETURN m.slug, m.name, m.work_type, m.status"

    result = query_falkordb(cypher, mission_data)

    if result and result['result'][1]:
        slug, name, work_type, status = result['result'][1][0]
        print(f"   ✅ Created {work_type} {slug}: {name} ({status})")
    else:
        print(f"   ❌ Failed to create mission")


def verify_missions():
    """Verify all missions were created successfully"""
    print("\n🔍 Verifying created missions...")

    cypher = """
    MATCH (m:U4_Work_Item)
    WHERE m.scope_ref = 'scopelock' AND m.work_type = 'mission'
    RETURN m.slug, m.name, m.work_type, m.status, m.points, m.completedBy
    ORDER BY m.slug
    """

    result = query_falkordb(cypher)

    if result and result['result'][1]:
        print(f"\n📋 Found {len(result['result'][1])} missions:")
        for row in result['result'][1]:
            slug, name, work_type, status, points, completed_by = row
            completed_str = f"completed by {completed_by}" if completed_by else "available (first to complete wins)"
            print(f"   • Mission {slug}: {name} (status={status}, points={points}, {completed_str})")
    else:
        print("   ❌ No missions found")


def main():
    print("🌱 Seeding test missions into FalkorDB (CORRECTED MODEL)")
    print(f"   Graph: {GRAPH_NAME}")
    print(f"   Model: Points-based, no claiming, first to complete wins")
    print()

    # Clear existing test missions
    clear_existing_test_missions()
    print()

    # Create each mission
    for mission in TEST_MISSIONS:
        create_mission(mission)

    # Verify
    verify_missions()

    print("\n✅ Seeding complete!")
    print("\n💡 Created MISSIONS with CORRECTED MODEL:")
    print("   • work_type: 'mission'")
    print("   • Points-based: 1 point per mission")
    print("   • NO claiming: First to complete wins")
    print("   • Emma validation: Via chat, no manual proof")
    print("   • Payment: Batched with next job (5% pool split by points)")


if __name__ == "__main__":
    main()
