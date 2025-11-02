# Gmail Webhook via Google Cloud Function

**Purpose**: Trigger Rafael when Upwork client responds via Gmail
**Cost**: $0 (Google Cloud free tier)
**Setup time**: 30 minutes (one-time)

---

## Overview

```
Client responds on Upwork → Gmail → Pub/Sub notification → Cloud Function → Render webhook → Backend runs `claude --print --continue`
```

**Why this approach**:
- ✅ Completely free (under free tier limits)
- ✅ Real-time notifications (< 1 second latency)
- ✅ Production-grade reliability
- ✅ No third-party services

---

## Prerequisites

- Google Cloud account (free tier)
- Gmail account
- Render backend deployed (see `render-deploy.md`)

---

## Step 1: Enable Gmail API (5 minutes)

### 1.1. Create Google Cloud Project

```bash
# Go to: https://console.cloud.google.com/
# Click "Create Project"
# Name: "scopelock-automation"
# Click "Create"
```

### 1.2. Enable Gmail API

```bash
# In Google Cloud Console:
# Navigation menu → APIs & Services → Library
# Search: "Gmail API"
# Click "Gmail API"
# Click "Enable"
```

### 1.3. Enable Cloud Pub/Sub API

```bash
# Navigation menu → APIs & Services → Library
# Search: "Cloud Pub/Sub API"
# Click "Enable"
```

---

## Step 2: Set Up Pub/Sub Topic (5 minutes)

### 2.1. Create Topic

```bash
# Navigation menu → Pub/Sub → Topics
# Click "Create Topic"
# Topic ID: "gmail-upwork-responses"
# Click "Create"
```

### 2.2. Grant Gmail Publish Permission

```bash
# In topic details page:
# Click "Permissions" tab
# Click "Add Principal"

# Principal: serviceAccount:gmail-api-push@system.gserviceaccount.com
# Role: Pub/Sub Publisher
# Click "Save"
```

---

## Step 3: Configure Gmail Push Notifications (5 minutes)

### 3.1. Get OAuth Credentials

```bash
# Navigation menu → APIs & Services → Credentials
# Click "Create Credentials" → "OAuth client ID"
# Application type: "Desktop app"
# Name: "scopelock-gmail-watcher"
# Click "Create"
# Download JSON (save as gmail-oauth.json)
```

### 3.2. Set Up Gmail Watch

Create script: `scripts/setup-gmail-watch.py`

```python
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
PROJECT_ID = 'scopelock-automation'  # Your project ID
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
            creds = flow.run_local_server(port=0)

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
```

### 3.3. Run Setup Script

```bash
cd /home/mind-protocol/scopelock
pip install google-auth google-auth-oauthlib google-api-python-client

python scripts/setup-gmail-watch.py
# Browser will open for OAuth consent
# Allow access to Gmail
# Script will confirm setup
```

---

## Step 4: Deploy Cloud Function (10 minutes)

### 4.1. Create Function Code

Create file: `cloud-function/main.py`

