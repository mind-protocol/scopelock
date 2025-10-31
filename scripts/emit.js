#!/usr/bin/env node
import process from 'node:process';
import { pathToFileURL } from 'node:url';

async function loadEmitterFromModule(loader) {
  try {
    const mod = await loader();
    if (typeof mod === 'function') return mod;
    if (typeof mod?.emit === 'function') return mod.emit.bind(mod);
    if (typeof mod?.mp?.emit === 'function') return mod.mp.emit.bind(mod.mp);
  } catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      console.warn('Emitter candidate failed to load:', error.message);
    }
  }
  return null;
}

export async function emitEvent(eventName, payload = {}) {
  if (!eventName) {
    throw new Error('eventName is required');
  }

  const candidates = [
    () => loadEmitterFromModule(() => import('mind-protocol')),
    () => loadEmitterFromModule(() => import('../agents/mp.js'))
  ];

  for (const resolver of candidates) {
    const emitter = await resolver();
    if (emitter) {
      await emitter(eventName, payload);
      console.log(`[emit] ${eventName}`, payload);
      return true;
    }
  }

  console.log(`[emit] SDK absent → noop for "${eventName}"`, payload);
  return false;
}

async function runCli() {
  const [,, eventName, payloadArg] = process.argv;
  if (!eventName) {
    console.error('Usage: node scripts/emit.js <event-name> [payload-json]');
    process.exit(1);
  }

  let payload = {};
  if (payloadArg) {
    try {
      payload = JSON.parse(payloadArg);
    } catch (error) {
      console.warn('Invalid JSON payload provided. Falling back to empty object.', error.message);
    }
  }

  try {
    await emitEvent(eventName, payload);
  } catch (error) {
    console.error('Failed to emit event:', error);
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : undefined;
if (invokedPath && import.meta.url === invokedPath) {
  runCli();
}
