import { MfaMethod } from '@/domain/interfaces';
import { DomainException } from '@/shared/exceptions';

export class MfaSettingsValueObject {
  private constructor(
    private readonly enabled: boolean,
    private readonly method: MfaMethod,
    private readonly backupCodesGenerated: boolean,
    private readonly lastVerified: Date | undefined,
  ) {
    this.validate();
  }

  static create(props: {
    enabled?: boolean;
    method?: MfaMethod;
    backupCodesGenerated?: boolean;
    lastVerified?: Date;
  }): MfaSettingsValueObject {
    return new MfaSettingsValueObject(
      props.enabled ?? false,
      props.method as MfaMethod,
      props.backupCodesGenerated ?? false,
      props.lastVerified,
    );
  }

  static fromPersistence(data: Record<string, unknown>): MfaSettingsValueObject {
    return new MfaSettingsValueObject(
      data.enabled as boolean,
      data.method as MfaMethod,
      data.backupCodesGenerated as boolean,
      data.lastVerified ? new Date(data.lastVerified as string) : undefined,
    );
  }

  toPersistence(): Record<string, unknown> {
    return {
      enabled: this.enabled,
      method: this.method,
      backupCodesGenerated: this.backupCodesGenerated,
      lastVerified: this.lastVerified?.toISOString(),
    };
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getMethod(): MfaMethod {
    return this.method;
  }

  areBackupCodesGenerated(): boolean {
    return this.backupCodesGenerated;
  }

  getLastVerified(): Date | undefined {
    return this.lastVerified;
  }

  private validate(): void {
    if (this.enabled && !this.method) {
      throw new DomainException('MFA method required when MFA is enabled');
    }

    if (this.method && !Object.values(MfaMethod).includes(this.method)) {
      throw new DomainException('Invalid MFA method');
    }
  }
}
