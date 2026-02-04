import { Injectable } from '@nestjs/common';
import {
  UpdateProfileVisibilityDto,
  ProfileVisibilityResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class UpdateProfileVisibilityUseCase {
  constructor() {}

  async execute(dto: UpdateProfileVisibilityDto): Promise<ProfileVisibilityResponseDto> {
    return {
      profileVisibility: dto.profileVisibility,
      showEmail: dto.showEmail,
      showPhone: dto.showPhone,
      showBirthday: dto.showBirthday,
      updatedAt: new Date(),
    };
  }
}
