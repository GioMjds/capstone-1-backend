import { AuditLogCategory } from '@/domain/interfaces';
import { DomainException } from '@/shared/exceptions';

export class AuditLogEntryValueObject {
  private constructor(
    private readonly category: AuditLogCategory,
    private readonly field: string,
    private readonly oldValue: unknown,
    private readonly newValue: unknown,
    private readonly changedBy: string,
    private readonly changeReason: string | undefined,
    private readonly timestamp: Date,
  ) {
    this.validate();
  }

  static create(props: {
    category: AuditLogCategory;
    field: string;
    oldValue: unknown;
    newValue: unknown;
    changedBy: string;
    changeReason?: string;
    timestamp?: Date;
  }): AuditLogEntryValueObject {
    return new AuditLogEntryValueObject(
      props.category,
      props.field,
      props.oldValue,
      props.newValue,
      props.changedBy,
      props.changeReason,
      props.timestamp ?? new Date(),
    );
  }

  static fromPersistence(data: Record<string, unknown>): AuditLogEntryValueObject {
    return new AuditLogEntryValueObject(
      data.category as AuditLogCategory,
      data.field as string,
      data.oldValue,
      data.newValue,
      data.changedBy as string,
      data.changeReason as string | undefined,
      new Date(data.timestamp as string),
    );
  }

  toPersistence(): Record<string, unknown> {
    return {
      category: this.category,
      field: this.field,
      oldValue: this.oldValue,
      newValue: this.newValue,
      changedBy: this.changedBy,
      changeReason: this.changeReason,
      timestamp: this.timestamp.toISOString(),
    };
  }

  getCategory(): AuditLogCategory {
    return this.category;
  }

  getField(): string {
    return this.field;
  }

  getOldValue(): unknown {
    return this.oldValue;
  }

  getNewValue(): unknown {
    return this.newValue;
  }

  getChangedBy(): string {
    return this.changedBy;
  }

  getChangeReason(): string | undefined {
    return this.changeReason;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  private validate(): void {
    if (!Object.values(AuditLogCategory).includes(this.category)) {
      throw new DomainException('Invalid audit log category');
    }

    if (!this.field || typeof this.field !== 'string') {
      throw new DomainException('Invalid field name');
    }

    if (!this.changedBy || typeof this.changedBy !== 'string') {
      throw new DomainException('Invalid changedBy value');
    }
  }
}
