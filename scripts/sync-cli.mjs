import { readFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
export const uiRoot = fileURLToPath(new URL('../', import.meta.url));
export const isCi = (env = process.env) => Boolean(env.CI && !/^(0|false)$/i.test(env.CI));
export async function findCli(root = uiRoot, env = process.env) {
  if (env.DAISU_UI_AUTO_SYNC === '0') return;
  const explicit = env.DAISU_UI_CLI_SOURCE;
  const path = resolve(explicit || join(root, '../cli'));
  try {
    const pkg = JSON.parse(await readFile(join(path, 'package.json'), 'utf8'));
    if (pkg.name !== '@daisu-ui/cli') {
      if (explicit) throw new Error('指定目录不是 Daisu UI CLI 仓库。');
      return;
    }
    await stat(join(path, 'scripts/auto-sync.mjs'));
    await stat(join(path, 'node_modules/typescript'));
    return path;
  } catch (error) {
    if (error.code === 'ENOENT' && !explicit) return;
    throw error;
  }
}
export function nodeProcess(root, args, options = {}) {
  return spawn(process.execPath, args, { cwd: root, stdio: 'inherit', ...options });
}
export async function syncCli({ root = uiRoot, check = isCi(), env = process.env, uiGenerated = false } = {}) {
  const cli = await findCli(root, env);
  if (!cli) return { skipped: true };
  const child = nodeProcess(cli, ['scripts/auto-sync.mjs', '--ui-dir', root, ...(check ? ['--check'] : []), ...(uiGenerated ? ['--ui-generated'] : [])], { env });
  await new Promise((done, fail) => {
    child.once('error', fail);
    child.once('exit', code => code === 0 ? done() : fail(new Error(`CLI 自动同步失败（${code}），请修复后重试构建。`)));
  });
  return { skipped: false };
}
