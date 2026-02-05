export interface INotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  digestFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  quietHoursStart?: string;
  quietHoursEnd?: string;
  securityAlerts: boolean;
}

export interface INotificationCategory {
  category: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface IQuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface IMarketingPreferences {
  emailMarketing: boolean;
  smsMarketing: boolean;
  partnerOffers: boolean;
}
