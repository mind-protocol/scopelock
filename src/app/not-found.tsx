import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found — ScopeLock',
  description: 'This page does not exist.',
};

export default function NotFound() {
  return (
    <main>
      <header className="hero">
        <h1>404 — Scope Undefined</h1>
        <p className="lead">This page does not exist in our acceptance criteria.</p>
      </header>

      <section className="card">
        <h2>What Happened?</h2>
        <p>
          The URL you requested doesn&apos;t match any page in our site. This could mean:
        </p>
        <ul>
          <li>The link is outdated or incorrect</li>
          <li>The page was moved or removed</li>
          <li>There&apos;s a typo in the URL</li>
        </ul>
      </section>

      <section className="card">
        <h2>Where to Go?</h2>
        <div className="hero-ctas">
          <Link className="cta" href="/">Go to homepage</Link>
          <Link href="/case-studies">See proof log</Link>
          <Link href="/contact">Contact us</Link>
        </div>
        <p style={{ marginTop: 'var(--slk-gap-5)' }}>
          Popular pages:
        </p>
        <ul>
          <li><Link href="/process">How we work</Link></li>
          <li><Link href="/pricing">Pricing</Link></li>
          <li><Link href="/case-studies">Case studies</Link></li>
          <li><Link href="/faq">FAQ</Link></li>
          <li><Link href="/blog">Blog</Link></li>
        </ul>
      </section>

      <section className="card">
        <h2>Reporting a Problem?</h2>
        <p>
          If you believe this page should exist or you found a broken link on our site,
          please <Link href="/contact">let us know</Link>. We&apos;ll fix it.
        </p>
      </section>
    </main>
  );
}
