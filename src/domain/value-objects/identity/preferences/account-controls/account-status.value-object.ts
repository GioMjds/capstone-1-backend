import { AccountState } from '@/domain/interfaces';
import { DomainException } from '@/shared/exceptions';

export class AccountStatusValueObject {
  private constructor(
    private readonly state: AccountState,
    private readonly deactivatedAt: Date | undefined,
    private readonly deletionRequestedAt: Date | undefined,
    private readonly recoveryToken: string | undefined,
  ) {
    this.validate();
  }

  static create(props: {
    state?: AccountState;
    deactivatedAt?: Date;
    deletionRequestedAt?: Date;
    recoveryToken?: string;
  }): AccountStatusValueObject {
    return new AccountStatusValueObject(
      props.state ?? AccountState.ACTIVE,
      props.deactivatedAt,
      props.deletionRequestedAt,
      props.recoveryToken,
    );
  }

  static fromPersistence(data: Record<string, unknown>): AccountStatusValueObject {
    return new AccountStatusValueObject(
      data.state as AccountState,
      data.deactivatedAt ? new Date(data.deactivatedAt as string) : undefined,
      data.deletionRequestedAt ? new Date(data.deletionRequestedAt as string) : undefined,
      data.recoveryToken as string | undefined,
    );
  }

  toPersistence(): Record<string, unknown> {
    return {
      state: this.state,
      deactivatedAt: this.deactivatedAt?.toISOString(),
      deletionRequestedAt: this.deletionRequestedAt?.toISOString(),
      recoveryToken: this.recoveryToken,
    };
  }

  getState(): AccountState {
    return this.state;
  }

  getDeactivatedAt(): Date | undefined {
    return this.deactivatedAt;
  }

  getDeletionRequestedAt(): Date | undefined {
    return this.deletionRequestedAt;
  }

  getRecoveryToken(): string | undefined {
    return this.recoveryToken;
  }

  isActive(): boolean {
    return this.state === AccountState.ACTIVE;
  }

  isDeactivated(): boolean {
    return this.state === AccountState.DEACTIVATED;
  }

  isDeletionRequested(): boolean {
    return this.state === AccountState.DELETION_REQUESTED;
  }

  private validate(): void {
    if (!Object.values(AccountState).includes(this.state)) {
      throw new DomainException('Invalid account state');
    }

    if (this.state === AccountState.DEACTIVATED && !this.deactivatedAt) {
      throw new DomainException('Deactivated accounts must have deactivatedAt');
    }

    if (this.state === AccountState.DELETION_REQUESTED && !this.deletionRequestedAt) {
      throw new DomainException('Deletion requested accounts must have deletionRequestedAt');
    }
  }
}
