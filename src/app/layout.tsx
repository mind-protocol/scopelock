import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'ScopeLock Delivery — Executable acceptance criteria, price and outcome locked',
  description: 'ScopeLock co-writes AC.md + tests, delivers through tagged milestones (demo ≤90s, delta) and invoices at AC green.',
  metadataBase: new URL('https://scopelock.mindprotocol.ai'),
  openGraph: {
    title: 'ScopeLock Delivery',
    description: 'Executable acceptance criteria. Price and outcome locked.',
    type: 'website',
    url: 'https://scopelock.mindprotocol.ai/',
    images: ['/og-scopelock.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/logo/scopelock-mark.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav className="site-nav">
            <Link href="/" className="logo-link">
              <img
                src="/brand/logo/logo.svg"
                alt="ScopeLock - Fixed-price software delivery with locked scope"
                width="224"
                height="48"
                style={{ height: '48px', width: 'auto' }}
              />
            </Link>
            <div className="nav-links">
              <Link href="/about">About</Link>
              <Link href="/process">Process</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/mission-deck">Mission Deck</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/resources">Resources</Link>
              <Link href="/join">Join Team</Link>
              <Link href="/#contact">Contact</Link>
            </div>
          </nav>
        </header>
        {children}
        <footer>
          <small>
            © ScopeLock — membrane-first, event-native. Tagged milestones, locked criteria.
            {' · '}
            <a href="https://github.com/mind-protocol/scopelock" target="_blank" rel="noopener">GitHub</a>
            {' · '}
            <a href="https://www.linkedin.com/in/nicolas-lester-reynolds-836ab828/" target="_blank" rel="noopener">LinkedIn</a>
            {' · '}
            <a href="https://x.com/nlr_ai" target="_blank" rel="noopener">X</a>
            {' · '}
            <a href="https://t.me/nlr_ai" target="_blank" rel="noopener">Telegram</a>
            {' · '}
            <Link href="/terms">Terms</Link>
            {' · '}
            <Link href="/privacy">Privacy</Link>
          </small>
        </footer>
      </body>
    </html>
  );
}
