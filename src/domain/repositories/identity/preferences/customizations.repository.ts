export abstract class ICustomizationsRepository {
  abstract getCustomizationSettings(userId: string): Promise<{
    id: string;
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
  } | null>;

  abstract updateCustomizationSettings(
    userId: string,
    settings: Partial<{
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
    }>,
  ): Promise<void>;
}
