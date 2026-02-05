import { DomainException } from '@/shared/exceptions';

export class DataRetentionValueObject {
  private constructor(
    private readonly retentionMonths: number,
    private readonly allowDeletion: boolean,
    private readonly anonymizeOnDeletion: boolean,
    private readonly lastPurgeDate: Date | undefined,
  ) {
    this.validate();
  }

  static create(props: {
    retentionMonths?: number;
    allowDeletion?: boolean;
    anonymizeOnDeletion?: boolean;
    lastPurgeDate?: Date;
  }): DataRetentionValueObject {
    return new DataRetentionValueObject(
      props.retentionMonths ?? 12,
      props.allowDeletion ?? true,
      props.anonymizeOnDeletion ?? false,
      props.lastPurgeDate,
    );
  }

  static fromPersistence(data: Record<string, unknown>): DataRetentionValueObject {
    return new DataRetentionValueObject(
      data.retentionMonths as number,
      data.allowDeletion as boolean,
      data.anonymizeOnDeletion as boolean,
      data.lastPurgeDate ? new Date(data.lastPurgeDate as string) : undefined,
    );
  }

  toPersistence(): Record<string, unknown> {
    return {
      retentionMonths: this.retentionMonths,
      allowDeletion: this.allowDeletion,
      anonymizeOnDeletion: this.anonymizeOnDeletion,
      lastPurgeDate: this.lastPurgeDate?.toISOString(),
    };
  }

  getRetentionMonths(): number {
    return this.retentionMonths;
  }

  isDeletionAllowed(): boolean {
    return this.allowDeletion;
  }

  shouldAnonymizeOnDeletion(): boolean {
    return this.anonymizeOnDeletion;
  }

  getLastPurgeDate(): Date | undefined {
    return this.lastPurgeDate;
  }

  private validate(): void {
    if (this.retentionMonths < 0) {
      throw new DomainException('Retention months cannot be negative');
    }

    if (this.retentionMonths > 120) {
      throw new DomainException('Retention months cannot exceed 10 years');
    }
  }
}
