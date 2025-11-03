#!/usr/bin/env python3
"""
Complete Gmail OAuth with authorization code
"""

import sys
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
PROJECT_ID = 'gen-lang-client-0082779823'  # From OAuth credentials
TOPIC_NAME = 'gmail-upwork-responses'

if len(sys.argv) != 2:
    print("Usage: python3 complete-gmail-oauth.py <authorization_code>")
    sys.exit(1)

code = sys.argv[1]

# Create flow and fetch token
flow = InstalledAppFlow.from_client_secrets_file('gmail-oauth.json', SCOPES)
flow.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'
flow.fetch_token(code=code)
creds = flow.credentials

# Save token
with open('gmail-token.json', 'w') as token:
    token.write(creds.to_json())

print("✅ OAuth token saved to gmail-token.json")

# Set up Gmail watch
service = build('gmail', 'v1', credentials=creds)

request_body = {
    'labelIds': ['INBOX'],
    'topicName': f'projects/{PROJECT_ID}/topics/{TOPIC_NAME}',
    'labelFilterAction': 'include'
}

result = service.users().watch(userId='me', body=request_body).execute()

print(f"✅ Gmail watch configured")
print(f"Expires: {result.get('expiration')} (renews automatically)")
print(f"History ID: {result.get('historyId')}")
