import { defineConfig } from '@lynx-js/rspeedy';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';
import { pluginLynxConfig } from '@lynx-js/config-rsbuild-plugin';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export default defineConfig({
  source: {
    entry: { app: './src/index.tsx' },
    define: { self: 'globalThis' },
    alias: {
      react$: require.resolve('@lynx-js/react/compat'),
      'react/jsx-runtime$': require.resolve('@lynx-js/react/jsx-runtime'),
      'react/jsx-dev-runtime$': require.resolve('@lynx-js/react/jsx-dev-runtime'),
    },
  },
  environments: { lynx: {}, web: { output: { distPath: { root: 'dist-web' }, assetPrefix: './' } } },
  plugins: [
    pluginReactLynx({ engineVersion: '4.0', enableCSSInheritance: true, customCSSInheritanceList: ['color', 'font-size', 'font-weight', 'font-family', 'font-style', 'line-height', 'text-align', 'text-indent'] }),
    pluginLynxConfig({ enableCSSInlineVariables: true }),
  ],
});
