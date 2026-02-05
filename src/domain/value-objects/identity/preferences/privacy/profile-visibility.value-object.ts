import { VisibilityLevel } from '@/domain/interfaces';
import { DomainException } from '@/shared/exceptions';

export class ProfileVisibilityValueObject {
  private constructor(
    private readonly visibility: VisibilityLevel,
    private readonly showEmail: boolean,
    private readonly showPhone: boolean,
    private readonly showLocation: boolean,
  ) {
    this.validate();
  }

  static create(props: {
    visibility?: VisibilityLevel;
    showEmail?: boolean;
    showPhone?: boolean;
    showLocation?: boolean;
  }): ProfileVisibilityValueObject {
    return new ProfileVisibilityValueObject(
      props.visibility ?? VisibilityLevel.PRIVATE,
      props.showEmail ?? false,
      props.showPhone ?? false,
      props.showLocation ?? false,
    );
  }

  static fromPersistence(data: Record<string, unknown>): ProfileVisibilityValueObject {
    return new ProfileVisibilityValueObject(
      data.visibility as VisibilityLevel,
      data.showEmail as boolean,
      data.showPhone as boolean,
      data.showLocation as boolean,
    );
  }

  toPersistence(): Record<string, unknown> {
    return {
      visibility: this.visibility,
      showEmail: this.showEmail,
      showPhone: this.showPhone,
      showLocation: this.showLocation,
    };
  }

  getVisibility(): VisibilityLevel {
    return this.visibility;
  }

  isEmailVisible(): boolean {
    return this.showEmail;
  }

  isPhoneVisible(): boolean {
    return this.showPhone;
  }

  isLocationVisible(): boolean {
    return this.showLocation;
  }

  private validate(): void {
    if (!Object.values(VisibilityLevel).includes(this.visibility)) {
      throw new DomainException('Invalid visibility level');
    }
  }
}
