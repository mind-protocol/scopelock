#!/usr/bin/env python3
"""
Set up Gmail push notifications for Upwork responses

Run once to configure, then renews automatically.
"""

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import os
import json

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
PROJECT_ID = 'gen-lang-client-0082779823'  # From OAuth credentials
TOPIC_NAME = 'gmail-upwork-responses'

def get_credentials():
    """Get Gmail API credentials"""
    creds = None

    # Load existing token
    if os.path.exists('gmail-token.json'):
        creds = Credentials.from_authorized_user_file('gmail-token.json', SCOPES)

    # Refresh or get new token
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'gmail-oauth.json', SCOPES)

            # Manual flow for WSL/headless environments
            flow.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'
            auth_url, _ = flow.authorization_url(prompt='consent')

            print('\nPlease visit this URL to authorize the application:')
            print(auth_url)
            print('\nAfter authorization, copy the code from the browser and paste it here:')
            code = input('Enter authorization code: ').strip()

            flow.fetch_token(code=code)
            creds = flow.credentials

        # Save token
        with open('gmail-token.json', 'w') as token:
            token.write(creds.to_json())

    return creds

def setup_watch():
    """Set up Gmail push notification"""
    creds = get_credentials()
    service = build('gmail', 'v1', credentials=creds)

    # Set up watch on inbox
    request_body = {
        'labelIds': ['INBOX'],
        'topicName': f'projects/{PROJECT_ID}/topics/{TOPIC_NAME}',
        'labelFilterAction': 'include'
    }

    result = service.users().watch(userId='me', body=request_body).execute()

    print(f"✅ Gmail watch configured")
    print(f"Expires: {result.get('expiration')} (renews automatically)")
    print(f"History ID: {result.get('historyId')}")

    return result

if __name__ == '__main__':
    setup_watch()
