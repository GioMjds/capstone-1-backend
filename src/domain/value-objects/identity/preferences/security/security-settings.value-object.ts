import { DomainException } from '@/shared/exceptions';

export class SecuritySettingsValueObject {
  constructor(
    private readonly twoFactorEnabled: boolean = false,
    private readonly twoFactorMethod?: string,
    private readonly passkeysEnabled: boolean = false,
    private readonly passwordChangedAt?: Date,
    private readonly activeSessions: Record<string, any>[] = [],
    private readonly trustedDevices: Record<string, any>[] = [],
  ) {
    this.validate();
  }

  static create(props: {
    twoFactorEnabled?: boolean;
    twoFactorMethod?: string;
    passkeysEnabled?: boolean;
    passwordChangedAt?: Date;
    activeSessions?: Record<string, any>[];
    trustedDevices?: Record<string, any>[];
  }): SecuritySettingsValueObject {
    return new SecuritySettingsValueObject(
      props.twoFactorEnabled ?? false,
      props.twoFactorMethod,
      props.passkeysEnabled ?? false,
      props.passwordChangedAt,
      props.activeSessions ?? [],
      props.trustedDevices ?? [],
    );
  }

  static fromPersistence(data: Record<string, any>): SecuritySettingsValueObject {
    return new SecuritySettingsValueObject(
      data.twoFactorEnabled ?? false,
      data.twoFactorMethod,
      data.passkeysEnabled ?? false,
      data.passwordChangedAt ? new Date(data.passwordChangedAt) : undefined,
      Array.isArray(data.activeSessions) ? data.activeSessions : [],
      Array.isArray(data.trustedDevices) ? data.trustedDevices : [],
    );
  }

  toPersistence(): Record<string, any> {
    return {
      twoFactorEnabled: this.twoFactorEnabled,
      twoFactorMethod: this.twoFactorMethod,
      passkeysEnabled: this.passkeysEnabled,
      passwordChangedAt: this.passwordChangedAt,
      activeSessions: this.activeSessions,
      trustedDevices: this.trustedDevices,
    };
  }

  isTwoFactorEnabled(): boolean {
    return this.twoFactorEnabled;
  }

  getTwoFactorMethod(): string | undefined {
    return this.twoFactorMethod;
  }

  arePasskeysEnabled(): boolean {
    return this.passkeysEnabled;
  }

  getPasswordChangedAt(): Date | undefined {
    return this.passwordChangedAt;
  }

  getActiveSessions(): Record<string, any>[] {
    return [...this.activeSessions];
  }

  getTrustedDevices(): Record<string, any>[] {
    return [...this.trustedDevices];
  }

  private validate(): void {
    if (
      this.twoFactorEnabled &&
      this.twoFactorMethod &&
      !['authenticator', 'sms', 'email'].includes(this.twoFactorMethod)
    ) {
      throw new DomainException('Invalid 2FA method');
    }

    if (!Array.isArray(this.activeSessions)) {
      throw new DomainException('Active sessions must be an array');
    }

    if (!Array.isArray(this.trustedDevices)) {
      throw new DomainException('Trusted devices must be an array');
    }
  }
}
