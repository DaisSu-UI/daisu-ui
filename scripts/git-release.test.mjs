import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const scripts = fileURLToPath(new URL('.', import.meta.url));
test('Git 发布产物可由 npm 安装，更新保持历史，重复或过期版本不发布', () => {
  const temporary = mkdtempSync(join(tmpdir(), 'daisu-git-release-test-'));
  const source = join(temporary, 'source');
  const remote = join(temporary, 'remote.git');
  const consumer = join(temporary, 'consumer');
  const env = { ...process.env, npm_config_cache: join(temporary, 'npm-cache') };
  for (const name of ['CI', 'CI_COMMIT_TAG', 'CI_PROJECT_URL', 'GIT_RELEASE_REMOTE', 'GIT_RELEASE_SSH_KEY', 'GIT_RELEASE_KNOWN_HOSTS']) delete env[name];
  const run = (command, args, cwd = source, overrides = {}) => execFileSync(command, args, {
    cwd, env: { ...env, ...overrides }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  });
  const git = (...args) => run('git', args).trim();
  const execute = (name, ...args) => run(process.execPath, [join(source, 'scripts', name), ...args]);
  const json = path => JSON.parse(readFileSync(path, 'utf8'));
  const save = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
  try {
    mkdirSync(join(source, 'scripts'), { recursive: true });
    mkdirSync(join(source, 'packages/daisu-ui/dist'), { recursive: true });
    mkdirSync(consumer);
    for (const name of ['prepare-git-package.mjs', 'publish-git-package.mjs']) cpSync(join(scripts, name), join(source, 'scripts', name));
    save(join(source, 'package.json'), { name: 'fixture', private: true, workspaces: ['packages/*'] });
    save(join(source, 'packages/daisu-ui/package.json'), {
      name: 'daisu-ui', version: '1.2.3', type: 'module', main: './dist/index.js', types: './dist/index.d.ts',
      files: ['dist'], scripts: { prepack: 'exit 77', prepare: 'exit 78' }, devDependencies: { 'never-install-development-package': '1.0.0' },
      publishConfig: { registry: 'https://registry.npmjs.org/' },
    });
    writeFileSync(join(source, '.gitignore'), 'artifacts/\nnode_modules/\n.npm/\n');
    writeFileSync(join(source, 'packages/daisu-ui/dist/index.js'), 'export const fixture = 42;\n');
    writeFileSync(join(source, 'packages/daisu-ui/dist/index.d.ts'), 'export declare const fixture: number;\n');
    writeFileSync(join(source, 'packages/daisu-ui/dist/Button.jsx'), 'export const Button = () => <view />;\n');
    writeFileSync(join(source, 'packages/daisu-ui/dist/styles.css'), '.button { color: red; }\n');
    git('init');
    git('config', 'user.name', 'Fixture');
    git('config', 'user.email', 'fixture@example.invalid');
    git('config', 'commit.gpgsign', 'false');
    git('add', '.');
    git('commit', '-m', 'fixture');
    run('git', ['init', '--bare', remote], temporary);
    git('remote', 'add', 'origin', remote);

    execute('prepare-git-package.mjs');
    const prepared = json(join(source, 'artifacts/git-package/package.json'));
    assert.equal(prepared.name, 'daisu-ui');
    assert.equal(prepared.scripts, undefined);
    assert.equal(prepared.devDependencies, undefined);
    assert.equal(prepared.publishConfig, undefined);
    assert.equal(prepared.private, true);
    assert(!existsSync(join(source, 'artifacts/git-package/scripts')));
    assert.match(execute('publish-git-package.mjs', '--dry-run'), /预演通过/);
    assert.equal(git('ls-remote', 'origin'), '');
    execute('publish-git-package.mjs');
    run('git', ['--git-dir', remote, 'symbolic-ref', 'HEAD', 'refs/heads/npm-dist']);
    const first = git('ls-remote', '--heads', 'origin', 'npm-dist').split('\t')[0];
    assert.throws(() => execute('publish-git-package.mjs'), /已存在/);

    save(join(consumer, 'package.json'), { name: 'consumer', private: true });
    run('npm', ['install', '--offline', '--no-audit', '--no-fund', `git+file://${remote}#npm-v1.2.3`], consumer);
    assert.equal(json(join(consumer, 'node_modules/daisu-ui/package.json')).version, '1.2.3');
    assert(existsSync(join(consumer, 'node_modules/daisu-ui/dist/Button.jsx')));
    assert(!existsSync(join(consumer, 'node_modules/daisu-ui/scripts')));
    assert(!existsSync(join(consumer, 'node_modules/never-install-development-package')));

    writeFileSync(join(source, 'uncommitted.txt'), 'pending');
    assert.throws(() => execute('publish-git-package.mjs'), /请先提交源码变更/);
    rmSync(join(source, 'uncommitted.txt'));
    const metadataPath = join(source, 'packages/daisu-ui/package.json');
    save(metadataPath, { ...json(metadataPath), version: '1.2.4' });
    git('add', '.');
    git('commit', '-m', 'next version');
    assert.throws(() => execute('publish-git-package.mjs'), /产物版本已过期/);
    assert.throws(() => run(process.execPath, [join(source, 'scripts/prepare-git-package.mjs')], source, { CI_COMMIT_TAG: 'v9.9.9' }), /源码 Tag 必须与组件包版本一致/);
    execute('prepare-git-package.mjs');
    execute('publish-git-package.mjs');
    run('git', ['--git-dir', remote, 'merge-base', '--is-ancestor', first, 'refs/heads/npm-dist']);
    const tags = git('ls-remote', '--tags', 'origin');
    assert(tags.includes('refs/tags/npm-v1.2.3'));
    assert(tags.includes('refs/tags/npm-v1.2.4'));
    git('commit', '--allow-empty', '-m', 'source changed after prepare');
    assert.throws(() => execute('publish-git-package.mjs'), /产物源码已过期/);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
