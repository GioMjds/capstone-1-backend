import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence';
import type { Prisma } from '@prisma/client';
import {
  UpdateNotificationSettingsDto,
  NotificationSettingsResponseDto,
} from '@/application/dto/identity/preferences/notification';
import { generateUserId } from '@/shared/utils';

@Injectable()
export class UpdateNotificationSettingsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    userId: string,
    dto: UpdateNotificationSettingsDto,
  ): Promise<NotificationSettingsResponseDto> {
    const userPreferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      include: { notificationSettings: true },
    });

    if (!userPreferences) {
      throw new NotFoundException(`User preferences not found for user: ${userId}`);
    }

    const existingSettings = userPreferences.notificationSettings;
    const existingPreferences = (existingSettings?.preferences ?? {}) as Prisma.InputJsonObject;

    const updatedPreferences: Prisma.InputJsonObject = {
      digestFrequency: (dto.digestFrequency ?? (existingPreferences.digestFrequency as string) ?? 'daily') as Prisma.InputJsonValue,
      quietHoursStart: (dto.quietHoursStart ?? (existingPreferences.quietHoursStart as string | null) ?? null) as Prisma.InputJsonValue,
      quietHoursEnd: (dto.quietHoursEnd ?? (existingPreferences.quietHoursEnd as string | null) ?? null) as Prisma.InputJsonValue,
      securityAlerts: (dto.securityAlerts ?? (existingPreferences.securityAlerts as boolean) ?? true) as Prisma.InputJsonValue,
    };

    const updatedSettings = await this.prisma.userNotificationSettings.upsert({
      where: { userPreferencesId: userPreferences.id },
      update: {
        emailNotifications: dto.emailNotifications ?? existingSettings?.emailNotifications ?? true,
        pushNotifications: dto.pushNotifications ?? existingSettings?.pushNotifications ?? false,
        smsNotifications: dto.smsNotifications ?? existingSettings?.smsNotifications ?? false,
        preferences: updatedPreferences as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        id: generateUserId(),
        userPreferencesId: userPreferences.id,
        emailNotifications: dto.emailNotifications ?? true,
        pushNotifications: dto.pushNotifications ?? false,
        smsNotifications: dto.smsNotifications ?? false,
        preferences: updatedPreferences as Prisma.InputJsonValue,
      },
    });

    const preferences = updatedSettings.preferences as Record<string, unknown>;

    return {
      id: updatedSettings.id,
      emailNotifications: updatedSettings.emailNotifications,
      pushNotifications: updatedSettings.pushNotifications,
      smsNotifications: updatedSettings.smsNotifications,
      digestFrequency: (preferences.digestFrequency as string) ?? 'daily',
      quietHoursStart: preferences.quietHoursStart as string | undefined,
      quietHoursEnd: preferences.quietHoursEnd as string | undefined,
      securityAlerts: (preferences.securityAlerts as boolean) ?? true,
      updatedAt: updatedSettings.updatedAt,
    };
  }

  validateTimeFormat(time: string): boolean {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  }

  canSetQuietHours(startTime: string, endTime: string): boolean {
    if (!this.validateTimeFormat(startTime) || !this.validateTimeFormat(endTime)) {
      return false;
    }

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return startMinutes < endMinutes;
  }

  isQuietHoursActive(startTime: string, endTime: string): boolean {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
}
