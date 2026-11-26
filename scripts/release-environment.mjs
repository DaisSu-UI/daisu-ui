import assert from 'node:assert/strict';

/** GitHub exposes tag refs through GITHUB_REF, rather than CI_COMMIT_TAG. */
export function releaseTag(env = process.env) {
  if (env.GITHUB_ACTIONS === 'true') {
    return env.GITHUB_REF?.startsWith('refs/tags/') ? env.GITHUB_REF.slice('refs/tags/'.length) : '';
  }
  return env.CI_COMMIT_TAG || '';
}

/** Keep npm and Git distribution publishing off the retired GitLab pipeline. */
export function assertPublishEnvironment(version, sourceCommit, env = process.env, { dryRun = false } = {}) {
  assert(!env.GITLAB_CI || env.GITLAB_CI === 'false', 'GitLab 自动发布已关闭；请使用 GitHub 的版本标签流水线');
  if (!env.CI && env.GITHUB_ACTIONS !== 'true') return;
  assert.equal(env.GITHUB_ACTIONS, 'true', '自动发布仅允许在 GitHub Actions 中执行');
  assert.equal(env.GITHUB_REPOSITORY?.toLowerCase(), 'daissu-ui/daisu-ui', '自动发布仅允许从 DaisSu-UI/daisu-ui 仓库执行');
  assert.equal(env.GITHUB_SHA, sourceCommit, 'GitHub 触发提交与发布源码不一致');
  const mainPreview = dryRun && env.GITHUB_REF === 'refs/heads/main' && ['push', 'workflow_dispatch'].includes(env.GITHUB_EVENT_NAME);
  if (!mainPreview) {
    assert.equal(env.GITHUB_EVENT_NAME, 'push', '自动发布仅允许由版本标签推送触发');
    assert.equal(releaseTag(env), `v${version}`, 'CI 只允许从组件版本对应的源码 Tag 发布');
  }
}