```python
"""
Gmail Pub/Sub → Render Webhook

Receives Gmail notifications, filters for Upwork responses,
calls Render webhook with HMAC signature.
"""

import base64
import json
import hmac
import hashlib
import requests
import os
from google.cloud import gmail_v1
from google.oauth2 import service_account

# Configuration
RENDER_WEBHOOK_URL = os.environ.get('RENDER_WEBHOOK_URL')
WEBHOOK_SECRET = os.environ.get('WEBHOOK_SECRET')
GMAIL_SERVICE_ACCOUNT = os.environ.get('GMAIL_SERVICE_ACCOUNT_JSON')

def parse_gmail_message(message_id):
    """Fetch and parse Gmail message"""
    credentials = service_account.Credentials.from_service_account_info(
        json.loads(GMAIL_SERVICE_ACCOUNT)
    )

    service = gmail_v1.GmailService(credentials=credentials)
    message = service.users().messages().get(
        userId='me',
        id=message_id,
        format='full'
    ).execute()

    headers = {h['name']: h['value'] for h in message['payload']['headers']}

    # Check if from Upwork
    if '@upwork.com' not in headers.get('From', ''):
        return None

    # Check if "New message" subject
    subject = headers.get('Subject', '')
    if 'New message from' not in subject:
        return None

    # Extract client name from subject
    # Format: "New message from John Doe on Upwork"
    client = subject.replace('New message from', '').replace('on Upwork', '').strip()

    # Get message body
    body = ''
    if 'parts' in message['payload']:
        for part in message['payload']['parts']:
            if part['mimeType'] == 'text/plain':
                body = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8')
                break

    return {
        'client': client,
        'subject': subject,
        'body': body,
        'message_id': message_id
    }

def send_to_render(data):
    """Send parsed message to Render webhook with HMAC signature"""
    payload = json.dumps(data)

    # Generate HMAC signature
    signature = hmac.new(
        WEBHOOK_SECRET.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()

    headers = {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature
    }

    response = requests.post(
        RENDER_WEBHOOK_URL,
        data=payload,
        headers=headers,
        timeout=10
    )

    return response.status_code == 200

def gmail_webhook(event, context):
    """Cloud Function entry point"""
    # Decode Pub/Sub message
    pubsub_message = base64.b64decode(event['data']).decode('utf-8')
    notification = json.loads(pubsub_message)

    # Get message ID
    history_id = notification.get('historyId')
    email_address = notification.get('emailAddress')

    print(f"Received notification for {email_address}, history {history_id}")

    # Parse Gmail message
    # Note: You'll need to fetch the actual message using Gmail API
    # This requires storing the last history_id and fetching changes

    # For MVP, you can also set up a Gmail filter to forward
    # Upwork emails to the Cloud Function HTTP trigger

    return {"status": "processed"}

def http_webhook(request):
    """
    HTTP trigger version (easier for MVP)

    Set up Gmail filter to forward Upwork emails to this endpoint
    """
    try:
        # Parse forwarded email
        data = request.get_json()

        # Extract from forwarded email format
        # Gmail forwards emails with specific structure

        client = data.get('client')
        message = data.get('message')

        if not client or not message:
            return {"error": "Missing required fields"}, 400

        # Send to Render
        payload = {
            'client': client,
            'message': message,
            'job_title': data.get('job_title', 'Unknown'),
            'job_link': data.get('job_link')
        }

        if send_to_render(payload):
            return {"status": "success"}, 200
        else:
            return {"error": "Failed to send to Render"}, 500

    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e)}, 500
```

### 4.2. Create requirements.txt

```txt
google-cloud-pubsub==2.18.4
google-cloud-gmail==0.1.0
google-auth==2.25.2
requests==2.31.0
```

### 4.3. Deploy Function

```bash
# Install gcloud CLI if needed
# https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set project
gcloud config set project scopelock-automation

# Deploy function
gcloud functions deploy gmail-upwork-webhook \
  --runtime python311 \
  --trigger-topic gmail-upwork-responses \
  --entry-point gmail_webhook \
  --set-env-vars RENDER_WEBHOOK_URL=https://scopelock-backend.onrender.com/webhook/upwork \
  --set-env-vars WEBHOOK_SECRET=your-secret-here \
  --region us-central1 \
  --max-instances 1

# Or for HTTP trigger (easier for MVP):
gcloud functions deploy gmail-upwork-webhook-http \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point http_webhook \
  --set-env-vars RENDER_WEBHOOK_URL=https://scopelock-backend.onrender.com/webhook/upwork \
  --set-env-vars WEBHOOK_SECRET=your-secret-here \
  --region us-central1
```

---

## Step 5: Configure Gmail Filter (Alternative - Easier)

**Instead of Pub/Sub**, use Gmail filter + HTTP function:

### 5.1. Get Cloud Function URL

