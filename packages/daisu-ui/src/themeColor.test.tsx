import { expect, test } from '@rstest/core';
import { cleanup, render } from '@lynx-js/react/testing-library';
import { ConfigProvider } from './ConfigProvider.js';
import { Icon } from './Icon.js';
import { resolveThemeColor } from './themeColor.js';
import { configThemeTokens } from './configTheme.js';

test('SVG colors follow scoped overrides, live theme changes and nested fallbacks', () => {
  try {
    const screen = render(<ConfigProvider theme="light"><Icon name="close" /></ConfigProvider>);
    const paint = () => screen.container.querySelector('svg')!.getAttribute('content');
    expect(paint()).toContain('#606266');
    screen.rerender(<ConfigProvider theme="dark"><Icon name="close" /></ConfigProvider>);
    expect(paint()).toContain('#babec5');
    screen.rerender(<ConfigProvider theme="dark" themeVars={{ '--cso-ui-layer-close-color': '#123456' }}><Icon name="close" color="var(--cso-ui-layer-close-color)" /></ConfigProvider>);
    expect(paint()).toContain('#123456');
    expect(paint()).not.toContain('var(');
    screen.rerender(<ConfigProvider theme="dark"><Icon name="close" color="#abcdef" /></ConfigProvider>);
    expect(paint()).toContain('#abcdef');
    screen.rerender(<ConfigProvider theme="light" themeVars={{ '--cso-ui-text-regular': 'var(--cso-ui-text-regular)' }}><Icon name="close" /></ConfigProvider>);
    expect(paint()).toContain('#606266');
  } finally { cleanup(); }
});

test('theme colors preserve Flutter title/body/secondary levels and handle missing or cyclic SVG tokens', () => {
  const light = configThemeTokens('light'), dark = configThemeTokens('dark');
  expect([light['--cso-ui-text'],light['--cso-ui-text-regular'],light['--cso-ui-text-muted']]).toEqual(['#303133','#606266','#909399']);
  expect([dark['--cso-ui-text'],dark['--cso-ui-text-regular'],dark['--cso-ui-text-muted']]).toEqual(['#e6e8eb','#babec5','#8a8f99']);
  expect(resolveThemeColor('var(--missing,var(--cso-ui-text-muted))',light)).toBe('#909399');
  expect(resolveThemeColor('var(--a,#777)',{'--a':'var(--b)','--b':'var(--a)'})).toBe('#777');
  expect(resolveThemeColor('var(--missing)',{})).toBeUndefined();
});
