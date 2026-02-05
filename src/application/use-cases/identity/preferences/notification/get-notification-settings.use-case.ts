import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationSettingsResponseDto } from '@/application/dto/identity/preferences/notification';
import { PrismaService } from '@/infrastructure/persistence';

@Injectable()
export class GetNotificationSettingsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<NotificationSettingsResponseDto> {
    const userPreferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      include: { notificationSettings: true },
    });

    if (!userPreferences) {
      throw new NotFoundException(`User preferences not found for user: ${userId}`);
    }

    const settings = userPreferences.notificationSettings;

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
        updatedAt: userPreferences.updatedAt,
      };
    }

    const preferences = (settings.preferences ?? {}) as Record<string, unknown>;

    return {
      id: settings.id,
      emailNotifications: settings.emailNotifications,
      pushNotifications: settings.pushNotifications,
      smsNotifications: settings.smsNotifications,
      digestFrequency: (preferences.digestFrequency as string) ?? 'daily',
      quietHoursStart: preferences.quietHoursStart as string | undefined,
      quietHoursEnd: preferences.quietHoursEnd as string | undefined,
      securityAlerts: (preferences.securityAlerts as boolean) ?? true,
      updatedAt: settings.updatedAt,
    };
  }
}
