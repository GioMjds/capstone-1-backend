import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/infrastructure/persistence';
import { IPrivacyRepository } from '@/domain/repositories/identity/preferences';
import { PrivacyMapper } from '@/infrastructure/persistence/prisma/mappers/identity/preferences';
import { IPrivacySettings } from '@/domain/interfaces';
import { generateUserId } from '@/shared/utils';

@Injectable()
export class PrismaPrivacyRepository implements IPrivacyRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrivacyMapper,
  ) {}

  private async getUserPreferencesId(userId: string): Promise<string | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      select: { id: true },
    });
    return preferences?.id ?? null;
  }

  async getPrivacySettings(userId: string): Promise<IPrivacySettings | null> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return null;

    const settings = await this.prisma.privacySettings.findUnique({
      where: { userPreferencesId: preferencesId },
    });

    return settings ? this.mapper.toDomain(settings) : null;
  }

  async updatePrivacySettings(
    userId: string,
    settings: Partial<IPrivacySettings>,
  ): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    await this.prisma.privacySettings.upsert({
      where: { userPreferencesId: preferencesId },
      update: {
        profileVisibility: settings.profileVisibility,
        activityVisibility: settings.activityVisibility as unknown as Prisma.InputJsonValue,
        fieldLevelVisibility: settings.fieldLevelVisibility as unknown as Prisma.InputJsonValue,
        onlinePresence: settings.onlinePresence,
        allowPublicProfile: settings.allowPublicProfile,
        allowSearchEngineIndex: settings.allowSearchEngineIndex,
        allowThirdPartySharing: settings.allowThirdPartySharing,
      },
      create: {
        id: generateUserId(),
        userPreferencesId: preferencesId,
        profileVisibility: settings.profileVisibility ?? 'private',
        activityVisibility: (settings.activityVisibility ?? {}) as unknown as Prisma.InputJsonValue,
        fieldLevelVisibility: (settings.fieldLevelVisibility ?? {}) as unknown as Prisma.InputJsonValue,
        onlinePresence: settings.onlinePresence ?? 'hidden',
        allowPublicProfile: settings.allowPublicProfile ?? false,
        allowSearchEngineIndex: settings.allowSearchEngineIndex ?? false,
        allowThirdPartySharing: settings.allowThirdPartySharing ?? false,
      },
    });
  }

  async updateProfileVisibility(userId: string, visibility: string): Promise<void> {
    await this.updatePrivacySettings(userId, { profileVisibility: visibility });
  }

  async updateOnlinePresence(userId: string, presence: string): Promise<void> {
    await this.updatePrivacySettings(userId, { onlinePresence: presence });
  }

  async updateActivityVisibility(
    userId: string,
    activityVisibility: Record<string, unknown>,
  ): Promise<void> {
    await this.updatePrivacySettings(userId, {
      activityVisibility: activityVisibility as unknown as IPrivacySettings['activityVisibility'],
    });
  }

  async updateFieldLevelVisibility(
    userId: string,
    fieldVisibility: Record<string, unknown>,
  ): Promise<void> {
    await this.updatePrivacySettings(userId, {
      fieldLevelVisibility: fieldVisibility as unknown as IPrivacySettings['fieldLevelVisibility'],
    });
  }
}
