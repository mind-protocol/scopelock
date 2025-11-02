#!/usr/bin/env node
/**
 * Proof Page Generator
 *
 * Purpose: Generate static HTML proof pages from git tags
 * Command: npm run proofgen
 * Owner: Daniel "The Forge"
 *
 * Documentation:
 * - Specification: docs/automation/SPEC.md#proof-regeneration
 * - Output Contract: ARCHITECTURE.md (PRF-020)
 * - Repository Map: REPO_MAP.md#scripts
 *
 * Input:
 * - Git tags matching: evidence-sprint_*, ac-green_*, change-*
 * - Proof files at tag: proof/AC.md, proof/DEMO.md, proof/DELTA.md
 *
 * Output:
 * - public/proof/index.html (index page)
 * - public/proof/index.json (API for homepage teaser)
 * - public/proof/[tag]/index.html (detail pages)
 *
 * Events Emitted:
 * - proof.generated@1.0 { tag, entry_count, timestamp }
 *
 * Failure Mode:
 * - Tag missing proof files → Generate page with "Missing files" chips (don't crash)
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import process from 'node:process';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { escapeHtml, extractFirstUrl, markdownToHtml } from './utils/markdown.js';
import { emitEvent } from '../scripts/emit.js';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const templatesDir = path.join(__dirname, 'templates');
const tokensPath = path.join(rootDir, 'public', 'styles', 'tokens.css');

const TAG_PATTERN = /^(evidence-sprint|ac-green)_([a-z0-9-]+)_(\d{4}-\d{2}-\d{2})$/i;
const TYPE_LABEL = {
  'evidence-sprint': 'Evidence sprint',
  'ac-green': 'AC green'
};
const BADGE_ICON = {
  'evidence-sprint': '●',
  'ac-green': '●'
};

function parseArgs(argv) {
  const options = { out: path.join('public', 'proof'), limit: null, json: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--out' && argv[i + 1]) {
      options.out = argv[++i];
    } else if (arg === '--limit' && argv[i + 1]) {
      options.limit = Number.parseInt(argv[++i], 10);
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--no-json') {
      options.json = false;
    }
  }
  return options;
}

async function git(args) {
  try {
    const { stdout } = await execFileAsync('git', args, { cwd: rootDir, encoding: 'utf8' });
    return stdout.trim();
  } catch (error) {
    throw new Error(`Git command failed: git ${args.join(' ')}\n${error.stderr || error.message}`);
  }
}

function parseTagName(tag) {
  const match = tag.match(TAG_PATTERN);
  if (!match) {
    return null;
  }
  const [, typeRaw, featureRaw, date] = match;
  const type = typeRaw.toLowerCase();
  const feature = featureRaw.toLowerCase();
  return { tag, type, feature, date, sortKey: date, featureLabel: featureRaw };
}

async function readProofFile(tag, file) {
  try {
    const content = await git(['show', `${tag}:${path.posix.join('proof', file)}`]);
    return content;
  } catch (error) {
    const message = String(error.stderr || error.message || '');
    if (
      /exists on disk, but not in/.test(message) ||
      /fatal: Path /.test(message) ||
      /does not have these files/.test(message) ||
      /fatal: invalid object name/.test(message) ||
      /fatal: bad revision/.test(message)
    ) {
      return null;
    }
    throw error;
  }
}

async function resolveTagEntry(tagInfo) {
  const { tag, type, feature, date } = tagInfo;
  const ac = await readProofFile(tag, 'AC.md');
  const demo = await readProofFile(tag, 'DEMO.md');
  const delta = await readProofFile(tag, 'DELTA.md');

  const commit = await git(['rev-parse', '--short', tag]);

  const acHtml = ac ? markdownToHtml(ac) : '';
  const demoHtml = demo ? markdownToHtml(demo) : '';
  const deltaHtml = delta ? markdownToHtml(delta) : '';
  const demoUrl = demo ? extractFirstUrl(demo) : null;

  const missingFiles = [];
  if (!ac) missingFiles.push('AC.md');
  if (!demo) missingFiles.push('DEMO.md');
  if (!delta) missingFiles.push('DELTA.md');

  return {
    tag,
    type,
    feature,
    featureLabel: tagInfo.featureLabel,
    date,
    commit,
    ac: { markdown: ac, html: acHtml, missing: !ac },
    demo: { markdown: demo, html: demoHtml, missing: !demo, url: demoUrl },
    delta: { markdown: delta, html: deltaHtml, missing: !delta },
    missingFiles
  };
}

function renderTemplate(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
    return data[key] ?? '';
  });
}

function buildIndexContent(entries, totalEntries) {
  if (entries.length === 0) {
    return `
      <section class="empty">
        <div class="card">
          <h2>No proof tags yet</h2>
          <p class="muted">Add git tags named <code>evidence-sprint_*</code> or <code>ac-green_*</code> with proof markdown to populate this log.</p>
        </div>
      </section>
    `;
  }

  const items = entries
    .map((entry) => {
      const dotClass = entry.type === 'ac-green' ? 'dot-green' : 'dot-evidence';
      const displayFeature = escapeHtml(entry.featureLabel || entry.feature);
      const dateLabel = escapeHtml(entry.date);
      return `
        <li data-type="${entry.type}" data-feature="${entry.feature}">
          <span class="dot ${dotClass}" aria-hidden="true"></span>
          <div class="entry">
            <a href="./${entry.tag}/index.html">${escapeHtml(entry.tag)}</a>
            <small class="muted">${dateLabel} • ${displayFeature}</small>
          </div>
        </li>
      `;
    })
    .join('\n');

  return `
    <section>
      <header class="list-head">
        <h2>Latest ${entries.length} of ${totalEntries}</h2>
      </header>
      <ul class="proof-list">
        ${items}
      </ul>
    </section>
  `;
}

function buildFilterScript() {
  return `(() => {
    const list = document.querySelectorAll('.proof-list li');
    const typeSelect = document.getElementById('typeFilter');
    const featureInput = document.getElementById('featureFilter');
    const emptyState = document.createElement('p');
    emptyState.className = 'muted empty-msg';
    emptyState.textContent = 'No entries match the current filters.';

    const parent = document.querySelector('.proof-list');

    function ensureEmptyState(visible) {
      if (!parent) return;
      const existing = parent.parentElement?.querySelector('.empty-msg');
      if (!visible) {
        if (!existing) {
          parent.parentElement?.appendChild(emptyState);
        }
      } else if (existing) {
        existing.remove();
      }
    }

    function applyFilters() {
      let visibleCount = 0;
      const typeValue = typeSelect?.value ?? 'all';
      const featureValue = (featureInput?.value ?? '').toLowerCase();
      list.forEach((item) => {
        const matchesType = typeValue === 'all' || item.dataset.type === typeValue;
        const matchesFeature = !featureValue || item.dataset.feature.includes(featureValue);
        const show = matchesType && matchesFeature;
        item.style.display = show ? '' : 'none';
        if (show) visibleCount += 1;
      });
      ensureEmptyState(visibleCount > 0);
    }

    typeSelect?.addEventListener('change', applyFilters);
    featureInput?.addEventListener('input', applyFilters);
  })();`;
}

function buildMissingChips(missingFiles) {
  if (!missingFiles.length) {
    return '';
  }
  const chips = missingFiles
    .map((file) => `<span class="chip chip-missing">Missing ${escapeHtml(file)}</span>`)
    .join('\n');
  return `<div class="chip-row">${chips}</div>`;
}

function ensureBody(content, fallback) {
  if (content && content.trim()) {
    return content;
  }
  return `<p class="muted">${escapeHtml(fallback)}</p>`;
}

async function writeDetailPage(outDir, entry) {
  const template = await fs.readFile(path.join(templatesDir, 'detail.html'), 'utf8');
  const badgeLabel = `${TYPE_LABEL[entry.type]} · ${entry.tag}`;
  const data = {
    pageTitle: `${entry.tag} • Proof`,
    stylesheet: '../proof.css',
    type: entry.type,
    badgeIcon: BADGE_ICON[entry.type],
    badgeLabel: escapeHtml(badgeLabel),
    typeLabel: TYPE_LABEL[entry.type],
    date: escapeHtml(entry.date),
    feature: escapeHtml(entry.featureLabel || entry.feature),
    demoCta: entry.demo.url
      ? `<p><a class="cta" href="${escapeHtml(entry.demo.url)}" target="_blank" rel="noopener noreferrer">Watch 90s demo →</a></p>`
      : '',
    missingChips: buildMissingChips(entry.missingFiles),
    acBody: ensureBody(entry.ac.html, 'AC.md was not provided in this tag.'),
    demoBody: ensureBody(entry.demo.html, 'DEMO.md was not provided in this tag.'),
    deltaBody: ensureBody(entry.delta.html, 'DELTA.md was not provided in this tag.'),
    tag: escapeHtml(entry.tag),
    commit: escapeHtml(entry.commit)
  };

  const html = renderTemplate(template, data);
  const tagDir = path.join(outDir, entry.tag);
  await fs.mkdir(tagDir, { recursive: true });
  await fs.writeFile(path.join(tagDir, 'index.html'), html, 'utf8');
}

async function writeIndexPage(outDir, entries) {
  const template = await fs.readFile(path.join(templatesDir, 'index.html'), 'utf8');
  const latest = entries.slice(0, Math.min(entries.length, 10));
  const content = buildIndexContent(latest, entries.length);
  const script = entries.length ? buildFilterScript() : '';
  const html = renderTemplate(template, {
    content,
    script
  });
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'index.html'), html, 'utf8');
}

async function writeJson(outDir, entries) {
  const json = entries.map((entry) => ({
    tag: entry.tag,
    type: entry.type,
    date: entry.date,
    feature: entry.feature,
    featureLabel: entry.featureLabel,
    commit: entry.commit,
    demoUrl: entry.demo.url,
    files: {
      AC: entry.ac.missing ? null : `/proof/${entry.tag}/index.html#ac`,
      DEMO: entry.demo.missing ? null : `/proof/${entry.tag}/index.html#demo`,
      DELTA: entry.delta.missing ? null : `/proof/${entry.tag}/index.html#delta`
    }
  }));
  const serialized = `${JSON.stringify({ entries: json }, null, 2)}\n`;
  await fs.writeFile(path.join(outDir, 'index.json'), serialized, 'utf8');
}

async function writeStyles(outDir) {
  const tokens = await fs.readFile(tokensPath, 'utf8');
  const customCss = `
main { max-width: 960px; margin: 0 auto; padding: var(--slk-gap-6) var(--slk-gap-5) var(--slk-gap-6); }
.header { display: flex; flex-direction: column; gap: var(--slk-gap-3); margin-bottom: var(--slk-gap-5); }
.stack { display: flex; flex-direction: column; gap: var(--slk-gap-3); margin-bottom: var(--slk-gap-6); }
.lead { color: var(--slk-muted); }
.muted { color: var(--slk-muted); }
.legend { display: grid; grid-template-columns: auto auto; gap: var(--slk-gap-2) var(--slk-gap-4); align-items: center; margin-top: var(--slk-gap-2); }
.filters { display: flex; flex-wrap: wrap; gap: var(--slk-gap-4); margin-top: var(--slk-gap-4); }
.filters label { display: flex; flex-direction: column; gap: var(--slk-gap-2); }
.filters select, .filters input { background: var(--slk-surface); border: 1px solid rgba(230, 234, 242, 0.08); border-radius: 8px; padding: 10px 12px; color: var(--slk-text); }
.proof-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--slk-gap-3); }
.proof-list li { display: flex; align-items: center; gap: var(--slk-gap-3); background: var(--slk-surface); padding: var(--slk-gap-3) var(--slk-gap-4); border-radius: var(--slk-radius); border: 1px solid rgba(230,234,242,0.05); }
.proof-list a { font-weight: 600; }
.dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
.dot-evidence { background: var(--slk-accent-2); }
.dot-green { background: var(--slk-success); }
.entry { display: flex; flex-direction: column; gap: 4px; }
.card { background: var(--slk-surface); border-radius: var(--slk-radius); padding: var(--slk-gap-5); border: 1px solid rgba(230,234,242,0.05); }
.badge { display: inline-flex; align-items: center; gap: var(--slk-gap-2); font-weight: 600; font-size: 0.875rem; padding: 6px 12px; border-radius: 999px; }
.badge-evidence-sprint { color: var(--slk-accent-2); background: rgba(100, 168, 255, 0.16); border: 1px solid rgba(100,168,255,0.4); }
.badge-ac-green { color: var(--slk-success); background: rgba(92,226,126,0.14); border: 1px solid rgba(92,226,126,0.35); }
.cta { background: var(--slk-accent-2); color: #0B1020; border-radius: 8px; padding: 12px 16px; display: inline-flex; align-items: center; font-weight: 600; }
.metrics ul { margin: 0; padding-left: 1.25rem; }
.metrics li { margin-bottom: var(--slk-gap-2); }
.chip-row { display: flex; flex-wrap: wrap; gap: var(--slk-gap-2); }
.chip { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.chip-missing { background: rgba(255,93,93,0.18); color: #ff9a9a; border: 1px solid rgba(255,93,93,0.4); }
.prose ul { padding-left: 1.25rem; }
.prose pre { background: rgba(21,26,33,0.8); padding: var(--slk-gap-3); border-radius: 8px; overflow-x: auto; }
.footer { margin-top: var(--slk-gap-6); }
.empty .card { text-align: center; }
.list-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--slk-gap-3); }
.empty-msg { margin-top: var(--slk-gap-3); }
@media (max-width: 720px) {
  .proof-list li { flex-direction: column; align-items: flex-start; }
  .filters { flex-direction: column; align-items: flex-start; }
}
`;

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'proof.css'), `${tokens}\n${customCss}`, 'utf8');
}

async function collectEntries(limit = null) {
  const tagListRaw = await git(['tag', '--list', 'evidence-sprint_*', 'ac-green_*']);
  const tags = tagListRaw ? tagListRaw.split('\n').map((tag) => tag.trim()).filter(Boolean) : [];
  const parsed = [];
  const skipped = [];

  for (const tag of tags) {
    const info = parseTagName(tag);
    if (!info) {
      skipped.push(tag);
      continue;
    }
    parsed.push(info);
  }

  parsed.sort((a, b) => {
    if (a.sortKey === b.sortKey) {
      return b.tag.localeCompare(a.tag);
    }
    return b.sortKey.localeCompare(a.sortKey);
  });

  const limited = typeof limit === 'number' && Number.isFinite(limit) && limit > 0
    ? parsed.slice(0, limit)
    : parsed;

  const entries = [];
  for (const info of limited) {
    const entry = await resolveTagEntry(info);
    entries.push(entry);
  }

  return { entries, skipped };
}

export async function generateProofSite(options = {}) {
  const { out: outArg = path.join('public', 'proof'), limit = null, json } = options;
  const outDir = path.isAbsolute(outArg) ? outArg : path.join(rootDir, outArg);

  const { entries, skipped } = await collectEntries(limit);

  if (skipped.length) {
    console.warn(`[proofgen] Skipped ${skipped.length} malformed tag(s): ${skipped.join(', ')}`);
  }

  await writeStyles(outDir);
  await writeIndexPage(outDir, entries);

  for (const entry of entries) {
    await writeDetailPage(outDir, entry);
  }

  const shouldWriteJson = json ?? true;
  if (shouldWriteJson) {
    await writeJson(outDir, entries);
  }

  await emitEvent('site.proof_updated@1.0', {
    count: entries.length,
    last_tag: entries[0]?.tag ?? null,
    ts: new Date().toISOString()
  });

  console.log(`[proofgen] Generated ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} in ${path.relative(rootDir, outDir) || '.'}`);
}

async function runCli() {
  const options = parseArgs(process.argv.slice(2));
  if (options.limit !== null && (!Number.isFinite(options.limit) || options.limit <= 0)) {
    console.warn('[proofgen] Ignoring invalid --limit value');
    options.limit = null;
  }
  try {
    await generateProofSite(options);
  } catch (error) {
    console.error('[proofgen] Failed to generate proof site:', error.message);
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (invokedPath && invokedPath === import.meta.url) {
  runCli();
}
