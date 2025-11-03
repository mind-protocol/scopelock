/**
 * ScopeLock Proposal Generator
 *
 * PURPOSE: Generate ScopeLock-style proposals (Evidence Sprint, AC.md, proof links)
 * APPROACH: Template-based with dynamic portfolio matching
 */

/**
 * Draft ScopeLock proposal for approved job
 */
async function draftScopeLockProposal(job, evaluation) {
  // Detect which portfolio projects are most relevant
  const relevantProof = selectRelevantProof(job);

  // Build proposal sections
  const sections = {
    hook: buildHook(job, evaluation),
    approach: buildApproach(job),
    proof: buildProofSection(relevantProof),
    evidence_sprint: buildEvidenceSprint(job),
    pricing: buildPricing(job),
    cta: buildCTA()
  };

  // Assemble full proposal
  return assembleProposal(sections);
}

/**
 * Select most relevant portfolio projects for this job
 */
function selectRelevantProof(job) {
  const title = job.title.toLowerCase();
  const desc = job.description.toLowerCase();
  const text = title + ' ' + desc;

  const proof = [];

  // Terminal Velocity (always include - social proof)
  proof.push({
    name: 'Terminal Velocity',
    stars: '1.1k',
    relevance: 'Content quality + AI review system',
    github: 'github.com/nlr-ai/terminal-velocity'
  });

  // Healthcare/HIPAA
  if (text.includes('healthcare') || text.includes('hipaa') ||
      text.includes('medical') || text.includes('patient') ||
      text.includes('therapy') || text.includes('health')) {
    proof.push({
      name: 'TherapyKin',
      live: 'therapykin.ai',
      relevance: 'HIPAA-aware healthcare AI, 121+ deployments',
      detail: 'Text + voice AI companion for mental health support'
    });
  }

  // Multi-agent / orchestration
  if (text.includes('agent') || text.includes('multi-agent') ||
      text.includes('orchestr') || text.includes('coordinator')) {
    proof.push({
      name: 'La Serenissima',
      live: 'serenissima.ai',
      relevance: '97+ autonomous agents, 99.7% uptime over 6 months',
      detail: 'AI city with event-native architecture and agent coordination'
    });
  }

  // Trading/finance
  if (text.includes('trading') || text.includes('finance') ||
      text.includes('invest') || text.includes('market')) {
    proof.push({
      name: 'KinKong',
      live: 'konginvest.ai',
      relevance: '$7M capital, Solana DEX trading bot',
      detail: 'Real-money trading system with risk management'
    });
  }

  // If only Terminal Velocity, add La Serenissima (technical depth)
  if (proof.length === 1) {
    proof.push({
      name: 'La Serenissima',
      live: 'serenissima.ai',
      relevance: '97+ autonomous agents, production-grade infrastructure',
      detail: 'Proves we can handle complex AI systems at scale'
    });
  }

  return proof;
}

/**
 * Build attention-grabbing hook
 */
function buildHook(job, evaluation) {
  // Extract key pain point from job
  const painPoints = extractPainPoints(job.description);

  return `I see you need ${painPoints[0] || 'an AI solution'}.

Here's how I'd approach it: **Evidence Sprint first** (working prototype in 2 weeks), then fixed-price milestones with executable acceptance criteria.

You'll know exactly what you're getting before committing to the full build.`;
}

/**
 * Build approach section (ScopeLock methodology)
 */
function buildApproach(job) {
  return `**My Approach:**

1. **Evidence Sprint** (2 weeks, $3-6K)
   - Working prototype showing core concept
   - Technical proof (not just mockups)
   - Risk validation before big investment

2. **Lock the Scope** (if Evidence Sprint succeeds)
   - We co-write AC.md: executable acceptance criteria
   - Fixed-price milestones, payment at AC green
   - You only pay when tests pass

3. **Deliver with Proof**
   - Every milestone: working demo + quantified deltas
   - Public proof log: ${process.env.SITE_URL || 'scopelock.mindprotocol.ai'}/proof
   - Executable tests you can run yourself`;
}

/**
 * Build proof section (portfolio links)
 */
