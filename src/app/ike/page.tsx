import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'Ikechukwu Okuzu - Head of Government & International Development | ScopeLock',
  description: 'Bridging government, academia, and technology to deliver scalable infrastructure solutions across Africa. Direct access to 36 state ministries, 9,000+ students, and AI-driven development infrastructure.',
};

export default function IkePage() {
  return (
    <main className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.profileImageContainer}>
            <img
              src="/humans/ike/profile.jpeg"
              alt="Ikechukwu Okuzu"
              className={styles.profileImage}
            />
          </div>
          <div className={styles.badge}>🌍 AFRICA REGIONAL LEAD</div>
          <h1 className={styles.heroTitle}>Ikechukwu Okuzu</h1>
          <div className={styles.heroRole}>Head of Government & International Development - Africa</div>
          <p className={styles.heroTagline}>
            Bridging government, academia, and technology to deliver scalable infrastructure solutions across Africa
          </p>

          {/* Contact Info */}
          <div className={styles.contactInfo}>
            <a href="mailto:ike@mindprotocol.ai" className={styles.contactLink}>
              📧 ike@mindprotocol.ai
            </a>
            <a href="https://www.linkedin.com/in/ikechukwu-okuzu" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
              💼 LinkedIn: @ikechukwu-okuzu
            </a>
            <span className={styles.contactItem}>📍 Maiduguri, Borno State, Nigeria</span>
          </div>

          {/* Strategic Network Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>9,000+</div>
              <div className={styles.statLabel}>Students Accessible</div>
              <div className={styles.statDetail}>Across 9 Engineering Departments</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>36</div>
              <div className={styles.statLabel}>State Ministries</div>
              <div className={styles.statDetail}>Direct Water Ministry Access</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Direct Contacts</div>
              <div className={styles.statDetail}>Government & Academia</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>4,020+</div>
              <div className={styles.statLabel}>LinkedIn Followers</div>
              <div className={styles.statDetail}>Professional Network</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Driven Development Highlight */}
      <section className={styles.section} style={{ background: 'rgba(30, 229, 184, 0.05)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.highlight}>AI-Driven Development Infrastructure</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Enabling non-developers and junior developers to perform senior-level work
          </p>

          <div className={styles.aiGrid}>
            <div className={styles.aiCard}>
              <div className={styles.aiIcon}>⚡</div>
              <h3>10x Productivity</h3>
              <p>Junior developers achieve senior-level output through AI-driven code generation, testing, and deployment</p>
            </div>
            <div className={styles.aiCard}>
              <div className={styles.aiIcon}>🎓</div>
              <h3>Rapid Training</h3>
              <p>Transform computer science students into productive developers within 2-4 weeks</p>
            </div>
            <div className={styles.aiCard}>
              <div className={styles.aiIcon}>💰</div>
              <h3>60-70% Cost Reduction</h3>
              <p>Reduce development costs while maintaining enterprise-grade quality</p>
            </div>
            <div className={styles.aiCard}>
              <div className={styles.aiIcon}>🔓</div>
              <h3>Open Source</h3>
              <p>Built on proven infrastructure - <a href="https://github.com/mind-protocol/scopelock" target="_blank" rel="noopener noreferrer">github.com/mind-protocol/scopelock</a></p>
            </div>
          </div>

          <div className={styles.calloutBox} style={{ marginTop: '2rem', background: 'rgba(30, 229, 184, 0.15)', borderColor: '#1EE5B8' }}>
            <p>
              <strong>Strategic Impact:</strong> This technology enables universities to provide immediate real-world value to students
              while delivering cost-effective solutions to government and enterprise clients.
            </p>
          </div>
        </div>
      </section>

      {/* Professional Summary */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Professional Summary</h2>
          <div className={styles.summaryBox}>
            <p>
              Award-winning engineering professional with exceptional access to Nigerian government agencies, international development
              organizations, and university networks. Former President of Engineering Student Association at University of Nigeria with
              direct connections to 9 departments encompassing 9,000+ students.
            </p>
            <p>
              Currently serving as <strong>Chair of IWA Young Water Professionals Nigeria</strong>, providing interface with water
              ministries across all 36 Nigerian states. Expertise in leveraging cutting-edge AI-driven infrastructure to enable
              non-developers and junior developers to perform complex software development work—reducing project costs by 60-70% while
              maintaining enterprise-grade quality.
            </p>
          </div>
        </div>
      </section>

      {/* Current Leadership Positions */}
      <section className={styles.section} style={{ background: 'rgba(21, 26, 33, 0.5)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Current Leadership Positions</h2>

          <div className={styles.positionsGrid}>
            {/* IWA Chair */}
            <div className={styles.positionCard}>
              <div className={styles.positionHeader}>
                <div className={styles.positionTitle}>Chair</div>
                <div className={styles.positionOrg}>IWA Young Water Professionals Nigeria</div>
                <div className={styles.positionDate}>Dec 2023 - Present</div>
              </div>
              <div className={styles.positionHighlight}>
                <strong>Network Access:</strong> International Water Association (IWA) - global authority on water professionals
              </div>
              <ul className={styles.positionBullets}>
                <li>Direct interface with water ministry commissioners across all 36 Nigerian states</li>
                <li>Regular participation in government water policy discussions and infrastructure planning</li>
                <li>Access to Federal Ministry of Water Resources and local government water officers</li>
                <li>Connection to international water development organizations and WASH-focused NGOs</li>
                <li>Gateway to UN SDG 6 initiatives and World Bank water projects</li>
              </ul>
            </div>

            {/* Africa Regional Coordinator */}
            <div className={styles.positionCard}>
              <div className={styles.positionHeader}>
                <div className={styles.positionTitle}>Africa Regional Coordinator</div>
                <div className={styles.positionOrg}>Swiss Agency for Development and Cooperation (1MYAC Ambassador)</div>
                <div className={styles.positionDate}>Jul 2023 - Present</div>
              </div>
              <div className={styles.positionHighlight}>
                <strong>International Development Leadership:</strong> Swiss government-backed position connecting to major development funding
              </div>
              <ul className={styles.positionBullets}>
                <li>Access to Swiss development grants ($250K-500K range)</li>
                <li>Connection to UN Water SDG 6 funding initiatives (millions available)</li>
                <li>Network with World Bank water infrastructure projects</li>
                <li>Partnership coordination with international development organizations</li>
              </ul>
            </div>

            {/* ScopeLock Partnership Lead */}
            <div className={styles.positionCard} style={{ borderColor: '#1EE5B8', background: 'rgba(30, 229, 184, 0.05)' }}>
              <div className={styles.positionHeader}>
                <div className={styles.positionTitle}>Partnership Lead - University & Government Relations</div>
                <div className={styles.positionOrg}>ScopeLock AI-Driven Software Development Agency</div>
                <div className={styles.positionDate}>Nov 2025 - Present</div>
              </div>
              <div className={styles.positionHighlight} style={{ background: 'rgba(30, 229, 184, 0.15)', borderColor: '#1EE5B8' }}>
                <strong>Strategic Initiative:</strong> Leveraging AI-driven development to build 5x delivery capacity through university talent pipeline
              </div>
              <ul className={styles.positionBullets}>
                <li><strong>AI-Driven Student Development Program:</strong> Recruiting and training 150-200 students from 9 engineering departments using cutting-edge AI infrastructure</li>
                <li><strong>University Partnership Strategy:</strong> Establishing official partnerships with Computer Science, Software Engineering departments—providing students with real client work</li>
                <li><strong>Government Contract Pipeline:</strong> Opening channels for water infrastructure systems, climate monitoring platforms, disaster relief coordination tools</li>
                <li><strong>Technology-Enabled Scalability:</strong> Utilizing AI-driven development to reduce project costs by 60-70% while maintaining enterprise-grade quality</li>
                <li><strong>Internship-to-Employment Pipeline:</strong> Systematic path from student recruitment through AI-driven training to full-time employment</li>
                <li><strong>Projected Impact:</strong> $2M-4M revenue growth in Year 1 through combination of student-leveraged delivery capacity and government contract channels</li>
              </ul>
            </div>

            {/* Federal Ministry Climate Officer */}
            <div className={styles.positionCard}>
              <div className={styles.positionHeader}>
                <div className={styles.positionTitle}>Climate Change Officer</div>
                <div className={styles.positionOrg}>Federal Ministry of Environment, Nigeria</div>
                <div className={styles.positionDate}>Jun 2024 - Mar 2025 (Contract)</div>
              </div>
              <ul className={styles.positionBullets}>
                <li>Strategic partnership with EcoVanguard NYSC CDS Group for environmental sustainability</li>
                <li>Led tree-planting initiative at Borno State Firewood Market</li>
                <li>Negotiated "Cut 1 Tree, Plant 10" campaign with government stakeholders</li>
                <li>Active government insider with Federal Ministry credentials and state agency connections</li>
              </ul>
            </div>

            {/* Flood Relief Specialist */}
            <div className={styles.positionCard}>
              <div className={styles.positionHeader}>
                <div className={styles.positionTitle}>Flood Relief and Assessment Specialist</div>
                <div className={styles.positionOrg}>Flood Relief Disbursement Committee</div>
                <div className={styles.positionDate}>Oct 2024 - Dec 2024</div>
              </div>
              <ul className={styles.positionBullets}>
                <li>Conducted data collection across 15 flood-affected communities</li>
                <li>Verified 5,000+ beneficiaries for relief fund disbursement</li>
                <li>Compiled detailed impact reports with demographic and socioeconomic data</li>
                <li>Informed strategic planning for future flood risk mitigation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Recognition */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Education & International Recognition</h2>

          <div className={styles.twoColumnGrid}>
            {/* Education */}
            <div className={styles.educationCard}>
              <div className={styles.cardIcon}>🎓</div>
              <h3>Bachelor of Engineering (B.Eng)</h3>
              <div className={styles.cardOrg}>Agricultural and Bio-Resources Engineering</div>
              <div className={styles.cardInstitution}>University of Nigeria, Nsukka</div>
              <div className={styles.cardDate}>2017 - 2022</div>
              <div className={styles.cardAchievements}>
                <div className={styles.achievement}>🏆 President of Engineering Student Association (ABESA) - 2023</div>
                <div className={styles.achievement}>👥 Direct access to 9,000+ students across 9 departments</div>
                <div className={styles.achievement}>💼 Recruitable talent pipeline for industry partnerships</div>
              </div>
            </div>

            {/* Awards */}
            <div className={styles.educationCard}>
              <div className={styles.cardIcon}>🏆</div>
              <h3>International Recognition</h3>
              <div className={styles.cardAchievements}>
                <div className={styles.awardItem}>
                  <strong>2021 Filmmaker Award - Canada</strong>
                  <div>Global Institute for Water Security, University of Saskatchewan</div>
                  <div className={styles.cardDate}>May 2021</div>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.95rem', color: '#9AA3AE' }}>
                    Award-winning short water film (1 of 3 African entries out of 241). Reached Viewers Choice Award.
                  </p>
                </div>
                <div className={styles.awardItem} style={{ marginTop: '1rem' }}>
                  <strong>🥉 NESTEC Essay Winner (3rd Runner)</strong>
                  <div>BlueApple</div>
                  <div className={styles.cardDate}>February 2022</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Expertise */}
      <section className={styles.section} style={{ background: 'rgba(21, 26, 33, 0.5)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Technical Expertise & Skills</h2>

          <div className={styles.skillsGrid}>
            <div className={styles.skillCard}>
              <h4>Water & Climate Solutions</h4>
              <ul>
                <li>Water infrastructure systems</li>
                <li>Climate change monitoring</li>
                <li>Environmental data collection</li>
                <li>Disaster management</li>
                <li>WASH (Water, Sanitation, Hygiene)</li>
              </ul>
            </div>

            <div className={styles.skillCard}>
              <h4>Government Relations</h4>
              <ul>
                <li>Ministry-level stakeholder engagement</li>
                <li>Government procurement processes</li>
                <li>Policy development collaboration</li>
                <li>International development funding</li>
                <li>Public-private partnerships</li>
              </ul>
            </div>

            <div className={styles.skillCard}>
              <h4>University Partnerships</h4>
              <ul>
                <li>Student recruitment & management</li>
                <li>Industry-academia collaboration</li>
                <li>Internship program development</li>
                <li>Technical training & mentorship</li>
                <li>Capstone project coordination</li>
              </ul>
            </div>

            <div className={styles.skillCard}>
              <h4>Product Development</h4>
              <ul>
                <li>Software requirements analysis</li>
                <li>Product conceptualization</li>
                <li>Fixed-price project delivery</li>
                <li>Technical writing & documentation</li>
                <li>Digital storytelling & communications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Value Proposition */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.highlight}>Strategic Value Proposition</span>
          </h2>

          <div className={styles.valueGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🎓</div>
              <h3>For Universities</h3>
              <p>
                Access to AI-driven development infrastructure that enables students to contribute to real client projects immediately—providing
                measurable employment outcomes, industry partnerships, and revenue-generating research opportunities without capital investment.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🏛️</div>
              <h3>For Government Agencies</h3>
              <p>
                Cost-effective, high-quality software solutions delivered through proven fixed-price model. Direct access to decision-makers
                across 36 states, understanding of procurement processes, and credibility through Federal Ministry position. AI-driven
                development reduces costs by 60-70% while maintaining enterprise standards.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>💼</div>
              <h3>For Technology Companies</h3>
              <p>
                Immediate access to 9,000+ student talent pool trained on cutting-edge AI-driven development infrastructure, established
                government contract channels generating $2M-4M annually, and connections to international development funding sources
                (Swiss Agency, UN Water, World Bank).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Certifications */}
      <section className={styles.section} style={{ background: 'rgba(21, 26, 33, 0.5)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Professional Certifications</h2>

          <div className={styles.certGrid}>
            <div className={styles.certCard}>
              <div className={styles.certName}>Water in Communications Training Programme</div>
              <div className={styles.certOrg}>SIWI - Stockholm International Water Institute</div>
              <div className={styles.certDate}>June 2025 | Focus: Storytelling and Journalism</div>
            </div>

            <div className={styles.certCard}>
              <div className={styles.certName}>Hygiene Promotion</div>
              <div className={styles.certOrg}>DisasterReady</div>
              <div className={styles.certDate}>April 2025</div>
            </div>

            <div className={styles.certCard}>
              <div className={styles.certName}>Advanced Engineering Studies</div>
              <div className={styles.certOrg}>University of Nigeria, Nsukka</div>
              <div className={styles.certDate}>2017-2022 | Agricultural & Bio-Resources Engineering</div>
            </div>
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Languages</h2>
          <div className={styles.languagesRow}>
            <div className={styles.languageTag}>🇬🇧 English (Full Professional Proficiency)</div>
            <div className={styles.languageTag}>🇩🇪 German (Limited Working Proficiency)</div>
            <div className={styles.languageTag}>Hausa (Native/Fluent)</div>
            <div className={styles.languageTag}>Igbo (Native/Fluent)</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Let's Build Infrastructure Solutions for Africa</h2>
          <p className={styles.ctaSubtitle}>
            Direct access to government ministries, 9,000+ students, and AI-driven development infrastructure.
            Cost-effective delivery, measurable impact, proven track record.
          </p>
          <div className={styles.ctaButtons}>
            <a href="mailto:ike@mindprotocol.ai" className={styles.primaryButton}>
              Get in Touch
            </a>
            <Link href="/contact" className={styles.secondaryButton}>
              Contact ScopeLock
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
