import { DomainException } from '@/shared/exceptions';

export class TrustedDeviceValueObject {
  private constructor(
    private readonly deviceId: string,
    private readonly deviceName: string,
    private readonly deviceType: string,
    private readonly lastUsed: Date,
    private readonly createdAt: Date,
    private readonly browser?: string,
    private readonly os?: string,
  ) {
    this.validate();
  }

  static create(props: {
    deviceId: string;
    deviceName: string;
    deviceType?: string;
    lastUsed?: Date;
    createdAt?: Date;
    browser?: string;
    os?: string;
  }): TrustedDeviceValueObject {
    return new TrustedDeviceValueObject(
      props.deviceId,
      props.deviceName,
      props.deviceType ?? 'unknown',
      props.lastUsed ?? new Date(),
      props.createdAt ?? new Date(),
      props.browser,
      props.os,
    );
  }

  static fromPersistence(data: Record<string, unknown>): TrustedDeviceValueObject {
    return new TrustedDeviceValueObject(
      data.deviceId as string,
      data.deviceName as string,
      data.deviceType as string,
      new Date(data.lastUsed as string),
      new Date(data.createdAt as string),
      data.browser as string | undefined,
      data.os as string | undefined,
    );
  }

  toPersistence(): Record<string, unknown> {
    return {
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      deviceType: this.deviceType,
      lastUsed: this.lastUsed.toISOString(),
      createdAt: this.createdAt.toISOString(),
      browser: this.browser,
      os: this.os,
    };
  }

  getDeviceId(): string {
    return this.deviceId;
  }

  getDeviceName(): string {
    return this.deviceName;
  }

  getDeviceType(): string {
    return this.deviceType;
  }

  getLastUsed(): Date {
    return this.lastUsed;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getBrowser(): string | undefined {
    return this.browser;
  }

  getOs(): string | undefined {
    return this.os;
  }

  private validate(): void {
    if (!this.deviceId || typeof this.deviceId !== 'string') {
      throw new DomainException('Invalid device ID');
    }

    if (!this.deviceName || typeof this.deviceName !== 'string') {
      throw new DomainException('Invalid device name');
    }
  }
}
