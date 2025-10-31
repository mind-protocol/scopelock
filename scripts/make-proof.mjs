#!/usr/bin/env node
import process from 'node:process';

import { generateProofSite } from '../proofgen/index.js';

async function run() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--limit' && args[i + 1]) {
      options.limit = Number.parseInt(args[++i], 10);
    } else if (arg === '--out' && args[i + 1]) {
      options.out = args[++i];
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--no-json') {
      options.json = false;
    }
  }

  try {
    await generateProofSite(options);
  } catch (error) {
    console.error('[make-proof] Generation failed:', error);
    process.exitCode = 1;
  }
}

run();
