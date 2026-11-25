import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));

/** 核对远端 main 的真实历史，避免本地旧的跟踪引用放行未合并源码。 */
export function checkReleaseSource({ root = repositoryRoot, env = process.env } = {}) {
  const git = args => execFileSync('git', args, {
    cwd: root, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
  const sourceCommit = git(['rev-parse', 'HEAD']);
  const shallow = git(['rev-parse', '--is-shallow-repository']) === 'true';
  try {
    git(['fetch', '--no-tags', ...(shallow ? ['--unshallow'] : []), 'origin', '+refs/heads/main:refs/remotes/origin/main']);
  } catch {
    throw new Error('无法读取 origin/main；请确认远端稳定分支已创建且当前凭据可读取仓库');
  }
  const mainCommit = git(['rev-parse', 'refs/remotes/origin/main']);
  try {
    git(['merge-base', '--is-ancestor', sourceCommit, mainCommit]);
  } catch {
    throw new Error('发布源码提交必须已合并到 origin/main；请先完成 developer → main 合并和验收');
  }
  return { sourceCommit, mainCommit };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  assert(args.every(arg => arg === '--require-main'), '仅支持 --require-main 参数');
  if (process.env.CI_COMMIT_TAG) {
    const metadata = JSON.parse(readFileSync(resolve(repositoryRoot, 'packages/daisu-ui/package.json'), 'utf8'));
    assert.equal(process.env.CI_COMMIT_TAG, `v${metadata.version}`, '源码 Tag 必须与组件包版本一致');
  }
  if (process.env.CI_COMMIT_TAG || args.includes('--require-main')) {
    const { sourceCommit } = checkReleaseSource();
    console.log(`发布来源校验通过：${sourceCommit} 已包含在 origin/main`);
  } else {
    console.log('分支流水线执行开发校验；版本 Tag 发布时必须验证 origin/main');
  }
}
