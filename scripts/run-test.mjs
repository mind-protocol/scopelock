#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

try {
  console.log('Running acceptance tests...');
  const { stdout, stderr } = await execAsync('npx playwright test', {
    cwd: process.cwd(),
    env: { ...process.env, BASE_URL: process.env.BASE_URL || 'http://localhost:3000' }
  });

  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);

  console.log('✅ All acceptance tests passed');
  process.exit(0);
} catch (error) {
  console.error('❌ Acceptance tests failed');
  console.error(error.stdout || error.message);
  process.exit(1);
}
