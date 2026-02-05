import { IpRestrictionType } from '@/domain/interfaces';
import { DomainException } from '@/shared/exceptions';

export class IpRestrictionValueObject {
  private constructor(
    private readonly type: IpRestrictionType,
    private readonly ipAddresses: string[],
    private readonly enabled: boolean,
  ) {
    this.validate();
  }

  static create(props: {
    type?: IpRestrictionType;
    ipAddresses?: string[];
    enabled?: boolean;
  }): IpRestrictionValueObject {
    return new IpRestrictionValueObject(
      props.type ?? IpRestrictionType.ALLOWLIST,
      props.ipAddresses ?? [],
      props.enabled ?? false,
    );
  }

  static fromPersistence(data: Record<string, unknown>): IpRestrictionValueObject {
    return new IpRestrictionValueObject(
      data.type as IpRestrictionType,
      data.ipAddresses as string[],
      data.enabled as boolean,
    );
  }

  toPersistence(): Record<string, unknown> {
    return {
      type: this.type,
      ipAddresses: this.ipAddresses,
      enabled: this.enabled,
    };
  }

  getType(): IpRestrictionType {
    return this.type;
  }

  getIpAddresses(): string[] {
    return [...this.ipAddresses];
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  isIpAllowed(ip: string): boolean {
    if (!this.enabled) return true;

    const ipInList = this.ipAddresses.includes(ip);
    return this.type === IpRestrictionType.ALLOWLIST ? ipInList : !ipInList;
  }

  private validate(): void {
    if (!Object.values(IpRestrictionType).includes(this.type)) {
      throw new DomainException('Invalid IP restriction type');
    }

    if (!Array.isArray(this.ipAddresses)) {
      throw new DomainException('IP addresses must be an array');
    }
  }
}
