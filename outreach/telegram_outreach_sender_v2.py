#!/usr/bin/env python3
"""
Automated Telegram Outreach Sender for ScopeLock - V2 (Chunked Messages)
Sends personalized messages in CHUNKS (2-4 messages, 5-10 sec apart, then 2.5-3.5 min before next contact)
"""

import asyncio
import json
import random
import sys
import os
import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict

try:
    from telethon import TelegramClient
    from telethon.errors import FloodWaitError, UserPrivacyRestrictedError
except ImportError:
    print("ERROR: Telethon not installed. Install with:")
    print("  pip install telethon")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv()  # Load .env file
except ImportError:
    print("ERROR: python-dotenv not installed. Install with:")
    print("  pip install python-dotenv")
    sys.exit(1)


# ===== CONFIGURATION =====

# Load from .env file (or environment variables)
API_ID = os.getenv('TELEGRAM_APP_ID')
API_HASH = os.getenv('TELEGRAM_APP_HASH')
PHONE = os.getenv('TELEGRAM_PHONE')

# Rate limiting
MIN_DELAY_BETWEEN_CONTACTS = 150  # 2.5 minutes in seconds
MAX_DELAY_BETWEEN_CONTACTS = 210  # 3.5 minutes in seconds
MIN_DELAY_BETWEEN_CHUNKS = 5      # 5 seconds between chunks
MAX_DELAY_BETWEEN_CHUNKS = 10     # 10 seconds between chunks

# Session file (stores auth token)
SESSION_NAME = 'scopelock_sender'

# Outreach data file
OUTREACH_FILE = Path('outreach_contacts_chunked.json')
LOG_FILE = Path('outreach_log.csv')


# ===== SENDER =====

