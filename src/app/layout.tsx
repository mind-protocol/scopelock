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
              {/* Portfolio */}
              <div className="nav-dropdown">
                <button className="nav-dropdown-trigger">Portfolio</button>
                <div className="nav-dropdown-menu">
                  <Link href="/case-studies">Projects</Link>
                  <Link href="/blog">Blog</Link>
                </div>
              </div>

              {/* How It Works */}
              <div className="nav-dropdown">
                <button className="nav-dropdown-trigger">How It Works</button>
                <div className="nav-dropdown-menu">
                  <Link href="/process">ScopeLock Process</Link>
                  <Link href="/pricing">Pricing</Link>
                  <Link href="/faq">FAQ</Link>
                </div>
              </div>

              {/* About */}
              <div className="nav-dropdown">
                <button className="nav-dropdown-trigger">About</button>
                <div className="nav-dropdown-menu">
                  <Link href="/about">Our Story</Link>
                  <Link href="/join">Join Our Team</Link>
                  <Link href="/mission-deck">Mission Deck</Link>
                  <Link href="/resources">Resources</Link>
                </div>
              </div>

              <span className="nav-separator" aria-hidden="true">|</span>

              {/* Get Started */}
              <Link href="/#contact" className="cta-nav">Start a Project</Link>
            </div>
          </nav>
        </header>
        {children}
        <footer style={{
          marginTop: '4rem',
          padding: '3rem 0 2rem',
          borderTop: '1px solid var(--slk-border)',
          background: 'var(--slk-bg)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>ScopeLock</h3>
              <p style={{ color: 'var(--slk-text-muted)', fontSize: '0.9rem' }}>
                Professional software & creative work. Fixed pricing. Fast delivery.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Services</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}><Link href="/#services-title" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>Web Development</Link></li>
                <li style={{ marginBottom: '0.5rem' }}><Link href="/#services-title" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>AI Chatbots</Link></li>
                <li style={{ marginBottom: '0.5rem' }}><Link href="/#services-title" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>Presentations</Link></li>
                <li style={{ marginBottom: '0.5rem' }}><Link href="/#services-title" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>Creative AI Services</Link></li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Company</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}><Link href="/about" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>About</Link></li>
                <li style={{ marginBottom: '0.5rem' }}><Link href="/process" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>How ScopeLock Works</Link></li>
                <li style={{ marginBottom: '0.5rem' }}><Link href="/faq" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>FAQ</Link></li>
                <li style={{ marginBottom: '0.5rem' }}><Link href="/#contact" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>Contact</Link></li>
                <li style={{ marginBottom: '0.5rem' }}><Link href="/privacy" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>Privacy</Link></li>
                <li style={{ marginBottom: '0.5rem' }}><Link href="/terms" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>Terms</Link></li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Connect</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="https://x.com/nlr_ai" target="_blank" rel="noopener" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>X (Twitter)</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="https://www.linkedin.com/in/nicolas-lester-reynolds-836ab828/" target="_blank" rel="noopener" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>LinkedIn</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="https://github.com/nlr-ai" target="_blank" rel="noopener" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>GitHub (Personal)</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="https://github.com/mind-protocol" target="_blank" rel="noopener" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>GitHub (Org)</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="mailto:scopelock@mindprotocol.ai" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>Email</a></li>
              </ul>
            </div>
          </div>

          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '1.5rem 1.5rem 0',
            borderTop: '1px solid var(--slk-border)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <small style={{ color: 'var(--slk-text-muted)' }}>
              © {new Date().getFullYear()} Mind Protocol. Solo architect + AI-assisted teams.
            </small>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <small><a href="https://serenissima.ai" target="_blank" rel="noopener" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>serenissima.ai</a></small>
              <small><a href="https://therapykin.ai" target="_blank" rel="noopener" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>therapykin.ai</a></small>
              <small><a href="https://konginvest.ai" target="_blank" rel="noopener" style={{ color: 'var(--slk-text-muted)', textDecoration: 'none' }}>konginvest.ai</a></small>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
