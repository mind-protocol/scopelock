#!/usr/bin/env python3
"""
Filter to find REAL developers who offered services
(exclude ecosystem members, team, investors)
"""

import json
from pathlib import Path

INPUT_FILE = Path('developers/developers.json')
OUTPUT_FILE = Path('developers/developers_filtered.txt')

# Exclude ecosystem/team members
EXCLUDE_NAMES = [
    'Universe Engine', 'UE - Core Team', 'REANANCE', 'KinKong Swarm',
    'Bass AI CFO', 'Defiant', 'DreamKollab', 'Serenissima',
    'The Board', 'Ambassadors', 'Aqualis', 'Ineya',
    '🌌', '🪖', '🦸', '🍸', '🌇',  # Emoji prefixes
]

# Strong developer offer signals
DEVELOPER_SIGNALS = [
    # Self-identification
    "i'm a developer", "i am a developer", "i'm a fullstack",
    "i'm a full-stack", "i am a full-stack",
    "i work as a developer", "i'm a web3 dev", "i'm a blockchain dev",

    # Offering to build
    "i can build", "i can develop", "i can code", "i can create",
    "i will build", "i will develop", "let me build",
    "i'd love to join your team as a developer",
    "looking for developer position",

    # Portfolio sharing
    "here's my github", "here is my github", "check my github",
    "my github:", "github.com/",
    "my portfolio:", "check my portfolio",

    # Tech skills
    "smart contract development", "dapp development",
    "solidity dev", "rust dev", "blockchain dev",
    "full stack web3", "fullstack web3",
]


def has_developer_signals(dev: dict) -> bool:
    """Check if developer has strong service offering signals."""

    # Check sample messages
    for msg in dev.get('sample_messages', []):
        msg_lower = msg.lower()
        for signal in DEVELOPER_SIGNALS:
            if signal in msg_lower:
                return True

    # Check all signals
    for signal_type in dev['signals'].values():
        if not isinstance(signal_type, list):
            continue
        for sig in signal_type:
            sig_lower = sig.lower()
            for signal in DEVELOPER_SIGNALS:
                if signal in sig_lower:
                    return True

    return False


def extract_github_links(dev: dict) -> list:
    """Extract GitHub profile links."""
    links = []

    # Check in all signals
    for signal_type in dev['signals'].values():
        if not isinstance(signal_type, list):
            continue
        for sig in signal_type:
            if 'github.com/' in sig.lower() and '/repos' not in sig.lower():
                # Extract GitHub URL
                import re
                matches = re.findall(r'github\.com/[\w-]+', sig, re.IGNORECASE)
                links.extend(matches)

    return list(set(links))


def main():
    print("Loading developers...")
    with open(INPUT_FILE) as f:
        developers = json.load(f)

    print(f"Total developers: {len(developers)}")

    # Filter
    filtered = []
    for dev in developers:
        name = dev['name']

        # Skip excluded names
        if any(excl in name for excl in EXCLUDE_NAMES):
            continue

        # Skip "Unknown"
        if name == 'Unknown':
            continue

        # Must have developer signals
        if not has_developer_signals(dev):
            continue

        # Must have reasonable score
        if dev['score'] < 10:
            continue

        # Extract GitHub links
        dev['github_links'] = extract_github_links(dev)

        filtered.append(dev)

    print(f"Filtered developers: {len(filtered)}")

    # Sort by score
    filtered.sort(key=lambda x: x['score'], reverse=True)

    # Write report
    with open(OUTPUT_FILE, 'w') as f:
        f.write("="*80 + "\n")
        f.write("REAL DEVELOPERS WHO OFFERED SERVICES\n")
        f.write("="*80 + "\n\n")
        f.write(f"Total: {len(filtered)}\n")
        f.write("Filtered to show only explicit developer offers\n")
        f.write("Excluded: Ecosystem members, team, investors\n\n")

        for i, dev in enumerate(filtered, 1):
            f.write(f"\n{'='*80}\n")
            f.write(f"{i}. {dev['name']}\n")
            f.write(f"{'='*80}\n\n")
            f.write(f"Score: {dev['score']}\n")
            f.write(f"Messages: {dev['message_count']}\n\n")

            # GitHub links
            if dev['github_links']:
                f.write("GITHUB:\n")
                for link in dev['github_links']:
                    f.write(f"  - https://{link}\n")
                f.write("\n")

            # Self-identifies as developer
            if dev['signals']['self_identifies_as_dev']:
                f.write("SELF-IDENTIFIES AS DEVELOPER:\n")
                for sig in dev['signals']['self_identifies_as_dev'][:2]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            # Offers to build
            if dev['signals']['offers_to_build']:
                f.write("OFFERS TO BUILD:\n")
                for sig in dev['signals']['offers_to_build'][:2]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            # Web3 experience
            if dev['signals']['web3_experience']:
                f.write("WEB3 EXPERIENCE:\n")
                for sig in dev['signals']['web3_experience'][:2]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            # Tech stack
            if dev['signals']['mentions_tech_stack']:
                f.write("TECH STACK:\n")
                for sig in dev['signals']['mentions_tech_stack'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            # Specific skills
            if dev['signals']['specific_skills']:
                f.write("SKILLS:\n")
                for sig in dev['signals']['specific_skills'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            # Sample messages
            if dev['sample_messages']:
                f.write("SAMPLE MESSAGES:\n")
                for msg in dev['sample_messages'][:2]:
                    f.write(f"\n  \"{msg}\"\n")
                f.write("\n")

    print(f"✓ Written: {OUTPUT_FILE}")

    # Print top 30
    print(f"\n{'='*80}")
    print("TOP 30 REAL DEVELOPERS")
    print(f"{'='*80}\n")

    for i, dev in enumerate(filtered[:30], 1):
        github_count = len(dev['github_links'])
        github_str = f" | {github_count} GitHub" if github_count > 0 else ""
        print(f"{i}. {dev['name']} (score: {dev['score']}{github_str})")
        if dev['sample_messages']:
            print(f"   Sample: \"{dev['sample_messages'][0][:80]}...\"")
        print()


if __name__ == '__main__':
    main()
