#!/usr/bin/env python3
"""
Find developers/designers who offered services - expanded search
Focus on: web3, blockchain, smart contracts, specific tech stacks
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

TELEGRAM_EXPORT = '/mnt/c/Users/reyno/Downloads/Telegram Desktop/DataExport_2025-09-29 (1)/result.json'
OUTPUT_DIR = Path('/home/mind-protocol/scopelock/outreach/developers')

# Expanded developer-specific patterns
DEVELOPER_PATTERNS = [
    # Self-identification
    r'\b(i am|i\'m)\s+(a|an)?\s*(developer|dev|programmer|coder|engineer|fullstack|full-stack|backend|frontend)\b',
    r'\b(i work as|i\'m working as)\s+(a|an)?\s*(developer|dev|programmer|engineer)\b',
    r'\bmy role is\s+(developer|engineer|programmer)\b',

    # Skills/experience
    r'\bi (know|use|work with|specialize in)\s+(react|next|vue|angular|node|python|django|flask|rust|solidity|web3)\b',
    r'\bi have\s+\d+\s+years?\s+(of\s+)?(experience|exp)\s+(in|with|as)\s+(developer|development|programming|coding)\b',
    r'\bexperienced?\s+(in|with)\s+(web3|blockchain|smart contracts|solidity|rust|solana|ethereum|defi)\b',

    # Service offers
    r'\bi can (build|develop|create|code|implement|deploy)\s+(your|a|the)?\s*(website|app|dapp|platform|smart contract|bot|api)\b',
    r'\bi (will|would|could)\s+(help|assist)?\s+(you\s+)?(build|develop|create|code)\b',
    r'\blet me (build|develop|create|code|implement)\b',

    # Portfolio/proof
    r'\bcheck (out\s+)?my\s+(github|portfolio|work|projects|code)\b',
    r'\bhere\'?s my\s+(github|portfolio|work|linkedin|cv|resume)\b',
    r'\bgithub\.com/[\w-]+',
    r'\blinkedin\.com/in/[\w-]+',

    # Tech stack mentions
    r'\b(react|next\.?js|vue|angular|svelte|node\.?js|express|fastapi|django|flask|rails)\b',
    r'\b(solidity|rust|move|web3\.?js|ethers\.?js|solana|ethereum|polygon|avalanche)\b',
    r'\b(typescript|javascript|python|go|golang|java|kotlin|swift)\b',
    r'\b(smart contracts?|defi|nft|dapp|blockchain|crypto|web3)\b',
    r'\b(frontend|backend|fullstack|full-stack|devops|ui/ux)\b',
]

# Service offer keywords
SERVICE_KEYWORDS = [
    'developer', 'dev', 'programmer', 'engineer', 'coder',
    'web3', 'blockchain', 'smart contract', 'solidity', 'rust',
    'react', 'next.js', 'vue', 'angular', 'node.js', 'python', 'django',
    'solana', 'ethereum', 'defi', 'nft', 'dapp',
    'frontend', 'backend', 'fullstack', 'full-stack',
    'github', 'portfolio', 'linkedin',
    'freelance', 'available', 'hire', 'hourly', 'rate', 'quote',
    'i can build', 'i can develop', 'i can code', 'i can help',
    'looking for work', 'open to projects', 'available for hire'
]


def load_telegram_data() -> Dict:
    """Load Telegram export JSON."""
    print(f"Loading Telegram export...")
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


def analyze_developer_conversation(chat: Dict) -> Tuple[bool, Dict]:
    """
    Analyze if someone is offering dev/design services.
    Returns (is_developer, analysis_data)
    """

    messages = chat.get('messages', [])
    name = chat.get('name') or 'Unknown'
    if not isinstance(name, str):
        name = 'Unknown'

    # Track signals
    signals = {
        'self_identifies_as_dev': [],
        'mentions_tech_stack': [],
        'offers_to_build': [],
        'shares_github_portfolio': [],
        'discusses_rate_pricing': [],
        'web3_experience': [],
        'specific_skills': []
    }

    dev_score = 0

    # Analyze messages from OTHER person (not us)
    for msg in messages:
        # Skip our own messages
        if msg.get('from') == 'You' or msg.get('from_id') == 'user_self':
            continue

        text = extract_text_from_message(msg)
        if not text:
            continue

        text_lower = text.lower()

        # Check developer patterns
        for pattern in DEVELOPER_PATTERNS:
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            if matches:
                dev_score += 3

                # Categorize
                if any(x in pattern for x in ['i am', 'i\'m', 'i work as']):
                    signals['self_identifies_as_dev'].append(text[:200])
                elif 'github' in pattern or 'portfolio' in pattern:
                    signals['shares_github_portfolio'].append(text[:200])
                elif 'i can build' in pattern or 'i will' in pattern:
                    signals['offers_to_build'].append(text[:200])
                elif any(x in pattern for x in ['web3', 'solidity', 'blockchain', 'smart contract']):
                    signals['web3_experience'].append(text[:200])
                elif any(x in pattern for x in ['react', 'next', 'python', 'node']):
                    signals['mentions_tech_stack'].append(text[:200])

        # Check service keywords
        for keyword in SERVICE_KEYWORDS:
            if keyword in text_lower:
                dev_score += 1

                # Pricing mentions
                if keyword in ['rate', 'hourly', 'quote', 'freelance', 'hire']:
                    if text not in [s[:200] for s in signals['discusses_rate_pricing']]:
                        signals['discusses_rate_pricing'].append(text[:200])

                # Specific tech skills
                if keyword in ['react', 'next.js', 'solidity', 'rust', 'python', 'solana', 'ethereum']:
                    if text not in [s[:200] for s in signals['specific_skills']]:
                        signals['specific_skills'].append(text[:200])

    # Determine if this is a developer offering services
    is_developer = (
        dev_score >= 5 or  # Multiple developer signals
        len(signals['self_identifies_as_dev']) >= 1 or  # Explicitly says "I'm a developer"
        len(signals['offers_to_build']) >= 1 or  # Offers to build something
        len(signals['shares_github_portfolio']) >= 1  # Shares GitHub/portfolio
    )

    analysis = {
        'name': name,
        'score': dev_score,
        'signals': signals,
        'message_count': len([m for m in messages if m.get('from') != 'You']),
        'sample_messages': []
    }

    # Collect sample messages showing developer offering
    for msg in messages:
        if msg.get('from') == 'You':
            continue

        text = extract_text_from_message(msg)
        if not text:
            continue

        # Check if this message shows developer offering
        for pattern in DEVELOPER_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                if text not in analysis['sample_messages']:
                    analysis['sample_messages'].append(text[:300])
                if len(analysis['sample_messages']) >= 5:
                    break

        if len(analysis['sample_messages']) >= 5:
            break

    return is_developer, analysis


def main():
    """Main execution."""

    # Load data
    data = load_telegram_data()
    chats = data.get('chats', {}).get('list', [])

    print(f"\nAnalyzing {len(chats)} conversations...")
    print("Looking for developers/designers offering services...\n")

    # Analyze each chat
    developers = []

    for i, chat in enumerate(chats):
        # Skip bots
        if is_bot(chat):
            continue

        # Skip if no messages
        messages = chat.get('messages', [])
        if not messages:
            continue

        # Analyze
        is_dev, analysis = analyze_developer_conversation(chat)

        if is_dev:
            developers.append(analysis)

        # Progress
        if (i + 1) % 100 == 0:
            print(f"Processed {i+1}/{len(chats)} chats... Found {len(developers)} developers")

    # Sort by score
    developers.sort(key=lambda x: x['score'], reverse=True)

    print(f"\n{'='*80}")
    print(f"FOUND {len(developers)} DEVELOPERS/DESIGNERS")
    print(f"{'='*80}\n")

    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)

    # Save full analysis to JSON
    json_output = OUTPUT_DIR / 'developers.json'
    with open(json_output, 'w', encoding='utf-8') as f:
        json.dump(developers, f, indent=2, ensure_ascii=False)
    print(f"✓ Saved full analysis: {json_output}")

    # Create readable summary
    summary_output = OUTPUT_DIR / 'developers_summary.txt'
    with open(summary_output, 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write("TELEGRAM DEVELOPERS - WHO OFFERED DEV/DESIGN SERVICES\n")
        f.write("="*80 + "\n\n")
        f.write(f"Total found: {len(developers)}\n\n")

        for i, dev in enumerate(developers, 1):
            f.write(f"\n{'='*80}\n")
            f.write(f"{i}. {dev['name']}\n")
            f.write(f"{'='*80}\n\n")
            f.write(f"Score: {dev['score']}\n")
            f.write(f"Their messages: {dev['message_count']}\n\n")

            # Signals
            signals = dev['signals']

            if signals['self_identifies_as_dev']:
                f.write("SELF-IDENTIFIES AS DEVELOPER:\n")
                for sig in signals['self_identifies_as_dev'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['offers_to_build']:
                f.write("OFFERS TO BUILD:\n")
                for sig in signals['offers_to_build'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['web3_experience']:
                f.write("WEB3/BLOCKCHAIN EXPERIENCE:\n")
                for sig in signals['web3_experience'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['mentions_tech_stack']:
                f.write("TECH STACK:\n")
                for sig in signals['mentions_tech_stack'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['specific_skills']:
                f.write("SPECIFIC SKILLS:\n")
                for sig in signals['specific_skills'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['shares_github_portfolio']:
                f.write("GITHUB/PORTFOLIO:\n")
                for sig in signals['shares_github_portfolio'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['discusses_rate_pricing']:
                f.write("RATE/PRICING:\n")
                for sig in signals['discusses_rate_pricing'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if dev['sample_messages']:
                f.write("SAMPLE MESSAGES:\n")
                for msg in dev['sample_messages'][:3]:
                    f.write(f"  \"{msg}\"\n\n")

            f.write("\n")

    print(f"✓ Saved summary: {summary_output}")

    # Show top 20
    print(f"\n{'='*80}")
    print("TOP 20 DEVELOPERS (by score)")
    print(f"{'='*80}\n")

    for i, dev in enumerate(developers[:20], 1):
        print(f"{i}. {dev['name']} (score: {dev['score']})")
        if dev['sample_messages']:
            print(f"   Sample: \"{dev['sample_messages'][0][:100]}...\"")
        print()

    print(f"\n✓ Complete! Found {len(developers)} developers")
    print(f"✓ Full results: {OUTPUT_DIR}")


if __name__ == '__main__':
    main()
