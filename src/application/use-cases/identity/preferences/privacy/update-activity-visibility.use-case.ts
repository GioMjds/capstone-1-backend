import { Inject, Injectable } from '@nestjs/common';
import {
  UpdateActivityVisibilityDto,
  ActivityVisibilityResponseDto,
} from '@/application/dto/identity/preferences';
import { IPrivacyRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class UpdateActivityVisibilityUseCase {
  constructor(
    @Inject('IPrivacyRepository')
    private readonly privacyRepository: IPrivacyRepository,
  ) {}

  async execute(
    userId: string,
    dto: UpdateActivityVisibilityDto,
  ): Promise<ActivityVisibilityResponseDto> {
    await this.privacyRepository.updateActivityVisibility(userId, {
      showRecentActivity: dto.showRecentActivity,
      showLoginHistory: dto.showLoginHistory,
      showLastSeen: dto.showLastSeen,
    });

    return {
      showRecentActivity: dto.showRecentActivity ?? true,
      showLoginHistory: dto.showLoginHistory ?? false,
      showLastSeen: dto.showLastSeen ?? true,
      updatedAt: new Date(),
    };
  }
}
