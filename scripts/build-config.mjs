import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const envPath = resolve(root, '.env.local');
const configPath = resolve(root, 'config.js');

function parseEnv(contents) {
  const values = {};
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }
    const separator = line.indexOf('=');
    if (separator === -1) {
      continue;
    }
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
    values[key] = value;
  }
  return values;
}

function requireValue(values, key) {
  const value = values[key];
  if (!value || value.includes('YOUR_')) {
    throw new Error(`Set ${key} in .env.local before building config.js`);
  }
  return value;
}

try {
  const values = parseEnv(await readFile(envPath, 'utf8'));
  const supabaseUrl = requireValue(values, 'SUPABASE_URL');
  const supabaseAnonKey = requireValue(values, 'SUPABASE_ANON_KEY');
  const streamTable = values.SUPABASE_STREAM_TABLE || 'hkust_stream_logs';
  const parsedUrl = new URL(supabaseUrl);

  if (parsedUrl.protocol !== 'https:') {
    throw new Error('SUPABASE_URL must use HTTPS');
  }

  const config = `export const SUPABASE_URL = ${JSON.stringify(supabaseUrl.replace(/\/$/, ''))};\nexport const SUPABASE_ANON_KEY = ${JSON.stringify(supabaseAnonKey)};\nexport const STREAM_TABLE = ${JSON.stringify(streamTable)};\n`;
  await writeFile(configPath, config, 'utf8');
  console.log('Generated config.js for the unpacked extension.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
