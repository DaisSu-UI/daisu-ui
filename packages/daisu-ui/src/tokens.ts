/** Semantic tokens shared by the CSO Lynx UI public surface. */
export const uiTokens = {
  color: {
    canvas: '#f5f7fa', surface: '#ffffff', text: '#17212e', textMuted: '#697586', line: '#e6eaf0',
    primary: '#f86100', success: '#1f9d67', info: '#236fd4', warning: '#b86b00', danger: '#d63b47',
  },
  radius: { small: 6, medium: 8, large: 12 },
  spacing: { xs: 4, small: 8, medium: 12, large: 16, xl: 24 },
  control: { mini: 28, small: 32, medium: 40, large: 44 },
} as const;

export type UiTokens = typeof uiTokens;
