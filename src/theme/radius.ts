export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  "2xl": 20,
  full: 999,
} as const;

export type AppRadiusName = keyof typeof radius;