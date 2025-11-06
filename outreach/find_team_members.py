#!/usr/bin/env python3
"""
Find potential ScopeLock team members from Telegram conversations.

TARGET PROFILES:

1. SUPERVISORS (NOT professional developers)
   - From Nigeria, India, Philippines, Latin America (cost of living fit)
   - Looking for remote/part-time work (5-30 hours/week)
   - Students, recent graduates, junior developers
   - Basic English, willing to learn, can follow instructions
   - NOT requiring: GitHub, years of experience, specific tech stack

2. SOLANA HUSTLERS (marketing/community/creative)
   - Raiders (coordinate raids, engage communities)
   - Designers (UI/UX, graphics, branding)
   - AMA hosts (community engagement, hosting)
   - Moderators (community management, Discord/Telegram)
   - Marketing types (growth, campaigns, content creators)

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
TELEGRAM_EXPORT = '/mnt/c/Users/reyno/Downloads/Telegram Desktop/DataExport_2025-11-05/DataExport_2025-11-05/result.json'
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

# SOLANA HUSTLER PATTERNS (raiders, designers, AMA, mods, marketing)
SOL_HUSTLER_PATTERNS = [
    # Raiders
    r'\b(raid|raiding|raiders|raid team|raid squad)\b',
    r'\b(coordinate raids|organize raids|lead raids)\b',
    r'\b(engagement farming|engagement team)\b',
    r'\b(twitter spaces|x spaces|hosting spaces)\b',

    # Designers
    r'\b(designer|ui/ux|ux/ui|graphic design|visual design|brand design)\b',
    r'\b(figma|sketch|adobe|illustrator|photoshop)\b',
    r'\b(i design|i create|i make)\s+(logos|graphics|visuals|ui|ux|brands)\b',
    r'\b(portfolio|behance|dribbble)\s+(is|link|here)\b',

    # AMA hosts
    r'\b(ama|ask me anything|host ama|hosting ama)\b',
    r'\b(community host|event host|space host)\b',
    r'\b(i host|hosting|moderat(e|or|ing))\s+(amas|events|spaces|calls)\b',

    # Moderators
    r'\b(mod|moderator|modding|community mod|discord mod|telegram mod)\b',
    r'\b(i moderate|moderating)\s+(discord|telegram|community)\b',
    r'\b(community manager|community management|cm)\b',
    r'\b(manage (discord|telegram|community))\b',

    # Marketing / Growth
    r'\b(marketing|marketer|growth|growth hacker|growth marketing)\b',
    r'\b(social media|sm manager|content creator|content creation)\b',
    r'\b(kol|key opinion leader|influencer)\b',
    r'\b(twitter|x\.com|instagram|tiktok)\s+(marketing|growth|strategy)\b',
    r'\b(viral|organic growth|community growth)\b',
    r'\b(campaign|campaigns|marketing campaign)\b',

    # Solana ecosystem signals
    r'\b(solana|sol|spl|phantom|backpack wallet)\b',
    r'\b(jupiter|jup|orca|raydium|marinade)\b',
    r'\b(degen|ape|gm|wagmi|ngmi)\b',
    r'\b(nft|nfts|mint|minting|pfp)\b',
    r'\b(web3|crypto|defi|token)\b',
]

# Hustler keywords
HUSTLER_KEYWORDS = [
    'raid', 'raiding', 'raiders', 'engagement',
    'designer', 'design', 'figma', 'ui/ux', 'graphics', 'logo',
    'ama', 'host', 'hosting', 'spaces',
    'mod', 'moderator', 'community manager', 'discord', 'telegram',
    'marketing', 'growth', 'social media', 'content creator', 'kol', 'influencer',
    'campaign', 'viral', 'organic growth',
    'solana', 'sol', 'degen', 'web3', 'crypto', 'nft',
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

    # Extract Telegram chat information
    telegram_id = chat.get('id')
    chat_type = chat.get('type', 'unknown')

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
        # HUSTLER signals
        'sol_hustler': [],
        'raider': [],
        'designer': [],
        'ama_host': [],
        'moderator': [],
        'marketing': [],
    }

    score = 0
    hustler_score = 0  # Separate score for hustler profile
    exclude = False
    matching_messages = []  # Track message references

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
                # Track message reference
                if len(matching_messages) < 10:  # Limit to 10 message refs
                    matching_messages.append({
                        'message_id': msg.get('id'),
                        'date': msg.get('date'),
                        'text_snippet': text[:200],
                        'signal_type': 'geographic_fit'
                    })

        # Check work seeking
        for pattern in WORK_SEEKING_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                score += 3
                signal_type = 'seeking_work'
                if 'hour' in pattern:
                    if text[:200] not in signals['hours_availability']:
                        signals['hours_availability'].append(text[:200])
                    signal_type = 'hours_availability'
                elif 'need' in pattern or 'earn' in pattern:
                    if text[:200] not in signals['income_need']:
                        signals['income_need'].append(text[:200])
                    signal_type = 'income_need'
                elif 'remote' in pattern or 'work from home' in pattern:
                    if text[:200] not in signals['remote_work_interest']:
                        signals['remote_work_interest'].append(text[:200])
                    signal_type = 'remote_work_interest'
                elif 'willing' in pattern or 'learn' in pattern:
                    if text[:200] not in signals['learning_willing']:
                        signals['learning_willing'].append(text[:200])
                    signal_type = 'learning_willing'
                else:
                    if text[:200] not in signals['seeking_work']:
                        signals['seeking_work'].append(text[:200])
                # Track message reference
                if len(matching_messages) < 10:
                    matching_messages.append({
                        'message_id': msg.get('id'),
                        'date': msg.get('date'),
                        'text_snippet': text[:200],
                        'signal_type': signal_type
                    })

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

        # Check SOL HUSTLER patterns
        for pattern in SOL_HUSTLER_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                hustler_score += 3  # High weight for hustler signals
                signal_type = 'sol_hustler'

                # Categorize by type
                if any(x in pattern for x in ['raid', 'engagement', 'spaces']):
                    if text[:200] not in signals['raider']:
                        signals['raider'].append(text[:200])
                    signal_type = 'raider'
                elif any(x in pattern for x in ['design', 'figma', 'logo', 'ui/ux']):
                    if text[:200] not in signals['designer']:
                        signals['designer'].append(text[:200])
                    signal_type = 'designer'
                elif any(x in pattern for x in ['ama', 'host', 'event']):
                    if text[:200] not in signals['ama_host']:
                        signals['ama_host'].append(text[:200])
                    signal_type = 'ama_host'
                elif any(x in pattern for x in ['mod', 'community manager', 'discord', 'telegram']):
                    if text[:200] not in signals['moderator']:
                        signals['moderator'].append(text[:200])
                    signal_type = 'moderator'
                elif any(x in pattern for x in ['marketing', 'growth', 'kol', 'influencer', 'social media']):
                    if text[:200] not in signals['marketing']:
                        signals['marketing'].append(text[:200])
                    signal_type = 'marketing'
                else:
                    # General sol/crypto signal
                    if text[:200] not in signals['sol_hustler']:
                        signals['sol_hustler'].append(text[:200])
                # Track message reference
                if len(matching_messages) < 10:
                    matching_messages.append({
                        'message_id': msg.get('id'),
                        'date': msg.get('date'),
                        'text_snippet': text[:200],
                        'signal_type': signal_type
                    })

        # Check hustler keywords
        for keyword in HUSTLER_KEYWORDS:
            if keyword in text_lower:
                hustler_score += 1

        # Check positive keywords
        for keyword in POSITIVE_KEYWORDS:
            if keyword in text_lower:
                score += 1

    # Don't include if excluded
    if exclude:
        return False, {}

    # Determine profile type and if this person is a good fit
    profile_type = 'unknown'
    is_supervisor = (
        score >= 5 or  # Multiple positive signals
        len(signals['geographic_fit']) >= 1 or  # In target region
        len(signals['seeking_work']) >= 1 or  # Looking for work
        len(signals['income_need']) >= 1  # Needs income
    )

    is_hustler = (
        hustler_score >= 5 or  # Multiple hustler signals
        len(signals['raider']) >= 1 or
        len(signals['designer']) >= 1 or
        len(signals['ama_host']) >= 1 or
        len(signals['moderator']) >= 1 or
        len(signals['marketing']) >= 1
    )

    # Determine profile type
    if is_supervisor and is_hustler:
        profile_type = 'hybrid'  # Both supervisor AND hustler (best!)
    elif is_supervisor:
        profile_type = 'supervisor'
    elif is_hustler:
        profile_type = 'hustler'

    is_potential_member = is_supervisor or is_hustler

    analysis = {
        'name': name,
        'telegram_id': telegram_id,
        'chat_type': chat_type,
        'score': score,
        'hustler_score': hustler_score,
        'profile_type': profile_type,
        'signals': signals,
        'message_count': len([m for m in messages if m.get('from') != 'You']),
        'matching_messages': matching_messages,  # Message references with IDs and dates
        'sample_messages': []
    }

    # Collect sample messages
    for msg in messages:
        if msg.get('from') == 'You':
            continue

        text = extract_text_from_message(msg)
        if not text:
            continue

        # Check if this message shows good signals (supervisor OR hustler)
        for pattern_list in [GEO_PATTERNS, WORK_SEEKING_PATTERNS, JUNIOR_PATTERNS, SOL_HUSTLER_PATTERNS]:
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
    print("TARGET PROFILES:")
    print("\n1. SUPERVISORS (NOT professional developers)")
    print("  - From target regions (Nigeria, India, Philippines, etc.)")
    print("  - Looking for remote/part-time work (5-30 hours/week)")
    print("  - Students, graduates, junior devs, willing to learn")
    print("  - Basic English, can follow guides")
    print("\n2. SOLANA HUSTLERS (marketing/community/creative)")
    print("  - Raiders (coordinate raids, engagement)")
    print("  - Designers (UI/UX, graphics, branding)")
    print("  - AMA hosts (community engagement)")
    print("  - Moderators (Discord/Telegram mgmt)")
    print("  - Marketing (growth, content, KOLs)")
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

            # Telegram contact info
            f.write(f"TELEGRAM CONTACT:\n")
            f.write(f"  Chat ID: {member['telegram_id']}\n")
            f.write(f"  Display Name: {member['name']}\n")
            f.write(f"  Chat Type: {member['chat_type']}\n\n")

            f.write(f"Profile Type: {member['profile_type'].upper()}\n")
            f.write(f"Supervisor Score: {member['score']}\n")
            f.write(f"Hustler Score: {member['hustler_score']}\n")
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

            # HUSTLER SIGNALS
            if signals['raider']:
                f.write("RAIDER (engagement/raids/spaces):\n")
                for sig in signals['raider'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['designer']:
                f.write("DESIGNER (UI/UX/graphics):\n")
                for sig in signals['designer'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['ama_host']:
                f.write("AMA HOST (community events):\n")
                for sig in signals['ama_host'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['moderator']:
                f.write("MODERATOR (community mgmt):\n")
                for sig in signals['moderator'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['marketing']:
                f.write("MARKETING (growth/content/KOL):\n")
                for sig in signals['marketing'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if signals['sol_hustler']:
                f.write("SOL/WEB3 INVOLVEMENT:\n")
                for sig in signals['sol_hustler'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            # Show matching messages with references
            if member.get('matching_messages'):
                f.write("MATCHING MESSAGES (with references to original conversation):\n")
                for msg_ref in member['matching_messages'][:5]:
                    f.write(f"  Message ID: {msg_ref['message_id']} | Date: {msg_ref['date']}\n")
                    f.write(f"  Signal: {msg_ref['signal_type']}\n")
                    f.write(f"  \"{msg_ref['text_snippet']}\"\n\n")
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
        profile_emoji = {
            'supervisor': '👤',
            'hustler': '🚀',
            'hybrid': '⭐',
            'unknown': '❓'
        }.get(member['profile_type'], '❓')

        print(f"{i}. {profile_emoji} {member['name']} (supervisor: {member['score']}, hustler: {member['hustler_score']})")
        print(f"   Type: {member['profile_type'].upper()}")

        # Show key signals
        signals = member['signals']
        key_signals = []

        # Supervisor signals
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

        # Hustler signals
        if signals['raider']:
            key_signals.append("🎯 Raider")
        if signals['designer']:
            key_signals.append("🎨 Designer")
        if signals['ama_host']:
            key_signals.append("🎙️ AMA host")
        if signals['moderator']:
            key_signals.append("🛡️ Moderator")
        if signals['marketing']:
            key_signals.append("📢 Marketing")

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
