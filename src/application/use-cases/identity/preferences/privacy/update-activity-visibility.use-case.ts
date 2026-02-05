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
      showRecentActivity: dto.showRecentActivity ?? true,
      showLoginHistory: dto.showLoginHistory ?? false,
      showLastSeen: dto.showLastSeen ?? true,
      updatedAt: new Date(),
    };
  }
}
