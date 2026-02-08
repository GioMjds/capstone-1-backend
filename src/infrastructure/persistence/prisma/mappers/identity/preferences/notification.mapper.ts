import { Injectable } from '@nestjs/common';
import { UserNotificationSettings as PrismaNotificationSettings } from '@prisma/client';

export interface NotificationSettingsDomain {
  id: string;
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
}

@Injectable()
export class NotificationMapper {
  toDomain(model: PrismaNotificationSettings): NotificationSettingsDomain {
    return {
      id: model.id,
      emailNotifications: model.emailNotifications,
      pushNotifications: model.pushNotifications,
      smsNotifications: model.smsNotifications,
      preferences: model.preferences as Record<string, unknown>,
      emailByCategory: model.emailByCategory as Record<string, unknown>,
      pushByCategory: model.pushByCategory as Record<string, unknown>,
      smsAlerts: model.smsAlerts as Record<string, unknown>,
      quietHoursStart: model.quietHoursStart,
      quietHoursEnd: model.quietHoursEnd,
      marketingOptIn: model.marketingOptIn,
      digestFrequency: model.digestFrequency,
    };
  }
}
