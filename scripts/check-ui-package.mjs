import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, lstatSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('..', import.meta.url));
const temporary = mkdtempSync(join(tmpdir(), 'daisu-ui-consumer-'));
const require = createRequire(import.meta.url);
const run = (command, args, cwd = root) => execFileSync(command, args, { cwd, stdio: 'inherit' });

try {
  const pack = JSON.parse(execFileSync('npm', [
    'pack', '--workspace', '@daisu-ui/ui', '--ignore-scripts', '--pack-destination', temporary, '--json',
  ], { cwd: root, encoding: 'utf8' }))[0];
  const paths = new Set(pack.files.map(file => file.path));
  for (const path of ['dist/index.js', 'dist/index.d.ts', 'dist/Button.jsx', 'dist/styles.css', 'dist/router/runtime.js', 'dist/icons/LICENSE.tabler', 'dist/brand/logo.svg', 'LICENSE', 'README.md']) {
    assert(paths.has(path), `Missing packed file: ${path}`);
  }
  assert(pack.files.every(file => !/\.test\.|\.tsx?$|tsbuildinfo|\.env/.test(file.path.replace(/\.d\.ts$/, '.declaration'))), 'Package contains source, tests or environment files');
  assert(pack.files.every(file => !/^(?:apps|docs|demo|examples)\//.test(file.path)), 'Package contains Demo or documentation applications');

  cpSync(join(root, 'fixtures/ui-consumer'), temporary, { recursive: true });
  const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
  const localVersion = name => {
    const version = lock.packages[`node_modules/${name}`]?.version;
    assert(version, `Missing installed dependency in lockfile: ${name}`);
    return version;
  };
  const metadata = JSON.parse(readFileSync(join(root, 'packages/daisu-ui/package.json'), 'utf8'));
  const dependencies = { '@daisu-ui/ui': `file:./${pack.filename}` };
  for (const name of Object.keys(metadata.peerDependencies)) dependencies[name] = localVersion(name);
  // Use the tested dependency versions while allowing npm to resolve the full
  // transitive graph in an isolated directory, without workspace symlinks.
  // Keep the same compiler override as the workspace and starter.
  const overrides = { ...JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).overrides };
  for (const name of Object.keys(metadata.dependencies)) overrides[name] = localVersion(name);
  const consumer = { name: 'daisu-ui-consumer', private: true, type: 'module', dependencies, overrides };
  writeFileSync(join(temporary, 'package.json'), JSON.stringify(consumer, null, 2));
  // Reuse the reviewed dependency graph, including transitive peers, instead of
  // allowing unrelated registry updates to change the acceptance environment.
  const consumerLock = structuredClone(lock);
  consumerLock.name = consumer.name;
  delete consumerLock.version;
  consumerLock.packages[''] = { name: consumer.name, dependencies };
  for (const [path, entry] of Object.entries(consumerLock.packages)) {
    if (entry.link || path && !path.startsWith('node_modules/')) delete consumerLock.packages[path];
  }
  consumerLock.packages['node_modules/@daisu-ui/ui'] = {
    version: metadata.version,
    resolved: dependencies['@daisu-ui/ui'],
    integrity: pack.integrity,
    dependencies: metadata.dependencies,
    peerDependencies: metadata.peerDependencies,
  };
  writeFileSync(join(temporary, 'package-lock.json'), JSON.stringify(consumerLock, null, 2));
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--prefer-offline', '--fetch-retries=0', '--fetch-timeout=30000'], temporary);

  const installed = join(temporary, 'node_modules/@daisu-ui/ui');
  assert(!lstatSync(installed).isSymbolicLink(), 'Consumer must install the tarball');
  const sources = [];
  const walk = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.(?:js|jsx|ts|css)$/.test(entry.name)) sources.push(path);
    }
  };
  walk(join(installed, 'dist'));
  const consumerRequire = createRequire(join(temporary, 'package.json'));
  const checkSpecifier = (file, specifier) => {
    if (specifier.startsWith('.')) {
      const target = resolve(dirname(file), specifier);
      const declaration = target.replace(/\.(?:js|jsx)$/, '.d.ts');
      assert(existsSync(target) || (file.endsWith('.d.ts') && existsSync(declaration)), `Unresolved import ${specifier} in ${file}`);
      assert(target.startsWith(`${installed}/dist/`), `Import leaves package: ${specifier}`);
    } else {
      const dependency = specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];
      const declarationTypes = file.endsWith('.d.ts') && metadata.peerDependencies[`@types/${dependency}`];
      assert(metadata.dependencies[dependency] || metadata.peerDependencies[dependency] || declarationTypes, `Undeclared dependency: ${dependency}`);
      if (!file.endsWith('.d.ts')) consumerRequire.resolve(specifier);
    }
  };
  for (const file of sources) {
    const content = readFileSync(file, 'utf8');
    if (file.endsWith('.css')) {
      for (const match of content.matchAll(/@import\s+['"]([^'"]+)['"]/g)) checkSpecifier(file, match[1]);
      continue;
    }
    if (!file.endsWith('.d.ts')) {
      assert(!/from\s*['"][^'"]*jsx(?:-dev)?-runtime['"]/.test(content), `JSX lowered before consumption: ${file}`);
    }
    const parsed = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, file.endsWith('.jsx') ? ts.ScriptKind.JSX : ts.ScriptKind.TS);
    const visit = node => {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) checkSpecifier(file, node.moduleSpecifier.text);
      if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) checkSpecifier(file, node.argument.literal.text);
      ts.forEachChild(node, visit);
    };
    visit(parsed);
  }
  assert(readFileSync(join(installed, 'dist/Button.jsx'), 'utf8').includes('<view'), 'Authored JSX must be preserved');
  run(process.execPath, [require.resolve('typescript/bin/tsc'), '--project', join(temporary, 'tsconfig.json')], temporary);

  const { createRspeedy } = await import('@lynx-js/rspeedy');
  const { pluginReactLynx } = await import('@lynx-js/react-rsbuild-plugin');
  const { pluginLynxConfig } = await import('@lynx-js/config-rsbuild-plugin');
  const build = await createRspeedy({
    cwd: temporary,
    loadEnv: false,
    rspeedyConfig: {
      mode: 'production',
      source: {
        entry: { app: join(temporary, 'index.tsx'), button: join(temporary, 'button.tsx') },
        define: { self: 'globalThis' },
        alias: {
          react$: consumerRequire.resolve('@lynx-js/react/compat'),
          'react/jsx-runtime$': consumerRequire.resolve('@lynx-js/react/jsx-runtime'),
          'react/jsx-dev-runtime$': consumerRequire.resolve('@lynx-js/react/jsx-dev-runtime'),
        },
      },
      environments: {
        lynx: {},
        web: { output: { distPath: { root: 'dist-web' } } },
      },
      plugins: [pluginReactLynx({ engineVersion: '4.0', enableCSSInheritance: true, customCSSInheritanceList: ['color', 'font-size', 'font-weight', 'font-family', 'font-style', 'line-height', 'text-align', 'text-indent'] }), pluginLynxConfig({ enableCSSInlineVariables: true })],
    },
  });
  await build.build();
  assert(existsSync(join(temporary, 'dist/app.lynx.bundle')), 'Standalone consumer did not emit a Lynx bundle');
  const { decode_wasm } = require('@lynx-js/tasm');
  for (const entry of ['app', 'button']) {
    const decoded = await decode_wasm(readFileSync(join(temporary, `dist/${entry}.lynx.bundle`)));
    assert.equal(decoded['engine-version'], '4.0', `${entry} Bundle must target Lynx 4.0`);
    const config = JSON.parse(decoded['page-config']);
    assert.equal(config.enableCSSInlineVariables, true, 'Scoped/inline theme variables must be enabled');
    assert.equal(config.enableCSSInheritance, true, 'Text descendants must inherit their component styles');
    assert(decoded.css.text.includes('--_daisu-var-'), 'Nested fallbacks must use native-compatible aliases');
  }
  const buttonBundle = readFileSync(join(temporary, 'dist-web/button.web.bundle'), 'utf8');
  assert(buttonBundle.includes('--ui-button-foreground'), 'Named Button import lost its automatic CSS during production tree shaking');
  console.log(`Daisu UI package verified: ${pack.filename}, ${paths.size} files, isolated npm install, types, ReactLynx build and automatic CSS`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
