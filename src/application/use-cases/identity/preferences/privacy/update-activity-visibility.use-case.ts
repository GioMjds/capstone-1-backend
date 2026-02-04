import { Injectable } from '@nestjs/common';
import {
  UpdateActivityVisibilityDto,
  ActivityVisibilityResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class UpdateActivityVisibilityUseCase {
  constructor() {}

  async execute(dto: UpdateActivityVisibilityDto): Promise<ActivityVisibilityResponseDto> {
    return {
      showRecentActivity: dto.showRecentActivity,
      showLoginHistory: dto.showLoginHistory,
      showLastSeen: dto.showLastSeen,
      updatedAt: new Date(),
    };
  }
}
