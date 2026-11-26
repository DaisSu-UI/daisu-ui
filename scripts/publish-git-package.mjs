import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkReleaseSource } from './check-release-source.mjs';
import { assertPublishEnvironment, releaseTag } from './release-environment.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
assert(args.every(arg => arg === '--dry-run'), '仅支持 --dry-run 参数');
const dryRun = args.includes('--dry-run');
const git = (args, cwd = root, env = process.env) => execFileSync('git', args, { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
assert.equal(git(['status', '--porcelain']), '', '请先提交源码变更，再发布已验证的版本');
const sourceCommit = git(['rev-parse', 'HEAD']);
const directory = join(root, 'artifacts/git-package');
const metadata = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'));
const release = JSON.parse(readFileSync(join(directory, 'release.json'), 'utf8'));
const sourceMetadata = JSON.parse(readFileSync(join(root, 'packages/daisu-ui/package.json'), 'utf8'));
assert.equal(metadata.name, '@daisu-ui/ui');
assert.equal(metadata.version, sourceMetadata.version, '产物版本已过期，请重新校验并准备发布包');
assert.equal(release.sourceCommit, sourceCommit, '产物源码已过期，请重新校验并准备发布包');
assert.equal(release.version, metadata.version);
assert.equal(metadata.scripts, undefined, 'Git 安装包不能保留开发构建脚本');
assert(existsSync(join(directory, 'dist/index.js')), '缺少编译产物');
if (releaseTag()) assert.equal(releaseTag(), `v${metadata.version}`);
assertPublishEnvironment(metadata.version, sourceCommit);
if (process.env.CI || process.env.GITHUB_ACTIONS === 'true') {
  assert(process.env.GIT_RELEASE_SSH_KEY, '请配置有仓库写权限的 GIT_RELEASE_SSH_KEY');
}
const { remote: sourceRemote } = checkReleaseSource({ root });

const temporary = mkdtempSync(join(tmpdir(), 'daisu-git-release-'));
const repository = join(temporary, 'repository');
const env = { ...process.env };
try {
  if (env.GIT_RELEASE_SSH_KEY) {
    assert(env.GIT_RELEASE_KNOWN_HOSTS, '请配置 GIT_RELEASE_KNOWN_HOSTS，不能关闭主机身份校验');
    const key = join(temporary, 'key');
    const knownHosts = join(temporary, 'known_hosts');
    writeFileSync(key, env.GIT_RELEASE_SSH_KEY.replace(/\r/g, '').trim() + '\n', { mode: 0o600 });
    writeFileSync(knownHosts, env.GIT_RELEASE_KNOWN_HOSTS.trim() + '\n', { mode: 0o600 });
    env.GIT_SSH_COMMAND = `ssh -i '${key}' -o IdentitiesOnly=yes -o UserKnownHostsFile='${knownHosts}' -o StrictHostKeyChecking=yes`;
  }
  const remote = env.GIT_RELEASE_REMOTE || (env.GITHUB_ACTIONS === 'true' ? `git@github.com:${env.GITHUB_REPOSITORY}.git` : git(['remote', 'get-url', sourceRemote]));
  const branch = 'npm-dist';
  const tag = `npm-v${metadata.version}`;
  git(['init', repository], root, env);
  git(['config', 'user.name', 'Daisu UI Release'], repository, env);
  git(['config', 'user.email', 'daisu-ui-release@noreply.local'], repository, env);
  git(['config', 'commit.gpgsign', 'false'], repository, env);
  git(['remote', 'add', 'publish', remote], repository, env);
  const refs = git(['ls-remote', '--heads', '--tags', 'publish', `refs/heads/${branch}`, `refs/tags/${tag}`], repository, env);
  assert(!refs.split('\n').some(line => line.endsWith(`\trefs/tags/${tag}`)), `${tag} 已存在；请升级版本，不覆盖已发布版本`);
  const parent = refs.split('\n').find(line => line.endsWith(`\trefs/heads/${branch}`))?.split('\t')[0];
  if (parent) git(['fetch', '--depth=1', 'publish', `refs/heads/${branch}`], repository, env);
  cpSync(directory, repository, { recursive: true });
  git(['add', '--all'], repository, env);
  const tree = git(['write-tree'], repository, env);
  const commit = git(['commit-tree', tree, ...(parent ? ['-p', parent] : []), '-m', `release: daisu-ui ${metadata.version}\n\nSource: ${sourceCommit}`], repository, env);
  git(['update-ref', `refs/heads/${branch}`, commit], repository, env);
  git(['tag', '-a', tag, '-m', `Daisu UI ${metadata.version}; source ${sourceCommit}`, commit], repository, env);
  // 分支和版本 Tag 一起成功或一起失败，不强推、不覆盖已有版本。
  git(['push', ...(dryRun ? ['--dry-run'] : []), '--atomic', 'publish', `refs/heads/${branch}`, `refs/tags/${tag}`], repository, env);
  console.log(`${dryRun ? '预演通过，未推送' : '发布完成'}：${branch} / ${tag}`);
  const installUrl = remote.startsWith('git@') ? `git+ssh://${remote.replace(':', '/')}` : remote;
  console.log(`npm install "${installUrl}#${tag}"`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
