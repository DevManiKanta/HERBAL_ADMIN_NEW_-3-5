/** Default name when API logo / app name is not set */
export const DEFAULT_APP_DISPLAY_NAME = "Sridevi Herbal & Co";

export function resolveAppDisplayName(apiAppName) {
  if (apiAppName != null && String(apiAppName).trim().length > 0) {
    return String(apiAppName).trim();
  }
  return DEFAULT_APP_DISPLAY_NAME;
}
