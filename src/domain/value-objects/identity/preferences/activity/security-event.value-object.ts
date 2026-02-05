import { SecurityEventType } from '@/domain/interfaces';
import { DomainException } from '@/shared/exceptions';

export class SecurityEventValueObject {
  private constructor(
    private readonly eventType: SecurityEventType,
    private readonly details: Record<string, unknown>,
    private readonly ipAddress: string | undefined,
    private readonly userAgent: string | undefined,
    private readonly timestamp: Date,
  ) {
    this.validate();
  }

  static create(props: {
    eventType: SecurityEventType;
    details: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    timestamp?: Date;
  }): SecurityEventValueObject {
    return new SecurityEventValueObject(
      props.eventType,
      props.details,
      props.ipAddress,
      props.userAgent,
      props.timestamp ?? new Date(),
    );
  }

  static fromPersistence(data: Record<string, unknown>): SecurityEventValueObject {
    return new SecurityEventValueObject(
      data.eventType as SecurityEventType,
      data.details as Record<string, unknown>,
      data.ipAddress as string | undefined,
      data.userAgent as string | undefined,
      new Date(data.timestamp as string),
    );
  }

  toPersistence(): Record<string, unknown> {
    return {
      eventType: this.eventType,
      details: this.details,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      timestamp: this.timestamp.toISOString(),
    };
  }

  getEventType(): SecurityEventType {
    return this.eventType;
  }

  getDetails(): Record<string, unknown> {
    return { ...this.details };
  }

  getIpAddress(): string | undefined {
    return this.ipAddress;
  }

  getUserAgent(): string | undefined {
    return this.userAgent;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  private validate(): void {
    if (!Object.values(SecurityEventType).includes(this.eventType)) {
      throw new DomainException('Invalid security event type');
    }

    if (!this.details || typeof this.details !== 'object') {
      throw new DomainException('Invalid event details');
    }
  }
}
