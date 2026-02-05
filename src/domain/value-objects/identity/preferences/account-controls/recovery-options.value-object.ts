import { RecoveryMethod } from '@/domain/interfaces';
import { DomainException } from '@/shared/exceptions';

export class RecoveryOptionsValueObject {
  private constructor(
    private readonly primaryMethod: RecoveryMethod,
    private readonly secondaryMethods: RecoveryMethod[],
    private readonly recoveryEmail: string | undefined,
    private readonly recoveryPhone: string | undefined,
    private readonly backupCodesRemaining: number,
  ) {
    this.validate();
  }

  static create(props: {
    primaryMethod?: RecoveryMethod;
    secondaryMethods?: RecoveryMethod[];
    recoveryEmail?: string;
    recoveryPhone?: string;
    backupCodesRemaining?: number;
  }): RecoveryOptionsValueObject {
    return new RecoveryOptionsValueObject(
      props.primaryMethod ?? RecoveryMethod.EMAIL,
      props.secondaryMethods ?? [],
      props.recoveryEmail,
      props.recoveryPhone,
      props.backupCodesRemaining ?? 0,
    );
  }

  static fromPersistence(data: Record<string, unknown>): RecoveryOptionsValueObject {
    return new RecoveryOptionsValueObject(
      data.primaryMethod as RecoveryMethod,
      data.secondaryMethods as RecoveryMethod[],
      data.recoveryEmail as string | undefined,
      data.recoveryPhone as string | undefined,
      data.backupCodesRemaining as number,
    );
  }

  toPersistence(): Record<string, unknown> {
    return {
      primaryMethod: this.primaryMethod,
      secondaryMethods: this.secondaryMethods,
      recoveryEmail: this.recoveryEmail,
      recoveryPhone: this.recoveryPhone,
      backupCodesRemaining: this.backupCodesRemaining,
    };
  }

  getPrimaryMethod(): RecoveryMethod {
    return this.primaryMethod;
  }

  getSecondaryMethods(): RecoveryMethod[] {
    return [...this.secondaryMethods];
  }

  getRecoveryEmail(): string | undefined {
    return this.recoveryEmail;
  }

  getRecoveryPhone(): string | undefined {
    return this.recoveryPhone;
  }

  getBackupCodesRemaining(): number {
    return this.backupCodesRemaining;
  }

  private validate(): void {
    if (!Object.values(RecoveryMethod).includes(this.primaryMethod)) {
      throw new DomainException('Invalid primary recovery method');
    }

    for (const method of this.secondaryMethods) {
      if (!Object.values(RecoveryMethod).includes(method)) {
        throw new DomainException('Invalid secondary recovery method');
      }
    }

    if (this.backupCodesRemaining < 0) {
      throw new DomainException('Backup codes remaining cannot be negative');
    }
  }
}
