import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: 'Blog | ScopeLock',
  description: 'Articles on acceptance criteria, evidence-based delivery, scope control, and building software that ships.',
  keywords: ['software development', 'acceptance criteria', 'project management', 'scope control', 'evidence sprint'],
};

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  status: 'published' | 'coming-soon';
}

const blogPosts: BlogPost[] = [
  {
    slug: 'why-acceptance-criteria-beat-time-estimates',
    title: 'Why Acceptance Criteria Beat Time Estimates',
    description: 'Time estimates are a trap. "Two weeks" becomes eight. "90% done" means nothing. Acceptance criteria with executable tests eliminate ambiguity.',
    date: '2025-11-02',
    readTime: '8 min',
    tags: ['acceptance-criteria', 'time-estimates', 'project-management'],
    status: 'published',
  },
  {
    slug: 'la-serenissima',
    title: 'Case Study: La Serenissima — 97 AI Agents, 6 Months Production',
    description: 'How we built La Serenissima, an AI system with 97+ persistent agents running 6+ months in production with 99.7% uptime.',
    date: '2025-11-02',
    readTime: '8 min',
    tags: ['multi-agent', 'case-study', 'production-ai'],
    status: 'published',
  },
  {
    slug: 'the-evidence-sprint-prove-value-in-90-seconds',
    title: 'The Evidence Sprint: Prove Value in 90 Seconds',
    description: 'Most MVPs take 3 months to validate. Evidence Sprints deliver working demo + quantified delta in 2-5 days.',
    date: '2025-11-02',
    readTime: '7 min',
    tags: ['evidence-sprint', 'mvp', 'rapid-prototyping'],
    status: 'published',
  },
  {
    slug: 'change-control-without-scope-creep',
    title: 'Change Control Without Scope Creep: CHG-130 Explained',
    description: '"Just one more feature" destroys projects. CHG-130 makes every change either Swap (€0) or Add (priced).',
    date: '2025-11-02',
    readTime: '7 min',
    tags: ['scope-creep', 'change-control', 'chg-130'],
    status: 'published',
  },
  {
    slug: 'fixed-price-vs-hourly-why-outcome-based-pricing-works',
    title: 'Fixed-Price vs Hourly: Why Outcome-Based Pricing Works',
    description: 'Hourly incentivizes slow work. Fixed-bid gets padded heavily. Outcome-based pricing aligns incentives: pay at AC green.',
    date: '2025-11-02',
    readTime: '8 min',
    tags: ['pricing', 'fixed-price', 'hourly-billing'],
    status: 'coming-soon',
  },
  {
    slug: 'what-is-acceptance-criteria-document',
    title: 'What Is an Acceptance Criteria Document (AC.md)?',
    description: 'AC.md defines "done" before you start. Functional criteria + performance thresholds + verification. No ambiguity.',
    date: '2025-11-02',
    readTime: '7 min',
    tags: ['acceptance-criteria', 'ac-md', 'requirements'],
    status: 'coming-soon',
  },
  {
    slug: 'how-we-use-ai-citizens-not-chatgpt-wrappers',
    title: 'How We Use AI Citizens (Not ChatGPT Wrappers)',
    description: '7 AI citizens with domain ownership, persistent memory, and autonomous decision-making. Not autocomplete.',
    date: '2025-11-02',
    readTime: '8 min',
    tags: ['ai-development', 'multi-agent', 'ai-citizens'],
    status: 'published',
  },
];

export default function BlogPage() {
  const publishedPosts = blogPosts.filter(post => post.status === 'published');
  const upcomingPosts = blogPosts.filter(post => post.status === 'coming-soon');

  return (
    <main className={styles.blogIndex}>
      {/* Header */}
      <section className={styles.header}>
        <h1>Blog</h1>
        <p className={styles.subtitle}>
          Articles on acceptance criteria, evidence-based delivery, and building software that ships.
        </p>
      </section>

      {/* Published Posts */}
      {publishedPosts.length > 0 && (
        <section className={styles.postsSection}>
          <h2 className={styles.sectionTitle}>Latest Posts</h2>
          <div className={styles.postsGrid}>
            {publishedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={styles.postCard}
              >
                <div className={styles.postMeta}>
                  <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postDescription}>{post.description}</p>
                <div className={styles.postTags}>
                  {post.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Posts */}
      {upcomingPosts.length > 0 && (
        <section className={styles.postsSection}>
          <h2 className={styles.sectionTitle}>Coming Soon</h2>
          <div className={styles.postsGrid}>
            {upcomingPosts.map((post) => (
              <div key={post.slug} className={`${styles.postCard} ${styles.comingSoon}`}>
                <div className={styles.comingSoonBadge}>Coming Soon</div>
                <div className={styles.postMeta}>
                  <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postDescription}>{post.description}</p>
                <div className={styles.postTags}>
                  {post.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Want articles like these in your inbox?</h2>
        <p>We publish new posts when we ship real projects. No fluff, just proof.</p>
        <div className={styles.ctaButtons}>
          <Link href="/contact" className={styles.ctaPrimary}>
            Schedule a call
          </Link>
          <a href="https://github.com/mind-protocol/scopelock" target="_blank" rel="noopener" className={styles.ctaSecondary}>
            Follow on GitHub
          </a>
        </div>
      </section>
    </main>
  );
}
