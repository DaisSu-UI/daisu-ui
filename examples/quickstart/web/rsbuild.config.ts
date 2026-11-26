import { defineConfig } from '@rsbuild/core';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  source: { entry: { index: './main.ts' } },
  html: { title: 'Daisu UI Quickstart' },
  server: { port: 3092, publicDir: [{ name: fileURLToPath(new URL('../dist-web', import.meta.url)), copyOnBuild: true }] },
  output: { distPath: { root: '../h5-dist' }, assetPrefix: 'auto', cleanDistPath: true },
});
