import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, writeFile, mkdir, readFile, access, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { packSite } from './docs-release.mjs';

test('root publishing preserves Git metadata, mirrors verified files and rejects corruption', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'daisu-root-pages-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const remote = join(directory, 'remote.git');
  const target = join(directory, 'target');
  const source = join(directory, 'source');
  const site = join(directory, 'site');
  const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git(directory, 'init', '--bare', '--initial-branch=main', remote);
  git(directory, 'clone', remote, target);
  git(target, 'config', 'user.name', 'Root Pages test');
  git(target, 'config', 'user.email', 'root-pages@example.test');
  await writeFile(join(target, 'README.md'), 'Initial site');
  git(target, 'add', '.');
  git(target, 'commit', '-m', 'Initialize the publication repository');
  git(target, 'push', 'origin', 'main');
  await mkdir(source);
  for (const name of ['index.html', 'content.json', 'search-index.json', 'llms.txt', '.nojekyll']) {
    await writeFile(join(source, name), name === '.nojekyll' ? '' : name);
  }
  await packSite({ source, output: site, id: 'root-test', version: 'test' });
  const root = fileURLToPath(new URL('../', import.meta.url));
  const publish = () => spawnSync('bash', ['ops/publish-root-pages.sh', site, target], {
    cwd: root, encoding: 'utf8', env: { ...process.env, GITHUB_SHA: 'root-test' },
  });
  let result = publish();
  assert.equal(result.status, 0, result.stderr);
  await access(join(target, '.git', 'config'));
  await assert.rejects(access(join(target, 'README.md')));
  assert.equal(await readFile(join(target, 'index.html'), 'utf8'), 'index.html');
  assert.equal(git(directory, '--git-dir', remote, 'show', 'main:.nojekyll'), '');
  const commit = git(target, 'rev-parse', 'HEAD');
  assert.equal(git(directory, '--git-dir', remote, 'rev-parse', 'main'), commit);
  result = publish();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(git(target, 'rev-parse', 'HEAD'), commit, 'identical artifacts must not create a new commit');
  await writeFile(join(site, 'index.html'), 'corrupted');
  result = publish();
  assert.notEqual(result.status, 0);
  assert.equal(await readFile(join(target, 'index.html'), 'utf8'), 'index.html');
  assert.equal(git(directory, '--git-dir', remote, 'rev-parse', 'main'), commit);
});
