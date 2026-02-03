import { Injectable } from '@nestjs/common';
import { UpdateNotificationSettingsDto } from '@/application/dto/identity/preferences';
import { NotificationSettingsValueObject } from '@/domain/value-objects/identity';
import { PrismaService } from '@/infrastructure/persistence';
import { randomUUID } from 'crypto';

@Injectable()
export class UpdateNotificationSettingsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    userId: string,
    dto: UpdateNotificationSettingsDto,
  ): Promise<NotificationSettingsValueObject> {
    const userPreferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!userPreferences) {
      const newPreferences = await this.prisma.userPreferences.create({
        data: {
          id: randomUUID().replace(/-/g, '').substring(0, 12),
          userId,
          notificationSettings: {
            emailNotifications: dto.emailNotifications ?? true,
            pushNotifications: dto.pushNotifications ?? true,
            smsNotifications: dto.smsNotifications ?? false,
            digestFrequency: dto.digestFrequency ?? 'daily',
            quietHoursStart: dto.quietHoursStart,
            quietHoursEnd: dto.quietHoursEnd,
            securityAlerts: dto.securityAlerts ?? true,
          },
        },
      });

      return NotificationSettingsValueObject.fromPersistence(
        newPreferences.notificationSettings,
      );
    }

    const currentNotificationSettings = userPreferences.notificationSettings as Record<
      string,
      any
    >;
    const updatedNotificationSettings = {
      ...currentNotificationSettings,
      ...(dto.emailNotifications !== undefined && {
        emailNotifications: dto.emailNotifications,
      }),
      ...(dto.pushNotifications !== undefined && {
        pushNotifications: dto.pushNotifications,
      }),
      ...(dto.smsNotifications !== undefined && {
        smsNotifications: dto.smsNotifications,
      }),
      ...(dto.digestFrequency && { digestFrequency: dto.digestFrequency }),
      ...(dto.quietHoursStart && { quietHoursStart: dto.quietHoursStart }),
      ...(dto.quietHoursEnd && { quietHoursEnd: dto.quietHoursEnd }),
      ...(dto.securityAlerts !== undefined && {
        securityAlerts: dto.securityAlerts,
      }),
    };

    await this.prisma.userPreferences.update({
      where: { userId },
      data: {
        notificationSettings: updatedNotificationSettings,
        updatedAt: new Date(),
      },
    });

    return NotificationSettingsValueObject.fromPersistence(
      updatedNotificationSettings,
    );
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
