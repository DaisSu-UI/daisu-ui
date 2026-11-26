import assert from 'node:assert/strict';

/** GitCode/AtomGit exposes tag refs through ATOMGIT_REF, rather than CI_COMMIT_TAG. */
export function releaseTag(env = process.env) {
  if (env.ATOMGIT_ACTIONS === 'true') {
    return env.ATOMGIT_REF?.startsWith('refs/tags/') ? env.ATOMGIT_REF.slice('refs/tags/'.length) : '';
  }
  return env.CI_COMMIT_TAG || '';
}

/** Keep npm and Git distribution publishing off the retired GitLab pipeline. */
export function assertPublishEnvironment(version, sourceCommit, env = process.env) {
  assert(!env.GITLAB_CI || env.GITLAB_CI === 'false', 'GitLab 自动发布已关闭；请使用 GitCode 的版本标签流水线');
  if (!env.CI && env.ATOMGIT_ACTIONS !== 'true') return;
  assert.equal(env.ATOMGIT_ACTIONS, 'true', '自动发布仅允许在 GitCode Actions 中执行');
  assert.equal(env.ATOMGIT_REPOSITORY, 'daisu/ui', '自动发布仅允许从 daisu/ui 仓库执行');
  assert.equal(env.ATOMGIT_EVENT_NAME?.toLowerCase(), 'push', '自动发布仅允许由版本标签推送触发');
  assert.equal(releaseTag(env), `v${version}`, 'CI 只允许从组件版本对应的源码 Tag 发布');
  assert.equal(env.ATOMGIT_SHA, sourceCommit, 'GitCode 触发提交与发布源码不一致');
}
