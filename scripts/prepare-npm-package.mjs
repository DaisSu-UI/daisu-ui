import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const library = join(root, 'packages/daisu-ui');
const metadata = JSON.parse(readFileSync(join(library, 'package.json'), 'utf8'));
assert.equal(metadata.name, '@daisu-ui/ui', '只允许打包 UI 库');
assert.notEqual(metadata.private, true, 'UI 包不能标记为 private');
assert(existsSync(join(library, 'dist/index.js')), '请先构建 UI 库');
assert(readFileSync(join(library, 'dist/Button.jsx'), 'utf8').includes('<view'), '组件必须保留 JSX');
const artifacts = join(root, 'artifacts');
mkdirSync(artifacts, { recursive: true });
const pack = JSON.parse(execFileSync('npm', [
  'pack', '--workspace', '@daisu-ui/ui', '--ignore-scripts', '--pack-destination', artifacts, '--json',
], { cwd: root, encoding: 'utf8' }))[0];
const files = pack.files.map(file => file.path);
const allowedRootFiles = new Set(['package.json', 'README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'CHANGELOG.md']);
assert(files.every(path => path.startsWith('dist/') || allowedRootFiles.has(path)), 'npm 包混入了 Demo、文档站、CLI 或其他工程文件');
assert(files.every(path => !/\.test\.|\.tsx?$/.test(path.replace(/\.d\.ts$/, '.declaration'))), 'npm 包混入了源码或测试');
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const integrity = `sha512-${createHash('sha512').update(readFileSync(join(artifacts, pack.filename))).digest('base64')}`;
assert.equal(pack.integrity, integrity);
writeFileSync(join(artifacts, 'npm-release.json'), JSON.stringify({
  name: metadata.name, version: metadata.version, sourceCommit,
  filename: pack.filename, integrity, files,
}, null, 2) + '\n');
console.log(`npm UI 包已准备：${pack.filename}，${files.length} 个文件；不含 Demo、文档站和 CLI`);
