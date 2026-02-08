import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  UpdateNotificationSettingsDto,
  NotificationSettingsResponseDto,
} from '@/application/dto/identity/preferences/notification';
import { INotificationRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class UpdateNotificationSettingsUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(
    userId: string,
    dto: UpdateNotificationSettingsDto,
  ): Promise<NotificationSettingsResponseDto> {
    await this.notificationRepository.updateNotificationSettings(userId, {
      emailNotifications: dto.emailNotifications,
      pushNotifications: dto.pushNotifications,
      smsNotifications: dto.smsNotifications,
      digestFrequency: dto.digestFrequency,
      quietHoursStart: dto.quietHoursStart,
      quietHoursEnd: dto.quietHoursEnd,
    });

    const settings = await this.notificationRepository.getNotificationSettings(userId);

    if (!settings) {
      throw new NotFoundException('Notification settings not found after update');
    }

    const preferences = (settings.preferences ?? {}) as Record<string, unknown>;

    return {
      id: settings.id,
      emailNotifications: settings.emailNotifications,
      pushNotifications: settings.pushNotifications,
      smsNotifications: settings.smsNotifications,
      digestFrequency: (settings.digestFrequency as string) ?? 'daily',
      quietHoursStart: settings.quietHoursStart ?? undefined,
      quietHoursEnd: settings.quietHoursEnd ?? undefined,
      securityAlerts: (preferences.securityAlerts as boolean) ?? true,
      updatedAt: new Date(),
    };
  }
}
