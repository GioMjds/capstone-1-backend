import { VisibilityLevel } from '@/domain/interfaces';
import { DomainException } from '@/shared/exceptions';

export class ActivityVisibilityValueObject {
  private constructor(
    private readonly visibility: VisibilityLevel,
    private readonly showLastActive: boolean,
    private readonly showActivityFeed: boolean,
  ) {
    this.validate();
  }

  static create(props: {
    visibility?: VisibilityLevel;
    showLastActive?: boolean;
    showActivityFeed?: boolean;
  }): ActivityVisibilityValueObject {
    return new ActivityVisibilityValueObject(
      props.visibility ?? VisibilityLevel.PRIVATE,
      props.showLastActive ?? false,
      props.showActivityFeed ?? false,
    );
  }

  static fromPersistence(data: Record<string, unknown>): ActivityVisibilityValueObject {
    return new ActivityVisibilityValueObject(
      data.visibility as VisibilityLevel,
      data.showLastActive as boolean,
      data.showActivityFeed as boolean,
    );
  }

  toPersistence(): Record<string, unknown> {
    return {
      visibility: this.visibility,
      showLastActive: this.showLastActive,
      showActivityFeed: this.showActivityFeed,
    };
  }

  getVisibility(): VisibilityLevel {
    return this.visibility;
  }

  isLastActiveVisible(): boolean {
    return this.showLastActive;
  }

  isActivityFeedVisible(): boolean {
    return this.showActivityFeed;
  }

  private validate(): void {
    if (!Object.values(VisibilityLevel).includes(this.visibility)) {
      throw new DomainException('Invalid visibility level');
    }
  }
}