class OutreachSender:
    def __init__(self, api_id: int, api_hash: str, phone: str):
        self.client = TelegramClient(SESSION_NAME, api_id, api_hash)
        self.phone = phone
        self.contacts = []
        self.sent_count = 0
        self.failed_count = 0

    async def authenticate(self):
        """Authenticate with Telegram."""
        await self.client.start(phone=self.phone)
        print(f"✓ Authenticated as {self.phone}")

    async def find_contact(self, name: str, username: str = None):
        """Find contact by name or username."""
        # If username provided, try that first
        if username:
            try:
                entity = await self.client.get_entity(username)
                return entity
            except:
                pass

        # Search dialogs for name match
        async for dialog in self.client.iter_dialogs():
            if dialog.name == name:
                return dialog.entity

        return None

    async def send_chunked_message(self, contact: Dict, dry_run: bool = False):
        """Send message chunks to a single contact."""
        name = contact['name']
        chunks = contact['chunks']  # List of message strings
        username = contact.get('username')

        print(f"\n{'[DRY RUN] ' if dry_run else ''}Sending to: {name} ({len(chunks)} chunks)")

        try:
            # Find contact
            entity = await self.find_contact(name, username)

            if not entity:
                print(f"  ✗ Contact not found: {name}")
                contact['status'] = 'not_found'
                self.failed_count += 1
                return False

            if dry_run:
                print(f"  ✓ Found contact (dry run - not sending)")
                for i, chunk in enumerate(chunks, 1):
                    print(f"  Chunk {i}/{len(chunks)} preview:\n{chunk[:100]}...")
                return True

            # Send each chunk with delay
            for i, chunk in enumerate(chunks, 1):
                print(f"  Sending chunk {i}/{len(chunks)}...")
                await self.client.send_message(entity, chunk)
                print(f"    ✓ Chunk {i} sent")

                # Wait between chunks (except after last chunk)
                if i < len(chunks):
                    chunk_delay = random.randint(MIN_DELAY_BETWEEN_CHUNKS, MAX_DELAY_BETWEEN_CHUNKS)
                    print(f"    Waiting {chunk_delay}s before next chunk...")
                    await asyncio.sleep(chunk_delay)

            print(f"  ✓ All {len(chunks)} chunks sent to {name}!")
            contact['status'] = 'sent'
            contact['sent_at'] = datetime.now().isoformat()
            self.sent_count += 1

            # Log to CSV
            self.log_send(name, 'success', chunks_count=len(chunks))

            return True

        except FloodWaitError as e:
            print(f"  ⚠️ Rate limit hit! Telegram requires waiting {e.seconds} seconds")
            print(f"  Pausing for {e.seconds} seconds...")
            await asyncio.sleep(e.seconds)
            return False

        except UserPrivacyRestrictedError:
            print(f"  ✗ User privacy settings prevent messages")
            contact['status'] = 'privacy_blocked'
            self.failed_count += 1
            self.log_send(name, 'privacy_blocked')
            return False

        except Exception as e:
            print(f"  ✗ Error: {e}")
            contact['status'] = 'error'
            contact['error'] = str(e)
            self.failed_count += 1
            self.log_send(name, 'error', str(e))
            return False

    async def send_batch(self, contacts: List[Dict], dry_run: bool = False, start_from: int = 0):
        """Send chunked messages to all contacts with rate limiting."""

        print(f"\n{'='*80}")
        print(f"{'DRY RUN MODE - NO MESSAGES WILL BE SENT' if dry_run else 'LIVE MODE - CHUNKED MESSAGES WILL BE SENT'}")
        print(f"{'='*80}\n")
        print(f"Total contacts: {len(contacts)}")
        print(f"Starting from: #{start_from + 1}")
        print(f"Rate limit (between contacts): {MIN_DELAY_BETWEEN_CONTACTS}-{MAX_DELAY_BETWEEN_CONTACTS} seconds")
        print(f"Rate limit (between chunks): {MIN_DELAY_BETWEEN_CHUNKS}-{MAX_DELAY_BETWEEN_CHUNKS} seconds")
        print(f"\nPress Ctrl+C to stop at any time\n")

        if not dry_run:
            response = input("Continue? (yes/no): ")
            if response.lower() != 'yes':
                print("Aborted.")
                return

        try:
            for i, contact in enumerate(contacts[start_from:], start=start_from):
                print(f"\n--- Contact {i+1}/{len(contacts)} ---")

                # Send chunked message
                success = await self.send_chunked_message(contact, dry_run)

                # Save progress after each send
                self.save_progress(contacts)

                # Wait before next contact (with randomization)
                if i < len(contacts) - 1:  # Don't wait after last contact
                    delay = random.randint(MIN_DELAY_BETWEEN_CONTACTS, MAX_DELAY_BETWEEN_CONTACTS)

                    if dry_run:
                        print(f"\n  [DRY RUN] Would wait {delay} seconds before next contact")
                    else:
                        print(f"\n  Waiting {delay} seconds before next contact...")
                        print(f"  (Next: {contacts[i+1]['name']})")

                        # Countdown timer
                        for remaining in range(delay, 0, -30):
                            print(f"    {remaining}s remaining...", end='\r')
                            await asyncio.sleep(30)
                        print()  # New line after countdown

        except KeyboardInterrupt:
            print("\n\n⚠️ Interrupted by user")
            print(f"Progress saved. Resume with --start-from {i}")

        finally:
            print(f"\n{'='*80}")
            print(f"SUMMARY")
            print(f"{'='*80}")
            print(f"Sent: {self.sent_count}")
            print(f"Failed: {self.failed_count}")
            print(f"Total: {len(contacts)}")

            if not dry_run:
                print(f"\nLog file: {LOG_FILE}")
                print(f"Progress file: {OUTREACH_FILE}")

    def log_send(self, name: str, status: str, error: str = '', chunks_count: int = 0):
        """Log send attempt to CSV."""
        if not LOG_FILE.exists():
            with open(LOG_FILE, 'w') as f:
                f.write("Timestamp,Contact,Status,Chunks,Error\n")

        with open(LOG_FILE, 'a') as f:
            timestamp = datetime.now().isoformat()
            f.write(f"{timestamp},{name},{status},{chunks_count},{error}\n")

    def save_progress(self, contacts: List[Dict]):
        """Save current progress to JSON."""
        with open(OUTREACH_FILE, 'w') as f:
            json.dump(contacts, f, indent=2)


# ===== CONTACT GENERATOR =====

