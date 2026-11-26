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
  for (const name of ['CI', 'CI_COMMIT_TAG', 'CI_PROJECT_URL', 'GITLAB_CI', 'GITHUB_ACTIONS', 'GITHUB_REF', 'RELEASE_SOURCE_REMOTE', 'GIT_RELEASE_REMOTE', 'GIT_RELEASE_SSH_KEY', 'GIT_RELEASE_KNOWN_HOSTS']) delete env[name];
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
    for (const name of ['release-environment.mjs', 'check-release-source.mjs', 'prepare-git-package.mjs', 'publish-git-package.mjs']) cpSync(join(scripts, name), join(source, 'scripts', name));
    save(join(source, 'package.json'), { name: 'fixture', private: true, workspaces: ['packages/*'] });
    save(join(source, 'packages/daisu-ui/package.json'), {
      name: '@daisu-ui/ui', version: '1.2.3', type: 'module', main: './dist/index.js', types: './dist/index.d.ts',
      files: ['dist'], scripts: { prepack: 'exit 77', prepare: 'exit 78' }, devDependencies: { 'never-install-development-package': '1.0.0' },
      publishConfig: { registry: 'https://registry.npmjs.org/' },
    });
    writeFileSync(join(source, '.gitignore'), 'artifacts/\nnode_modules/\n.npm/\n');
    writeFileSync(join(source, 'packages/daisu-ui/dist/index.js'), 'export const fixture = 42;\n');
    writeFileSync(join(source, 'packages/daisu-ui/dist/index.d.ts'), 'export declare const fixture: number;\n');
    writeFileSync(join(source, 'packages/daisu-ui/dist/Button.jsx'), 'export const Button = () => <view />;\n');
    writeFileSync(join(source, 'packages/daisu-ui/dist/styles.css'), '.button { color: red; }\n');
    git('init', '-b', 'developer');
    git('config', 'user.name', 'Fixture');
    git('config', 'user.email', 'fixture@example.invalid');
    git('config', 'commit.gpgsign', 'false');
    git('add', '.');
    git('commit', '-m', 'fixture');
    run('git', ['init', '--bare', remote], temporary);
    git('remote', 'add', 'origin', remote);
    assert.throws(() => execute('check-release-source.mjs', '--require-main'), /无法读取 origin\/main/);
    git('push', 'origin', 'HEAD:refs/heads/main');

    // With both remotes configured, an accepted GitLab commit cannot substitute
    // for acceptance in GitHub. Explicit overrides still select the named remote.
    const githubRemote = join(temporary, 'github.git');
    run('git', ['init', '--bare', githubRemote], temporary);
    git('remote', 'add', 'gitcode', remote);
    git('remote', 'add', 'github', githubRemote);
    assert.throws(() => execute('check-release-source.mjs', '--require-main'), /无法读取 github\/main/);
    assert.match(run(process.execPath, [join(source, 'scripts/check-release-source.mjs'), '--require-main'], source, { RELEASE_SOURCE_REMOTE: 'origin' }), /origin\/main/);
    git('push', 'github', 'HEAD:refs/heads/main');
    assert.match(execute('check-release-source.mjs', '--require-main'), /github\/main/);
    assert.throws(() => run(process.execPath, [join(source, 'scripts/check-release-source.mjs'), '--require-main'], source, { RELEASE_SOURCE_REMOTE: '--invalid' }), /必须为 Git 远程名称/);
    git('remote', 'remove', 'github');
    git('remote', 'remove', 'gitcode');

    // 开发提交尚未合入 main 时，CI 和本地发布都必须拒绝。
    git('switch', '-c', 'feature/unmerged');
    git('commit', '--allow-empty', '-m', 'unmerged development');
    execute('prepare-git-package.mjs');
    assert.throws(() => execute('check-release-source.mjs', '--require-main'), /必须已合并到 origin\/main/);
    assert.throws(() => execute('publish-git-package.mjs'), /必须已合并到 origin\/main/);
    assert.throws(() => run(process.execPath, [join(source, 'scripts/prepare-git-package.mjs')], source, { CI_COMMIT_TAG: 'v1.2.3' }), /必须已合并到 origin\/main/);
    git('switch', 'developer');

    execute('prepare-git-package.mjs');
    const prepared = json(join(source, 'artifacts/git-package/package.json'));
    assert.equal(prepared.name, '@daisu-ui/ui');
    assert.equal(prepared.scripts, undefined);
    assert.equal(prepared.devDependencies, undefined);
    assert.equal(prepared.publishConfig, undefined);
    assert.equal(prepared.private, true);
    assert(!existsSync(join(source, 'artifacts/git-package/scripts')));
    assert.match(execute('publish-git-package.mjs', '--dry-run'), /预演通过/);
    assert.equal(git('ls-remote', 'origin', 'refs/heads/npm-dist', 'refs/tags/npm-v1.2.3'), '');
    execute('publish-git-package.mjs');
    run('git', ['--git-dir', remote, 'symbolic-ref', 'HEAD', 'refs/heads/npm-dist']);
    const first = git('ls-remote', '--heads', 'origin', 'npm-dist').split('\t')[0];
    assert.throws(() => execute('publish-git-package.mjs'), /已存在/);

    save(join(consumer, 'package.json'), { name: 'consumer', private: true });
    run('npm', ['install', '--offline', '--no-audit', '--no-fund', `git+file://${remote}#npm-v1.2.3`], consumer);
    assert.equal(json(join(consumer, 'node_modules/@daisu-ui/ui/package.json')).version, '1.2.3');
    assert(existsSync(join(consumer, 'node_modules/@daisu-ui/ui/dist/Button.jsx')));
    assert(!existsSync(join(consumer, 'node_modules/@daisu-ui/ui/scripts')));
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
    // 本地跟踪引用即使被提前指向开发提交，也要以远端 main 为准。
    git('update-ref', 'refs/remotes/origin/main', git('rev-parse', 'HEAD'));
    assert.throws(() => execute('publish-git-package.mjs'), /必须已合并到 origin\/main/);
    git('push', 'origin', 'HEAD:refs/heads/main');
    execute('publish-git-package.mjs');
    run('git', ['--git-dir', remote, 'merge-base', '--is-ancestor', first, 'refs/heads/npm-dist']);
    const tags = git('ls-remote', '--tags', 'origin');
    assert(tags.includes('refs/tags/npm-v1.2.3'));
    assert(tags.includes('refs/tags/npm-v1.2.4'));
    // 旧的发布提交仍在 main 历史中：浅克隆须补全历史后正确放行。
    git('push', 'origin', 'HEAD:refs/heads/accepted-release');
    git('commit', '--allow-empty', '-m', 'main advanced after accepted release');
    git('push', 'origin', 'HEAD:refs/heads/main');
    const shallow = join(temporary, 'shallow');
    run('git', ['clone', '--depth=1', '--branch', 'accepted-release', `file://${remote}`, shallow]);
    assert.equal(run('git', ['rev-parse', '--is-shallow-repository'], shallow).trim(), 'true');
    assert.match(run(process.execPath, [join(shallow, 'scripts/check-release-source.mjs'), '--require-main'], shallow), /发布来源校验通过/);
    assert.equal(run('git', ['rev-parse', '--is-shallow-repository'], shallow).trim(), 'false');
    assert.throws(() => execute('publish-git-package.mjs'), /产物源码已过期/);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