function buildProofSection(relevantProof) {
  let section = '\n**Relevant Work:**\n\n';

  for (const project of relevantProof) {
    if (project.github) {
      section += `- **${project.name}** (${project.stars} GitHub stars) - ${project.relevance}\n`;
      section += `  ${project.github}\n\n`;
    } else if (project.live) {
      section += `- **${project.name}** (${project.live}) - ${project.relevance}\n`;
      if (project.detail) {
        section += `  ${project.detail}\n`;
      }
      section += '\n';
    }
  }

  section += `Full portfolio: github.com/mind-protocol\n`;
  section += `Process details: ${process.env.SITE_URL || 'scopelock.mindprotocol.ai'}/process`;

  return section;
}

/**
 * Build Evidence Sprint proposal
 */
function buildEvidenceSprint(job) {
  // Extract key features from job description
  const features = extractKeyFeatures(job.description);

  return `\n**Evidence Sprint Scope** (what you'd get in 2 weeks):\n\n${features.slice(0, 3).map((f, i) => `${i + 1}. ${f}`).join('\n')}

This proves the concept works before you commit to the full budget.

Demo: ≤90 seconds, quantified results (e.g., "p95 latency <300ms", "accuracy >85%").`;
}

/**
 * Build pricing section
 */
function buildPricing(job) {
  const budgetMatch = job.budget.match(/\$?(\d+,?\d*)/);
  const budgetValue = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : 0;

  let evidenceSprintPrice = 3500;
  let totalEstimate = 'TBD after Evidence Sprint';

  if (budgetValue >= 10000) {
    evidenceSprintPrice = 5000;
    totalEstimate = '$12-18K (3-4 milestones)';
  } else if (budgetValue >= 5000) {
    evidenceSprintPrice = 4000;
    totalEstimate = '$8-12K (2-3 milestones)';
  }

  return `\n**Pricing:**\n
- Evidence Sprint: $${evidenceSprintPrice.toLocaleString()} (2 weeks)
- Full build: ${totalEstimate}

Payment at AC green (when tests pass), not hours.`;
}

/**
 * Build call-to-action
 */
function buildCTA() {
  return `\n**Next Steps:**\n
1. Quick call to align on Evidence Sprint scope (15 min)
2. I draft AC.md for the sprint
3. You approve → we start
4. 2 weeks → working prototype

Book here: ${process.env.CAL_COM_URL || 'cal.com/scopelock/kickoff'}

Or reply with questions. Happy to clarify the approach.`;
}

/**
 * Assemble full proposal
 */
function assembleProposal(sections) {
  return `${sections.hook}

${sections.approach}

${sections.proof}

${sections.evidence_sprint}

${sections.pricing}

${sections.cta}

---

Nicolas Le Roux
ScopeLock - Lock the scope. Prove the value.
${process.env.SITE_URL || 'scopelock.mindprotocol.ai'}`;
}

/**
 * Extract pain points from job description
 */
function extractPainPoints(description) {
  const painKeywords = [
    'struggling with',
    'need help',
    'looking for',
    'want to',
    'trying to',
    'challenge',
    'problem',
    'issue'
  ];

  const sentences = description.split(/[.!?]/);
  const painPoints = [];

  for (const sentence of sentences) {
    for (const keyword of painKeywords) {
      if (sentence.toLowerCase().includes(keyword)) {
        painPoints.push(sentence.trim());
        break;
      }
    }
  }

  return painPoints.length > 0 ? painPoints : ['a solution'];
}

/**
 * Extract key features from job description
 */
function extractKeyFeatures(description) {
  // Simple heuristic: look for numbered lists, bullets, or "need" statements
  const features = [];

  const lines = description.split('\n');
  for (const line of lines) {
    if (line.match(/^[\d\-\*•]/)) {
      features.push(line.replace(/^[\d\-\*•]\s*/, '').trim());
    }
  }

  // Fallback: generic features
  if (features.length === 0) {
    features.push(
      'Core AI integration (model selection, prompting, context)',
      'Working prototype with basic UI',
      'Performance metrics (latency, accuracy, cost)'
    );
  }

  return features;
}

module.exports = { draftScopeLockProposal };
