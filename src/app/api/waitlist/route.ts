import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Store waitlist entries in a JSON file
const WAITLIST_FILE = path.join(process.cwd(), 'data', 'waitlist.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(WAITLIST_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(WAITLIST_FILE)) {
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify({ entries: [] }, null, 2));
  }
}

// Read waitlist entries
function readWaitlist() {
  ensureDataDirectory();
  const data = fs.readFileSync(WAITLIST_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write waitlist entries
function writeWaitlist(data: any) {
  ensureDataDirectory();
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify(data, null, 2));
}

export async function POST(request: Request) {
  try {
    const { wallet, email, telegram, commitment, source } = await request.json();

    // Validate required fields
    if (!wallet || !email) {
      return NextResponse.json(
        { error: 'Wallet address and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Solana wallet validation (basic)
    const walletRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    if (!walletRegex.test(wallet)) {
      return NextResponse.json(
        { error: 'Invalid Solana wallet address' },
        { status: 400 }
      );
    }

    // Check for duplicates
    const waitlistData = readWaitlist();
    const duplicate = waitlistData.entries.find(
      (entry: any) => entry.wallet === wallet || entry.email === email
    );

    if (duplicate) {
      return NextResponse.json(
        { error: 'This wallet or email is already on the waitlist' },
        { status: 409 }
      );
    }

    // Create entry
    const entry = {
      wallet,
      email,
      telegram: telegram || null,
      commitment: commitment || 'Just exploring',
      source: source || 'Unknown',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    };

    // Save to file
    waitlistData.entries.push(entry);
    writeWaitlist(waitlistData);

    // Send to Telegram
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramBotToken && telegramChatId) {
      const telegramMessage = `🎯 <b>$MIND Waitlist Signup #${waitlistData.entries.length}</b>

<b>Wallet:</b> <code>${wallet}</code>
<b>Email:</b> ${email}
${telegram ? `<b>Telegram:</b> ${telegram}` : ''}
<b>Commitment:</b> ${commitment || 'Just exploring'}
<b>Source:</b> ${source || 'Not specified'}

<b>Total Waitlist:</b> ${waitlistData.entries.length} people

---
<i>From scopelock.mindprotocol.ai/mind-token</i>`;

      const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

      try {
        const telegramResponse = await fetch(telegramUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: telegramMessage,
            parse_mode: 'HTML',
          }),
        });

        if (!telegramResponse.ok) {
          console.error('Telegram API error:', await telegramResponse.text());
        }
      } catch (telegramError) {
        console.error('Failed to send to Telegram:', telegramError);
        // Continue anyway - don't fail the whole request
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "You're on the list! Check your email for confirmation.",
        totalWaitlist: waitlistData.entries.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Waitlist submission error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve waitlist stats (optional, for admin)
export async function GET(request: Request) {
  try {
    // Simple auth check - only allow if admin key provided
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_API_KEY;

    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const waitlistData = readWaitlist();

    // Calculate stats
    const stats = {
      total: waitlistData.entries.length,
      byCommitment: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      recentSignups: waitlistData.entries.slice(-10).reverse(),
    };

    waitlistData.entries.forEach((entry: any) => {
      // Count by commitment
      const commitment = entry.commitment || 'Just exploring';
      stats.byCommitment[commitment] = (stats.byCommitment[commitment] || 0) + 1;

      // Count by source
      const source = entry.source || 'Unknown';
      stats.bySource[source] = (stats.bySource[source] || 0) + 1;
    });

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Waitlist GET error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve waitlist data' },
      { status: 500 }
    );
  }
}