def parse_rewritten_batch(file_path: Path) -> List[Dict]:
    """
    Parse a rewritten batch file and extract contacts with chunked messages.
    Returns list of {name, chunks: [str], priority, status}
    """
    contacts = []

    if not file_path.exists():
        return contacts

    content = file_path.read_text()

    # Different batch files have different formats
    # Try to detect format and parse accordingly

    # Batch 1 format: "=== Name ===" then "CHUNK 1:", "CHUNK 2:", etc.
    if '=== ' in content and 'CHUNK 1' in content:
        sections = re.split(r'\n===+ (.+?) ===+', content)

        for i in range(1, len(sections), 2):
            if i+1 >= len(sections):
                break

            name = sections[i].strip()
            body = sections[i+1]

            # Extract chunks
            chunk_pattern = r'CHUNK \d+[^:]*:\s*\n(.+?)(?=\nCHUNK \d+|TIMING:|---|\Z)'
            chunk_matches = re.findall(chunk_pattern, body, re.DOTALL)

            if not chunk_matches:
                continue

            # Clean chunks
            chunks = [chunk.strip() for chunk in chunk_matches if chunk.strip()]

            if not chunks:
                continue

            contacts.append({
                'name': name,
                'username': None,
                'chunks': chunks,
                'priority': 2,  # Will be updated later
                'status': 'pending',
                'source_file': file_path.name
            })

    # Batch 2 format: "=== Name ===" then "Chunk 1:", "Chunk 2:", etc.
    elif '=== ' in content and 'Chunk 1' in content:
        sections = re.split(r'\n===+ (.+?) ===+', content)

        for i in range(1, len(sections), 2):
            if i+1 >= len(sections):
                break

            name = sections[i].strip()
            body = sections[i+1]

            # Extract chunks (capital C)
            chunk_pattern = r'Chunk \d+[^:]*:\s*\n(.+?)(?=\nChunk \d+|TIMING:|---|\Z)'
            chunk_matches = re.findall(chunk_pattern, body, re.DOTALL)

            if not chunk_matches:
                continue

            # Clean chunks
            chunks = [chunk.strip() for chunk in chunk_matches if chunk.strip()]

            if not chunks:
                continue

            contacts.append({
                'name': name,
                'username': None,
                'chunks': chunks,
                'priority': 2,
                'status': 'pending',
                'source_file': file_path.name
            })

    # Batch 4 & 5 format: Lines with "Chunk 1 [...]:" or similar
    elif 'Chunk 1' in content:
        # Split by contact number or separator
        contact_pattern = r'(?:CONTACT #\d+:|^\d+\.)\s*([A-Z][^\n]+)'
        sections = re.split(contact_pattern, content, flags=re.MULTILINE)

        for i in range(1, len(sections), 2):
            if i+1 >= len(sections):
                break

            name = sections[i].strip().rstrip(':')
            body = sections[i+1]

            # Extract chunks
            chunk_pattern = r'Chunk \d+\s*\[?[^\]:]*\]?:\s*\n(.+?)(?=\nChunk \d+|---|\Z)'
            chunk_matches = re.findall(chunk_pattern, body, re.DOTALL)

            if not chunk_matches:
                continue

            # Clean chunks
            chunks = [chunk.strip() for chunk in chunk_matches if chunk.strip()]

            if not chunks:
                continue

            contacts.append({
                'name': name,
                'username': None,
                'chunks': chunks,
                'priority': 2,
                'status': 'pending',
                'source_file': file_path.name
            })

    return contacts


