'use client';

import Link from 'next/link';

const resources = [
  {
    title: 'The Complete Mission Flow: Who Does What When',
    description: 'Understand the complete flow from "job posted on Upwork" to "client paid." Learn WHO to ask when stuck, WHEN to escalate, and WHAT a good handoff looks like.',
    href: '/resources/complete-mission-flow',
    icon: '🔄',
    impact: 'Zero confusion, clear handoffs',
    timeToRead: '12 min',
    category: 'Critical',
  },
  {
    title: 'How to Talk to AI Citizens: Context Is Everything',
    description: 'Learn how to ask Rafael, Sofia, and Emma the right questions to get 3-5x faster results. Master the art of providing context for instant solutions instead of hours of debugging.',
    href: '/resources/how-to-talk-to-ai-citizens',
    icon: '🎯',
    impact: '3-5x faster mission completion',
    timeToRead: '10 min',
    category: 'Essential',
  },
  {
    title: 'Compensation Structure: How You Get Paid',
    description: 'Understand exactly how ScopeLock\'s payment works, why we chose pure commission, and what you can expect to earn at different volume levels. Use the dynamic revenue projector to calculate your potential earnings.',
    href: '/resources/compensation-structure',
    icon: '💰',
    impact: 'Aligned incentives, clear growth path',
    timeToRead: '10 min',
    category: 'Critical',
  },
  {
    title: 'What Good Documentation Looks Like (PATTERN→GUIDE)',
    description: 'Learn ScopeLock\'s 6-level documentation framework that eliminates ambiguity and prevents rework. See before/after examples showing how bad docs waste 4+ hours per feature while good docs save time for everyone.',
    href: '/resources/good-documentation',
    icon: '📚',
    impact: 'Rafael generates correct code first time',
    timeToRead: '18 min',
    category: 'Essential',
  },
  {
    title: 'Testing Mindset: AC Green or It Didn\'t Happen',
    description: 'Understand why "it compiled" ≠ "it works." Learn the 4 testing levels, how Sofia verifies your work, and why green tests are the only proof that matters. See real scenarios of what can go wrong without proper testing.',
    href: '/resources/testing-mindset',
    icon: '✅',
    impact: 'Zero bugs reach client, fast delivery',
    timeToRead: '15 min',
    category: 'Critical',
  },
  {
    title: 'Pain Point → Implementation: How to Think Like a Builder',
    description: 'Learn the 7-step framework from client pain to working code. Walk through real examples (TherapyKin, KongInvest) showing how to extract the real problem, define testable objectives, and build vertical slices. Interactive step-by-step guide.',
    href: '/resources/pain-point-to-implementation',
    icon: '🔨',
    impact: 'Build the right thing, not what client asked for',
    timeToRead: '15 min',
    category: 'Essential',
  },
  {
    title: 'Mission Planning: From Job Post to Locked Scope',
    description: 'Master the 7-step framework from parsing job posts to locking AC.md baselines. Learn Evidence Sprint vs Full Mission decisions, milestone breakdown, timeline estimation, risk identification, and scope protection via change control.',
    href: '/resources/mission-planning',
    icon: '📋',
    impact: 'Profitable missions, no scope creep',
    timeToRead: '20 min',
    category: 'Critical',
  },
  // Future resources: Add new resources here following the same structure
  // {
  //   title: 'Your Resource Title',
  //   description: 'Brief description...',
  //   href: '/resources/your-resource-slug',
  //   icon: '🚀',
  //   impact: 'Key benefit',
  //   timeToRead: 'X min',
  //   category: 'Critical|Essential|Advanced',
  // },
];

export default function ResourcesPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0E1116 0%, #151A21 100%)',
      color: '#E6EAF2',
      paddingBottom: '120px',
    }}>
      {/* Hero Section */}
      <section style={{
        padding: '120px 20px 80px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 0%, rgba(30, 229, 184, 0.1) 0%, transparent 60%)',
        borderBottom: '1px solid rgba(154, 163, 174, 0.1)',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '8px 16px',
          background: 'rgba(30, 229, 184, 0.1)',
          border: '1px solid rgba(30, 229, 184, 0.2)',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#1EE5B8',
          marginBottom: '24px',
        }}>
          Internal Team Resources
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700,
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #1EE5B8 0%, #64A8FF 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Learn to Work Faster
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#9AA3AE',
          maxWidth: '600px',
          margin: '0 auto 40px',
        }}>
          Practical guides for ScopeLock team members to leverage AI citizens effectively and deliver missions with speed and quality.
        </p>
      </section>

      {/* Resources Grid */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '32px',
        }}>
          {resources.map((resource, index) => (
            <Link
              key={index}
              href={resource.href}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{
                background: 'rgba(21, 26, 33, 0.8)',
                border: '1px solid rgba(154, 163, 174, 0.1)',
                borderRadius: '12px',
                padding: '32px',
                height: '100%',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(30, 229, 184, 0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(30, 229, 184, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(154, 163, 174, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  marginBottom: '20px',
                }}>
                  <div style={{ fontSize: '3rem' }}>{resource.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      background: 'rgba(30, 229, 184, 0.1)',
                      border: '1px solid rgba(30, 229, 184, 0.2)',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#1EE5B8',
                      marginBottom: '12px',
                    }}>
                      {resource.category}
                    </div>
                    <h2 style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#E6EAF2',
                      marginBottom: '8px',
                      lineHeight: 1.3,
                    }}>
                      {resource.title}
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  color: '#9AA3AE',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                }}>
                  {resource.description}
                </p>

                {/* Meta info */}
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(154, 163, 174, 0.1)',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', color: '#9AA3AE', marginBottom: '4px' }}>
                      Impact
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1EE5B8' }}>
                      {resource.impact}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', color: '#9AA3AE', marginBottom: '4px' }}>
                      Reading Time
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#64A8FF' }}>
                      {resource.timeToRead}
                    </div>
                  </div>
                </div>

                {/* Read arrow */}
                <div style={{
                  marginTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#1EE5B8',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                }}>
                  Read Guide
                  <span style={{ transition: 'transform 0.2s ease' }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div style={{
          marginTop: '60px',
          padding: '40px',
          background: 'rgba(21, 26, 33, 0.6)',
          border: '1px solid rgba(154, 163, 174, 0.1)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#E6EAF2',
            marginBottom: '16px',
          }}>
            More Resources Coming Soon
          </h3>
          <p style={{
            color: '#9AA3AE',
            fontSize: '1rem',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            We're building a comprehensive library of guides to help you master every aspect of
            working with AI citizens and delivering missions efficiently.
          </p>

          <div style={{
            marginTop: '32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            maxWidth: '800px',
            margin: '32px auto 0',
          }}>
            {[
              'Mission Planning',
              'Quality Verification',
              'Client Communication',
              'Deployment Best Practices',
            ].map((topic, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  background: 'rgba(154, 163, 174, 0.05)',
                  border: '1px solid rgba(154, 163, 174, 0.1)',
                  borderRadius: '8px',
                  color: '#9AA3AE',
                  fontSize: '0.9375rem',
                }}
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
