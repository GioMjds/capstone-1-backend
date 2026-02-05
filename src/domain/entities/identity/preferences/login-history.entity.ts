import { CreateLoginHistoryProps, LoginStatus } from '@/domain/interfaces';
import { DomainException } from '@/shared/exceptions';
import { v4 as uuidv4 } from 'uuid';

export class LoginHistoryEntity {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    private ipAddress: string,
    private userAgent: string,
    private loginTimestamp: Date,
    private status: LoginStatus,
    private location?: string,
    private device?: string,
    private browser?: string,
    private os?: string,
  ) {
    this.validate();
  }

  static create(payload: CreateLoginHistoryProps): LoginHistoryEntity {
    return new LoginHistoryEntity(
      uuidv4().slice(0, 12),
      payload.userId,
      payload.ipAddress,
      payload.userAgent,
      new Date(),
      LoginStatus.SUCCESS,
      payload.location,
      payload.device,
      payload.browser,
      payload.os,
    );
  }

  static reconstitute(payload: {
    id: string;
    userId: string;
    ipAddress: string;
    userAgent: string;
    loginTimestamp: Date;
    status: LoginStatus;
    location?: string;
    device?: string;
    browser?: string;
    os?: string;
  }): LoginHistoryEntity {
    return new LoginHistoryEntity(
      payload.id,
      payload.userId,
      payload.ipAddress,
      payload.userAgent,
      payload.loginTimestamp,
      payload.status,
      payload.location,
      payload.device,
      payload.browser,
      payload.os,
    );
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

  markAsFailed(): void {
    this.status = LoginStatus.FAILED;
  }

  markAsBlocked(): void {
    this.status = LoginStatus.BLOCKED;
  }

  markAsSuspicious(): void {
    this.status = LoginStatus.SUSPICIOUS;
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
