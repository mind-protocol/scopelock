'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.css';

export default function JoinPage() {
  // Interactive calculator state
  const [selectedCountry, setSelectedCountry] = useState('nigeria');
  const [hoursPerWeek, setHoursPerWeek] = useState(25);

  const countries = {
    nigeria: { name: 'Nigeria', flag: '🇳🇬', pppMultiplier: 7.5, earningsPerHour: 9 },
    colombia: { name: 'Colombia', flag: '🇨🇴', pppMultiplier: 5, earningsPerHour: 9 },
    pakistan: { name: 'Pakistan', flag: '🇵🇰', pppMultiplier: 7, earningsPerHour: 9 },
    kenya: { name: 'Kenya', flag: '🇰🇪', pppMultiplier: 5.5, earningsPerHour: 9 },
    philippines: { name: 'Philippines', flag: '🇵🇭', pppMultiplier: 4, earningsPerHour: 9 },
    india: { name: 'India', flag: '🇮🇳', pppMultiplier: 6.5, earningsPerHour: 9 },
  };

  const country = countries[selectedCountry as keyof typeof countries];
  const monthlyEarnings = Math.round((hoursPerWeek * 4) * country.earningsPerHour);
  const pppEquivalent = Math.round(monthlyEarnings * country.pppMultiplier);

  return (
    <main className={styles.main}>
      {/* Hero - What YOU Get */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Earn $900/Month<br />Without Coding
          </h1>

          <p className={styles.heroSubtitle}>
            You don't need technical skills. AI does the coding. You just guide it, review it, and deploy it.
            Get paid when clients accept the work.
          </p>

          <div className={styles.heroHighlight}>
            <div className={styles.highlightItem}>
              <div className={styles.highlightNumber}>$900</div>
              <div className={styles.highlightLabel}>Per month</div>
            </div>
            <div className={styles.highlightArrow}>→</div>
            <div className={styles.highlightItem}>
              <div className={styles.highlightNumber}>$4,500+</div>
              <div className={styles.highlightLabel}>In Nigeria/Pakistan</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Simple Process */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            AI does 95% of the work. You guide and supervise.
          </p>

          <div className={styles.processFlow}>
            <div className={styles.processStep}>
              <div className={styles.processActor} style={{ borderColor: '#64A8FF' }}>
                <div className={styles.processIcon}>👤</div>
                <div className={styles.processName}>You</div>
              </div>
              <div className={styles.processTasks}>
                <div className={styles.processTask}>Find job on Upwork (5 min)</div>
                <div className={styles.processTask}>Review AI-generated code (30 min)</div>
                <div className={styles.processTask}>Deploy to Render/Vercel (1h)</div>
                <div className={styles.processTask}>Test it works (1h)</div>
              </div>
            </div>

            <div className={styles.processArrow}>↓</div>

            <div className={styles.processStep}>
              <div className={styles.processActor} style={{ borderColor: '#1EE5B8' }}>
                <div className={styles.processIcon}>🤖</div>
                <div className={styles.processName}>AI Citizens</div>
              </div>
              <div className={styles.processTasks}>
                <div className={styles.processTask}>Emma writes proposal (2 min)</div>
                <div className={styles.processTask}>Inna writes specifications (5 min)</div>
                <div className={styles.processTask}>Rafael generates code (2 min)</div>
                <div className={styles.processTask}>Sofia tests quality (30s)</div>
                <div className={styles.processTask}>Maya handles client (1 min)</div>
              </div>
            </div>

            <div className={styles.processArrow}>↓</div>

            <div className={styles.processResult}>
              <div className={styles.resultBox}>
                <div className={styles.resultIcon}>✅</div>
                <div className={styles.resultText}>Client accepts</div>
                <div className={styles.resultEarnings}>You get paid $90</div>
              </div>
            </div>
          </div>

          <div className={styles.processSummary}>
            <strong>Total time:</strong> 3 hours of supervision per $600 mission<br />
            <strong>Your work:</strong> Review, deploy, test<br />
            <strong>AI work:</strong> Proposals, code, specs, testing, client communication
          </div>
        </div>
      </section>

      {/* Who This Is For - Personal */}
      <section className={styles.section} style={{ background: 'rgba(21, 26, 33, 0.4)' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Who This Is For</h2>

          <div className={styles.personalMessage}>
            <h3>You don't need to know how to code.</h3>
            <p>
              You don't need a computer science degree. You don't need years of experience.
              You just need:
            </p>

            <div className={styles.requirements}>
              <div className={styles.requirement}>
                <div className={styles.requirementIcon}>✓</div>
                <div className={styles.requirementText}>
                  <strong>Basic English</strong> — Read documentation, write clear messages
                </div>
              </div>
              <div className={styles.requirement}>
                <div className={styles.requirementIcon}>✓</div>
                <div className={styles.requirementText}>
                  <strong>Follow instructions</strong> — Deploy guides are step-by-step
                </div>
              </div>
              <div className={styles.requirement}>
                <div className={styles.requirementIcon}>✓</div>
                <div className={styles.requirementText}>
                  <strong>15-30 hours/week</strong> — Flexible schedule, work when you want
                </div>
              </div>
              <div className={styles.requirement}>
                <div className={styles.requirementIcon}>✓</div>
                <div className={styles.requirementText}>
                  <strong>Willingness to learn</strong> — AI helps you learn by doing
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Expect - Interactive Calculator */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What You Can Expect</h2>
          <p className={styles.sectionSubtitle}>
            Your earnings depend on your country and hours worked
          </p>

          <div className={styles.calculator}>
            <div className={styles.calculatorControls}>
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>Your Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className={styles.countrySelect}
                >
                  {Object.entries(countries).map(([key, country]) => (
                    <option key={key} value={key}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>
                  Hours Per Week: <strong>{hoursPerWeek}</strong>
                </label>
                <input
                  type="range"
                  min="15"
                  max="30"
                  step="1"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>15h</span>
                  <span>30h</span>
                </div>
              </div>
            </div>

            <div className={styles.calculatorResult}>
              <div className={styles.resultCard}>
                <div className={styles.resultLabel}>You Earn (USD)</div>
                <div className={styles.resultValue}>${monthlyEarnings}/month</div>
              </div>
              <div className={styles.resultArrow}>→</div>
              <div className={styles.resultCard} style={{ borderColor: '#1EE5B8' }}>
                <div className={styles.resultLabel}>Real Purchasing Power</div>
                <div className={styles.resultValue} style={{ color: '#1EE5B8' }}>
                  ${pppEquivalent}/month
                </div>
                <div className={styles.resultNote}>
                  In {country.name}, ${monthlyEarnings} USD buys what ${pppEquivalent} buys in the US
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your First Week - Benefits */}
      <section className={styles.section} style={{ background: 'rgba(21, 26, 33, 0.4)' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Your First Week</h2>
          <p className={styles.sectionSubtitle}>
            From signup to first payment
          </p>

          <div className={styles.weekTimeline}>
            <div className={styles.weekStep}>
              <div className={styles.weekDay}>Day 1</div>
              <div className={styles.weekContent}>
                <div className={styles.weekWhat}>Read docs, set up wallet</div>
                <div className={styles.weekGet}>→ You're ready to work</div>
              </div>
            </div>

            <div className={styles.weekStep}>
              <div className={styles.weekDay}>Day 2-7</div>
              <div className={styles.weekContent}>
                <div className={styles.weekWhat}>Complete real mission (AI-supervised)</div>
                <div className={styles.weekGet}>→ You get paid $90</div>
              </div>
            </div>

            <div className={styles.weekStep}>
              <div className={styles.weekDay}>Week 2+</div>
              <div className={styles.weekContent}>
                <div className={styles.weekWhat}>Regular missions (10-12/month)</div>
                <div className={styles.weekGet}>→ Steady income $900/month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to Start?</h2>
          <p className={styles.ctaSubtitle}>
            Message Nicolas on Telegram. Include your country and hours/week you can work.
          </p>

          <a
            href="https://t.me/nlr_ai"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            Apply via Telegram →
          </a>

          <div className={styles.ctaTemplate}>
            <div className={styles.templateTitle}>Message template:</div>
            <div className={styles.templateBox}>
              Hi Nicolas, I want to join ScopeLock.
              <br />
              <br />
              Country: [Your country]
              <br />
              Hours/week: [15-30]
              <br />
              <br />
              I understand AI does the coding, I supervise and deploy.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
