import { DomainException } from '@/shared/exceptions';

export class NotificationSettingsValueObject {
  constructor(
    private readonly emailNotifications: boolean = true,
    private readonly pushNotifications: boolean = true,
    private readonly smsNotifications: boolean = false,
    private readonly digestFrequency: string = 'immediate',
    private readonly quietHoursStart?: string,
    private readonly quietHoursEnd?: string,
    private readonly securityAlerts: boolean = true,
  ) {
    this.validate();
  }

  static create(props: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    smsNotifications?: boolean;
    digestFrequency?: string;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    securityAlerts?: boolean;
  }): NotificationSettingsValueObject {
    return new NotificationSettingsValueObject(
      props.emailNotifications ?? true,
      props.pushNotifications ?? true,
      props.smsNotifications ?? false,
      props.digestFrequency ?? 'immediate',
      props.quietHoursStart,
      props.quietHoursEnd,
      props.securityAlerts ?? true,
    );
  }

  static fromPersistence(data: Record<string, any>): NotificationSettingsValueObject {
    return new NotificationSettingsValueObject(
      data.emailNotifications ?? true,
      data.pushNotifications ?? true,
      data.smsNotifications ?? false,
      data.digestFrequency ?? 'immediate',
      data.quietHoursStart,
      data.quietHoursEnd,
      data.securityAlerts ?? true,
    );
  }

  toPersistence(): Record<string, any> {
    return {
      emailNotifications: this.emailNotifications,
      pushNotifications: this.pushNotifications,
      smsNotifications: this.smsNotifications,
      digestFrequency: this.digestFrequency,
      quietHoursStart: this.quietHoursStart,
      quietHoursEnd: this.quietHoursEnd,
      securityAlerts: this.securityAlerts,
    };
  }

  isEmailNotificationsEnabled(): boolean {
    return this.emailNotifications;
  }

  isPushNotificationsEnabled(): boolean {
    return this.pushNotifications;
  }

  isSmsNotificationsEnabled(): boolean {
    return this.smsNotifications;
  }

  getDigestFrequency(): string {
    return this.digestFrequency;
  }

  getQuietHours(): { start?: string; end?: string } {
    return {
      start: this.quietHoursStart,
      end: this.quietHoursEnd,
    };
  }

  areSecurityAlertsEnabled(): boolean {
    return this.securityAlerts;
  }

  private validate(): void {
    const validFrequencies = ['immediate', 'daily', 'weekly', 'monthly'];
    if (!validFrequencies.includes(this.digestFrequency)) {
      throw new DomainException('Invalid digest frequency');
    }

    if (this.quietHoursStart && !this.isValidTimeFormat(this.quietHoursStart)) {
      throw new DomainException('Invalid quiet hours start time format (HH:mm)');
    }

    if (this.quietHoursEnd && !this.isValidTimeFormat(this.quietHoursEnd)) {
      throw new DomainException('Invalid quiet hours end time format (HH:mm)');
    }
  }

  private isValidTimeFormat(time: string): boolean {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  }
}
