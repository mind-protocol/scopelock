#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const proofConfigPath = path.join(rootDir, 'proofgen', 'tags.json');
const proofOutputDir = path.join(rootDir, 'public', 'proof');

async function loadConfig() {
  const raw = await fs.readFile(proofConfigPath, 'utf-8');
  return JSON.parse(raw);
}

function renderHtml(config) {
  const { project, version, entries } = config;
  const items = entries
    .map(
      (entry) => `
        <article id="${entry.id}">
          <h2>${entry.title}</h2>
          <p>${entry.description}</p>
          <p><strong>Tags:</strong> ${entry.tags.join(', ')}</p>
          <p><small>${entry.timestamp}</small></p>
        </article>
      `
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${project} Proof Bundle</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 2rem; line-height: 1.6; }
      header { margin-bottom: 2rem; }
      article { border: 1px solid #cbd5f5; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1.5rem; background: #f8fafc; }
      h1 { margin: 0; }
      h2 { margin-top: 0; }
    </style>
  </head>
  <body>
    <header>
      <h1>${project} Proof Bundle</h1>
      <p>Version ${version}</p>
    </header>
    <section>
      ${items}
    </section>
  </body>
</html>`;
}

async function writeProof(config) {
  await fs.mkdir(proofOutputDir, { recursive: true });
  const html = renderHtml(config);
  await fs.writeFile(path.join(proofOutputDir, 'index.html'), html, 'utf-8');
  await fs.writeFile(
    path.join(proofOutputDir, 'entries.json'),
    JSON.stringify(config.entries, null, 2),
    'utf-8'
  );
  console.log(`Generated proof bundle with ${config.entries.length} entries.`);
}

async function main() {
  const config = await loadConfig();
  if (!config.entries || config.entries.length === 0) {
    throw new Error('Proof configuration must contain at least one entry.');
  }
  await writeProof(config);
}

main().catch((error) => {
  console.error('Failed to generate proof bundle:', error);
  process.exitCode = 1;
});
