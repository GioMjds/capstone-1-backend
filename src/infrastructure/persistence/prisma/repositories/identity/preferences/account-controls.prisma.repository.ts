import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence';
import { IAccountControlsRepository } from '@/domain/repositories/identity/preferences';
import { AccountControlsMapper } from '@/infrastructure/persistence/prisma/mappers/identity/preferences';
import { IAccountControlSettings } from '@/domain/interfaces';
import { generateUserId } from '@/shared/utils';

@Injectable()
export class PrismaAccountControlsRepository implements IAccountControlsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: AccountControlsMapper,
  ) {}

  private async getUserPreferencesId(userId: string): Promise<string | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      select: { id: true },
    });
    return preferences?.id ?? null;
  }

  async getAccountControlSettings(
    userId: string,
  ): Promise<IAccountControlSettings | null> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return null;

    const settings = await this.prisma.accountControlSettings.findUnique({
      where: { userPreferencesId: preferencesId },
    });

    return settings ? this.mapper.toDomain(settings) : null;
  }

  async updateAccountControlSettings(
    userId: string,
    settings: Partial<IAccountControlSettings>,
  ): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    await this.prisma.accountControlSettings.upsert({
      where: { userPreferencesId: preferencesId },
      update: {
        deactivated: settings.deactivated,
        deactivatedAt: settings.deactivatedAt,
        deletionRequested: settings.deletionRequested,
        deletionRequestedAt: settings.deletionRequestedAt,
        recoveryToken: settings.recoveryToken,
      },
      create: {
        id: generateUserId(),
        userPreferencesId: preferencesId,
        deactivated: settings.deactivated ?? false,
        deactivatedAt: settings.deactivatedAt ?? null,
        deletionRequested: settings.deletionRequested ?? false,
        deletionRequestedAt: settings.deletionRequestedAt ?? null,
        recoveryToken: settings.recoveryToken ?? null,
      },
    });
  }

  async deactivateAccount(userId: string): Promise<void> {
    await this.updateAccountControlSettings(userId, {
      deactivated: true,
      deactivatedAt: new Date(),
    });
  }

  async reactivateAccount(userId: string): Promise<void> {
    await this.updateAccountControlSettings(userId, {
      deactivated: false,
      deactivatedAt: null,
    });
  }

  async requestDeletion(userId: string): Promise<void> {
    await this.updateAccountControlSettings(userId, {
      deletionRequested: true,
      deletionRequestedAt: new Date(),
    });
  }

  async cancelDeletion(userId: string): Promise<void> {
    await this.updateAccountControlSettings(userId, {
      deletionRequested: false,
      deletionRequestedAt: null,
    });
  }
}
