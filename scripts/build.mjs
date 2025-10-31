#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { emitEvent } from './emit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'app');
const outDir = path.join(rootDir, 'public');

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function build() {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
  await copyDirectory(srcDir, outDir);
  console.log('Static site built to', outDir);
  try {
    await emitEvent('site.page_built@1.0', {
      path: '/',
      actor: 'agent:web',
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Unable to emit site.page_built@1.0:', error.message);
  }
}

build().catch((error) => {
  console.error('Build failed:', error);
  process.exitCode = 1;
});
