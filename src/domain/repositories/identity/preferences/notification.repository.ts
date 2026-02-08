export abstract class INotificationRepository {
  abstract getNotificationSettings(userId: string): Promise<{
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
  } | null>;

  abstract updateNotificationSettings(
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
  ): Promise<void>;

  abstract updateQuietHours(
    userId: string,
    start: string | null,
    end: string | null,
  ): Promise<void>;

  abstract updateMarketingOptIn(
    userId: string,
    optIn: boolean,
  ): Promise<void>;
}
