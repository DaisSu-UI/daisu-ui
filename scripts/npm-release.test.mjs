import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { npmReleaseTag } from './publish-npm-package.mjs';

test('npm 预发布使用 beta，正式版使用 latest，预发布不能占用 latest', () => {
  assert.equal(npmReleaseTag('1.2.3-beta.0'), 'beta');
  assert.equal(npmReleaseTag('1.2.3'), 'latest');
  assert.equal(npmReleaseTag('1.2.3-rc.0', 'next'), 'next');
  assert.throws(() => npmReleaseTag('1.2.3-beta.0', 'latest'), /不能使用 latest/);
  assert.throws(() => npmReleaseTag('1.2.3', 'bad tag'), /格式无效/);
});

test('npm 只打包 UI 库，拒绝额外工程文件、未合并提交和被修改的产物', () => {
  const temporary = mkdtempSync(join(tmpdir(), 'daisu-npm-release-test-'));
  const source = join(temporary, 'source');
  const remote = join(temporary, 'remote.git');
  const scripts = fileURLToPath(new URL('.', import.meta.url));
  const env = { ...process.env, npm_config_offline: 'true', npm_config_cache: join(temporary, 'cache'), npm_config_userconfig: join(temporary, 'npmrc') };
  for (const key of ['CI', 'CI_COMMIT_TAG', 'NPM_TOKEN', 'NODE_AUTH_TOKEN']) delete env[key];
  const run = (command, args, cwd = source) => execFileSync(command, args, { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const git = (...args) => run('git', args).trim();
  const execute = (name, ...args) => run(process.execPath, [join(source, 'scripts', name), ...args]);
  const save = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
  try {
    mkdirSync(join(source, 'scripts'), { recursive: true });
    mkdirSync(join(source, 'packages/daisu-ui/dist'), { recursive: true });
    mkdirSync(join(source, 'apps/demo'), { recursive: true });
    writeFileSync(env.npm_config_userconfig, '');
    save(join(source, 'package.json'), { name: 'fixture', private: true, workspaces: ['packages/*', 'apps/*'] });
    save(join(source, 'apps/demo/package.json'), { name: 'private-demo', private: true });
    const metadata = { name: '@daisu-ui/ui', version: '1.2.3-beta.0', files: ['dist'], scripts: { prepack: 'exit 77' }, publishConfig: { access: 'public' } };
    const metadataPath = join(source, 'packages/daisu-ui/package.json');
    save(metadataPath, metadata);
    writeFileSync(join(source, '.gitignore'), 'artifacts/\n');
    writeFileSync(join(source, 'packages/daisu-ui/dist/index.js'), 'export const fixture = true;\n');
    writeFileSync(join(source, 'packages/daisu-ui/dist/Button.jsx'), 'export const Button = () => <view />;\n');
    for (const name of ['check-release-source.mjs', 'prepare-npm-package.mjs', 'publish-npm-package.mjs']) cpSync(join(scripts, name), join(source, 'scripts', name));
    git('init', '-b', 'developer');
    git('config', 'user.name', 'Fixture');
    git('config', 'user.email', 'fixture@example.invalid');
    git('config', 'commit.gpgsign', 'false');
    git('add', '.');
    git('commit', '-m', 'fixture');
    run('git', ['init', '--bare', remote], temporary);
    git('remote', 'add', 'origin', remote);
    git('push', 'origin', 'HEAD:refs/heads/main');
    execute('prepare-npm-package.mjs');
    const release = JSON.parse(readFileSync(join(source, 'artifacts/npm-release.json'), 'utf8'));
    assert.equal(release.name, '@daisu-ui/ui');
    assert(release.files.includes('dist/Button.jsx'));
    assert(!release.files.some(path => /^(?:apps|docs|scripts)\//.test(path)));
    const archive = join(source, 'artifacts', release.filename);
    const bytes = readFileSync(archive);
    writeFileSync(archive, Buffer.concat([bytes, Buffer.from('modified')]));
    assert.throws(() => execute('publish-npm-package.mjs', '--dry-run'), /校验和不匹配/);
    writeFileSync(archive, bytes);
    assert.match(execute('publish-npm-package.mjs', '--dry-run'), /dist-tag=beta/);
    git('switch', '-c', 'feature/unmerged');
    git('commit', '--allow-empty', '-m', 'unmerged');
    execute('prepare-npm-package.mjs');
    assert.throws(() => execute('publish-npm-package.mjs', '--dry-run'), /必须已合并到 origin\/main/);
    git('switch', 'developer');
    const docs = join(source, 'packages/daisu-ui/docs');
    mkdirSync(docs);
    writeFileSync(join(docs, 'site.md'), 'Not part of the UI package.');
    save(metadataPath, { ...metadata, files: ['dist', 'docs'] });
    assert.throws(() => execute('prepare-npm-package.mjs'), /混入了 Demo、文档站、CLI/);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
