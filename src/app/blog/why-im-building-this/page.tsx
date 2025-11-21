import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'Why I\'m Building This: A Letter to UNN Engineering Students | Ikechukwu Okuzu',
  description: 'From nearly dropping out to building a bridge for 150-200 UNN students. The real story of why the Campus Developer Program exists.',
};

export default function WhyImBuildingThisPage() {
  return (
    <main className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>📖 PERSONAL STORY</div>
          <h1 className={styles.heroTitle}>
            Why I'm Building This
          </h1>
          <p className={styles.heroSubtitle}>
            A Letter to UNN Engineering Students
          </p>
          <div className={styles.author}>
            <img src="/humans/ike/profile.jpeg" alt="Ikechukwu Okuzu" className={styles.authorImage} />
            <div className={styles.authorInfo}>
              <div className={styles.authorName}>Ikechukwu "Ike" Okuzu</div>
              <div className={styles.authorTitle}>
                Former ABESA President, Class of 2023<br />
                Chair, IWA Young Water Professionals Nigeria
              </div>
            </div>
          </div>
          <div className={styles.readTime}>
            ⏱️ 20 minute read · 4,200 words
          </div>
        </div>
      </section>

      {/* Before You Read */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Before You Read This: Who Am I and Why You Should Care</h2>

          <div className={styles.textBlock}>
            <h3>Who I Am</h3>
            <p>
              My name is Ikechukwu Okuzu. Most people call me Ike.
            </p>
            <p>
              I graduated from the University of Nigeria, Nsukka (UNN) in 2023 with a degree in Agricultural Engineering.
              While I was there, I served as President of ABESA (Association of Biomedical Engineering Students Association) -
              yes, Agricultural Engineering student leading ABESA, long story - and built a network across all 9 engineering departments.
            </p>
            <p>
              Today, I'm the Chair of IWA Young Water Professionals Nigeria, work with the Federal Ministry of Environment on
              infrastructure projects, and coordinate with state water ministries across the country. I partner with international
              NGOs and government agencies building technology solutions for African problems.
            </p>
            <p className={styles.highlight}>
              <strong>But three years ago, I was exactly where you are now.</strong>
            </p>
            <p>
              Sitting in my hostel room at UNN, worried about accommodation fees, wondering if my degree would actually lead
              anywhere, watching my seniors graduate and struggle to find ₦80,000/month jobs.
            </p>
          </div>

          <div className={styles.textBlock}>
            <h3>Why I'm Writing This</h3>
            <p>
              I'm partnering with ScopeLock - an AI-assisted software development agency - to create something that didn't exist
              when I needed it most: <strong>a bridge from university to real tech careers</strong>.
            </p>
            <p>
              We're recruiting <strong>150-200 UNN engineering and computer science students</strong> for paid remote developer
              work. You'll earn ₦50,000-100,000 per month while studying, work on real government and NGO projects, and build
              skills that lead to ₦300,000-500,000/month jobs after graduation.
            </p>
            <p>
              But this isn't a recruitment post. <strong>This is the story of why I'm doing this.</strong>
            </p>
          </div>

          <div className={styles.calloutBox}>
            <h3>Why You Should Read This (Even If You're Skeptical)</h3>
            <p>I know what you're thinking:</p>
            <ul>
              <li><em>"Another opportunity that sounds too good to be true."</em></li>
              <li><em>"Another program that promises a lot and delivers nothing."</em></li>
              <li><em>"Another person who doesn't understand what students are going through."</em></li>
            </ul>
            <p><strong>Fair. I'd think the same thing.</strong></p>
            <p>That's exactly why I wrote this letter.</p>
          </div>

          <div className={styles.textBlock}>
            <p>
              I'm not going to pitch you. I'm going to tell you my story - the real one, not the polished LinkedIn version.
              The story of nearly dropping out. The story of realizing a degree wouldn't save me. The story of the professor
              who earned less than $300/month after 20 years. The story of the VP's personal assistant who showed me exactly
              why the job market is rigged.
            </p>
            <p>
              And then I'm going to explain what's possible now that wasn't possible even two years ago, because AI changed everything.
            </p>
            <p>
              <strong>This letter is 4,200 words long.</strong> That's about 20 minutes of reading.
            </p>
            <p>
              If you can't commit 20 minutes to understand an opportunity that could change your financial situation and career
              trajectory, then honestly, this program isn't for you anyway.
            </p>
            <p>But if you're willing to read - really read, not just skim - then you'll understand:</p>
          </div>

          <div className={styles.benefitsList}>
            <div className={styles.benefitItem}>
              ✅ Why someone who graduated just 3 years ago is now working with federal government and international organizations
            </div>
            <div className={styles.benefitItem}>
              ✅ Why AI makes it possible to earn as a developer without knowing how to code
            </div>
            <div className={styles.benefitItem}>
              ✅ Why 150-200 spots for 9,000 engineering students means you need to decide fast
            </div>
            <div className={styles.benefitItem}>
              ✅ Why this matters for Nigeria, not just your bank account
            </div>
            <div className={styles.benefitItem}>
              ✅ Exactly what you'll do, how much you'll earn, and what happens after graduation
            </div>
          </div>

          <div className={styles.textBlock}>
            <p>
              <strong>Most importantly: You'll understand whether this is for you or not.</strong>
            </p>
            <p>
              Because I'm not trying to recruit everyone. I'm trying to recruit the <strong>right 150-200 students</strong> -
              the ones who are hungry, hardworking, and willing to bet on themselves.
            </p>
          </div>

          <div className={styles.tocBox}>
            <h4>What's Below</h4>
            <p>The full letter is divided into six parts:</p>
            <ul>
              <li><strong>Part 1: My Story</strong> - Where I came from and what I learned the hard way</li>
              <li><strong>Part 2: What I See</strong> - The wasted potential and broken system at UNN</li>
              <li><strong>Part 3: The Bridge</strong> - What we're building and how it actually works</li>
              <li><strong>Part 4: Who This Is For</strong> - Honest assessment of who should (and shouldn't) apply</li>
              <li><strong>Part 5: The Call</strong> - Why now matters and what you need to do</li>
              <li><strong>Part 6: My Commitment</strong> - What I'm promising you if you're willing to work</li>
            </ul>
            <p><strong>Read the whole thing. Then decide.</strong></p>
            <p>If it resonates, apply. If it doesn't, that's okay too.</p>
            <p>But at least you'll know what's possible.</p>
          </div>

          <div className={styles.readyBox}>
            <p><strong>Ready? Here's my story.</strong></p>
          </div>
        </div>
      </section>

      {/* Part 1: My Story */}
      <section className={styles.section} style={{ background: 'rgba(30, 229, 184, 0.05)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.partTitle}>
            <span className={styles.partNumber}>Part 1</span>
            My Story: From Nearly Dropping Out to Building This
          </h2>

          <div className={styles.textBlock}>
            <p>I remember the exact moment I realized something was broken.</p>
            <p>
              Tuesday morning, third year. I walked into Professor Eze's office. His desk was buried under papers - research
              proposals, student assignments, administrative forms stacked everywhere. We'd been talking about career paths,
              and I asked the question that was burning in my mind:
            </p>
            <p><em>"Sir, if you don't mind - how much does a professor actually earn?"</em></p>
            <p>
              He laughed. Not a happy laugh - the kind of laugh that says <em>you're about to learn something disappointing</em>.
            </p>
            <p><em>"₦180,000 a month, Ikechukwu. Sometimes less."</em></p>
            <p>
              I did the math in my head right there. Less than $300 a month. After 20 years at the university. After a PhD.
              After teaching thousands of students.
            </p>
            <p>I walked out of that office thinking: <em>I can't end up like this. I won't end up like this.</em></p>
            <p className={styles.highlight}>
              <strong>But here's the thing - I nearly didn't make it at all.</strong>
            </p>
          </div>

          <div className={styles.storySection}>
            <h3>The Breaking Point</h3>
            <p>Second year was hell.</p>
            <p>
              I was running a small business - computer services, helping other students with typing, printing, basic tech
              support. I hired a few classmates. We were making maybe ₦50,000 a month if we were lucky. It was enough to pay
              my accommodation.
            </p>
            <p>
              Because that's the real cost nobody talks about: <strong>accommodation at UNN costs ₦300,000-400,000 per year.
              Tuition is ₦50,000.</strong>
            </p>
            <p><strong>Read that again. You're spending 6-8 times more on a room than on your actual education.</strong></p>
            <p>
              So I was working. A lot. Missing classes. Running to client meetings. Fixing computers at midnight. Then trying
              to study thermodynamics at 2am on three hours of sleep.
            </p>
            <p>
              My friends were taking notes in lecture halls. I was in my room, fighting to keep my eyes open, thinking:
              <em>Will the client pay tomorrow? Can I afford to register next semester? What if this doesn't work?</em>
            </p>
            <p>I was exhausted. I was falling behind. I was one bad month away from going home.</p>
            <p><strong>And I was scared.</strong></p>
            <p>
              I remember walking to the Dean of Student Affairs office, thinking: <em>This is it. I'm done. I failed.</em> My
              hands were actually shaking when I knocked on his door.
            </p>
            <p>
              He looked at me. He'd been watching me somehow - my hustle, my struggle, my grades slipping. He said:
              "Ikechukwu, sit down. You're not going anywhere."
            </p>
            <p>
              Then he told me about a full scholarship the university was offering. He said I qualified. He said they believed in me.
            </p>
            <p>I just sat there. I couldn't speak. I was trying so hard not to cry in front of him.</p>
            <p className={styles.highlight}>
              <strong>That scholarship saved my university career. Without it, I wouldn't have graduated. Without it, none of
              what came after would have been possible.</strong>
            </p>
          </div>

          <div className={styles.storySection}>
            <h3>The Breakthrough</h3>
            <p>Things changed for me when I won an international award.</p>
            <p>
              University of Saskatchewan, Canada - video editing competition. International contest. I had no camera. I had no
              fancy equipment. I had my phone and an idea.
            </p>
            <p>
              I made a 120-second film about life at UNN. Shot it all on my phone. Edited it on a borrowed laptop. Submitted
              it not really expecting anything.
            </p>
            <p>I won. $1,000 Canadian dollars.</p>
            <p>
              But more than the money - <strong>that award opened doors.</strong> Suddenly I had a network. Friends representing
              Nigeria in Scotland. Classmates working on international projects. Access to grants and opportunities I never knew existed.
            </p>
            <p>
              My roommates and I formed a cohort. We learned how to write grant applications. We learned how to find opportunities.
              We raised $20,000 in grants as students.
            </p>
            <p className={styles.highlight}>
              <strong>$20,000. As students. While our classmates didn't even know these opportunities existed.</strong>
            </p>
            <p>
              That's when I realized: <strong>The difference between students who succeed and students who struggle isn't intelligence
              or work ethic. It's exposure. It's knowing what's possible. It's having someone show you the doors.</strong>
            </p>
          </div>

          <div className={styles.storySection}>
            <h3>The Hard Truth I Learned</h3>
            <p>
              Fast forward to final year, about to graduate. I'm feeling good. I've got skills. I've got experience. I've got a
              degree. I'm ready.
            </p>
            <p>
              Then one evening, I'm invited to the house of the personal assistant to the Vice President of Nigeria. We're talking
              about the job market. He asks me: "What's your plan after graduation?"
            </p>
            <p>I tell him I'm looking for opportunities. He smiles that same sad smile Professor Eze had.</p>
            <p><em>"Let me show you something,"</em> he says.</p>
            <p>We do the math together. He uses the Nigerian Civil Defense as an example.</p>
            <p><em>"Let's say they're hiring 1,000 people. Sounds good, right? But here's how it actually works:</em></p>
            <ul>
              <li>Every state has a quota: 720 positions gone</li>
              <li>Every politician has a quota: another 150 gone</li>
              <li>Every traditional ruler has a quota: another 80 gone</li>
              <li>Every community leader has connections: another 50 gone</li>
            </ul>
            <p className={styles.highlight}>
              <strong>By the time you do the math, there's maybe 20% left for everyone else. Sometimes there's nothing left at all."</strong>
            </p>
            <p>That's not just one agency. <strong>That's how the entire system works.</strong></p>
            <p>Suddenly my degree didn't feel so valuable anymore.</p>
          </div>
        </div>
      </section>

      {/* Part 2: What I See */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.partTitle}>
            <span className={styles.partNumber}>Part 2</span>
            What I See: The Wasted Potential
          </h2>

          <div className={styles.textBlock}>
            <p>Here's what kills me.</p>
            <p>
              Right now at UNN, there are thousands of students like I was. Smart. Hardworking. Hungry. <strong>Brilliant.</strong>
            </p>
            <p>But most of them are trapped in a cycle: classroom → hostel → church → repeat.</p>
            <p>
              They don't know about international competitions. They don't know how to write grant applications. They don't know
              what opportunities exist beyond Nigeria. They don't know that you can earn $500, $1,000, $2,000 a month as a student
              if you have the right skills and guidance.
            </p>
            <p className={styles.highlight}>
              <strong>They're going to graduate with degrees and no jobs. Just like the classes before them. Just like I almost did.</strong>
            </p>
            <p>And here's what makes it worse: <strong>It's not their fault.</strong></p>
          </div>

          <div className={styles.problemBox}>
            <h4>The system is designed to fail them:</h4>
            <ul>
              <li>Professors earning less than $1,000/month can't show them a better path</li>
              <li>The job market is rigged with quota systems</li>
              <li>Traditional education teaches theory, not practical skills</li>
              <li>Nobody is showing them how to access the global market</li>
              <li>Nobody is teaching them how to use the tools that are changing everything</li>
            </ul>
          </div>

          <div className={styles.textBlock}>
            <p>
              58-60% of Nigeria's population is under 24 years old. <strong>That's millions of young, brilliant minds being
              wasted because nobody is showing them what's possible.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Part 3: The Bridge */}
      <section className={styles.section} style={{ background: 'rgba(100, 168, 255, 0.05)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.partTitle}>
            <span className={styles.partNumber}>Part 3</span>
            The AI Revolution & The Bridge We're Building
          </h2>

          <div className={styles.revolutionBox}>
            <h3>What Just Became Possible</h3>
            <p>Two months ago, if you wanted to be a software developer, you had to:</p>
            <ol>
              <li>Learn to code for 2-4 years</li>
              <li>Build practice projects</li>
              <li>Hope someone would hire you</li>
              <li>Start at the bottom earning ₦80,000-120,000/month</li>
            </ol>
            <p className={styles.highlight}>
              <strong>Everything changed.</strong>
            </p>
            <p>
              Today - right now - you can earn as a developer <strong>without knowing how to code.</strong>
            </p>
            <p>I know that sounds crazy. But it's true.</p>
            <p>
              AI agents - sophisticated AI systems - can now write code, test it, deploy it, fix bugs. They can build complete
              websites, mobile apps, business systems. They can do in 30 minutes what used to take a week.
            </p>
            <p><strong>But here's the catch: You can't do it alone.</strong></p>
          </div>

          <div className={styles.textBlock}>
            <h3>The AI Citizens</h3>
            <p>We've built six specialized AI systems - we call them "citizens" because they work like team members:</p>
          </div>

          <div className={styles.citizensGrid}>
            <div className={styles.citizenCard}>
              <div className={styles.citizenNumber}>1</div>
              <h4>Emma (The Scout)</h4>
              <ul>
                <li>Finds real jobs on Upwork (global freelance market)</li>
                <li>Analyzes which ones are good fits</li>
                <li>Writes complete proposals for you</li>
                <li>You literally copy-paste and click "send"</li>
              </ul>
            </div>

            <div className={styles.citizenCard}>
              <div className={styles.citizenNumber}>2</div>
              <h4>Inna (The Specifier)</h4>
              <ul>
                <li>Writes complete technical documentation</li>
                <li>Creates six levels of specs before any code is written</li>
                <li>Ensures everyone understands what needs to be built</li>
                <li>You just verify it makes sense</li>
              </ul>
            </div>

            <div className={styles.citizenCard}>
              <div className={styles.citizenNumber}>3</div>
              <h4>Rafael (The Builder)</h4>
              <ul>
                <li>Writes 100% of the code</li>
                <li>Tests everything</li>
                <li>Deploys it online</li>
                <li>Fixes bugs</li>
                <li>You supervise and guide, you don't write code yourself</li>
              </ul>
            </div>

            <div className={styles.citizenCard}>
              <div className={styles.citizenNumber}>4</div>
              <h4>Sofia (The Checker)</h4>
              <ul>
                <li>Verifies quality before delivery</li>
                <li>Runs comprehensive tests</li>
                <li>Makes sure nothing breaks</li>
                <li>Ensures client gets exactly what they paid for</li>
              </ul>
            </div>

            <div className={styles.citizenCard}>
              <div className={styles.citizenNumber}>5</div>
              <h4>Maya (The Bridge)</h4>
              <ul>
                <li>Manages client communication</li>
                <li>Writes professional messages</li>
                <li>Handles updates and feedback</li>
                <li>You just copy-paste her messages</li>
              </ul>
            </div>

            <div className={styles.citizenCard}>
              <div className={styles.citizenNumber}>6</div>
              <h4>Alexis (The Strategist)</h4>
              <ul>
                <li>Guides pricing decisions</li>
                <li>Helps with strategy</li>
                <li>Tracks your earnings</li>
              </ul>
            </div>
          </div>

          <div className={styles.roleBox}>
            <p><strong>Your job?</strong> Guide them. Supervise them. Verify their work. Copy-paste between them.</p>
            <p><strong>Their job?</strong> Handle 100% of the technical complexity.</p>
          </div>

          <div className={styles.timelineBox}>
            <h3>What You'll Actually Do</h3>

            <div className={styles.timelineItem}>
              <div className={styles.timelineLabel}>Month 1: Training & First Project</div>
              <ul>
                <li>Learn our AI workflow system (2-4 weeks)</li>
                <li>Get assigned to your first real client project</li>
                <li>Work 10-15 hours/week (flexible around classes)</li>
                <li>Earn ₦50,000-100,000 your first month</li>
              </ul>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineLabel}>Month 3: Getting Confident</div>
              <ul>
                <li>You're handling full features independently</li>
                <li>Working on 2-3 projects simultaneously</li>
                <li>Earning ₦100,000-150,000/month consistently</li>
                <li>Building real portfolio of deployed systems</li>
              </ul>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineLabel}>Month 6: Professional Level</div>
              <ul>
                <li>You're a reliable contributor on complex projects</li>
                <li>Earning ₦150,000-250,000/month</li>
                <li>Have 4-6 major projects in your portfolio</li>
                <li>Getting job offers for after graduation</li>
              </ul>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineLabel}>Month 12: Career Launch</div>
              <ul>
                <li>Top 10-20% receive full-time job offers: ₦300,000-500,000/month</li>
                <li>Everyone else has skills to freelance independently</li>
                <li>You've built systems serving thousands of real users</li>
                <li>You're earning more than most graduates 3 years ahead of you</li>
              </ul>
            </div>
          </div>

          <div className={styles.projectsBox}>
            <h3>What You'll Build</h3>
            <p>Not practice projects. <strong>Real systems that real people use.</strong></p>
            <p>Examples of projects ScopeLock students work on:</p>
            <ul>
              <li><strong>Water infrastructure management systems</strong> for state governments</li>
              <li><strong>Disaster relief coordination platforms</strong> for NGOs</li>
              <li><strong>Climate monitoring dashboards</strong> for federal agencies</li>
              <li><strong>University management systems</strong> for educational institutions</li>
              <li><strong>Mobile apps for social impact organizations</strong></li>
            </ul>
            <p className={styles.highlight}>
              When you apply for jobs, you don't say "I built a todo app for practice."
            </p>
            <p>
              You say: <strong>"I built the water management system currently serving 50,000 citizens in Kaduna State. I built
              the disaster relief platform used during the 2024 floods. I built systems that matter."</strong>
            </p>
            <p><strong>That's what employers want to see.</strong></p>
          </div>
        </div>
      </section>

      {/* Part 4: Who This Is For */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.partTitle}>
            <span className={styles.partNumber}>Part 4</span>
            Who This Is For (And Who It's Not For)
          </h2>

          <div className={styles.textBlock}>
            <p>Let me be completely honest with you.</p>
          </div>

          <div className={styles.eligibilityGrid}>
            <div className={styles.eligibilityCard} style={{ borderColor: '#1EE5B8' }}>
              <h3>✅ Who Should Apply</h3>
              <ul>
                <li><strong>You're hungry</strong> - You want more than a degree. You want skills that actually pay.</li>
                <li><strong>You're hardworking</strong> - This isn't passive income. You'll work 10-20 hours/week consistently.</li>
                <li><strong>You're under financial pressure</strong> - ₦50,000-100,000/month would actually help you and your family.</li>
                <li><strong>You want to learn while earning</strong> - You don't just want money, you want to build real capabilities.</li>
                <li><strong>You're between classes or have time</strong> - You can commit 10-20 hours/week for 3+ months.</li>
                <li><strong>You have phone/laptop and internet</strong> - You can work remotely from your accommodation.</li>
                <li><strong>You're 2nd year or above</strong> - You're settled at university, you understand commitment.</li>
                <li><strong>You want to build solutions for African problems</strong> - You care about impact, not just income.</li>
              </ul>
            </div>

            <div className={styles.eligibilityCard} style={{ borderColor: '#FF5D5D' }}>
              <h3>❌ Who Should Not Apply</h3>
              <ul>
                <li><strong>You're looking for easy money</strong> - This requires real work. If you're not willing to put in effort, don't waste our time.</li>
                <li><strong>You need constant hand-holding</strong> - We provide training and guidance, but you need to be self-motivated.</li>
                <li><strong>You give up when things get hard</strong> - The first 2-3 weeks are challenging. If you quit easily, this isn't for you.</li>
                <li><strong>You can't commit time consistently</strong> - We need 10-20 hours per week, every week. If you're unreliable, don't apply.</li>
                <li><strong>You just want a certificate</strong> - We don't give certificates. We give skills, portfolio, and income.</li>
                <li><strong>You're in final year graduating this semester</strong> - You need at least 3-6 months to make this worthwhile.</li>
              </ul>
            </div>
          </div>

          <div className={styles.calloutBox} style={{ marginTop: '3rem' }}>
            <p><strong>This is not for everyone. And that's okay.</strong></p>
            <p>
              We're looking for 150-200 students out of 9,000 engineering students at UNN. <strong>We're looking for the top 2%.</strong>
            </p>
          </div>

          <div className={styles.fearsBox}>
            <h3>The Hard Truth About AI</h3>
            <p>Some students are scared. They think:</p>

            <div className={styles.fearItem}>
              <div className={styles.fearQuestion}><em>"I'm not smart enough."</em></div>
              <div className={styles.fearAnswer}>
                → You got into UNN Engineering. You're smart enough. This isn't about genius - it's about willingness to learn.
              </div>
            </div>

            <div className={styles.fearItem}>
              <div className={styles.fearQuestion}><em>"I don't know how to code."</em></div>
              <div className={styles.fearAnswer}>
                → Perfect. Neither did I when I started. The AI writes the code. You learn by guiding it, not by writing it yourself.
              </div>
            </div>

            <div className={styles.fearItem}>
              <div className={styles.fearQuestion}><em>"I'll fail."</em></div>
              <div className={styles.fearAnswer}>
                → Maybe. Some people do. That's life. But the only guaranteed failure is not trying at all.
              </div>
            </div>

            <div className={styles.fearItem}>
              <div className={styles.fearQuestion}><em>"This sounds too good to be true."</em></div>
              <div className={styles.fearAnswer}>
                → It's not magic. It's real work with real guidance using real AI tools. The opportunity is real because AI
                changed what's possible. Two years ago, this wouldn't have worked. Today it does.
              </div>
            </div>

            <p className={styles.highlight} style={{ marginTop: '2rem' }}>
              <strong>The truth: AI is the great equalizer.</strong>
            </p>
            <p>
              It doesn't matter if you went to the best secondary school or the worst. It doesn't matter if you have a laptop
              or just a phone. It doesn't matter if you're from Lagos or a village.
            </p>
            <p><strong>What matters is: Are you willing to learn? Are you willing to work? Are you willing to try?</strong></p>
          </div>
        </div>
      </section>

      {/* Part 5: The Call */}
      <section className={styles.section} style={{ background: 'rgba(255, 93, 93, 0.1)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.partTitle}>
            <span className={styles.partNumber}>Part 5</span>
            Why This Matters for Nigeria & Why Now
          </h2>

          <div className={styles.textBlock}>
            <p>I work with the Federal Ministry of Environment. I chair IWA Young Water Professionals Nigeria. I see government and NGO projects across the country.</p>
            <p><strong>Here's what I know: Nigeria has massive problems that need software solutions.</strong></p>
            <ul>
              <li>State governments need water management systems</li>
              <li>NGOs need disaster relief coordination platforms</li>
              <li>Federal agencies need climate monitoring dashboards</li>
              <li>Communities need mobile apps for local services</li>
            </ul>
            <p><strong>These problems exist. The funding exists. The need exists.</strong></p>
            <p><strong>What's missing? Developers who can actually build the solutions.</strong></p>
            <p>
              Most software agencies charge international rates (₦5M-10M for a system). Government can't afford it or doesn't
              trust foreign companies. Local developers don't have the skills or capacity.
            </p>
            <p className={styles.highlight}>
              <strong>But what if 150 UNN students could build these systems?</strong>
            </p>
            <p>What if you're not just earning income - you're building solutions that serve millions of Nigerians?</p>
            <p>
              What if instead of watching our classmates leave for Europe and America, we're building careers right here solving
              African problems?
            </p>
            <p><strong>That's the vision. That's what's possible.</strong></p>
          </div>

          <div className={styles.urgencyBox}>
            <h3>⚠️ The Urgency: Why Now?</h3>
            <p>
              Some of you are thinking: "I'll apply next semester. I'll wait until I'm more ready. I'll do this after I finish
              my current project."
            </p>
            <p><strong>Don't.</strong></p>
            <p>Here's why:</p>

            <ol>
              <li>
                <strong>Limited Spots</strong><br />
                We're recruiting 150-200 students total. First 50 in December, then 70 more, then 80 more. <strong>First
                applicants get first opportunities.</strong>
              </li>
              <li>
                <strong>Optimal Timing</strong><br />
                • <strong>Now (November):</strong> Recruitment and screening<br />
                • <strong>December:</strong> Training during your break when you have time<br />
                • <strong>January:</strong> Start earning when classes resume<br />
                • <strong>Wait until February:</strong> You miss the December training window. You fall behind.
              </li>
              <li>
                <strong>AI is Moving Fast</strong><br />
                This opportunity exists because AI technology reached a breakthrough point in 2024. In 2 years, everyone will
                be doing this. <strong>Right now, you're early. That's an advantage.</strong>
              </li>
              <li>
                <strong>The Job Market is Getting Worse</strong><br />
                Every year, more graduates compete for the same broken quota system. The longer you wait to build real skills,
                the harder it gets.
              </li>
              <li>
                <strong>Your Financial Situation</strong><br />
                If you're struggling to pay accommodation, if your family can't support you, if you're worried about next
                semester - <strong>every month you wait is another month of financial stress.</strong>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Part 6: My Commitment */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.partTitle}>
            <span className={styles.partNumber}>Part 6</span>
            My Commitment to You
          </h2>

          <div className={styles.textBlock}>
            <p>Let me tell you why I'm doing this.</p>
            <p>
              I could focus 100% on my own career. Federal Ministry work pays well. IWA leadership opens international doors.
              I have consulting opportunities.
            </p>
            <p><strong>But I can't stop thinking about that moment in the Dean's office.</strong></p>
            <p>When he saved me from dropping out. When he gave me a chance. When he believed in me.</p>
            <p className={styles.highlight}>
              <strong>Someone invested in me when I was struggling. Now I need to do the same.</strong>
            </p>
            <p>
              I look at UNN students today and I see myself 3 years ago. Smart. Hungry. Scared about the future. Trapped in a
              system that's designed to fail them.
            </p>
            <p><strong>I can't save everyone. But I can create a bridge for 150-200 students.</strong></p>
          </div>

          <div className={styles.commitmentsGrid}>
            <div className={styles.commitmentCard}>
              <div className={styles.commitmentNumber}>1</div>
              <h4>I Will Be Honest</h4>
              <p>
                I won't overpromise. This is hard work. Some of you will fail. But if you commit and do the work, you'll succeed.
              </p>
            </div>

            <div className={styles.commitmentCard}>
              <div className={styles.commitmentNumber}>2</div>
              <h4>I Will Provide Real Guidance</h4>
              <p>
                This isn't a passive program. I'm personally involved in recruitment, training, and monitoring quality. You'll
                have access to me and the team.
              </p>
            </div>

            <div className={styles.commitmentCard}>
              <div className={styles.commitmentNumber}>3</div>
              <h4>I Will Demand Excellence</h4>
              <p>
                I'm not building a charity. I'm building a professional program. I expect you to work hard, meet deadlines, and
                deliver quality. That's how you grow.
              </p>
            </div>

            <div className={styles.commitmentCard}>
              <div className={styles.commitmentNumber}>4</div>
              <h4>I Will Celebrate Your Success</h4>
              <p>
                When you land your first client. When you deploy your first system. When you get your first job offer. I'll
                celebrate with you because I know what it took.
              </p>
            </div>

            <div className={styles.commitmentCard}>
              <div className={styles.commitmentNumber}>5</div>
              <h4>I Will Build Something That Lasts</h4>
              <p>
                This isn't a one-time program. The goal is to create a permanent pipeline from UNN to tech careers. Year after year.
                Class after class.
              </p>
            </div>
          </div>

          <div className={styles.calloutBox} style={{ marginTop: '3rem' }}>
            <p><strong>If you're willing to work, I'm willing to guide you.</strong></p>
          </div>
        </div>
      </section>

      {/* Final Challenge */}
      <section className={styles.section} style={{ background: 'rgba(30, 229, 184, 0.1)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>The Challenge</h2>

          <div className={styles.textBlock}>
            <p>If I could stand in front of every UNN engineering student right now, here's what I'd say:</p>
            <p><strong>Stop waiting for opportunities to find you. Go find them.</strong></p>
            <p>
              Stop complaining about the system being broken. We know it's broken. <strong>Build skills that transcend the
              broken system.</strong>
            </p>
            <p>
              Stop thinking you're not ready. Nobody is ready. <strong>You learn by doing, not by preparing to do.</strong>
            </p>
            <p>
              Stop making excuses about time, money, equipment. I built my first success with a phone and borrowed laptop.
              <strong>You have more resources than I did.</strong>
            </p>
            <p><strong>The question is not: "Am I qualified?"</strong></p>
            <p className={styles.highlight}>
              <strong>The question is: "Am I willing?"</strong>
            </p>
            <p>Willing to learn. Willing to work. Willing to push through the hard first weeks. Willing to bet on yourself.</p>
          </div>

          <div className={styles.mathBox}>
            <div className={styles.mathRow}>
              <span className={styles.mathNumber}>150-200</span>
              <span className={styles.mathLabel}>spots</span>
            </div>
            <div className={styles.mathDivider}></div>
            <div className={styles.mathRow}>
              <span className={styles.mathNumber}>9,000</span>
              <span className={styles.mathLabel}>engineering students</span>
            </div>
            <div className={styles.mathResult}>
              <strong>Do the math.</strong>
            </div>
          </div>

          <div className={styles.textBlock}>
            <p>The best will apply this week. The ambitious will apply next week. The hesitant will think about it. The cautious will wait.</p>
            <p>And when all the spots are filled, the ones who waited will ask: "Will there be another chance?"</p>
            <p><strong>Maybe. Maybe not.</strong></p>
          </div>
        </div>
      </section>

      {/* Final Promise */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>My Promise</h2>

          <div className={styles.textBlock}>
            <p>I'm building this because someone gave me a chance when I was about to drop out.</p>
            <p>I'm building this because I nearly ended up like that professor earning less than $300/month after 20 years.</p>
            <p>
              I'm building this because I met the VP's assistant and realized the job market is rigged and we need a different path.
            </p>
            <p>
              I'm building this because I have a younger sister - a frontend developer going by the brand name Destiny - and I
              want a world where she doesn't have to struggle like I did.
            </p>
            <p className={styles.highlight}>
              <strong>I'm building this because you deserve better than what the system is offering you.</strong>
            </p>
            <p>If you're willing to work, I'm willing to guide you.</p>
            <p>If you're willing to learn, I'm willing to teach you.</p>
            <p>If you're willing to try, I'm willing to bet on you.</p>
            <p><strong>150-200 students. Starting December 2025.</strong></p>
            <p><strong>Will you be one of them?</strong></p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>How to Apply</h2>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <p><strong>Read everything</strong> on the landing page</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <p><strong>Complete the application</strong> using Claude AI (instructions provided)</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <p><strong>Submit before deadline</strong> (First 150-200 qualified applicants accepted)</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>4</div>
              <p><strong>Interviews next week</strong> (15 minutes with me)</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>5</div>
              <p><strong>Training starts December</strong> (When you have time during break)</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>6</div>
              <p><strong>First earnings in January</strong> (When classes resume)</p>
            </div>
          </div>

          <div className={styles.applicationNote}>
            <p><strong>The application takes 90-120 minutes of focused work.</strong></p>
            <p><strong>If you can't commit 2 hours to apply, you won't commit 10-20 hours per week to work.</strong></p>
          </div>

          <div className={styles.ctaButtons}>
            <Link href="/program" className={styles.primaryButton}>
              View Full Program Details →
            </Link>
            <a href="mailto:ike@mindprotocol.ai" className={styles.secondaryButton}>
              Ask Questions
            </a>
          </div>
        </div>
      </section>

      {/* One Last Thing */}
      <section className={styles.finalSection}>
        <div className={styles.finalContent}>
          <h2>One Last Thing</h2>

          <div className={styles.finalMessage}>
            <p>To the student reading this at 2am in your hostel, worried about next semester's accommodation fees:</p>
            <p><strong>I was you.</strong></p>
            <p>To the student who asked a professor about salary and realized education alone won't save you:</p>
            <p><strong>I was you.</strong></p>
            <p>To the student who wants to build something real, earn real money, and make your family proud:</p>
            <p><strong>I was you.</strong></p>
            <p className={styles.finalHighlight}>
              <strong>Someone gave me a chance. I'm giving you a chance.</strong>
            </p>
            <p><strong>What you do with it is up to you.</strong></p>
          </div>

          <div className={styles.signature}>
            <div className={styles.signatureName}>Ikechukwu "Ike" Okuzu</div>
            <div className={styles.signatureTitles}>
              UNN Alumnus, Agricultural Engineering (Class of 2023)<br />
              Former President, ABESA (Association of Biomedical Engineering Students)<br />
              Chair, IWA Young Water Professionals Nigeria<br />
              Partner, ScopeLock
            </div>
            <div className={styles.signatureQuote}>
              <em>"The bridge exists. You just need to cross it."</em>
            </div>
          </div>

          <div className={styles.finalCta}>
            <a
              href="https://claude.ai/public/artifacts/af94aca0-c4b2-4a53-b47a-a9b79dfa1aec"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.finalButton}
            >
              Apply Now - First 150-200 Students
            </a>
            <p className={styles.finalWarning}>
              <strong>Don't be the one who waited.</strong>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
