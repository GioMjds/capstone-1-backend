import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence';
import { IAccessibilityRepository } from '@/domain/repositories/identity/preferences';
import { AccessibilityMapper, AccessibilitySettingsDomain } from '@/infrastructure/persistence/prisma/mappers/identity/preferences';
import { generateUserId } from '@/shared/utils';

@Injectable()
export class PrismaAccessibilityRepository implements IAccessibilityRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: AccessibilityMapper,
  ) {}

  private async getUserPreferencesId(userId: string): Promise<string | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      select: { id: true },
    });
    return preferences?.id ?? null;
  }

  async getAccessibilitySettings(
    userId: string,
  ): Promise<AccessibilitySettingsDomain | null> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return null;

    const settings = await this.prisma.accessibilitySettings.findUnique({
      where: { userPreferencesId: preferencesId },
    });

    return settings ? this.mapper.toDomain(settings) : null;
  }

  async updateAccessibilitySettings(
    userId: string,
    settings: Partial<{
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
    }>,
  ): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    await this.prisma.accessibilitySettings.upsert({
      where: { userPreferencesId: preferencesId },
      update: settings,
      create: {
        id: generateUserId(),
        userPreferencesId: preferencesId,
        ...settings,
      },
    });
  }
}
