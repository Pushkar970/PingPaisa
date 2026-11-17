export const colors = {
  base: '#F5C518',
  surface: '#D4A80E',
  card: '#F7D44C',
  cardBorder: 'rgba(0,0,0,0.1)',
  cardGlass: 'rgba(255,255,255,0.7)',
  primary: '#7C3AED',
  primaryLight: '#8B5CF6',
  accent: '#7C3AED',
  heading: '#1A1A1A',
  body: '#2D2D2D',
  muted: '#6B6B6B',
  error: '#DC2626',
  success: '#16A34A',
  warning: '#D97706',
  white: '#FFFFFF',
  inputBg: '#EDE9FE',
  inputBorder: '#C4B5FD',
  gradientPrimary: ['#7C3AED', '#9333EA'] as const,
  gradientAccent: ['#7C3AED', '#6D28D9'] as const,
  chartColors: ['#7C3AED', '#9333EA', '#6D28D9', '#16A34A', '#D97706', '#DC2626', '#EC4899', '#14B8A6', '#F97316', '#A855F7'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const fonts = {
  display: { fontSize: 32, fontWeight: '700' as const, color: colors.heading },
  h1: { fontSize: 24, fontWeight: '600' as const, color: colors.heading },
  h2: { fontSize: 20, fontWeight: '600' as const, color: colors.heading },
  body: { fontSize: 16, fontWeight: '400' as const, color: colors.body },
  caption: { fontSize: 13, fontWeight: '400' as const, color: colors.muted },
};
