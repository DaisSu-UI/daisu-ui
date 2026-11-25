import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, readFile, writeFile, rm, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkAiDocs } from './check-ai-docs.mjs';

test('AI documentation validation catches tampering, missing files and invalid manifests', async t => {
  const root = await mkdtemp(join(tmpdir(), 'daisu-ai-docs-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(new URL('./ai/', import.meta.url), root, { recursive: true });
  assert.equal((await checkAiDocs(root)).package, '@daisu-ui/cli');
  const file = join(root, 'mcp.md'), original = await readFile(file, 'utf8');
  await writeFile(file, original + '\nmanual change');
  await assert.rejects(checkAiDocs(root), /mcp.md/);
  await writeFile(file, original);
  await unlink(file);
  await assert.rejects(checkAiDocs(root), /ENOENT/);
  await writeFile(file, original);
  const manifestPath = join(root, 'cli-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest.files['../other.md'] = 'bad';
  await writeFile(manifestPath, JSON.stringify(manifest));
  await assert.rejects(checkAiDocs(root), /清单无效/);
});
