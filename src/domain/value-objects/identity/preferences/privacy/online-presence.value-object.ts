import { OnlineStatus } from '@/domain/interfaces';
import { DomainException } from '@/shared/exceptions';

export class OnlinePresenceValueObject {
  private constructor(
    private readonly status: OnlineStatus,
    private readonly showOnlineStatus: boolean,
    private readonly customStatusMessage: string | undefined,
  ) {
    this.validate();
  }

  static create(props: {
    status?: OnlineStatus;
    showOnlineStatus?: boolean;
    customStatusMessage?: string;
  }): OnlinePresenceValueObject {
    return new OnlinePresenceValueObject(
      props.status ?? OnlineStatus.OFFLINE,
      props.showOnlineStatus ?? false,
      props.customStatusMessage,
    );
  }

  static fromPersistence(data: Record<string, unknown>): OnlinePresenceValueObject {
    return new OnlinePresenceValueObject(
      data.status as OnlineStatus,
      data.showOnlineStatus as boolean,
      data.customStatusMessage as string | undefined,
    );
  }

  toPersistence(): Record<string, unknown> {
    return {
      status: this.status,
      showOnlineStatus: this.showOnlineStatus,
      customStatusMessage: this.customStatusMessage,
    };
  }

  getStatus(): OnlineStatus {
    return this.status;
  }

  isOnlineStatusVisible(): boolean {
    return this.showOnlineStatus;
  }

  getCustomStatusMessage(): string | undefined {
    return this.customStatusMessage;
  }

  private validate(): void {
    if (!Object.values(OnlineStatus).includes(this.status)) {
      throw new DomainException('Invalid online status');
    }

    if (this.customStatusMessage && this.customStatusMessage.length > 100) {
      throw new DomainException('Custom status message too long');
    }
  }
}
