import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkReleaseSource } from './check-release-source.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const registry = 'https://registry.npmjs.org/';

export function npmReleaseTag(version, requested) {
  const prerelease = version.includes('-');
  const tag = requested || (prerelease ? 'beta' : 'latest');
  assert.match(tag, /^[a-z][a-z0-9._-]*$/, 'npm dist-tag 格式无效');
  assert(!(prerelease && tag === 'latest'), '预发布版本不能使用 latest；请使用 beta 或 next');
  return tag;
}

export function publishNpmPackage(args = process.argv.slice(2)) {
  let dryRun = false, requested;
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--dry-run') dryRun = true;
    else if (args[index] === '--tag') { requested = args[++index]; assert(requested, '--tag 缺少值'); }
    else throw new Error('仅支持 --dry-run 和 --tag <标签> 参数');
  }
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  assert.equal(git(['status', '--porcelain']), '', '请先提交源码变更，再发布已验证的版本');
  const metadata = JSON.parse(readFileSync(join(root, 'packages/daisu-ui/package.json'), 'utf8'));
  const release = JSON.parse(readFileSync(join(root, 'artifacts/npm-release.json'), 'utf8'));
  assert.equal(metadata.name, '@daisu-ui/ui', '只允许发布 UI 库');
  assert.notEqual(metadata.private, true);
  assert.equal(release.name, metadata.name);
  assert.equal(release.version, metadata.version, 'npm 产物版本已过期，请重新校验并打包');
  assert.equal(release.sourceCommit, git(['rev-parse', 'HEAD']), 'npm 产物源码已过期，请重新校验并打包');
  assert.equal(release.filename, `daisu-ui-ui-${metadata.version}.tgz`);
  const archive = join(root, 'artifacts', release.filename);
  const integrity = `sha512-${createHash('sha512').update(readFileSync(archive)).digest('base64')}`;
  assert.equal(integrity, release.integrity, 'npm 产物校验和不匹配');
  checkReleaseSource({ root });
  if (process.env.CI) {
    assert.equal(process.env.CI_COMMIT_TAG, `v${metadata.version}`, 'CI 只允许从组件版本对应的源码 Tag 发布 npm');
    assert(process.env.NPM_TOKEN, '请在 GitLab Secret variables 中配置受保护的 NPM_TOKEN');
  }
  const tag = npmReleaseTag(metadata.version, requested);
  const temporary = mkdtempSync(join(tmpdir(), 'daisu-npm-auth-'));
  const env = { ...process.env };
  try {
    if (env.NPM_TOKEN) {
      const token = env.NPM_TOKEN.trim();
      assert(/^[A-Za-z0-9_-]+$/.test(token), 'NPM_TOKEN 格式无效');
      const userconfig = join(temporary, 'npmrc');
      writeFileSync(userconfig, `//registry.npmjs.org/:_authToken=${token}\n`, { mode: 0o600 });
      env.npm_config_userconfig = userconfig;
    }
    console.log(`${dryRun ? '预演' : '发布'} UI 库：${metadata.name}@${metadata.version}，dist-tag=${tag}`);
    execFileSync('npm', ['publish', archive, '--registry', registry, '--access', 'public', '--tag', tag, ...(dryRun ? ['--dry-run'] : [])], {
      cwd: root, env, stdio: 'inherit',
    });
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) publishNpmPackage();
