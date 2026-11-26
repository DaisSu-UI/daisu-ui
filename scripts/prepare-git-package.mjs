import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkReleaseSource } from './check-release-source.mjs';
import { releaseTag } from './release-environment.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const library = join(root, 'packages/daisu-ui');
const metadata = JSON.parse(readFileSync(join(library, 'package.json'), 'utf8'));
assert.equal(metadata.name, '@daisu-ui/ui');
assert.match(metadata.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
const sourceTag = releaseTag();
if (sourceTag) {
  assert.equal(sourceTag, `v${metadata.version}`, '源码 Tag 必须与组件包版本一致');
  checkReleaseSource({ root });
}
assert(existsSync(join(library, 'dist/index.js')), '请先运行 npm run ui:build');
assert(readFileSync(join(library, 'dist/Button.jsx'), 'utf8').includes('<view'), '组件必须保留 JSX');

const artifacts = join(root, 'artifacts');
const destination = join(artifacts, 'git-package');
mkdirSync(artifacts, { recursive: true });
// 与 npm pack 使用相同文件白名单，避免将 Demo、测试或源码装进发布分支。
const pack = JSON.parse(execFileSync('npm', [
  'pack', '--workspace', '@daisu-ui/ui', '--ignore-scripts', '--pack-destination', artifacts, '--json',
], { cwd: root, encoding: 'utf8' }))[0];
rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
for (const file of pack.files) {
  const source = resolve(library, file.path);
  const target = resolve(destination, file.path);
  assert(source.startsWith(`${library}/`) && target.startsWith(`${destination}/`), '非法包文件路径');
  assert(!/^(?:apps|docs|src|scripts|node_modules)\//.test(file.path), '组件包混入开发文件');
  cpSync(source, target, { recursive: true });
}
// Git 依赖已包含产物，不应在消费端安装开发依赖或再次执行源码构建。
delete metadata.scripts;
delete metadata.devDependencies;
delete metadata.publishConfig;
if (metadata.repository) delete metadata.repository.directory;
metadata.private = true;
writeFileSync(join(destination, 'package.json'), JSON.stringify(metadata, null, 2) + '\n');
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
writeFileSync(join(destination, 'release.json'), JSON.stringify({
  name: metadata.name,
  version: metadata.version,
  sourceCommit,
  sourceTag: sourceTag || null,
  engineVersion: '4.2',
}, null, 2) + '\n');
// 发布分支不执行源码流水线，也不落入实例的 Auto DevOps 默认配置。
writeFileSync(join(destination, '.gitlab-ci.yml'), 'skip:package:\n  script: echo "组件发布产物"\n  only:\n    - /^__no_package_pipeline__$/\n');
console.log(`已准备 Git 安装包：${destination}，安装 Tag npm-v${metadata.version}`);
