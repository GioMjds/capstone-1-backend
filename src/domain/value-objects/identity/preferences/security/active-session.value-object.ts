import { DomainException } from '@/shared/exceptions';

export class ActiveSessionValueObject {
  private constructor(
    private readonly sessionId: string,
    private readonly ipAddress: string,
    private readonly userAgent: string,
    private readonly lastSeen: Date,
    private readonly createdAt: Date,
    private readonly location?: string,
    private readonly device?: string,
    private readonly browser?: string,
    private readonly os?: string,
    private readonly isCurrent: boolean = false,
  ) {
    this.validate();
  }

  static create(props: {
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    lastSeen?: Date;
    createdAt?: Date;
    location?: string;
    device?: string;
    browser?: string;
    os?: string;
    isCurrent?: boolean;
  }): ActiveSessionValueObject {
    return new ActiveSessionValueObject(
      props.sessionId,
      props.ipAddress,
      props.userAgent,
      props.lastSeen ?? new Date(),
      props.createdAt ?? new Date(),
      props.location,
      props.device,
      props.browser,
      props.os,
      props.isCurrent ?? false,
    );
  }

  static fromPersistence(data: Record<string, unknown>): ActiveSessionValueObject {
    return new ActiveSessionValueObject(
      data.sessionId as string,
      data.ipAddress as string,
      data.userAgent as string,
      new Date(data.lastSeen as string),
      new Date(data.createdAt as string),
      data.location as string | undefined,
      data.device as string | undefined,
      data.browser as string | undefined,
      data.os as string | undefined,
      data.isCurrent as boolean,
    );
  }

  toPersistence(): Record<string, unknown> {
    return {
      sessionId: this.sessionId,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      lastSeen: this.lastSeen.toISOString(),
      createdAt: this.createdAt.toISOString(),
      location: this.location,
      device: this.device,
      browser: this.browser,
      os: this.os,
      isCurrent: this.isCurrent,
    };
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getIpAddress(): string {
    return this.ipAddress;
  }

  getUserAgent(): string {
    return this.userAgent;
  }

  getLastSeen(): Date {
    return this.lastSeen;
  }

  getCreatedAt(): Date {
    return this.createdAt;
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

  getIsCurrent(): boolean {
    return this.isCurrent;
  }

  private validate(): void {
    if (!this.sessionId || typeof this.sessionId !== 'string') {
      throw new DomainException('Invalid session ID');
    }

    if (!this.ipAddress || typeof this.ipAddress !== 'string') {
      throw new DomainException('Invalid IP address');
    }

    if (!this.userAgent || typeof this.userAgent !== 'string') {
      throw new DomainException('Invalid user agent');
    }
  }
}
