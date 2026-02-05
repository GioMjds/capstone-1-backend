import { Injectable } from '@nestjs/common';
import { ProfileVisibilityResponseDto } from '@/application/dto/identity/preferences';
import { ProfileVisibility } from '@/domain/interfaces';

@Injectable()
export class GetProfileVisibilityUseCase {
  constructor() {}

  async execute(userId: string): Promise<ProfileVisibilityResponseDto> {
    return {
      profileVisibility: ProfileVisibility.PUBLIC,
      showEmail: false,
      showPhone: false,
      showBirthday: true,
      updatedAt: new Date(),
    };
  }
}
