#!/usr/bin/env python3
"""
Find people who proposed development/design services TO us
(potential contractors, collaborators, service providers)
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

# Path to Telegram export
TELEGRAM_EXPORT = '/mnt/c/Users/reyno/Downloads/Telegram Desktop/DataExport_2025-09-29 (1)/result.json'
OUTPUT_DIR = Path('/home/mind-protocol/scopelock/outreach/service_providers')

# Keywords indicating someone is OFFERING services
OFFERING_PATTERNS = [
    # Direct offers
    r'\b(i can|i could|i would|i will)\s+(help|assist|build|develop|design|create|make)\b',
    r'\b(i am|i\'m)\s+(a|an)?\s*(developer|designer|programmer|coder|engineer|freelancer)\b',
    r'\b(i have|i\'ve)\s+(experience|skills|expertise|worked)\s+(in|with|on)\b',
    r'\b(my|our)\s+(services|portfolio|work|experience|skills|team)\b',
    r'\b(we|i)\s+(specialize|specialized|focus|offer|provide)\s+(in|on)\b',

    # Availability/interest
    r'\b(available for|looking for|interested in|open to)\s+(work|projects|collaboration|freelance|contract)\b',
    r'\blet me know if you need\b',
    r'\bif you\'re looking for\b',
    r'\bhappy to help\b',
    r'\bcan assist (with|you)\b',

    # Portfolio/proof
    r'\b(check out|see|view)\s+(my|our)\s+(portfolio|work|github|website)\b',
    r'\bhere\'?s my (portfolio|work|github|cv|resume)\b',
    r'\bi\'?ve? (built|developed|designed|created|worked on)\b',

    # Rates/pricing
    r'\b(my rate|hourly rate|fixed price|budget|quote|estimate)\b',
    r'\b\$\d+\s*(per|/)\s*(hour|project|month)\b',

    # Tech stack mentions
    r'\bi (know|use|work with)\s+(react|next|python|django|node|vue|flutter)\b',
    r'\bexperience (with|in)\s+(web|mobile|frontend|backend|fullstack|ui/ux)\b',
]

# Keywords indicating professional service offering
SERVICE_KEYWORDS = [
    'developer', 'designer', 'programmer', 'engineer', 'freelancer',
    'contractor', 'consultant', 'specialist', 'expert',
    'web development', 'mobile development', 'ui/ux', 'frontend', 'backend',
    'fullstack', 'full-stack', 'full stack',
    'portfolio', 'github', 'resume', 'cv',
    'available', 'hire', 'freelance', 'contract',
    'rate', 'hourly', 'fixed price', 'estimate', 'quote'
]


def load_telegram_data() -> Dict:
    """Load Telegram export JSON."""
    print(f"Loading Telegram export from: {TELEGRAM_EXPORT}")
    with open(TELEGRAM_EXPORT, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"✓ Loaded {len(data.get('chats', {}).get('list', []))} chats")
    return data


def is_bot(chat: Dict) -> bool:
    """Check if chat is with a bot."""
    chat_type = chat.get('type', '')
    name = chat.get('name') or ''
    name = name.lower() if isinstance(name, str) else ''
    return 'bot' in chat_type or 'bot' in name


def extract_text_from_message(message: Dict) -> str:
    """Extract text from message (handles both string and array formats)."""
    text_content = message.get('text', '')

    if isinstance(text_content, str):
        return text_content
    elif isinstance(text_content, list):
        # Join text parts
        parts = []
        for item in text_content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict) and 'text' in item:
                parts.append(item['text'])
        return ' '.join(parts)

    return ''


def analyze_conversation(chat: Dict) -> Tuple[bool, Dict]:
    """
    Analyze if someone is offering dev/design services.
    Returns (is_service_provider, analysis_data)
    """

    messages = chat.get('messages', [])
    name = chat.get('name') or 'Unknown'
    if not isinstance(name, str):
        name = 'Unknown'

    # Track signals
    signals = {
        'offers_service': [],
        'mentions_skills': [],
        'shares_portfolio': [],
        'mentions_rate': [],
        'available_for_work': [],
        'tech_stack': []
    }

    offering_score = 0

    # Analyze messages from OTHER person (not us)
    for msg in messages:
        # Skip our own messages
        if msg.get('from') == 'You' or msg.get('from_id') == 'user_self':
            continue

        text = extract_text_from_message(msg).lower()

        if not text:
            continue

        # Check offering patterns
        for pattern in OFFERING_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                offering_score += 2
                signals['offers_service'].append(text[:150])
                break

        # Check service keywords
        for keyword in SERVICE_KEYWORDS:
            if keyword in text:
                offering_score += 1

                # Categorize
                if keyword in ['developer', 'designer', 'programmer', 'engineer', 'freelancer']:
                    signals['mentions_skills'].append(f"{keyword}: {text[:100]}")
                elif keyword in ['portfolio', 'github', 'resume', 'cv']:
                    signals['shares_portfolio'].append(text[:150])
                elif keyword in ['rate', 'hourly', 'fixed price', 'estimate', 'quote']:
                    signals['mentions_rate'].append(text[:150])
                elif keyword in ['available', 'hire', 'freelance', 'contract']:
                    signals['available_for_work'].append(text[:150])

                # Tech stack
                tech_keywords = ['react', 'next', 'python', 'django', 'node', 'vue', 'flutter',
                                'frontend', 'backend', 'fullstack', 'ui/ux', 'web', 'mobile']
                if any(tk in text for tk in tech_keywords):
                    signals['tech_stack'].append(text[:150])

    # Determine if this is a service provider
    is_provider = (
        offering_score >= 3 or  # Multiple offering signals
        len(signals['offers_service']) >= 1 or  # Direct offer
        len(signals['shares_portfolio']) >= 1  # Shared portfolio/work
    )

    analysis = {
        'name': name,
        'score': offering_score,
        'signals': signals,
        'message_count': len([m for m in messages if m.get('from') != 'You']),
        'sample_messages': []
    }

    # Collect sample messages showing service offering
    for msg in messages:
        if msg.get('from') == 'You':
            continue

        text = extract_text_from_message(msg)
        if not text:
            continue

        # Check if this message shows service offering
        for pattern in OFFERING_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                analysis['sample_messages'].append(text[:300])
                if len(analysis['sample_messages']) >= 3:
                    break

        if len(analysis['sample_messages']) >= 3:
            break

    return is_provider, analysis


def main():
    """Main execution."""

    # Load data
    data = load_telegram_data()
    chats = data.get('chats', {}).get('list', [])

    print(f"\nAnalyzing {len(chats)} conversations...")
    print("Looking for people who offered dev/design services...\n")

    # Analyze each chat
    service_providers = []

    for i, chat in enumerate(chats):
        # Skip bots
        if is_bot(chat):
            continue

        # Skip if no messages
        messages = chat.get('messages', [])
        if not messages:
            continue

        # Analyze
        is_provider, analysis = analyze_conversation(chat)

        if is_provider:
            service_providers.append(analysis)

        # Progress
        if (i + 1) % 100 == 0:
            print(f"Processed {i+1}/{len(chats)} chats... Found {len(service_providers)} service providers")

    # Sort by score
    service_providers.sort(key=lambda x: x['score'], reverse=True)

    print(f"\n{'='*80}")
    print(f"FOUND {len(service_providers)} SERVICE PROVIDERS")
    print(f"{'='*80}\n")

    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)

    # Save full analysis to JSON
    json_output = OUTPUT_DIR / 'service_providers.json'
    with open(json_output, 'w', encoding='utf-8') as f:
        json.dump(service_providers, f, indent=2, ensure_ascii=False)
    print(f"✓ Saved full analysis: {json_output}")

    # Create readable summary
    summary_output = OUTPUT_DIR / 'service_providers_summary.txt'
    with open(summary_output, 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write("TELEGRAM SERVICE PROVIDERS - PEOPLE WHO OFFERED SERVICES TO US\n")
        f.write("="*80 + "\n\n")
        f.write(f"Total found: {len(service_providers)}\n")
        f.write(f"Generated: {Path(__file__).stat().st_mtime}\n\n")

        for i, provider in enumerate(service_providers, 1):
            f.write(f"\n{'='*80}\n")
            f.write(f"{i}. {provider['name']}\n")
            f.write(f"{'='*80}\n\n")
            f.write(f"Score: {provider['score']}\n")
            f.write(f"Their messages: {provider['message_count']}\n\n")

            # Signals
            signals = provider['signals']

            if signals['offers_service']:
                f.write("OFFERS SERVICE:\n")
                for sig in signals['offers_service'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['mentions_skills']:
                f.write("SKILLS MENTIONED:\n")
                for sig in signals['mentions_skills'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['shares_portfolio']:
                f.write("PORTFOLIO/WORK:\n")
                for sig in signals['shares_portfolio'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['mentions_rate']:
                f.write("PRICING:\n")
                for sig in signals['mentions_rate'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['available_for_work']:
                f.write("AVAILABILITY:\n")
                for sig in signals['available_for_work'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['tech_stack']:
                f.write("TECH STACK:\n")
                for sig in signals['tech_stack'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if provider['sample_messages']:
                f.write("SAMPLE MESSAGES:\n")
                for msg in provider['sample_messages'][:3]:
                    f.write(f"  \"{msg}\"\n\n")

            f.write("\n")

    print(f"✓ Saved summary: {summary_output}")

    # Show top 10
    print(f"\n{'='*80}")
    print("TOP 10 SERVICE PROVIDERS (by score)")
    print(f"{'='*80}\n")

    for i, provider in enumerate(service_providers[:10], 1):
        print(f"{i}. {provider['name']} (score: {provider['score']})")
        if provider['sample_messages']:
            print(f"   Sample: \"{provider['sample_messages'][0][:100]}...\"")
        print()

    print(f"\n✓ Complete! Found {len(service_providers)} service providers")
    print(f"✓ Full results: {OUTPUT_DIR}")


if __name__ == '__main__':
    main()
