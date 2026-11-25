import { withLynxConfig } from '@lynx-js/react/testing-library/rstest-config';
import { defineConfig } from '@rstest/core';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

export default defineConfig({
  extends: withLynxConfig({ configPath: fileURLToPath(new URL('./apps/demo/lynx.config.ts', import.meta.url)), buildTool: 'rspeedy' }),
  include: ['src/**/*.test.{ts,tsx}', 'packages/**/*.test.{ts,tsx}', 'apps/**/*.test.{ts,tsx}'],
  resolve: {
    alias: {
      'daisu-ui$': fileURLToPath(new URL('./packages/daisu-ui/src/index.ts', import.meta.url)),
      'daisu-ui/router$': fileURLToPath(new URL('./packages/daisu-ui/src/router/index.ts', import.meta.url)),
      'daisu-ui/router/location$': fileURLToPath(new URL('./packages/daisu-ui/src/router/location.ts', import.meta.url)),
      'daisu-ui/router/runtime$': fileURLToPath(new URL('./packages/daisu-ui/src/router/runtime.ts', import.meta.url)),
      'daisu-ui/utils$': fileURLToPath(new URL('./packages/daisu-ui/src/utils.ts', import.meta.url)),
      react: require.resolve('@lynx-js/react/compat'),
      'react/jsx-runtime': require.resolve('@lynx-js/react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('@lynx-js/react/jsx-dev-runtime'),
    },
  },
});
