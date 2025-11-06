#!/usr/bin/env python3
"""
Find potential ScopeLock clients from Telegram conversations.

TARGET: Business owners/founders who NEED software built (NOT developers offering services)
- Have project ideas: "I need...", "Looking for...", "Can someone build..."
- Complaining about: slow developers, missed deadlines, unreliable freelancers
- Mentions budget, timeline, urgency
- Creative work needs: presentations, voiceovers, translations, content
- Running businesses/startups that need tech

ScopeLock offers:
- Fixed-price software delivery ($3k-15k missions)
- Fast delivery (2-7 days for Evidence Sprint, 1-3 weeks for full)
- Pay only when tests pass (AC green)
- Web apps, AI chatbots, backend APIs, creative AI work
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

# Path to Telegram export (UPDATE THIS)
TELEGRAM_EXPORT = '/mnt/c/Users/reyno/Downloads/Telegram Desktop/DataExport_2025-11-05.zip/DataExport_2025-11-05/results.json'
OUTPUT_DIR = Path('/home/mind-protocol/scopelock/outreach/potential_clients')

# Business owner / founder patterns
BUSINESS_OWNER_PATTERNS = [
    r'\b(i (run|own|started|founded|built|launched))\s+(a|an|my)?\s*(startup|company|business|saas|platform|app|website)\b',
    r'\b(i am|i\'m)\s+(a|an|the)?\s*(founder|ceo|owner|entrepreneur|startup founder)\b',
    r'\bmy (startup|company|business|saas|platform)\b',
    r'\bwe (run|have|built|launched)\s+(a|an)?\s*(startup|company|business|product)\b',
    r'\bour (startup|company|business|product|platform)\b',
]

# Project need patterns (ASKING for software, not OFFERING to build)
PROJECT_NEED_PATTERNS = [
    # Direct needs
    r'\b(i need|i want|i\'m looking for|looking to build|need to build)\s+(a|an|someone to)?\s*(website|app|platform|api|bot|chatbot)\b',
    r'\b(can (someone|anyone|you)|who can|anyone who can)\s+(build|develop|create|make|design)\b',
    r'\b(help me|help us)\s+(build|develop|create|make)\b',
    r'\bneed (help|someone|developer|agency)\s+(to|for|with)\s+(build|develop|create)\b',

    # Problems/complaints (opportunity!)
    r'\b(developer|freelancer|agency)\s+(disappeared|ghosted|stopped responding|went silent)\b',
    r'\b(too slow|taking forever|behind schedule|missed deadline|late delivery)\b',
    r'\b(not working|broken|doesn\'t work|isn\'t working|keeps breaking)\b',
    r'\b(unreliable|unprofessional|bad experience|nightmare|disaster)\s+(developer|freelancer|agency)\b',
    r'\bhad (a bad|terrible|horrible)\s+experience with\b',

    # Urgency/timeline
    r'\bneed (it|this|done)\s+(asap|urgently|quickly|fast|soon|within\s+\d+)\b',
    r'\b(urgent|emergency|critical|time-sensitive)\b',
    r'\bdeadline is\b',
    r'\bhave\s+\d+\s+(days?|weeks?)\s+to\b',

    # Budget mentions (good signal - they're serious)
    r'\bbudget (is|of|around)\s+[\$€£]\d{3,}\b',
    r'\b[\$€£]\d{3,}\s*(budget|to spend|available)\b',
    r'\bhow much (would it|to)\b',

    # Scope descriptions
    r'\bfeatures?:\s*[\d\-•]\b',  # "Features: 1. ..."
    r'\bneed (login|signup|auth|payment|stripe|api|dashboard|admin)\b',
    r'\bintegrate with (stripe|paypal|airtable|notion|slack|discord)\b',
]

# Creative work needs (presentations, voice, content, translation)
CREATIVE_WORK_PATTERNS = [
    r'\bneed (a|an)?\s*(presentation|pitch deck|slides|powerpoint)\b',
    r'\bvoiceover|voice-over|voice narration|audio narration\b',
    r'\btranslate|translation\s+(to|into|from)\b',
    r'\bcontent (writing|creation|generation)\b',
    r'\bblog (posts?|articles?|content)\b',
    r'\bseo content|seo articles?\b',
    r'\bproduct descriptions?\b',
    r'\bmarketing copy|sales copy\b',
    r'\bimages?|graphics?|visuals?\s+(for|need)\b',
]

# Tech need keywords
TECH_NEED_KEYWORDS = [
    'website', 'web app', 'mobile app', 'app', 'platform', 'saas',
    'backend', 'api', 'database', 'integration',
    'chatbot', 'ai chat', 'ai assistant', 'gpt', 'openai',
    'landing page', 'dashboard', 'admin panel',
    'authentication', 'login', 'signup', 'payment', 'stripe',
    'automation', 'workflow', 'scraper', 'bot',
]

# Creative work keywords
CREATIVE_KEYWORDS = [
    'presentation', 'pitch deck', 'slides', 'powerpoint',
    'voiceover', 'voice-over', 'audio', 'narration',
    'translate', 'translation', 'multilingual',
    'content writing', 'blog post', 'article', 'seo',
    'product description', 'marketing copy',
    'images', 'graphics', 'visuals', 'design',
]

# Negative signals (filter out developers offering services)
EXCLUDE_PATTERNS = [
    r'\bi (can|could|will|would)\s+(build|develop|create|design|make|code)\s+(for you|your|it)\b',
    r'\blet me (build|develop|help|create)\b',
    r'\bi am (a|an)\s+(developer|designer|programmer|freelancer)\b',
    r'\bmy (services|portfolio|rate|github)\b',
    r'\bcheck (out\s+)?my (work|portfolio|github)\b',
]


def load_telegram_data() -> Dict:
    """Load Telegram export JSON."""
    print(f"Loading Telegram export...")
    print(f"Path: {TELEGRAM_EXPORT}")
    with open(TELEGRAM_EXPORT, 'r', encoding='utf-8') as f:
        data = json.load(f)
    chats = data.get('chats', {}).get('list', [])
    print(f"✓ Loaded {len(chats)} chats")
    return data


def is_bot(chat: Dict) -> bool:
    """Check if chat is with a bot."""
    chat_type = chat.get('type', '')
    name = chat.get('name') or ''
    name = name.lower() if isinstance(name, str) else ''
    return 'bot' in chat_type or 'bot' in name


def extract_text_from_message(message: Dict) -> str:
    """Extract text from message."""
    text_content = message.get('text', '')

    if isinstance(text_content, str):
        return text_content
    elif isinstance(text_content, list):
        parts = []
        for item in text_content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict) and 'text' in item:
                parts.append(item['text'])
        return ' '.join(parts)

    return ''


def analyze_potential_client(chat: Dict) -> Tuple[bool, Dict]:
    """
    Analyze if someone is a potential ScopeLock client.
    Returns (is_potential_client, analysis_data)
    """

    messages = chat.get('messages', [])
    name = chat.get('name') or 'Unknown'
    if not isinstance(name, str):
        name = 'Unknown'

    # Track signals
    signals = {
        'is_business_owner': [],
        'has_project_need': [],
        'complains_about_devs': [],
        'mentions_urgency': [],
        'mentions_budget': [],
        'tech_needs': [],
        'creative_needs': [],
        'specific_scope': [],
    }

    score = 0
    exclude = False

    # Analyze messages from OTHER person (not us)
    for msg in messages:
        # Skip our own messages
        if msg.get('from') == 'You' or msg.get('from_id') == 'user_self':
            continue

        text = extract_text_from_message(msg)
        if not text:
            continue

        text_lower = text.lower()

        # Check exclusion patterns (developers offering services)
        for pattern in EXCLUDE_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                exclude = True
                break

        if exclude:
            break

        # Check business owner signals
        for pattern in BUSINESS_OWNER_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                score += 5  # High weight (actual business owner)
                if text[:200] not in signals['is_business_owner']:
                    signals['is_business_owner'].append(text[:200])

        # Check project needs
        for pattern in PROJECT_NEED_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                score += 3

                if 'need' in pattern or 'looking for' in pattern or 'can someone' in pattern:
                    if text[:200] not in signals['has_project_need']:
                        signals['has_project_need'].append(text[:200])
                elif 'disappeared' in pattern or 'slow' in pattern or 'broken' in pattern or 'unreliable' in pattern:
                    if text[:200] not in signals['complains_about_devs']:
                        signals['complains_about_devs'].append(text[:200])
                elif 'asap' in pattern or 'urgent' in pattern or 'deadline' in pattern:
                    if text[:200] not in signals['mentions_urgency']:
                        signals['mentions_urgency'].append(text[:200])
                elif 'budget' in pattern or '$' in pattern:
                    if text[:200] not in signals['mentions_budget']:
                        signals['mentions_budget'].append(text[:200])
                elif 'login' in pattern or 'stripe' in pattern or 'integrate' in pattern:
                    if text[:200] not in signals['specific_scope']:
                        signals['specific_scope'].append(text[:200])

        # Check creative work needs
        for pattern in CREATIVE_WORK_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                score += 3
                if text[:200] not in signals['creative_needs']:
                    signals['creative_needs'].append(text[:200])

        # Check tech need keywords
        for keyword in TECH_NEED_KEYWORDS:
            if keyword in text_lower:
                score += 1
                if text[:200] not in signals['tech_needs']:
                    signals['tech_needs'].append(text[:200])

        # Check creative keywords
        for keyword in CREATIVE_KEYWORDS:
            if keyword in text_lower:
                score += 1
                # Already captured in creative_needs

    # Don't include if excluded (they're offering services, not asking for them)
    if exclude:
        return False, {}

    # Determine if this person is a potential client
    is_potential_client = (
        score >= 5 or  # Multiple client signals
        len(signals['is_business_owner']) >= 1 or  # Owns a business
        len(signals['has_project_need']) >= 1 or  # Explicitly needs software
        len(signals['complains_about_devs']) >= 1  # Had bad experience (opportunity!)
    )

    analysis = {
        'name': name,
        'score': score,
        'signals': signals,
        'message_count': len([m for m in messages if m.get('from') != 'You']),
        'sample_messages': []
    }

    # Collect sample messages
    for msg in messages:
        if msg.get('from') == 'You':
            continue

        text = extract_text_from_message(msg)
        if not text:
            continue

        # Check if this message shows client need
        for pattern_list in [BUSINESS_OWNER_PATTERNS, PROJECT_NEED_PATTERNS, CREATIVE_WORK_PATTERNS]:
            for pattern in pattern_list:
                if re.search(pattern, text, re.IGNORECASE):
                    if text not in analysis['sample_messages']:
                        analysis['sample_messages'].append(text[:300])
                    if len(analysis['sample_messages']) >= 5:
                        break

            if len(analysis['sample_messages']) >= 5:
                break

        if len(analysis['sample_messages']) >= 5:
            break

    return is_potential_client, analysis


def main():
    """Main execution."""

    # Load data
    data = load_telegram_data()
    chats = data.get('chats', {}).get('list', [])

    print(f"\nAnalyzing {len(chats)} conversations...")
    print("Looking for potential ScopeLock clients...\n")
    print("Target: Business owners who NEED software built (NOT developers offering services)")
    print("  - Have project ideas: websites, apps, APIs, chatbots")
    print("  - Complaining about slow/unreliable developers")
    print("  - Mentions budget, timeline, urgency")
    print("  - Creative work needs: presentations, voice, content")
    print()

    # Analyze each chat
    potential_clients = []

    for i, chat in enumerate(chats):
        # Skip bots
        if is_bot(chat):
            continue

        # Skip if no messages
        messages = chat.get('messages', [])
        if not messages:
            continue

        # Analyze
        is_client, analysis = analyze_potential_client(chat)

        if is_client:
            potential_clients.append(analysis)

        # Progress
        if (i + 1) % 100 == 0:
            print(f"Processed {i+1}/{len(chats)} chats... Found {len(potential_clients)} potential clients")

    # Sort by score
    potential_clients.sort(key=lambda x: x['score'], reverse=True)

    print(f"\n{'='*80}")
    print(f"FOUND {len(potential_clients)} POTENTIAL CLIENTS")
    print(f"{'='*80}\n")

    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)

    # Save full analysis to JSON
    json_output = OUTPUT_DIR / 'potential_clients.json'
    with open(json_output, 'w', encoding='utf-8') as f:
        json.dump(potential_clients, f, indent=2, ensure_ascii=False)
    print(f"✓ Saved full analysis: {json_output}")

    # Create readable summary
    summary_output = OUTPUT_DIR / 'potential_clients_summary.txt'
    with open(summary_output, 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write("POTENTIAL SCOPELOCK CLIENTS\n")
        f.write("="*80 + "\n\n")
        f.write(f"Total found: {len(potential_clients)}\n\n")
        f.write("Target: Business owners who need software built\n")
        f.write("  - Have project ideas (websites, apps, APIs, chatbots)\n")
        f.write("  - Complaining about unreliable developers (opportunity!)\n")
        f.write("  - Mentions budget, timeline, urgency\n")
        f.write("  - Creative work needs (presentations, voice, content)\n\n")

        for i, client in enumerate(potential_clients, 1):
            f.write(f"\n{'='*80}\n")
            f.write(f"{i}. {client['name']}\n")
            f.write(f"{'='*80}\n\n")
            f.write(f"Score: {client['score']}\n")
            f.write(f"Their messages: {client['message_count']}\n\n")

            # Signals
            signals = client['signals']

            if signals['is_business_owner']:
                f.write("BUSINESS OWNER/FOUNDER:\n")
                for sig in signals['is_business_owner'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['has_project_need']:
                f.write("PROJECT NEED:\n")
                for sig in signals['has_project_need'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['complains_about_devs']:
                f.write("COMPLAINS ABOUT DEVELOPERS (opportunity!):\n")
                for sig in signals['complains_about_devs'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['mentions_urgency']:
                f.write("URGENCY/TIMELINE:\n")
                for sig in signals['mentions_urgency'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['mentions_budget']:
                f.write("BUDGET MENTIONED:\n")
                for sig in signals['mentions_budget'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['tech_needs']:
                f.write("TECH NEEDS:\n")
                for sig in signals['tech_needs'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['creative_needs']:
                f.write("CREATIVE WORK NEEDS:\n")
                for sig in signals['creative_needs'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['specific_scope']:
                f.write("SPECIFIC SCOPE:\n")
                for sig in signals['specific_scope'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if client['sample_messages']:
                f.write("SAMPLE MESSAGES:\n")
                for msg in client['sample_messages'][:5]:
                    f.write(f"  \"{msg}\"\n\n")

            f.write("\n")

    print(f"✓ Saved summary: {summary_output}")

    # Show top 20
    print(f"\n{'='*80}")
    print("TOP 20 POTENTIAL CLIENTS (by score)")
    print(f"{'='*80}\n")

    for i, client in enumerate(potential_clients[:20], 1):
        print(f"{i}. {client['name']} (score: {client['score']})")

        # Show key signals
        signals = client['signals']
        key_signals = []
        if signals['is_business_owner']:
            key_signals.append("👔 Business owner")
        if signals['has_project_need']:
            key_signals.append("🚀 Has project need")
        if signals['complains_about_devs']:
            key_signals.append("😤 Unhappy with devs")
        if signals['mentions_budget']:
            key_signals.append("💰 Budget mentioned")
        if signals['mentions_urgency']:
            key_signals.append("⏰ Urgent")

        if key_signals:
            print(f"   {' | '.join(key_signals)}")

        if client['sample_messages']:
            print(f"   Sample: \"{client['sample_messages'][0][:100]}...\"")
        print()

    print(f"\n✓ Complete! Found {len(potential_clients)} potential clients")
    print(f"✓ Full results: {OUTPUT_DIR}")
    print()
    print("Next steps:")
    print("  1. Review potential_clients_summary.txt")
    print("  2. Reach out via Telegram with ScopeLock offer")
    print("  3. Lead with: 'Saw you need [X]. We deliver fixed-price, pay when tests pass...'")
    print("  4. If they complained about devs: 'We solve that exact problem with AC.md...'")


if __name__ == '__main__':
    main()
