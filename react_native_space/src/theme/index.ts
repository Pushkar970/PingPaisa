export const colors = {
  base: '#FFD214',              // Option 1: Warm Vibrant Sunflower Gold
  surface: '#FFFFFF',           // Crisp White for surfaces, modals, popovers
  surfaceVariant: '#F1F5F9',    // Slate 100 for secondary tags, chips, tracks
  card: '#FFFFFF',              // Pure Porcelain White Cards
  cardBorder: 'rgba(15, 23, 42, 0.08)', // Subtle slate border
  cardGlass: 'rgba(255, 255, 255, 0.95)',
  primary: '#111827',           // Carbon Obsidian Black (Main CTA, FAB, Active items)
  primaryLight: '#1F2937',      // Charcoal
  accent: '#111827',            // Carbon Black Accent
  heading: '#0F172A',           // Deep Slate Black for titles
  body: '#334155',              // Slate 700 for high-contrast body text
  muted: '#64748B',             // Slate 500 for secondary/meta text
  error: '#DC2626',             // Clear Red for expenses/debts
  success: '#16A34A',           // Emerald Green for income, positive cashflow
  warning: '#D97706',           // Burnt Orange/Amber (clearly visible on yellow)
  white: '#FFFFFF',
  inputBg: '#FFFFFF',           // Crisp White input backgrounds
  inputBorder: '#E2E8F0',       // Clean slate-200 input border
  gradientPrimary: ['#111827', '#1F2937'] as const, // Carbon Black Gradient
  gradientAccent: ['#0F172A', '#334155'] as const,
  chartColors: ['#111827', '#16A34A', '#DC2626', '#D97706', '#2563EB', '#7C3AED', '#0891B2', '#EC4899', '#F97316', '#4B5563'],
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
