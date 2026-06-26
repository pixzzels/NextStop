import type { AppTheme, AppThemeName } from "./themeTypes";

export const appThemes = {
  coastalBlue: {
    name: "coastalBlue",
    label: "Coastal Blue",
    colors: {
      background: "#F7FBFC",
      surface: "#FFFFFF",
      surfaceMuted: "#EAF4F7",

      textPrimary: "#102A43",
      textSecondary: "#486581",
      textMuted: "#829AB1",
      textInverse: "#FFFFFF",

      primary: "#0E7490",
      primaryPressed: "#155E75",
      primaryDisabled: "#A5D8E6",

      accent: "#F97316",
      accentMuted: "#FFEDD5",

      border: "#D6E6EA",
      borderMuted: "#E6F0F3",

      dangerBackground: "#FEF2F2",
      dangerBorder: "#FECACA",
      dangerText: "#991B1B",

      successBackground: "#ECFDF5",
      successBorder: "#A7F3D0",
      successText: "#047857",

      warningBackground: "#FFFBEB",
      warningBorder: "#FDE68A",
      warningText: "#92400E",

      infoBackground: "#E0F2FE",
      infoBorder: "#BAE6FD",
      infoText: "#0369A1",
    },
  },

  warmItinerary: {
    name: "warmItinerary",
    label: "Warm Itinerary",
    colors: {
      background: "#FFFDF8",
      surface: "#FFFFFF",
      surfaceMuted: "#F8F3EA",

      textPrimary: "#1F2933",
      textSecondary: "#52616B",
      textMuted: "#7B8794",
      textInverse: "#FFFFFF",

      primary: "#D97706",
      primaryPressed: "#B45309",
      primaryDisabled: "#F3C98B",

      accent: "#2563EB",
      accentMuted: "#DBEAFE",

      border: "#E7DCCB",
      borderMuted: "#F1E8DA",

      dangerBackground: "#FEF2F2",
      dangerBorder: "#FECACA",
      dangerText: "#991B1B",

      successBackground: "#ECFDF5",
      successBorder: "#A7F3D0",
      successText: "#047857",

      warningBackground: "#FFFBEB",
      warningBorder: "#FDE68A",
      warningText: "#92400E",

      infoBackground: "#EFF6FF",
      infoBorder: "#BFDBFE",
      infoText: "#1D4ED8",
    },
  },

  softSage: {
    name: "softSage",
    label: "Soft Sage",
    colors: {
      background: "#FAFAF5",
      surface: "#FFFFFF",
      surfaceMuted: "#F0F3EA",

      textPrimary: "#1F2A24",
      textSecondary: "#526158",
      textMuted: "#7A867E",
      textInverse: "#FFFFFF",

      primary: "#4D7C0F",
      primaryPressed: "#3F6212",
      primaryDisabled: "#C9D8A8",

      accent: "#B45309",
      accentMuted: "#FEF3C7",

      border: "#DDE5D2",
      borderMuted: "#EEF2E8",

      dangerBackground: "#FEF2F2",
      dangerBorder: "#FECACA",
      dangerText: "#991B1B",

      successBackground: "#F0FDF4",
      successBorder: "#BBF7D0",
      successText: "#166534",

      warningBackground: "#FFFBEB",
      warningBorder: "#FDE68A",
      warningText: "#92400E",

      infoBackground: "#EFF6FF",
      infoBorder: "#BFDBFE",
      infoText: "#1D4ED8",
    },
  },

  modernSlate: {
    name: "modernSlate",
    label: "Modern Slate",
    colors: {
      background: "#F8FAFC",
      surface: "#FFFFFF",
      surfaceMuted: "#F1F5F9",

      textPrimary: "#0F172A",
      textSecondary: "#475569",
      textMuted: "#64748B",
      textInverse: "#FFFFFF",

      primary: "#334155",
      primaryPressed: "#1E293B",
      primaryDisabled: "#CBD5E1",

      accent: "#7C3AED",
      accentMuted: "#EDE9FE",

      border: "#CBD5E1",
      borderMuted: "#E2E8F0",

      dangerBackground: "#FEF2F2",
      dangerBorder: "#FECACA",
      dangerText: "#991B1B",

      successBackground: "#ECFDF5",
      successBorder: "#A7F3D0",
      successText: "#047857",

      warningBackground: "#FFFBEB",
      warningBorder: "#FDE68A",
      warningText: "#92400E",

      infoBackground: "#EFF6FF",
      infoBorder: "#BFDBFE",
      infoText: "#1D4ED8",
    },
  },

  sunsetCoral: {
    name: "sunsetCoral",
    label: "Sunset Coral",
    colors: {
      background: "#FFF8F6",
      surface: "#FFFFFF",
      surfaceMuted: "#FFF0EB",

      textPrimary: "#2A1F1D",
      textSecondary: "#6B4E49",
      textMuted: "#9A756E",
      textInverse: "#FFFFFF",

      primary: "#E11D48",
      primaryPressed: "#BE123C",
      primaryDisabled: "#FDA4AF",

      accent: "#F59E0B",
      accentMuted: "#FEF3C7",

      border: "#F3D4CC",
      borderMuted: "#F8E6E1",

      dangerBackground: "#FEF2F2",
      dangerBorder: "#FECACA",
      dangerText: "#991B1B",

      successBackground: "#ECFDF5",
      successBorder: "#A7F3D0",
      successText: "#047857",

      warningBackground: "#FFFBEB",
      warningBorder: "#FDE68A",
      warningText: "#92400E",

      infoBackground: "#EFF6FF",
      infoBorder: "#BFDBFE",
      infoText: "#1D4ED8",
    },
  },
} satisfies Record<AppThemeName, AppTheme>;

export const defaultThemeName: AppThemeName = "coastalBlue";

export const defaultTheme = appThemes[defaultThemeName];

export function getAppTheme(themeName: AppThemeName = defaultThemeName): AppTheme {
  return appThemes[themeName];
}