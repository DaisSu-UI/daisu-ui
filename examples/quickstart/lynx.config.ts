import { defineConfig } from '@lynx-js/rspeedy';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';
export default defineConfig({
  source: { entry: { app: './src/index.tsx' } },
  environments: { lynx: {}, web: { output: { distPath: { root: 'dist-web' }, assetPrefix: './' } } },
  plugins: [pluginReactLynx({ engineVersion: '4.0' })],
});
