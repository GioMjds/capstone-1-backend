import { Injectable } from '@nestjs/common';
import {
  UpdateProfileVisibilityDto,
  ProfileVisibilityResponseDto,
} from '@/application/dto/identity/preferences';
import { ProfileVisibility } from '@/domain/interfaces';

@Injectable()
export class UpdateProfileVisibilityUseCase {
  constructor() {}

  async execute(dto: UpdateProfileVisibilityDto): Promise<ProfileVisibilityResponseDto> {
    return {
      profileVisibility: dto.profileVisibility ?? ProfileVisibility.PUBLIC,
      showEmail: dto.showEmail ?? false,
      showPhone: dto.showPhone ?? false,
      showBirthday: dto.showBirthday ?? true,
      updatedAt: new Date(),
    };
  }
}
