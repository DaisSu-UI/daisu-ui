import { createRequire } from 'node:module';
import { defineConfig } from '@rsbuild/core';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const directory = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  root: directory,
  source: { entry: { index: './main.ts' }, alias: { '@daisu-ui/ui/web$': require.resolve('@daisu-ui/ui/web'), '@daisu-ui/ui/router/location$': require.resolve('@daisu-ui/ui/router/location') } },
  html: { title: 'Daisu UI · Demo' },
  server: { port: 3091, publicDir: [{ name: resolve(directory, '../dist-web'), copyOnBuild: true }, { name: resolve(directory, 'public'), copyOnBuild: true }] },
  output: { distPath: { root: resolve(directory, '../h5-dist') }, cleanDistPath: true, assetPrefix: 'auto' },
});
