import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, writeFile, mkdir, readFile, rm, readdir, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { packSite } from './docs-release.mjs';
import { pullProjectSite } from './pull-project-site.mjs';

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'daisu-root-pages-'));
  const source = join(directory, 'source');
  const site = join(directory, 'verified');
  await mkdir(source);
  for (const name of ['index.html', 'content.json', 'search-index.json', 'llms.txt', '.nojekyll']) await writeFile(join(source, name), name === '.nojekyll' ? '' : name);
  const manifest = await packSite({ source, output: site, id: 'root-test', version: 'test' });
  const resources = new Map();
  for (const name of [...Object.keys(manifest.files), 'site-manifest.json']) resources.set('/source/' + name, await readFile(join(site, name)));
  let downloads = 0;
  const server = createServer((request, response) => {
    const path = new URL(request.url, 'http://localhost').pathname;
    if (path.startsWith('/source/') && !path.endsWith('/site-manifest.json')) downloads++;
    if (!resources.has(path)) { response.writeHead(404).end(); return; }
    response.end(resources.get(path));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await rm(directory, { recursive: true, force: true }); });
  const base = `http://127.0.0.1:${server.address().port}`;
  return { directory, resources, manifest, downloads: () => downloads, source: base + '/source/', current: base + '/current/' };
}

test('root site downloads verified public resources and skips an unchanged deployment', async t => {
  const f = await fixture(t);
  const output = join(f.directory, 'site');
  assert.deepEqual(await pullProjectSite({ source: f.source, current: f.current, output }), { changed: true, id: 'root-test' });
  assert.equal(await readFile(join(output, 'index.html'), 'utf8'), 'index.html');
  await access(join(output, '.nojekyll'));
  f.resources.set('/current/site-manifest.json', f.resources.get('/source/site-manifest.json'));
  const before = f.downloads();
  assert.deepEqual(await pullProjectSite({ source: f.source, current: f.current, output }), { changed: false, id: 'root-test' });
  assert.equal(f.downloads(), before);
});

test('corrupt downloads do not activate a partial site or replace existing files', async t => {
  const f = await fixture(t);
  const output = join(f.directory, 'site');
  await mkdir(output);
  await writeFile(join(output, 'index.html'), 'existing site');
  f.resources.set('/source/index.html', Buffer.from('corrupt'));
  await assert.rejects(pullProjectSite({ source: f.source, output }), /integrity/);
  assert.equal(await readFile(join(output, 'index.html'), 'utf8'), 'existing site');
  assert(!(await readdir(f.directory)).some(name => name.startsWith('.root-site-')));
});

test('invalid paths and failed resource requests cannot create a publication', async t => {
  const f = await fixture(t);
  const output = join(f.directory, 'site');
  f.resources.set('/source/site-manifest.json', Buffer.from(JSON.stringify({ ...f.manifest, files: { '../escape': '0'.repeat(64) } })));
  await assert.rejects(pullProjectSite({ source: f.source, output }), /Invalid source resource/);
  await assert.rejects(access(output));
  f.resources.set('/source/site-manifest.json', Buffer.from(JSON.stringify(f.manifest)));
  f.resources.delete('/source/llms.txt');
  await assert.rejects(pullProjectSite({ source: f.source, output }), /request failed/);
  await assert.rejects(access(output));
});
