#!/usr/bin/env python3
"""
Filter service providers to find those who explicitly offered dev/design services
(not ecosystem members, not potential clients)
"""

import json
from pathlib import Path

INPUT_FILE = Path('service_providers/service_providers.json')
OUTPUT_FILE = Path('service_providers/service_providers_filtered.txt')

# Names to exclude (ecosystem members, team, known non-service-providers)
EXCLUDE_NAMES = [
    'Universe Engine', 'UE - Core Team', 'REANANCE', 'KinKong Swarm',
    'Bass AI CFO', 'Unknown', 'Defiant',
    '🌌 Universe Engine', '🪖 UE - Core Team',
]

# Strong offer keywords (explicit service proposals)
STRONG_OFFER_KEYWORDS = [
    'i can help you', 'i can build', 'i can develop', 'i can design',
    'i will create', 'i will build', 'i will develop', 'i will design',
    'my rate is', 'hourly rate', 'fixed price for',
    'here is my portfolio', 'check my portfolio', 'see my work',
    'i am a developer', 'i am a designer', 'i am a freelancer',
    'looking for work', 'available for hire', 'open to projects',
    'my services', 'i offer', 'i provide', 'i specialize in'
]


def has_strong_offer(provider: dict) -> bool:
    """Check if provider has strong explicit service offering signals."""

    # Check sample messages for explicit offers
    for msg in provider.get('sample_messages', []):
        msg_lower = msg.lower()
        for keyword in STRONG_OFFER_KEYWORDS:
            if keyword in msg_lower:
                return True

    # Check offer signals
    for sig in provider['signals'].get('offers_service', []):
        sig_lower = sig.lower()
        for keyword in STRONG_OFFER_KEYWORDS:
            if keyword in sig_lower:
                return True

    return False


def main():
    print("Loading service providers...")
    with open(INPUT_FILE) as f:
        providers = json.load(f)

    print(f"Total providers: {len(providers)}")

    # Filter
    filtered = []
    for provider in providers:
        name = provider['name']

        # Skip excluded names
        if any(excl in name for excl in EXCLUDE_NAMES):
            continue

        # Must have strong offer signals
        if not has_strong_offer(provider):
            continue

        # Must have reasonable score
        if provider['score'] < 10:
            continue

        filtered.append(provider)

    print(f"Filtered providers: {len(filtered)}")

    # Sort by score
    filtered.sort(key=lambda x: x['score'], reverse=True)

    # Write report
    with open(OUTPUT_FILE, 'w') as f:
        f.write("="*80 + "\n")
        f.write("SERVICE PROVIDERS WHO EXPLICITLY OFFERED DEV/DESIGN SERVICES\n")
        f.write("="*80 + "\n\n")
        f.write(f"Total: {len(filtered)}\n")
        f.write("Filtered to show only explicit service offers\n")
        f.write("Excluded: Ecosystem members, team members, potential clients\n\n")

        for i, provider in enumerate(filtered, 1):
            f.write(f"\n{'='*80}\n")
            f.write(f"{i}. {provider['name']}\n")
            f.write(f"{'='*80}\n\n")
            f.write(f"Score: {provider['score']}\n")
            f.write(f"Messages: {provider['message_count']}\n\n")

            # Show sample messages (the smoking gun)
            if provider['sample_messages']:
                f.write("SERVICE OFFER MESSAGES:\n")
                for msg in provider['sample_messages'][:3]:
                    f.write(f"\n  \"{msg}\"\n")
                f.write("\n")

            # Show specific signals
            if provider['signals']['offers_service']:
                f.write("OFFER SIGNALS:\n")
                for sig in provider['signals']['offers_service'][:3]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if provider['signals']['shares_portfolio']:
                f.write("PORTFOLIO SHARED:\n")
                for sig in provider['signals']['shares_portfolio'][:2]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

            if provider['signals']['mentions_rate']:
                f.write("PRICING MENTIONED:\n")
                for sig in provider['signals']['mentions_rate'][:2]:
                    f.write(f"  - {sig}\n")
                f.write("\n")

    print(f"✓ Written: {OUTPUT_FILE}")

    # Print top 20
    print(f"\n{'='*80}")
    print("TOP 20 EXPLICIT SERVICE PROVIDERS")
    print(f"{'='*80}\n")

    for i, provider in enumerate(filtered[:20], 1):
        print(f"{i}. {provider['name']} (score: {provider['score']})")
        if provider['sample_messages']:
            print(f"   Sample: \"{provider['sample_messages'][0][:100]}...\"")
        print()


if __name__ == '__main__':
    main()
