import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'ScopeLock Campus Developer Program | Earn ₦100k-300k/month While Studying',
  description: 'Get paid to build real government and NGO software. Learn AI-assisted development. Launch your tech career. Starting at University of Nigeria, Nsukka. 150 spots available.',
};

export default function ProgramPage() {
  return (
    <main className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>🎓 CAMPUS DEVELOPER PROGRAM</div>
          <h1 className={styles.heroTitle}>
            Get Paid to Build Real Software
          </h1>
          <p className={styles.heroSubtitle}>
            Learn AI-Assisted Development. Launch Your Tech Career.
          </p>

          {/* Key Stats */}
          <div className={styles.keyStats}>
            <div className={styles.keyStat}>
              <div className={styles.keyStatValue}>₦100k-300k</div>
              <div className={styles.keyStatLabel}>Monthly Earnings</div>
            </div>
            <div className={styles.keyStat}>
              <div className={styles.keyStatValue}>10-20 hrs</div>
              <div className={styles.keyStatLabel}>Per Week</div>
            </div>
            <div className={styles.keyStat}>
              <div className={styles.keyStatValue}>150 Spots</div>
              <div className={styles.keyStatLabel}>Available</div>
            </div>
          </div>

          <div className={styles.heroHighlight}>
            <p>
              <strong>📍 Starting at University of Nigeria, Nsukka</strong><br />
              🚀 Build portfolio with real government and NGO projects<br />
              ⏰ Flexible hours - work around your class schedule
            </p>
          </div>

          <div className={styles.ctaButtons}>
            <a href="#apply" className={styles.primaryButton}>
              Apply Now →
            </a>
            <a href="#faq" className={styles.secondaryButton}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* What Is This */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>What Is This?</h2>

          <div className={styles.summaryBox}>
            <p>
              ScopeLock is an international software development agency building government and NGO software systems across
              Nigeria and Africa. We deliver water management systems, disaster relief platforms, climate monitoring dashboards,
              and more.
            </p>
            <p>
              <strong>We need smart, hungry students to help us deliver these projects.</strong>
            </p>
            <p>
              Not to write code from scratch (AI does that). But to <strong>orchestrate AI</strong> to build software faster
              and better than traditional agencies.
            </p>
          </div>

          <div className={styles.calloutBox} style={{ background: 'rgba(30, 229, 184, 0.15)', borderColor: '#1EE5B8' }}>
            <h3>This is NOT an internship. This is PAID WORK starting immediately.</h3>
          </div>
        </div>
      </section>

      {/* Earnings Breakdown */}
      <section className={styles.section} style={{ background: 'rgba(30, 229, 184, 0.05)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.highlight}>What You'll Earn</span>
          </h2>

          <div className={styles.earningsGrid}>
            {/* Junior Developer */}
            <div className={styles.earningCard}>
              <div className={styles.earningBadge}>Junior Developer</div>
              <div className={styles.earningAmount}>₦100k-150k</div>
              <div className={styles.earningPeriod}>per month</div>
              <div className={styles.earningHours}>10-15 hrs/week</div>
              <ul className={styles.earningBullets}>
                <li>Simple tasks: QA testing, bug fixes, documentation</li>
                <li>~$65-100 USD equivalent</li>
                <li>Perfect for: 2nd-3rd year students building skills</li>
              </ul>
            </div>

            {/* Developer Fellow */}
            <div className={styles.earningCard} style={{ borderColor: '#1EE5B8', background: 'rgba(30, 229, 184, 0.08)' }}>
              <div className={styles.earningBadge} style={{ background: '#1EE5B8', color: '#0E1116' }}>
                Developer Fellow
              </div>
              <div className={styles.earningAmount} style={{ color: '#1EE5B8' }}>₦200k-300k</div>
              <div className={styles.earningPeriod}>per month</div>
              <div className={styles.earningHours}>15-20 hrs/week</div>
              <ul className={styles.earningBullets}>
                <li>Complete features: dashboards, forms, API endpoints</li>
                <li>~$130-195 USD equivalent</li>
                <li>Perfect for: 3rd-4th year students with some experience</li>
              </ul>
            </div>

            {/* Campus Ambassador */}
            <div className={styles.earningCard}>
              <div className={styles.earningBadge}>Campus Ambassador</div>
              <div className={styles.earningAmount}>50 $MIND</div>
              <div className={styles.earningPeriod}>per referral</div>
              <div className={styles.earningHours}>5-10 hrs/week</div>
              <ul className={styles.earningBullets}>
                <li>Recruit other students, organize info sessions</li>
                <li>₦30k-50k value per referral</li>
                <li>Perfect for: Well-connected students, any department</li>
              </ul>
            </div>
          </div>

          <div className={styles.paymentInfo}>
            <h4>How Payment Works</h4>
            <p>
              You earn based on contribution (interaction credits). The more you contribute to missions, the more you earn.
            </p>
            <ul>
              <li><strong>Payments:</strong> End of each month</li>
              <li><strong>Method:</strong> Bank transfer or mobile money (USDT)</li>
              <li><strong>Transparent:</strong> You see your earnings update in real-time</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>What You'll Learn</h2>
          <p className={styles.sectionSubtitle}>
            This isn't just a job. It's a <strong>skill acceleration program.</strong>
          </p>

          <div className={styles.skillsGrid}>
            {/* Technical Skills */}
            <div className={styles.skillCategory}>
              <div className={styles.skillIcon}>⚡</div>
              <h3>Technical Skills</h3>
              <ul>
                <li>AI-Assisted Development (orchestrate Claude, ChatGPT 10x faster)</li>
                <li>Modern Tech Stack (Next.js, FastAPI, PostgreSQL, Vercel, Render)</li>
                <li>Professional Workflows (GitHub, code reviews, testing, deployment)</li>
                <li>Software Architecture (design systems that actually work)</li>
                <li>Quality Assurance (verify software meets requirements)</li>
              </ul>
            </div>

            {/* Professional Skills */}
            <div className={styles.skillCategory}>
              <div className={styles.skillIcon}>💼</div>
              <h3>Professional Skills</h3>
              <ul>
                <li>Project Management (breaking down work, estimating time, meeting deadlines)</li>
                <li>Client Communication (working with government officials and NGOs)</li>
                <li>Remote Work (async communication, Slack, documentation)</li>
                <li>Team Collaboration (code reviews, handoffs, context management)</li>
              </ul>
            </div>

            {/* Career Skills */}
            <div className={styles.skillCategory}>
              <div className={styles.skillIcon}>🚀</div>
              <h3>Career Skills</h3>
              <ul>
                <li>Real Portfolio (showcase actual client projects, not school assignments)</li>
                <li>Mentorship (learn from senior developers with 5-10 years experience)</li>
                <li>Industry Connections (network with government agencies, international NGOs)</li>
                <li>Job Pipeline (top performers get full-time offers after graduation)</li>
              </ul>
            </div>
          </div>

          <div className={styles.calloutBox} style={{ marginTop: '3rem', background: 'rgba(100, 168, 255, 0.15)', borderColor: '#64A8FF' }}>
            <p>
              <strong>After 6 months in this program, you'll be worth 2-3x more in the job market.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Real Projects */}
      <section className={styles.section} style={{ background: 'rgba(21, 26, 33, 0.5)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>What You'll Build</h2>
          <p className={styles.sectionSubtitle}>
            Real Projects. Real Impact. Not practice apps - actual systems used by thousands.
          </p>

          <div className={styles.projectsGrid}>
            <div className={styles.projectCard}>
              <div className={styles.projectIcon}>🌊</div>
              <h3>Water Billing System - Kaduna State</h3>
              <ul className={styles.projectFeatures}>
                <li>Citizens check bills and pay online</li>
                <li>Automated SMS reminders for overdue payments</li>
                <li>Dashboard for government officials</li>
              </ul>
              <div className={styles.projectImpact}>
                <strong>Impact:</strong> 50,000+ citizens served
              </div>
            </div>

            <div className={styles.projectCard}>
              <div className={styles.projectIcon}>🆘</div>
              <h3>Disaster Relief Platform - Borno State</h3>
              <ul className={styles.projectFeatures}>
                <li>Citizens report flood damage</li>
                <li>Officials coordinate relief efforts</li>
                <li>Real-time maps of affected areas</li>
              </ul>
              <div className={styles.projectImpact}>
                <strong>Impact:</strong> Supported 10,000+ flood victims
              </div>
            </div>

            <div className={styles.projectCard}>
              <div className={styles.projectIcon}>🌍</div>
              <h3>Climate Monitoring Dashboard - Federal Ministry</h3>
              <ul className={styles.projectFeatures}>
                <li>IoT sensor data from across Nigeria</li>
                <li>Temperature, rainfall, air quality tracking</li>
                <li>Predictive analytics for disaster preparedness</li>
              </ul>
              <div className={styles.projectImpact}>
                <strong>Impact:</strong> National policy decisions
              </div>
            </div>
          </div>

          <div className={styles.calloutBox}>
            <p>
              <strong>These aren't hypothetical. These are LIVE systems. Your work matters.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Who Can Apply */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Who Can Apply?</h2>

          <div className={styles.eligibilityGrid}>
            <div className={styles.eligibilityBox}>
              <h3>🎓 Coding Roles (100-120 students)</h3>
              <ul>
                <li>Computer Science</li>
                <li>Software Engineering</li>
                <li>Electrical Engineering (with programming interest)</li>
              </ul>
            </div>

            <div className={styles.eligibilityBox}>
              <h3>💼 Non-Coding Roles (30-50 students)</h3>
              <ul>
                <li>Campus Ambassadors (any department)</li>
                <li>QA Testers (any engineering department)</li>
                <li>Documentation Writers (any department)</li>
                <li>Data Entry/Validation (any department)</li>
              </ul>
            </div>
          </div>

          <div className={styles.requirementsBox}>
            <div className={styles.requirementsSection}>
              <h4>✅ Requirements</h4>
              <ul>
                <li><strong>Year:</strong> 2nd, 3rd, 4th, or Final year (sorry, 1st years - come back next year!)</li>
                <li><strong>Availability:</strong> 10-20 hours/week for at least 3 months</li>
                <li><strong>Setup:</strong> Reliable laptop + internet connection</li>
                <li><strong>Mindset:</strong> Hungry to learn, willing to work hard, detail-oriented</li>
              </ul>
            </div>

            <div className={styles.requirementsSection}>
              <h4>❌ You DON'T need</h4>
              <ul>
                <li>Expert coding skills (we'll train you)</li>
                <li>Perfect GPA (we care about hustle, not grades)</li>
                <li>Prior work experience (this can be your first job)</li>
                <li>Expensive equipment (basic laptop is fine)</li>
              </ul>
            </div>
          </div>

          <div className={styles.calloutBox} style={{ background: 'rgba(30, 229, 184, 0.15)', borderColor: '#1EE5B8' }}>
            <p>
              <strong>If you're smart, hardworking, and excited to learn - you're qualified.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.section} style={{ background: 'rgba(30, 229, 184, 0.05)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>How It Works</h2>

          <div className={styles.phaseGrid}>
            {/* Phase 1 */}
            <div className={styles.phaseCard}>
              <div className={styles.phaseNumber}>Phase 1</div>
              <h3>Application (This Week)</h3>
              <div className={styles.phaseSteps}>
                <div className={styles.phaseStep}>
                  <strong>1. Complete application using Claude (AI)</strong>
                  <p>75-100 minutes. Tests: AI proficiency, architecture, planning, communication, quality</p>
                </div>
                <div className={styles.phaseStep}>
                  <strong>2. We review applications</strong>
                  <p>Top candidates selected within 5 days</p>
                </div>
                <div className={styles.phaseStep}>
                  <strong>3. 15-minute interview</strong>
                  <p>Quick chat with Ikechukwu Okuzu to confirm fit</p>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className={styles.phaseCard}>
              <div className={styles.phaseNumber}>Phase 2</div>
              <h3>Training (Week 1-2)</h3>
              <div className={styles.phaseSteps}>
                <div className={styles.phaseStep}>
                  <strong>Week 1: Onboarding</strong>
                  <p>Introduction to ScopeLock workflow, meet team, set up environment, learn tech stack</p>
                </div>
                <div className={styles.phaseStep}>
                  <strong>Week 2: Practice Tasks</strong>
                  <p>Work on practice missions, get feedback, learn processes, pass final readiness check</p>
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className={styles.phaseCard} style={{ borderColor: '#1EE5B8', background: 'rgba(30, 229, 184, 0.05)' }}>
              <div className={styles.phaseNumber} style={{ background: '#1EE5B8', color: '#0E1116' }}>Phase 3</div>
              <h3>Real Work (Week 3+)</h3>
              <div className={styles.phaseSteps}>
                <div className={styles.phaseStep}>
                  <strong>Start contributing to actual client projects</strong>
                  <p>Assigned to missions based on your level. Work 10-20 hours/week. Get paid monthly. Continuous growth.</p>
                </div>
                <div className={styles.phaseStep}>
                  <strong>Top performers after 3-6 months:</strong>
                  <ul>
                    <li>Promoted to Developer Fellow (higher pay)</li>
                    <li>Become Team Leads (mentor new students)</li>
                    <li>Get full-time job offers after graduation (₦300k-500k/month)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes This Different */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>What Makes This Different?</h2>

          <div className={styles.comparisonGrid}>
            {/* vs Internships */}
            <div className={styles.comparisonCard}>
              <h3>vs. Traditional Internships</h3>
              <div className={styles.comparisonRow}>
                <div className={styles.comparisonBad}>
                  <span className={styles.comparisonIcon}>❌</span>
                  <div>
                    <strong>Typical Internship</strong>
                    <p>Unpaid or ₦20k-30k/month, make coffee, photocopy documents. 9am-5pm every day, must be in office. 3 months, then goodbye.</p>
                  </div>
                </div>
                <div className={styles.comparisonGood}>
                  <span className={styles.comparisonIcon}>✅</span>
                  <div>
                    <strong>ScopeLock</strong>
                    <p>₦100k-300k/month, build real software, learn cutting-edge skills. 10-20 hrs/week, fully remote. 3-12+ months, job pipeline after graduation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* vs Bootcamps */}
            <div className={styles.comparisonCard}>
              <h3>vs. Coding Bootcamps</h3>
              <div className={styles.comparisonRow}>
                <div className={styles.comparisonBad}>
                  <span className={styles.comparisonIcon}>❌</span>
                  <div>
                    <strong>Bootcamps</strong>
                    <p>Pay ₦200k-500k to learn. Build practice projects. 3 months intensive, can't study.</p>
                  </div>
                </div>
                <div className={styles.comparisonGood}>
                  <span className={styles.comparisonIcon}>✅</span>
                  <div>
                    <strong>ScopeLock</strong>
                    <p>GET PAID ₦100k-300k/month while learning. Build real client projects. Part-time, flexible around schedule.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* vs Freelancing */}
            <div className={styles.comparisonCard}>
              <h3>vs. Freelancing</h3>
              <div className={styles.comparisonRow}>
                <div className={styles.comparisonBad}>
                  <span className={styles.comparisonIcon}>❌</span>
                  <div>
                    <strong>Freelancing</strong>
                    <p>Spend weeks finding clients, often don't get paid. Work alone, no support. Need to already be expert.</p>
                  </div>
                </div>
                <div className={styles.comparisonGood}>
                  <span className={styles.comparisonIcon}>✅</span>
                  <div>
                    <strong>ScopeLock</strong>
                    <p>Clients provided, guaranteed payment. Team support, mentorship, code reviews. Training provided, start as beginner.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.calloutBox} style={{ marginTop: '3rem', background: 'rgba(30, 229, 184, 0.15)', borderColor: '#1EE5B8' }}>
            <h3>This is the best of all worlds:</h3>
            <p><strong>Learning + Earning + Portfolio + Job Pipeline</strong></p>
          </div>
        </div>
      </section>

      {/* Important Warning */}
      <section className={styles.section} style={{ background: 'rgba(255, 93, 93, 0.1)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle} style={{ color: '#FF5D5D' }}>⚠️ Important: This Is Real Work</h2>

          <div className={styles.warningGrid}>
            <div className={styles.warningBox} style={{ borderColor: '#FF5D5D' }}>
              <h3>❌ We're NOT looking for:</h3>
              <ul>
                <li>Students who just want easy money</li>
                <li>People who ghost when things get hard</li>
                <li>Students who can't commit 3+ months</li>
                <li>People who do sloppy work and don't care</li>
                <li>Students who need constant hand-holding</li>
              </ul>
            </div>

            <div className={styles.warningBox} style={{ borderColor: '#1EE5B8' }}>
              <h3>✅ We ARE looking for:</h3>
              <ul>
                <li><strong>Hungry learners</strong> - You want to build real skills</li>
                <li><strong>Hard workers</strong> - You'll put in the hours and do quality work</li>
                <li><strong>Reliable people</strong> - You show up, meet deadlines, communicate</li>
                <li><strong>Detail-oriented</strong> - You catch errors before they become problems</li>
                <li><strong>Team players</strong> - You help others and accept feedback</li>
              </ul>
            </div>
          </div>

          <div className={styles.calloutBox} style={{ borderColor: '#FF5D5D', background: 'rgba(255, 93, 93, 0.15)', marginTop: '2rem' }}>
            <h3 style={{ color: '#FF5D5D' }}>This program is HARD WORK. But it's worth it.</h3>
            <p>If you want easy, go somewhere else. If you want to actually build skills and launch your career, you're in the right place.</p>
          </div>
        </div>
      </section>

      {/* Limited Spots */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.highlight}>🚨 Limited Spots</span>
          </h2>

          <div className={styles.cohortGrid}>
            <div className={styles.cohortCard}>
              <div className={styles.cohortPhase}>Phase 1</div>
              <div className={styles.cohortCount}>20 students</div>
              <div className={styles.cohortDate}>Starting December 2025</div>
            </div>
            <div className={styles.cohortCard}>
              <div className={styles.cohortPhase}>Phase 2</div>
              <div className={styles.cohortCount}>50 more</div>
              <div className={styles.cohortDate}>Starting January 2026</div>
              <div className={styles.cohortTotal}>(70 total)</div>
            </div>
            <div className={styles.cohortCard}>
              <div className={styles.cohortPhase}>Phase 3</div>
              <div className={styles.cohortCount}>80 more</div>
              <div className={styles.cohortDate}>Starting February 2026</div>
              <div className={styles.cohortTotal}>(150 total)</div>
            </div>
          </div>

          <div className={styles.summaryBox} style={{ marginTop: '3rem' }}>
            <h3>Why limited?</h3>
            <p>
              Quality over quantity. We provide personal mentorship from senior developers, code reviews on every submission,
              and career guidance.
            </p>
            <p>
              <strong>We can't do this for 1,000 students. We can do it for 150.</strong>
            </p>
          </div>

          <div className={styles.calloutBox} style={{ marginTop: '2rem', background: 'rgba(255, 93, 93, 0.15)', borderColor: '#FF5D5D' }}>
            <p>
              <strong>150 spots. 9,000 engineering students at UNN.</strong><br />
              That's 1.7% acceptance rate if everyone applies.<br /><br />
              <strong style={{ fontSize: '1.2rem' }}>Competition is real. Top candidates get offers. Others get waitlisted.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* About Ikechukwu */}
      <section className={styles.section} style={{ background: 'rgba(21, 26, 33, 0.5)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>About Your Program Lead</h2>

          <div className={styles.leaderProfile}>
            <div className={styles.leaderImage}>
              <img src="/humans/ike/profile.jpeg" alt="Ikechukwu Okuzu" />
            </div>
            <div className={styles.leaderInfo}>
              <h3>Ikechukwu Okuzu</h3>
              <div className={styles.leaderRoles}>
                <div className={styles.leaderRole}>
                  <strong>Professional:</strong>
                  <ul>
                    <li>Chair, International Water Association Young Water Professionals - Nigeria</li>
                    <li>Climate Change Officer, Federal Ministry of Environment</li>
                    <li>Africa Regional Coordinator, Swiss Agency for Development and Cooperation</li>
                  </ul>
                </div>
                <div className={styles.leaderRole}>
                  <strong>Academic:</strong>
                  <ul>
                    <li>Alumni, University of Nigeria (Agricultural Engineering)</li>
                    <li>Former President, Engineering Student Association (ABESA), 2023</li>
                  </ul>
                </div>
              </div>
              <div className={styles.leaderQuote}>
                <p>
                  "I graduated from UNN knowing I needed more than just my degree to compete in the job market. I learned
                  software development on the side, connected with international organizations, and built real skills.
                </p>
                <p>
                  Now I want to give back. ScopeLock has more work than we can handle. Nigerian students are hungry, smart,
                  and hardworking - but lack opportunities to prove themselves.
                </p>
                <p>
                  <strong>This program bridges that gap. You get paid work, real skills, and a pathway to careers.
                  We get talented people who help us serve more clients. Win-win.</strong>
                </p>
              </div>
              <div className={styles.leaderLinks}>
                <Link href="/ike" className={styles.leaderLink}>
                  Full Profile →
                </Link>
                <a
                  href="https://www.linkedin.com/in/ikechukwu-okuzu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.leaderLink}
                >
                  LinkedIn →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.section} id="faq">
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>

          <div className={styles.faqGrid}>
            <div className={styles.faqCard}>
              <h3>"Do I need to be a coding genius?"</h3>
              <p>
                No. You need to be smart, hardworking, and willing to learn. We'll teach you everything else.
              </p>
            </div>

            <div className={styles.faqCard}>
              <h3>"I'm in Mechanical Engineering, not Computer Science. Can I still apply?"</h3>
              <p>
                Yes! We have non-coding roles: Campus Ambassador, QA Tester, Documentation Writer. If you're in any engineering
                department and interested in tech, apply.
              </p>
            </div>

            <div className={styles.faqCard}>
              <h3>"How much time does this actually take?"</h3>
              <p>
                10-20 hours/week. You choose when to work (mornings, evenings, weekends). Fully flexible around your class schedule.
              </p>
            </div>

            <div className={styles.faqCard}>
              <h3>"What if I have exams?"</h3>
              <p>
                Tell us in advance. Reduce hours during exam weeks. We're students too - we get it.
              </p>
            </div>

            <div className={styles.faqCard}>
              <h3>"How do I know ScopeLock is real?"</h3>
              <p>
                Check our proof log (scopelock.mindprotocol.ai), Ikechukwu's LinkedIn profile is verifiable, references
                available from past government clients. You can verify everything before accepting.
              </p>
            </div>

            <div className={styles.faqCard}>
              <h3>"What happens after I graduate?"</h3>
              <p>
                Top performers (10-20%) get full-time job offers (₦300k-500k/month starting). Even if not, you'll have
                3-12 months real experience, portfolio of client projects, and skills worth 2-3x more in job market.
              </p>
            </div>

            <div className={styles.faqCard}>
              <h3>"This sounds too good to be true. What's the catch?"</h3>
              <p>
                The catch: <strong>It's hard work.</strong> This is real software development. You'll work 10-20 hours/week
                consistently, meet real deadlines, get code reviewed, fix bugs, communicate professionally, and take
                responsibility for quality.
              </p>
            </div>

            <div className={styles.faqCard}>
              <h3>"What if I don't have a fast internet connection?"</h3>
              <p>
                You need reliable internet to work remotely, but it doesn't have to be super fast. If you can watch YouTube
                videos and use WhatsApp, you can do this work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.ctaSection} id="apply">
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Apply?</h2>
          <p className={styles.ctaSubtitle}>
            150 spots. 9,000 engineering students at UNN.<br />
            <strong>First 20 spots go to the strongest applicants. Don't delay.</strong>
          </p>

          <div className={styles.timelineBox}>
            <div className={styles.timelineRow}>
              <strong>Today:</strong> Read application instructions
            </div>
            <div className={styles.timelineRow}>
              <strong>This Week:</strong> Complete application (75-100 minutes)
            </div>
            <div className={styles.timelineRow}>
              <strong>Next Week:</strong> Interviews for top candidates
            </div>
            <div className={styles.timelineRow}>
              <strong>December 1st:</strong> First cohort starts training
            </div>
            <div className={styles.timelineRow}>
              <strong>December 15th:</strong> First cohort starts real paid work
            </div>
          </div>

          <div className={styles.ctaButtons}>
            <a href="mailto:ike@mindprotocol.ai" className={styles.primaryButton}>
              Apply Now →
            </a>
            <Link href="/ike" className={styles.secondaryButton}>
              Meet Ikechukwu
            </Link>
          </div>

          <div className={styles.ctaWarning}>
            <p>
              <strong>If you're serious about launching your tech career, apply now.</strong><br />
              If you're not sure, someone else will take your spot.
            </p>
            <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
              <strong>Your move. 🚀</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Footer Contact */}
      <section className={styles.footerSection}>
        <div className={styles.footerContent}>
          <h3>Questions about the program?</h3>
          <div className={styles.footerLinks}>
            <a href="mailto:ike@mindprotocol.ai">📧 ike@mindprotocol.ai</a>
            <a href="https://www.linkedin.com/in/ikechukwu-okuzu" target="_blank" rel="noopener noreferrer">
              💼 LinkedIn: @ikechukwu-okuzu
            </a>
            <Link href="/">🌐 scopelock.mindprotocol.ai</Link>
          </div>
          <div className={styles.footerBranding}>
            <strong>SCOPELOCK CAMPUS DEVELOPER PROGRAM</strong>
            <p>Building the future of African software development, one student at a time.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
