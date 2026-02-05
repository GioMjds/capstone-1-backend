import { LoginStatus } from '@/domain/interfaces';
import { DomainException } from '@/shared/exceptions';

export class LoginHistoryEntryValueObject {
  private constructor(
    private readonly ipAddress: string,
    private readonly userAgent: string,
    private readonly loginTimestamp: Date,
    private readonly status: LoginStatus,
    private readonly location?: string,
    private readonly device?: string,
    private readonly browser?: string,
    private readonly os?: string,
  ) {
    this.validate();
  }

  static create(props: {
    ipAddress: string;
    userAgent: string;
    loginTimestamp?: Date;
    status?: LoginStatus;
    location?: string;
    device?: string;
    browser?: string;
    os?: string;
  }): LoginHistoryEntryValueObject {
    return new LoginHistoryEntryValueObject(
      props.ipAddress,
      props.userAgent,
      props.loginTimestamp ?? new Date(),
      props.status ?? LoginStatus.SUCCESS,
      props.location,
      props.device,
      props.browser,
      props.os,
    );
  }

  static fromPersistence(data: Record<string, unknown>): LoginHistoryEntryValueObject {
    return new LoginHistoryEntryValueObject(
      data.ipAddress as string,
      data.userAgent as string,
      new Date(data.loginTimestamp as string),
      data.status as LoginStatus,
      data.location as string | undefined,
      data.device as string | undefined,
      data.browser as string | undefined,
      data.os as string | undefined,
    );
  }

  toPersistence(): Record<string, unknown> {
    return {
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      loginTimestamp: this.loginTimestamp.toISOString(),
      status: this.status,
      location: this.location,
      device: this.device,
      browser: this.browser,
      os: this.os,
    };
  }

  getIpAddress(): string {
    return this.ipAddress;
  }

  getUserAgent(): string {
    return this.userAgent;
  }

  getLoginTimestamp(): Date {
    return this.loginTimestamp;
  }

  getStatus(): LoginStatus {
    return this.status;
  }

  getLocation(): string | undefined {
    return this.location;
  }

  getDevice(): string | undefined {
    return this.device;
  }

  getBrowser(): string | undefined {
    return this.browser;
  }

  getOs(): string | undefined {
    return this.os;
  }

  private validate(): void {
    if (!this.ipAddress || typeof this.ipAddress !== 'string') {
      throw new DomainException('Invalid IP address');
    }

    if (!this.userAgent || typeof this.userAgent !== 'string') {
      throw new DomainException('Invalid user agent');
    }

    if (!Object.values(LoginStatus).includes(this.status)) {
      throw new DomainException('Invalid login status');
    }
  }
}