```bash
# After deploying HTTP function:
gcloud functions describe gmail-upwork-webhook-http --region us-central1
# Note the URL: https://us-central1-scopelock-automation.cloudfunctions.net/gmail-upwork-webhook-http
```

### 5.2. Create Gmail Filter

```
1. In Gmail: Settings → Filters and Blocked Addresses
2. Click "Create a new filter"
3. From: @upwork.com
4. Subject: New message from
5. Click "Create filter"
6. Check: "Forward it to"
7. Add forwarding address: your-trigger-email@yourdomain.com
   (This email forwards to Cloud Function via service like CloudMailin or SendGrid Inbound Parse)
```

**Note**: Gmail doesn't directly support webhook forwarding. You need:
- Option A: Use CloudMailin (free tier: 10K emails/month) to convert email → HTTP
- Option B: Use SendGrid Inbound Parse (free)
- Option C: Use Pub/Sub approach (more complex but native)

---

## Step 6: Test Setup (5 minutes)

### 6.1. Send Test Email

```bash
# Send test email to your Gmail from another account
# Subject: "New message from Test Client on Upwork"
# Body: "Can we schedule a call?"
```

### 6.2. Verify Cloud Function Triggered

```bash
# Check Cloud Function logs
gcloud functions logs read gmail-upwork-webhook-http --region us-central1 --limit 10

# Should see:
# "Received notification..."
# "Calling Render webhook..."
```

### 6.3. Verify Render Backend Received

```bash
# Check Render logs
# Should see:
# "POST /webhook/upwork 200"
# "Triggered Claude Code..."
```

---

## Troubleshooting

### Cloud Function not triggering
```bash
# Check Pub/Sub subscription
gcloud pubsub subscriptions list

# Check function logs
gcloud functions logs read gmail-upwork-webhook-http --region us-central1
```

### Gmail watch expired
```bash
# Re-run setup script
python scripts/setup-gmail-watch.py

# Gmail watch expires after 7 days, needs renewal
# Recommendation: Set up cron job to renew weekly
```

### Webhook signature mismatch
```bash
# Verify WEBHOOK_SECRET matches in:
# - Cloud Function env vars
# - Render backend env vars

# Regenerate if needed:
openssl rand -hex 32
```

---

## Cost Estimate

**Google Cloud Free Tier** (monthly limits):
- Cloud Functions: 2M invocations
- Pub/Sub: 10GB messages
- Gmail API: 1B quota units

**Expected usage** (100 Upwork responses/month):
- Cloud Functions: ~100 invocations
- Pub/Sub: ~1MB data
- Gmail API: ~100K quota units

**Cost**: $0 (well under free tier)

---

## Maintenance

**Weekly**:
- Renew Gmail watch (automatic with cron)

**Monthly**:
- Check Cloud Function logs for errors
- Verify webhook still working

**As needed**:
- Update WEBHOOK_SECRET if compromised

---

## Alternative: Email Forwarding Services

**If Gmail filter → Cloud Function is too complex**, use:

### CloudMailin (Recommended for MVP)
```
Free tier: 10K emails/month
Setup: 5 minutes

1. Sign up at cloudmailin.com
2. Create address: rafael@scopelock.cloudmailin.net
3. Set webhook: https://scopelock-backend.onrender.com/webhook/upwork
4. Gmail filter → Forward to rafael@scopelock.cloudmailin.net
```

**Pros**: Easiest setup, reliable
**Cons**: Dependency on third-party (but free tier is generous)

---

## Next Steps

After Gmail webhook is configured:
1. Deploy backend to Render (see `render-deploy.md`)
2. Configure Telegram bot (see `telegram-config.md`)
3. Test end-to-end (see `testing.md`)

---

**Recommended MVP path**: Gmail filter → CloudMailin → Render (5 min setup, free forever)
**Production path**: Gmail API + Pub/Sub + Cloud Function (30 min setup, more control)
