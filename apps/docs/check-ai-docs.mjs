import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const names = ['overview.md', 'cli.md', 'mcp.md', 'skills.md'];
export async function checkAiDocs(directory = fileURLToPath(new URL('./ai/', import.meta.url))) {
  const manifest = JSON.parse(await readFile(resolve(directory, 'cli-manifest.json'), 'utf8'));
  if (manifest.schemaVersion !== 1 || manifest.generator?.package !== '@daisu-ui/cli' ||
      !/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(manifest.generator?.version || '') ||
      !manifest.files || Object.keys(manifest.files).sort().join(',') !== [...names].sort().join(','))
    throw new Error('CLI 接入文档清单无效，请从 CLI 重新导出。');
  for (const name of names) {
    const text = await readFile(resolve(directory, name), 'utf8');
    const hash = createHash('sha256').update(text).digest('hex');
    if (manifest.files[name] !== hash)
      throw new Error(`CLI 接入文档已变更或未同步：${name}。请在 CLI 执行 docs export --ui-dir <UI仓库>，不要手工修改生成页面。`);
  }
  return manifest.generator;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const generator = await checkAiDocs();
  console.log(`CLI 接入文档摘要一致：${generator.package}@${generator.version}`);
}
