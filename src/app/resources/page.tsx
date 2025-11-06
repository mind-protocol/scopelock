'use client';

import Link from 'next/link';

// Organize resources into learning pipeline
const learningPath = [
  {
    section: 'Week 1: Critical Path',
    subtitle: 'Day 1-2 • Must Read Before First Mission',
    description: 'Build the foundational mindset and skills. Learn why you can succeed (even as a junior), how to communicate with AI citizens effectively, who does what in each phase, how you get paid, and how to work on slow connections.',
    outcome: 'After this section: You understand the AI-human partnership model, know who to ask for what, have your connection optimized, and feel confident you can complete missions.',
    totalTime: '62 min',
    badge: 'Start Here',
    badgeColor: '#FF5D5D',
    resources: [
      {
        title: 'Why ScopeLock Makes Development Super Easy',
        description: 'You don\'t have to be a senior developer. AI does 95% of the work—you supervise, deploy, and verify. See the complete $600 mission walkthrough showing exactly what AI does vs what you do.',
        href: '/resources/why-scopelock-works',
        icon: '🚀',
        impact: 'Eliminates fear: "Can I do this?"',
        timeToRead: '15 min',
        whatYouLearn: [
          'AI does 95%, you supervise 5%',
          'Real mission: 9 hours total (not 40+)',
          'Mission Deck: 50+ → 5 context switches/day',
          'Why this is easier than traditional freelancing'
        ],
      },
      {
        title: 'Compensation Structure: How You Get Paid',
        description: 'Understand exactly how ScopeLock\'s payment works, why we chose pure commission, and what you can expect to earn at different volume levels. Interactive currency converter and earnings timeline.',
        href: '/resources/compensation-structure',
        icon: '💰',
        impact: 'Aligned incentives, clear growth path',
        timeToRead: '10 min',
        whatYouLearn: [
          'Pure commission model (no hourly tracking)',
          '4-way split: Team 30%, Upwork 10%, Org 21%, Profit 39%',
          'Payment timing: AC Green → 21 days → SOL',
          'PPP advantage: $900 → $4,500+ purchasing power'
        ],
      },
      {
        title: 'The Complete Mission Flow: Who Does What When',
        description: 'Understand the complete flow from "job posted on Upwork" to "client paid." Learn WHO to ask when stuck, WHEN to escalate, and WHAT a good handoff looks like.',
        href: '/resources/complete-mission-flow',
        icon: '🔄',
        impact: 'Zero confusion, clear handoffs',
        timeToRead: '12 min',
        whatYouLearn: [
          '5 phases: Acquire → Specify → Build → Test → Deliver',
          'Who owns each phase (Bigbosexf, Reanance, Kara)',
          'When to escalate (Rafael → NLR)',
          'Handoff checklists for each phase'
        ],
      },
      {
        title: 'How to Talk to AI Citizens: Context Is Everything',
        description: 'Learn how to ask Rafael, Sofia, and Emma the right questions to get 3-5x faster results. Master the art of providing context for instant solutions instead of hours of debugging.',
        href: '/resources/how-to-talk-to-ai-citizens',
        icon: '🎯',
        impact: '3-5x faster mission completion',
        timeToRead: '10 min',
        whatYouLearn: [
          'Good vs bad questions (with examples)',
          'The Context Triangle: What, Why, Tried',
          'Specific templates for Rafael/Sofia/Emma',
          'How to avoid "garbage in, garbage out"'
        ],
      },
      {
        title: 'Bandwidth Solutions for Remote Teams',
        description: '4 practical solutions to work effectively on slow or unstable internet connections. Set these up once, work 50-90% faster forever. Essential for Nigeria, India, Philippines, rural areas.',
        href: '/resources/bandwidth',
        icon: '📶',
        impact: 'Works on ANY connection',
        timeToRead: '15 min',
        whatYouLearn: [
          'Opera Turbo Mode (50-90% bandwidth savings)',
          'Telegram Desktop (works offline, caches everything)',
          'Voice messages instead of video calls',
          'Snipping Tool (replace screen sharing, step-by-step)'
        ],
      },
    ],
  },
  {
    section: 'Week 1: Quality Foundations',
    subtitle: 'Day 3-7 • Before First Delivery',
    description: 'Learn how to think like a builder and ensure quality. Understand how to translate client pain into working solutions and why testing is the only proof that matters.',
    outcome: 'After this section: You can extract the real problem from vague requests, build the right thing, and verify it works before client sees it.',
    totalTime: '30 min',
    badge: 'Quality',
    badgeColor: '#5CE27E',
    resources: [
      {
        title: 'Pain Point → Implementation: How to Think Like a Builder',
        description: 'Learn the 7-step framework from client pain to working code. Walk through real examples (TherapyKin, KongInvest) showing how to extract the real problem, define testable objectives, and build vertical slices.',
        href: '/resources/pain-point-to-implementation',
        icon: '🔨',
        impact: 'Build the right thing, not what client asked for',
        timeToRead: '15 min',
        whatYouLearn: [
          '7-step framework: Pain → Objective → Solution',
          'How to ask "why" to find the real problem',
          'Vertical slices (feature by feature, not layer by layer)',
          'Real examples: TherapyKin, E-commerce chatbot'
        ],
      },
      {
        title: 'Testing Mindset: AC Green or It Didn\'t Happen',
        description: 'Understand why "it compiled" ≠ "it works." Learn the 4 testing levels, how Sofia verifies your work, and why green tests are the only proof that matters.',
        href: '/resources/testing-mindset',
        icon: '✅',
        impact: 'Zero bugs reach client, fast delivery',
        timeToRead: '15 min',
        whatYouLearn: [
          'Why "it works on my machine" doesn\'t count',
          '4 testing levels: Unit → Integration → E2E → Manual',
          'How Sofia uses DoD checklist to verify',
          'Real scenarios: What goes wrong without testing'
        ],
      },
    ],
  },
  {
    section: 'Week 2+: Advanced Execution',
    subtitle: 'After First Mission • Scale & Specialize',
    description: 'Master advanced skills for handling complex missions. Learn how Inna creates airtight documentation and how to plan missions from job post to locked scope with risk mitigation.',
    outcome: 'After this section: You can handle complex multi-milestone missions, understand documentation best practices, and protect scope through change control.',
    totalTime: '38 min',
    badge: 'Advanced',
    badgeColor: '#64A8FF',
    resources: [
      {
        title: 'What Good Documentation Looks Like (PATTERN→GUIDE)',
        description: 'Learn ScopeLock\'s 6-level documentation framework that eliminates ambiguity and prevents rework. See before/after examples showing how bad docs waste 4+ hours per feature.',
        href: '/resources/good-documentation',
        icon: '📚',
        impact: 'Rafael generates correct code first time',
        timeToRead: '18 min',
        whatYouLearn: [
          '6 levels: PATTERN → BEHAVIOR_SPEC → VALIDATION → MECHANISM → ALGORITHM → GUIDE',
          'Why each level matters (prevents rework)',
          'Before/after examples (bad vs good docs)',
          'How to write AC.md that Rafael can implement'
        ],
      },
      {
        title: 'Mission Planning: From Job Post to Locked Scope',
        description: 'Master the 7-step framework from parsing job posts to locking AC.md baselines. Learn Evidence Sprint vs Full Mission decisions, milestone breakdown, timeline estimation, and scope protection.',
        href: '/resources/mission-planning',
        icon: '📋',
        impact: 'Profitable missions, no scope creep',
        timeToRead: '20 min',
        whatYouLearn: [
          'Parse job post → Extract requirements → Identify risks',
          'Evidence Sprint vs Full Mission (when to use each)',
          'Milestone breakdown and timeline estimation',
          'Scope protection via Swap/Add change control'
        ],
      },
    ],
  },
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
          ScopeLock Learning Path
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
          ScopeLock: AI-Assisted Development for Junior Developers
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#9AA3AE',
          maxWidth: '700px',
          margin: '0 auto 40px',
          lineHeight: 1.6,
        }}>
          This learning path shows you how ScopeLock works, what you'll actually do day-to-day, how you get paid,
          and how to work with AI citizens (Rafael, Sofia, Emma) to complete missions faster. Read Week 1 before
          starting your first mission.
        </p>

        {/* Pipeline Overview */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginTop: '48px',
        }}>
          {learningPath.map((section, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                padding: '12px 20px',
                background: 'rgba(21, 26, 33, 0.8)',
                border: `2px solid ${section.badgeColor}`,
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: section.badgeColor,
                textAlign: 'center',
              }}>
                <div style={{ marginBottom: '4px' }}>{section.badge}</div>
                <div style={{ fontSize: '0.75rem', color: '#9AA3AE' }}>{section.totalTime}</div>
              </div>
              {idx < learningPath.length - 1 && (
                <div style={{
                  fontSize: '1.5rem',
                  color: '#1EE5B8',
                  fontWeight: 700,
                }}>
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Learning Path Sections */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px',
      }}>
        {learningPath.map((section, sectionIdx) => (
          <div key={sectionIdx} style={{
            marginBottom: sectionIdx < learningPath.length - 1 ? '80px' : '0',
          }}>
            {/* Section Header */}
            <div style={{
              marginBottom: '40px',
              padding: '32px',
              background: 'rgba(21, 26, 33, 0.6)',
              border: `1px solid ${section.badgeColor}33`,
              borderLeft: `4px solid ${section.badgeColor}`,
              borderRadius: '12px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
                flexWrap: 'wrap',
              }}>
                <div style={{
                  padding: '6px 14px',
                  background: `${section.badgeColor}20`,
                  border: `1px solid ${section.badgeColor}`,
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: section.badgeColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {section.badge}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#9AA3AE',
                }}>
                  {section.totalTime} total reading
                </div>
              </div>

              <h2 style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#E6EAF2',
                marginBottom: '8px',
              }}>
                {section.section}
              </h2>

              <div style={{
                fontSize: '1rem',
                color: '#64A8FF',
                marginBottom: '20px',
                fontWeight: 500,
              }}>
                {section.subtitle}
              </div>

              <p style={{
                fontSize: '1.125rem',
                color: '#9AA3AE',
                lineHeight: 1.6,
                marginBottom: '20px',
              }}>
                {section.description}
              </p>

              <div style={{
                padding: '16px',
                background: 'rgba(30, 229, 184, 0.05)',
                border: '1px solid rgba(30, 229, 184, 0.2)',
                borderRadius: '8px',
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#1EE5B8',
                  fontWeight: 600,
                  marginBottom: '4px',
                }}>
                  ✓ Learning Outcome
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: '#E6EAF2',
                  lineHeight: 1.6,
                }}>
                  {section.outcome}
                </div>
              </div>
            </div>

            {/* Resources Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '32px',
            }}>
              {section.resources.map((resource, resourceIdx) => (
                <Link
                  key={resourceIdx}
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
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = section.badgeColor;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${section.badgeColor}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(154, 163, 174, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    {/* Number badge */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '32px',
                      height: '32px',
                      background: `${section.badgeColor}20`,
                      border: `2px solid ${section.badgeColor}`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: section.badgeColor,
                    }}>
                      {resourceIdx + 1}
                    </div>

                    {/* Icon */}
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '16px',
                    }}>
                      {resource.icon}
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#E6EAF2',
                      marginBottom: '12px',
                      lineHeight: 1.3,
                    }}>
                      {resource.title}
                    </h3>

                    {/* Description */}
                    <p style={{
                      color: '#9AA3AE',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      marginBottom: '20px',
                    }}>
                      {resource.description}
                    </p>

                    {/* What you'll learn */}
                    <div style={{
                      marginBottom: '20px',
                      paddingTop: '20px',
                      borderTop: '1px solid rgba(154, 163, 174, 0.1)',
                    }}>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#64A8FF',
                        fontWeight: 600,
                        marginBottom: '12px',
                      }}>
                        What You'll Learn:
                      </div>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}>
                        {resource.whatYouLearn.map((item, idx) => (
                          <li key={idx} style={{
                            fontSize: '0.875rem',
                            color: '#9AA3AE',
                            paddingLeft: '20px',
                            position: 'relative',
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: '0',
                              color: section.badgeColor,
                            }}>
                              •
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Meta info */}
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      paddingTop: '20px',
                      borderTop: '1px solid rgba(154, 163, 174, 0.1)',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', color: '#9AA3AE', marginBottom: '4px' }}>
                          Impact
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: section.badgeColor }}>
                          {resource.impact}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', color: '#9AA3AE', marginBottom: '4px' }}>
                          Reading Time
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#E6EAF2' }}>
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
                      color: section.badgeColor,
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                    }}>
                      Start Learning
                      <span style={{ transition: 'transform 0.2s ease' }}>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Section connector */}
            {sectionIdx < learningPath.length - 1 && (
              <div style={{
                textAlign: 'center',
                margin: '60px 0 40px',
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 24px',
                  background: 'rgba(21, 26, 33, 0.8)',
                  border: '1px solid rgba(30, 229, 184, 0.3)',
                  borderRadius: '24px',
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                  }}>
                    ↓
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#1EE5B8',
                    fontWeight: 600,
                  }}>
                    Next: {learningPath[sectionIdx + 1].section}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '80px auto 0',
        padding: '0 20px',
      }}>
        <div style={{
          padding: '60px 40px',
          background: 'linear-gradient(135deg, rgba(30, 229, 184, 0.1) 0%, rgba(100, 168, 255, 0.1) 100%)',
          border: '1px solid rgba(30, 229, 184, 0.3)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#E6EAF2',
            marginBottom: '16px',
          }}>
            Ready to Start?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#9AA3AE',
            maxWidth: '700px',
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}>
            Begin with Week 1 Critical Path. Complete all 5 resources (62 minutes total reading),
            then move to Quality Foundations. After Week 1, you'll be ready for your first supervised mission.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            <div style={{
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              textAlign: 'left',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📚</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#E6EAF2', marginBottom: '8px' }}>
                Week 1: Day 1-2
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9AA3AE' }}>
                Read Critical Path (62 min) → Mindset, skills, flow, compensation, bandwidth setup
              </div>
            </div>

            <div style={{
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              textAlign: 'left',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🛠️</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#E6EAF2', marginBottom: '8px' }}>
                Week 1: Day 3-7
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9AA3AE' }}>
                Read Quality Foundations (30 min) → Complete first supervised mission → Get paid
              </div>
            </div>

            <div style={{
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              textAlign: 'left',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🚀</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#E6EAF2', marginBottom: '8px' }}>
                Week 2+
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9AA3AE' }}>
                Read Advanced Execution (38 min) → Complete 2 independent missions → You're productive!
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
