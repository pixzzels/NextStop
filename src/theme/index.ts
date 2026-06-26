import { defaultTheme, defaultThemeName, getAppTheme, appThemes } from "./palettes";
import { radius } from "./radius";
import { spacing } from "./spacing";
import { typography } from "./typography";

export { appThemes, defaultThemeName, getAppTheme };
export type { AppColorTokens, AppTheme, AppThemeName } from "./themeTypes";

export const theme = {
  ...defaultTheme,
  spacing,
  radius,
  typography,
} as const;