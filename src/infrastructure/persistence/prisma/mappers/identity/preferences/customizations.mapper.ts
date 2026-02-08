import { Injectable } from '@nestjs/common';
import { CustomizationSettings as PrismaCustomizationSettings } from '@prisma/client';

export interface CustomizationSettingsDomain {
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
}

@Injectable()
export class CustomizationsMapper {
  toDomain(model: PrismaCustomizationSettings): CustomizationSettingsDomain {
    return {
      id: model.id,
      theme: model.theme,
      layoutPreferences: model.layoutPreferences as Record<string, unknown>,
      defaultViews: model.defaultViews as Record<string, unknown>,
      sortFilterDefaults: model.sortFilterDefaults as Record<string, unknown>,
      paginationSize: model.paginationSize,
      featureToggles: model.featureToggles as Record<string, unknown>,
      betaFeaturesOptIn: model.betaFeaturesOptIn,
      aiFeaturesOptIn: model.aiFeaturesOptIn,
      contentSensitivityFilters: model.contentSensitivityFilters as Record<string, unknown>,
      sidebarCollapsed: model.sidebarCollapsed,
      compactMode: model.compactMode,
    };
  }
}
