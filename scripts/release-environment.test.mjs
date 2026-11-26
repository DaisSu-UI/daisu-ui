import assert from 'node:assert/strict';
import test from 'node:test';
import { assertPublishEnvironment, releaseTag } from './release-environment.mjs';

const version = '1.2.3-beta.0';
const commit = 'a'.repeat(40);
const gitcode = {
  CI: 'true', ATOMGIT_ACTIONS: 'true', ATOMGIT_REPOSITORY: 'daisu/ui',
  ATOMGIT_EVENT_NAME: 'push', ATOMGIT_REF: `refs/tags/v${version}`, ATOMGIT_SHA: commit,
};

test('branch pushes cannot become releases through a stale legacy tag variable', () => {
  assert.equal(releaseTag({ ...gitcode, ATOMGIT_REF: 'refs/heads/main', CI_COMMIT_TAG: `v${version}` }), '');
  assert.throws(() => assertPublishEnvironment(version, commit, { ...gitcode, ATOMGIT_REF: 'refs/heads/main' }), /对应的源码 Tag/);
  assert.throws(() => assertPublishEnvironment(version, commit, { ...gitcode, ATOMGIT_REF: 'refs/tags/v9.9.9' }), /对应的源码 Tag/);
  assert.equal(releaseTag(gitcode), `v${version}`);
  assert.equal(releaseTag({ CI_COMMIT_TAG: 'v1.2.3' }), 'v1.2.3');
});

test('GitLab and unknown CI providers cannot publish even with a valid version tag', () => {
  assert.throws(() => assertPublishEnvironment(version, commit, { CI: 'true', GITLAB_CI: 'true', CI_COMMIT_TAG: `v${version}` }), /GitLab 自动发布已关闭/);
  assert.throws(() => assertPublishEnvironment(version, commit, { ...gitcode, GITLAB_CI: 'true' }), /GitLab 自动发布已关闭/);
  assert.throws(() => assertPublishEnvironment(version, commit, { CI: 'true', CI_COMMIT_TAG: `v${version}` }), /仅允许在 GitCode/);
});

test('publishing requires the original repository, tag push and exact source commit', () => {
  assert.doesNotThrow(() => assertPublishEnvironment(version, commit, gitcode));
  assert.doesNotThrow(() => assertPublishEnvironment(version, commit, { ...gitcode, ATOMGIT_EVENT_NAME: 'Push' }));
  assert.throws(() => assertPublishEnvironment(version, commit, { ...gitcode, ATOMGIT_REPOSITORY: 'someone/ui' }), /仅允许从 daisu\/ui/);
  for (const event of ['pull_request', 'MR', 'workflow_dispatch', 'Manual']) {
    assert.throws(() => assertPublishEnvironment(version, commit, { ...gitcode, ATOMGIT_EVENT_NAME: event }), /版本标签推送/);
  }
  assert.throws(() => assertPublishEnvironment(version, commit, { ...gitcode, ATOMGIT_SHA: 'b'.repeat(40) }), /提交与发布源码不一致/);
  assert.doesNotThrow(() => assertPublishEnvironment(version, commit, {}));
});
