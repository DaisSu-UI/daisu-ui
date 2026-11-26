import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { verifySite } from './docs-release.mjs';

const defaultSource = 'https://daissu-ui.github.io/daisu-ui/';
async function readManifest(base, optional = false) {
  const response = await fetch(new URL('site-manifest.json', base), { signal: AbortSignal.timeout(30000), cache: 'no-store' });
  if (optional && response.status === 404) return null;
  if (!response.ok) throw Error(`Site manifest request failed: ${response.status}`);
  const manifest = await response.json();
  if (manifest.schemaVersion !== 1 || typeof manifest.id !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,100}$/.test(manifest.id) || manifest.id.includes('..') || typeof manifest.version !== 'string' || !manifest.files || Array.isArray(manifest.files)) throw Error('Invalid source site manifest');
  for (const [path, hash] of Object.entries(manifest.files)) {
    if (!path || path.startsWith('/') || path.includes('\\') || /[?#]/.test(path) || path.split('/').some(part => !part || part === '.' || part === '..' || part === '.git') || !/^[a-f0-9]{64}$/.test(hash)) throw Error('Invalid source resource path or digest');
  }
  return manifest;
}

/** Mirror the public, verified project artifact using the root site's own token. */
export async function pullProjectSite({ source = defaultSource, current, output }) {
  const manifest = await readManifest(source);
  const previous = current ? await readManifest(current, true) : null;
  if (previous && JSON.stringify(previous) === JSON.stringify(manifest)) return { changed: false, id: manifest.id };
  output = resolve(output);
  await mkdir(dirname(output), { recursive: true });
  const temporary = await mkdtemp(resolve(dirname(output), '.root-site-'));
  try {
    const entries = Object.entries(manifest.files);
    let index = 0;
    const downloads = await Promise.allSettled(Array.from({ length: Math.min(8, entries.length) }, async () => {
      while (index < entries.length) {
        const [name, hash] = entries[index++];
        const path = resolve(temporary, name);
        if (!path.startsWith(temporary + sep)) throw Error('Resource escapes site directory');
        let bytes;
        if (name === '.nojekyll') bytes = Buffer.alloc(0);
        else {
          const url = new URL(name.split('/').map(encodeURIComponent).join('/'), source);
          url.searchParams.set('release', manifest.id);
          const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
          if (!response.ok) throw Error(`Site resource request failed: ${name} (${response.status})`);
          bytes = Buffer.from(await response.arrayBuffer());
        }
        if (createHash('sha256').update(bytes).digest('hex') !== hash) throw Error(`Site resource integrity check failed: ${name}`);
        await mkdir(dirname(path), { recursive: true });
        await writeFile(path, bytes);
      }
    }));
    const failure = downloads.find(result => result.status === 'rejected');
    if (failure) throw failure.reason;
    await writeFile(resolve(temporary, 'site-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    await verifySite(temporary);
    await rename(temporary, output);
    return { changed: true, id: manifest.id };
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: { source: { type: 'string' }, current: { type: 'string' }, output: { type: 'string' } } });
  if (!values.output) throw Error('--output is required');
  const result = await pullProjectSite(values);
  if (process.env.GITHUB_OUTPUT) {
    const { appendFile } = await import('node:fs/promises');
    await appendFile(process.env.GITHUB_OUTPUT, `changed=${result.changed}\nid=${result.id}\n`);
  }
  console.log(`Organization site: ${result.changed ? 'verified new artifact' : 'already current'} (${result.id})`);
}
