import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/infrastructure/persistence';
import { ICustomizationsRepository } from '@/domain/repositories/identity/preferences';
import { CustomizationsMapper, CustomizationSettingsDomain } from '@/infrastructure/persistence/prisma/mappers/identity/preferences';
import { generateUserId } from '@/shared/utils';

@Injectable()
export class PrismaCustomizationsRepository implements ICustomizationsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: CustomizationsMapper,
  ) {}

  private async getUserPreferencesId(userId: string): Promise<string | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      select: { id: true },
    });
    return preferences?.id ?? null;
  }

  async getCustomizationSettings(
    userId: string,
  ): Promise<CustomizationSettingsDomain | null> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return null;

    const settings = await this.prisma.customizationSettings.findUnique({
      where: { userPreferencesId: preferencesId },
    });

    return settings ? this.mapper.toDomain(settings) : null;
  }

  async updateCustomizationSettings(
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
  ): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    const updateData: Record<string, unknown> = {};
    if (settings.theme !== undefined) updateData.theme = settings.theme;
    if (settings.layoutPreferences !== undefined) updateData.layoutPreferences = settings.layoutPreferences as Prisma.InputJsonValue;
    if (settings.defaultViews !== undefined) updateData.defaultViews = settings.defaultViews as Prisma.InputJsonValue;
    if (settings.sortFilterDefaults !== undefined) updateData.sortFilterDefaults = settings.sortFilterDefaults as Prisma.InputJsonValue;
    if (settings.paginationSize !== undefined) updateData.paginationSize = settings.paginationSize;
    if (settings.featureToggles !== undefined) updateData.featureToggles = settings.featureToggles as Prisma.InputJsonValue;
    if (settings.betaFeaturesOptIn !== undefined) updateData.betaFeaturesOptIn = settings.betaFeaturesOptIn;
    if (settings.aiFeaturesOptIn !== undefined) updateData.aiFeaturesOptIn = settings.aiFeaturesOptIn;
    if (settings.contentSensitivityFilters !== undefined) updateData.contentSensitivityFilters = settings.contentSensitivityFilters as Prisma.InputJsonValue;
    if (settings.sidebarCollapsed !== undefined) updateData.sidebarCollapsed = settings.sidebarCollapsed;
    if (settings.compactMode !== undefined) updateData.compactMode = settings.compactMode;

    await this.prisma.customizationSettings.upsert({
      where: { userPreferencesId: preferencesId },
      update: updateData,
      create: {
        id: generateUserId(),
        userPreferencesId: preferencesId,
        ...updateData,
      },
    });
  }
}
