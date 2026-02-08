export interface ICustomizationSettings {
  id: string;
  userPreferencesId: string;
  theme: string;
  layoutPreferences: Record<string, unknown>;
  defaultViews: Record<string, unknown>;
  sortFilterDefaults: Record<string, unknown>;
  paginationSize: number;
  featureToggles: Record<string, unknown>;
  betaFeaturesOptIn: boolean;
  aiFeaturesOptIn: boolean;
  contentSensitivityFilters: Record<string, unknown>;
  sidebarCollapsed: boolean;
  compactMode: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAccessibilitySettings {
  id: string;
  userPreferencesId: string;
  language: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  currency: string;
  timeFormat: string;
  highContrastMode: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  fontSize: string;
  keyboardNavigation: boolean;
  colorBlindMode: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
