#!/usr/bin/env python3
"""
Find potential ScopeLock team members from Telegram conversations.

TARGET: People who can supervise (NOT professional developers)
- From Nigeria, India, Philippines, Latin America (cost of living fit)
- Looking for remote/part-time work (5-30 hours/week)
- Students, recent graduates, junior developers
- Basic English, willing to learn, can follow instructions
- NOT requiring: GitHub, years of experience, specific tech stack

ScopeLock offers:
- AI does 95% of work + 100% of coding
- You just supervise, deploy, test
- Commission-based: $360-1800/month depending on volume
- Paid in $SOL automatically when client pays
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

# Path to Telegram export (UPDATE THIS)
TELEGRAM_EXPORT = '/mnt/c/Users/reyno/Downloads/Telegram Desktop/DataExport_2025-11-05.zip/DataExport_2025-11-05/results.json'
OUTPUT_DIR = Path('/home/mind-protocol/scopelock/outreach/team_members')

# Geographic indicators (target regions)
GEO_PATTERNS = [
    r'\b(nigeria|nigerian|lagos|abuja|kano)\b',
    r'\b(india|indian|mumbai|delhi|bangalore|hyderabad|pune|chennai)\b',
    r'\b(philippines|filipino|manila|cebu|davao)\b',
    r'\b(pakistan|pakistani|karachi|lahore|islamabad)\b',
    r'\b(bangladesh|dhaka|chittagong)\b',
    r'\b(latin america|mexico|brazil|argentina|colombia|chile|peru)\b',
    r'\b(vietnam|vietnamese|hanoi|ho chi minh)\b',
    r'\b(egypt|egyptian|cairo)\b',
    r'\b(kenya|nairobi)\b',
]

# Job/work seeking patterns
WORK_SEEKING_PATTERNS = [
    # Direct job seeking
    r'\b(looking for|seeking|searching for|need|want)\s+(a job|work|employment|opportunity|gig|freelance|remote work|part-time)\b',
    r'\b(available for|open to|interested in)\s+(work|projects|opportunities|freelance|remote|part-time)\b',
    r'\b(can i|could i|would you|do you)\s+(hire|work with|join)\b',
    r'\b(i am|i\'m)\s+(available|free|looking)\s+(for work|to work|for opportunities)\b',

    # Hours/availability mentions
    r'\bi (have|got)\s+\d+(-\d+)?\s+hours?\s+(per|a)?\s*(week|day|month)\b',
    r'\bi can work\s+\d+(-\d+)?\s+hours?\b',
    r'\bpart-time|full-time|flexible hours|flexible schedule\b',

    # Income needs
    r'\bneed (money|income|$|cash|earning)\b',
    r'\b(earn|make)\s+(\$|money|income)\s+(online|remotely|from home)\b',
    r'\blooking to earn\b',
    r'\bneed to (pay|support|provide)\b',

    # Learning/willingness
    r'\b(willing to|want to|eager to|ready to)\s+(learn|try|start|work)\b',
    r'\bi (can|could)\s+(learn|pick up|understand)\b',
    r'\b(beginner|junior|entry level|starting out|new to)\b',
    r'\bno experience but\b',

    # Remote work interest
    r'\b(remote|work from home|wfh|online work|digital nomad)\b',
    r'\b(upwork|fiverr|freelancer|contra|toptal)\b',
]

# Educational/junior indicators
JUNIOR_PATTERNS = [
    r'\b(student|college|university|studying|degree|graduate|graduated)\b',
    r'\b(learning|self-taught|teaching myself|new to)\b',
    r'\b(junior|entry level|entry-level|beginner|starting)\b',
    r'\b(bootcamp|course|tutorial|udemy|coursera)\b',
    r'\bjust (finished|completed|started)\b',
]

# Basic tech understanding (good, but not required to be expert)
BASIC_TECH_PATTERNS = [
    r'\b(i know|i use|i\'ve used|i\'ve tried)\s+(a bit|a little|some|basic)?\s*(html|css|python|javascript)\b',
    r'\b(understand|familiar with)\s+(websites|web|apps|apis|deployment)\b',
    r'\bcan (read|follow|understand)\s+(code|documentation|instructions)\b',
]

# Negative signals (filter out professional developers)
EXCLUDE_PATTERNS = [
    r'\b\d+\+?\s+years?\s+(of\s+)?(experience|exp)\b',  # "5+ years experience"
    r'\bsenior (developer|engineer|programmer)\b',
    r'\b(cto|tech lead|lead developer|architect)\b',
    r'\b(rate|hourly)\s+is\s+\$\d{2,}\b',  # "$50/hour" rates (too expensive)
]

# Keywords for scoring
POSITIVE_KEYWORDS = [
    'remote', 'part-time', 'flexible', 'available', 'looking for work',
    'need income', 'want to learn', 'willing to learn', 'eager to work',
    'student', 'graduate', 'junior', 'beginner', 'entry level',
    'upwork', 'freelance', 'online work', 'work from home',
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


def analyze_team_member_fit(chat: Dict) -> Tuple[bool, Dict]:
    """
    Analyze if someone could be a good ScopeLock team member.
    Returns (is_potential_member, analysis_data)
    """

    messages = chat.get('messages', [])
    name = chat.get('name') or 'Unknown'
    if not isinstance(name, str):
        name = 'Unknown'

    # Track signals
    signals = {
        'geographic_fit': [],
        'seeking_work': [],
        'hours_availability': [],
        'income_need': [],
        'learning_willing': [],
        'junior_indicators': [],
        'basic_tech': [],
        'remote_work_interest': [],
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

        # Check exclusion patterns (professional devs, senior roles, high rates)
        for pattern in EXCLUDE_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                exclude = True
                break

        if exclude:
            break

        # Check geographic fit
        for pattern in GEO_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                score += 5  # High weight (cost of living fit)
                if text[:200] not in signals['geographic_fit']:
                    signals['geographic_fit'].append(text[:200])

        # Check work seeking
        for pattern in WORK_SEEKING_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                score += 3
                if 'hour' in pattern:
                    if text[:200] not in signals['hours_availability']:
                        signals['hours_availability'].append(text[:200])
                elif 'need' in pattern or 'earn' in pattern:
                    if text[:200] not in signals['income_need']:
                        signals['income_need'].append(text[:200])
                elif 'remote' in pattern or 'work from home' in pattern:
                    if text[:200] not in signals['remote_work_interest']:
                        signals['remote_work_interest'].append(text[:200])
                elif 'willing' in pattern or 'learn' in pattern:
                    if text[:200] not in signals['learning_willing']:
                        signals['learning_willing'].append(text[:200])
                else:
                    if text[:200] not in signals['seeking_work']:
                        signals['seeking_work'].append(text[:200])

        # Check junior/educational indicators
        for pattern in JUNIOR_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                score += 2
                if text[:200] not in signals['junior_indicators']:
                    signals['junior_indicators'].append(text[:200])

        # Check basic tech (good signal, but not required)
        for pattern in BASIC_TECH_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                score += 1
                if text[:200] not in signals['basic_tech']:
                    signals['basic_tech'].append(text[:200])

        # Check positive keywords
        for keyword in POSITIVE_KEYWORDS:
            if keyword in text_lower:
                score += 1

    # Don't include if excluded
    if exclude:
        return False, {}

    # Determine if this person is a good fit
    is_potential_member = (
        score >= 5 or  # Multiple positive signals
        len(signals['geographic_fit']) >= 1 or  # In target region
        len(signals['seeking_work']) >= 1 or  # Looking for work
        len(signals['income_need']) >= 1  # Needs income
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

        # Check if this message shows good signals
        for pattern_list in [GEO_PATTERNS, WORK_SEEKING_PATTERNS, JUNIOR_PATTERNS]:
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

    return is_potential_member, analysis


def main():
    """Main execution."""

    # Load data
    data = load_telegram_data()
    chats = data.get('chats', {}).get('list', [])

    print(f"\nAnalyzing {len(chats)} conversations...")
    print("Looking for potential ScopeLock team members...\n")
    print("Target: People who can SUPERVISE (not professional developers)")
    print("  - From target regions (Nigeria, India, Philippines, etc.)")
    print("  - Looking for remote/part-time work (5-30 hours/week)")
    print("  - Students, graduates, junior devs, willing to learn")
    print("  - Basic English, can follow guides")
    print()

    # Analyze each chat
    potential_members = []

    for i, chat in enumerate(chats):
        # Skip bots
        if is_bot(chat):
            continue

        # Skip if no messages
        messages = chat.get('messages', [])
        if not messages:
            continue

        # Analyze
        is_fit, analysis = analyze_team_member_fit(chat)

        if is_fit:
            potential_members.append(analysis)

        # Progress
        if (i + 1) % 100 == 0:
            print(f"Processed {i+1}/{len(chats)} chats... Found {len(potential_members)} potential members")

    # Sort by score
    potential_members.sort(key=lambda x: x['score'], reverse=True)

    print(f"\n{'='*80}")
    print(f"FOUND {len(potential_members)} POTENTIAL TEAM MEMBERS")
    print(f"{'='*80}\n")

    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)

    # Save full analysis to JSON
    json_output = OUTPUT_DIR / 'team_members.json'
    with open(json_output, 'w', encoding='utf-8') as f:
        json.dump(potential_members, f, indent=2, ensure_ascii=False)
    print(f"✓ Saved full analysis: {json_output}")

    # Create readable summary
    summary_output = OUTPUT_DIR / 'team_members_summary.txt'
    with open(summary_output, 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write("POTENTIAL SCOPELOCK TEAM MEMBERS\n")
        f.write("="*80 + "\n\n")
        f.write(f"Total found: {len(potential_members)}\n\n")
        f.write("Target: People who can supervise (AI does the coding)\n")
        f.write("  - From Nigeria, India, Philippines, Latin America, etc.\n")
        f.write("  - Looking for remote/part-time work (5-30 hours/week)\n")
        f.write("  - Students, graduates, junior devs\n")
        f.write("  - Willing to learn, can follow guides\n\n")

        for i, member in enumerate(potential_members, 1):
            f.write(f"\n{'='*80}\n")
            f.write(f"{i}. {member['name']}\n")
            f.write(f"{'='*80}\n\n")
            f.write(f"Score: {member['score']}\n")
            f.write(f"Their messages: {member['message_count']}\n\n")

            # Signals
            signals = member['signals']

            if signals['geographic_fit']:
                f.write("GEOGRAPHIC FIT (target regions):\n")
                for sig in signals['geographic_fit'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['seeking_work']:
                f.write("SEEKING WORK:\n")
                for sig in signals['seeking_work'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['hours_availability']:
                f.write("AVAILABILITY (hours/week):\n")
                for sig in signals['hours_availability'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['income_need']:
                f.write("INCOME NEED:\n")
                for sig in signals['income_need'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['learning_willing']:
                f.write("WILLING TO LEARN:\n")
                for sig in signals['learning_willing'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['junior_indicators']:
                f.write("JUNIOR/EDUCATIONAL:\n")
                for sig in signals['junior_indicators'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['remote_work_interest']:
                f.write("REMOTE WORK INTEREST:\n")
                for sig in signals['remote_work_interest'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['basic_tech']:
                f.write("BASIC TECH UNDERSTANDING:\n")
                for sig in signals['basic_tech'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if member['sample_messages']:
                f.write("SAMPLE MESSAGES:\n")
                for msg in member['sample_messages'][:5]:
                    f.write(f"  \"{msg}\"\n\n")

            f.write("\n")

    print(f"✓ Saved summary: {summary_output}")

    # Show top 20
    print(f"\n{'='*80}")
    print("TOP 20 POTENTIAL TEAM MEMBERS (by score)")
    print(f"{'='*80}\n")

    for i, member in enumerate(potential_members[:20], 1):
        print(f"{i}. {member['name']} (score: {member['score']})")

        # Show key signals
        signals = member['signals']
        key_signals = []
        if signals['geographic_fit']:
            key_signals.append("📍 Target region")
        if signals['seeking_work']:
            key_signals.append("💼 Seeking work")
        if signals['income_need']:
            key_signals.append("💰 Needs income")
        if signals['junior_indicators']:
            key_signals.append("🎓 Junior/student")
        if signals['remote_work_interest']:
            key_signals.append("🌐 Remote work")

        if key_signals:
            print(f"   {' | '.join(key_signals)}")

        if member['sample_messages']:
            print(f"   Sample: \"{member['sample_messages'][0][:100]}...\"")
        print()

    print(f"\n✓ Complete! Found {len(potential_members)} potential team members")
    print(f"✓ Full results: {OUTPUT_DIR}")
    print()
    print("Next steps:")
    print("  1. Review team_members_summary.txt")
    print("  2. Reach out via Telegram with ScopeLock offer")
    print("  3. Message template: 'Hi [name], saw you're looking for remote work...'")


if __name__ == '__main__':
    main()