def generate_contacts_json():
    """
    Parse rewritten batch files and generate contacts JSON with chunks.
    """

    all_contacts = []

    # Priority 1 contacts (top 10)
    priority_1 = ["CodeSensei", "ØPTIMUS ONE", "Mike", "Emil", "ying",
                  "Mel", "Leo©", "5w4v3ry", "Etienne", "pdx"]

    # Parse each rewritten batch file
    rewritten_files = [
        Path('outreach_batch_1_rewritten.txt'),
        Path('outreach_batch_2_rewritten.txt'),
        Path('outreach_batch_4_rewritten.txt'),
        Path('outreach_batch_5_rewritten.txt'),
    ]

    for file_path in rewritten_files:
        if not file_path.exists():
            print(f"⚠️ File not found: {file_path}")
            continue

        print(f"Parsing: {file_path.name}...")
        contacts = parse_rewritten_batch(file_path)
        all_contacts.extend(contacts)
        print(f"  ✓ Found {len(contacts)} contacts")

    # Set priority for top 10
    for contact in all_contacts:
        # Clean name (remove special chars for matching)
        clean_name = re.sub(r'[^a-zA-Z0-9\s]', '', contact['name']).strip()

        for priority_name in priority_1:
            clean_priority = re.sub(r'[^a-zA-Z0-9\s]', '', priority_name).strip()
            if clean_name.lower() == clean_priority.lower():
                contact['priority'] = 1
                break

    # Sort by priority
    all_contacts.sort(key=lambda x: (x['priority'], x['name']))

    # Save to JSON
    with open(OUTREACH_FILE, 'w') as f:
        json.dump(all_contacts, f, indent=2)

    print(f"\n✓ Generated {len(all_contacts)} contacts with chunked messages")
    print(f"  Priority 1: {sum(1 for c in all_contacts if c['priority'] == 1)}")
    print(f"  Priority 2: {sum(1 for c in all_contacts if c['priority'] == 2)}")
    print(f"  Saved to: {OUTREACH_FILE}")

    # Show sample
    if all_contacts:
        sample = all_contacts[0]
        print(f"\n  Sample contact: {sample['name']}")
        print(f"  Chunks: {len(sample['chunks'])}")
        print(f"  First chunk preview: {sample['chunks'][0][:80]}...")

    return all_contacts


# ===== MAIN =====

async def main():
    import argparse

    parser = argparse.ArgumentParser(description='Automated Telegram Outreach for ScopeLock (Chunked Messages)')
    parser.add_argument('--generate', action='store_true', help='Generate contacts JSON from rewritten batch files')
    parser.add_argument('--dry-run', action='store_true', help='Test without sending messages')
    parser.add_argument('--start-from', type=int, default=0, help='Resume from contact index')
    parser.add_argument('--contacts', type=str, help='Custom contacts JSON file (default: outreach_contacts_chunked.json)')
    parser.add_argument('--api-id', type=int, help='Telegram API ID')
    parser.add_argument('--api-hash', help='Telegram API Hash')
    parser.add_argument('--phone', help='Phone number')

    args = parser.parse_args()

    # Generate contacts JSON
    if args.generate:
        generate_contacts_json()
        return

    # Check configuration
    api_id = args.api_id or API_ID
    api_hash = args.api_hash or API_HASH
    phone = args.phone or PHONE

    # Convert API_ID to int if it's a string from .env
    if api_id and isinstance(api_id, str):
        api_id = int(api_id)

    if not api_id or not api_hash or not phone:
        print("ERROR: Missing configuration!")
        print("\nYou need to:")
        print("1. Get API credentials from https://my.telegram.org/apps")
        print("2. Create .env file with:")
        print("   TELEGRAM_APP_ID=12345678")
        print("   TELEGRAM_APP_HASH=abc123...")
        print("   TELEGRAM_PHONE=+33621636737")
        print("\n   Or pass via CLI:")
        print("   --api-id ID --api-hash HASH --phone +33123456789")
        print("\n3. Generate contacts: python telegram_outreach_sender_v2.py --generate")
        print("4. Run dry-run: python telegram_outreach_sender_v2.py --dry-run")
        print("5. Run live: python telegram_outreach_sender_v2.py")
        sys.exit(1)

    # Load contacts
    contacts_file = Path(args.contacts) if args.contacts else OUTREACH_FILE

    if not contacts_file.exists():
        print(f"ERROR: Contacts file not found: {contacts_file}")
        if not args.contacts:
            print("Run: python telegram_outreach_sender_v2.py --generate")
        sys.exit(1)

    with open(contacts_file) as f:
        contacts = json.load(f)

    # Filter pending only (skip already sent)
    pending = [c for c in contacts if c['status'] == 'pending']

    if not pending:
        print("✓ All contacts already processed!")
        print(f"  Sent: {sum(1 for c in contacts if c['status'] == 'sent')}")
        print(f"  Failed: {sum(1 for c in contacts if c['status'] != 'sent' and c['status'] != 'pending')}")
        return

    print(f"Loaded {len(pending)} pending contacts")

    # Initialize sender
    sender = OutreachSender(api_id, api_hash, phone)

    # Authenticate
    print("Authenticating with Telegram...")
    await sender.authenticate()

    # Send messages
    await sender.send_batch(pending, dry_run=args.dry_run, start_from=args.start_from)

    await sender.client.disconnect()


if __name__ == '__main__':
    asyncio.run(main())
