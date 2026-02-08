import { Inject, Injectable } from '@nestjs/common';
import { ActivityVisibilityResponseDto } from '@/application/dto/identity/preferences';
import { IPrivacyRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class GetActivityVisibilityUseCase {
  constructor(
    @Inject('IPrivacyRepository')
    private readonly privacyRepository: IPrivacyRepository,
  ) {}

  async execute(userId: string): Promise<ActivityVisibilityResponseDto> {
    const settings = await this.privacyRepository.getPrivacySettings(userId);

    if (!settings) {
      return {
        showRecentActivity: true,
        showLoginHistory: false,
        showLastSeen: true,
        updatedAt: new Date(),
      };
    }

    const actVis = (settings.activityVisibility ?? {}) as Record<string, unknown>;

    return {
      showRecentActivity: (actVis.showRecentActivity as boolean) ?? true,
      showLoginHistory: (actVis.showLoginHistory as boolean) ?? false,
      showLastSeen: (actVis.showLastSeen as boolean) ?? true,
      updatedAt: settings.updatedAt,
    };
  }
}
