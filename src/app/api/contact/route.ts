import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Send to Telegram
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramBotToken && telegramChatId) {
      const telegramMessage = `📧 **New Contact Form Submission**

**Name:** ${name}
**Email:** ${email}

**Message:**
${message}

---
_From scopelock.mindprotocol.ai/contact_`;

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
            parse_mode: 'Markdown',
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
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please email scopelock@mindprotocol.ai directly.' },
      { status: 500 }
    );
  }
}
