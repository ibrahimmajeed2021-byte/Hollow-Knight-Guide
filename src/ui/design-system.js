// Stage 2 visual foundation: shared dimensions, typography and motion.
// This is neutral to Free / Premium and both Hollow Knight and Silksong.
// Themes still own all colours through SettingsContext.
export const layout = Object.freeze({
  gutter: 16,
  screenTop: 16,
  screenBottom: 28,
  sectionGap: 20,
  cardGap: 10,
  cardPadding: 16,
  compactCardPadding: 12,
  touchTarget: 48,
});

export const radius = Object.freeze({
  small: 10,
  control: 12,
  card: 16,
  feature: 18,
  hero: 24,
  pill: 999,
});

export const space = Object.freeze({
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
});

export const type = Object.freeze({
  caption: { fontSize: 12, lineHeight: 17 },
  small: { fontSize: 13, lineHeight: 19 },
  label: { fontSize: 14, lineHeight: 20, fontWeight: "700" },
  body: { fontSize: 16, lineHeight: 24 },
  subheading: { fontSize: 18, lineHeight: 25, fontWeight: "700" },
  heading: { fontSize: 21, lineHeight: 29, fontWeight: "800" },
  title: { fontSize: 30, lineHeight: 38 },
});

export const motion = Object.freeze({
  quick: 160,
  standard: 230,
  slow: 420,
});

// Keep static UI values testable without a React runtime.
export const clampPercent = (percent) => {
  const value = Number(percent);
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
};
