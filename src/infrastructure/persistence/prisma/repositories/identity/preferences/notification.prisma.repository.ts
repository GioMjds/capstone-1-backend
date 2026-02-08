import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/infrastructure/persistence';
import { INotificationRepository } from '@/domain/repositories/identity/preferences';
import { NotificationMapper, NotificationSettingsDomain } from '@/infrastructure/persistence/prisma/mappers/identity/preferences';
import { generateUserId } from '@/shared/utils';

@Injectable()
export class PrismaNotificationRepository implements INotificationRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: NotificationMapper,
  ) {}

  private async getUserPreferencesId(userId: string): Promise<string | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      select: { id: true },
    });
    return preferences?.id ?? null;
  }

  async getNotificationSettings(
    userId: string,
  ): Promise<NotificationSettingsDomain | null> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return null;

    const settings = await this.prisma.userNotificationSettings.findUnique({
      where: { userPreferencesId: preferencesId },
    });

    return settings ? this.mapper.toDomain(settings) : null;
  }

  async updateNotificationSettings(
    userId: string,
    settings: Partial<{
      emailNotifications: boolean;
      pushNotifications: boolean;
      smsNotifications: boolean;
      preferences: Record<string, unknown>;
      emailByCategory: Record<string, unknown>;
      pushByCategory: Record<string, unknown>;
      smsAlerts: Record<string, unknown>;
      quietHoursStart: string | null;
      quietHoursEnd: string | null;
      marketingOptIn: boolean;
      digestFrequency: string;
    }>,
  ): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    const updateData: Record<string, unknown> = {};
    if (settings.emailNotifications !== undefined) updateData.emailNotifications = settings.emailNotifications;
    if (settings.pushNotifications !== undefined) updateData.pushNotifications = settings.pushNotifications;
    if (settings.smsNotifications !== undefined) updateData.smsNotifications = settings.smsNotifications;
    if (settings.preferences !== undefined) updateData.preferences = settings.preferences as Prisma.InputJsonValue;
    if (settings.emailByCategory !== undefined) updateData.emailByCategory = settings.emailByCategory as Prisma.InputJsonValue;
    if (settings.pushByCategory !== undefined) updateData.pushByCategory = settings.pushByCategory as Prisma.InputJsonValue;
    if (settings.smsAlerts !== undefined) updateData.smsAlerts = settings.smsAlerts as Prisma.InputJsonValue;
    if (settings.quietHoursStart !== undefined) updateData.quietHoursStart = settings.quietHoursStart;
    if (settings.quietHoursEnd !== undefined) updateData.quietHoursEnd = settings.quietHoursEnd;
    if (settings.marketingOptIn !== undefined) updateData.marketingOptIn = settings.marketingOptIn;
    if (settings.digestFrequency !== undefined) updateData.digestFrequency = settings.digestFrequency;

    await this.prisma.userNotificationSettings.upsert({
      where: { userPreferencesId: preferencesId },
      update: updateData,
      create: {
        id: generateUserId(),
        userPreferencesId: preferencesId,
        ...updateData,
      },
    });
  }

  async updateQuietHours(
    userId: string,
    start: string | null,
    end: string | null,
  ): Promise<void> {
    await this.updateNotificationSettings(userId, {
      quietHoursStart: start,
      quietHoursEnd: end,
    });
  }

  async updateMarketingOptIn(
    userId: string,
    optIn: boolean,
  ): Promise<void> {
    await this.updateNotificationSettings(userId, {
      marketingOptIn: optIn,
    });
  }
}
