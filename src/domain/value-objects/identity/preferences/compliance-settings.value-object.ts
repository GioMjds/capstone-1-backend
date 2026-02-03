import { DomainException } from '@/shared/exceptions';

export class ComplianceSettingsValueObject {
  constructor(
    private readonly dataShareConsent: boolean = false,
    private readonly dataRetentionMonths: number = 12,
    private readonly allowAccountDeletion: boolean = true,
    private readonly auditLogPreference: string = 'full',
  ) {
    this.validate();
  }

  static create(props: {
    dataShareConsent?: boolean;
    dataRetentionMonths?: number;
    allowAccountDeletion?: boolean;
    auditLogPreference?: string;
  }): ComplianceSettingsValueObject {
    return new ComplianceSettingsValueObject(
      props.dataShareConsent ?? false,
      props.dataRetentionMonths ?? 12,
      props.allowAccountDeletion ?? true,
      props.auditLogPreference ?? 'full',
    );
  }

  static fromPersistence(data: Record<string, any>): ComplianceSettingsValueObject {
    return new ComplianceSettingsValueObject(
      data.dataShareConsent ?? false,
      data.dataRetentionMonths ?? 12,
      data.allowAccountDeletion ?? true,
      data.auditLogPreference ?? 'full',
    );
  }

  toPersistence(): Record<string, any> {
    return {
      dataShareConsent: this.dataShareConsent,
      dataRetentionMonths: this.dataRetentionMonths,
      allowAccountDeletion: this.allowAccountDeletion,
      auditLogPreference: this.auditLogPreference,
    };
  }

  isDataShareConsentGiven(): boolean {
    return this.dataShareConsent;
  }

  getDataRetentionMonths(): number {
    return this.dataRetentionMonths;
  }

  isAccountDeletionAllowed(): boolean {
    return this.allowAccountDeletion;
  }

  getAuditLogPreference(): string {
    return this.auditLogPreference;
  }

  private validate(): void {
    if (this.dataRetentionMonths < 0) {
      throw new DomainException('Data retention months cannot be negative');
    }

    const validPreferences = ['full', 'minimal', 'none'];
    if (!validPreferences.includes(this.auditLogPreference)) {
      throw new DomainException('Invalid audit log preference');
    }
  }
}
