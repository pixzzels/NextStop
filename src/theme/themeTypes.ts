export type AppThemeName =
  | "coastalBlue"
  | "warmItinerary"
  | "softSage"
  | "modernSlate"
  | "sunsetCoral";

export type AppColorTokens = {
  background: string;
  surface: string;
  surfaceMuted: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  primary: string;
  primaryPressed: string;
  primaryDisabled: string;

  accent: string;
  accentMuted: string;

  border: string;
  borderMuted: string;

  dangerBackground: string;
  dangerBorder: string;
  dangerText: string;

  successBackground: string;
  successBorder: string;
  successText: string;

  warningBackground: string;
  warningBorder: string;
  warningText: string;

  infoBackground: string;
  infoBorder: string;
  infoText: string;
};

export type AppTheme = {
  name: AppThemeName;
  label: string;
  colors: AppColorTokens;
};