import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationSettingsResponseDto } from '@/application/dto/identity/preferences/notification';
import { INotificationRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class GetNotificationSettingsUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string): Promise<NotificationSettingsResponseDto> {
    const settings = await this.notificationRepository.getNotificationSettings(userId);

    if (!settings) {
      return {
        id: '',
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: false,
        digestFrequency: 'daily',
        quietHoursStart: undefined,
        quietHoursEnd: undefined,
        securityAlerts: true,
        updatedAt: new Date(),
      };
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
