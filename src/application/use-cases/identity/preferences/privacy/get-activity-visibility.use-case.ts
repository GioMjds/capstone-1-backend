import { Injectable } from '@nestjs/common';
import { ActivityVisibilityResponseDto } from '@/application/dto/identity/preferences';

@Injectable()
export class GetActivityVisibilityUseCase {
  constructor() {}

  async execute(userId: string): Promise<ActivityVisibilityResponseDto> {
    return {
      showRecentActivity: true,
      showLoginHistory: false,
      showLastSeen: true,
      updatedAt: new Date(),
    };
  }
}
