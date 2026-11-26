import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

function checkNpmAuth() {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const registry = 'https://registry.npmjs.org/';
  const metadata = JSON.parse(readFileSync(join(root, 'packages/daisu-ui/package.json'), 'utf8'));
  assert.equal(metadata.name, '@daisu-ui/ui', '只核对 UI 包的发布权限');
  const token = process.env.NPM_TOKEN?.trim();
  assert(token, '缺少 NPM_TOKEN；请核对 GitHub Actions Repository secret 的名称与可用范围');
  assert(/^[A-Za-z0-9_-]+$/.test(token), 'NPM_TOKEN 格式无效');
  const temporary = mkdtempSync(join(tmpdir(), 'daisu-npm-auth-check-'));
  try {
    const userconfig = join(temporary, 'npmrc');
    writeFileSync(userconfig, `//registry.npmjs.org/:_authToken=${token}\n`, { mode: 0o600 });
    const env = { ...process.env, npm_config_userconfig: userconfig };
    const npm = args => execFileSync('npm', [...args, '--registry', registry], {
      cwd: root, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
    let username;
    try {
      username = JSON.parse(npm(['whoami', '--json']));
      assert.equal(typeof username, 'string');
      assert(username);
    } catch {
      throw new Error('npm 身份验证失败；请核对 NPM_TOKEN 是否有效、过期或被撤销');
    }
    let collaborators;
    try {
      collaborators = JSON.parse(npm(['access', 'list', 'collaborators', metadata.name, username, '--json']));
    } catch (error) {
      const stderr = String(error?.stderr ?? '');
      const code = stderr.match(/npm (?:error|ERR!) code ([A-Z0-9_]+)/)?.[1];
      throw new Error(`无法查询 npm 包权限${code ? `（npm ${code}）` : '（未返回有效的权限数据）'}；Token 身份验证已通过`);
    }
    assert.equal(collaborators[username], 'read-write', '当前 npm 账号没有 @daisu-ui/ui 的读写权限，或 Token 未授权此包');
    console.log('npm Token 身份验证通过；@daisu-ui/ui 的账号读写权限检查通过。');
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

try {
  checkNpmAuth();
} catch (error) {
  const message = error instanceof Error ? error.message : 'npm 身份和权限核对失败';
  const annotation = message.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
  console.error(`::error title=npm credential check::${annotation}`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## npm 凭据核对失败\n\n${message}\n`);
  }
  process.exitCode = 1;
}
