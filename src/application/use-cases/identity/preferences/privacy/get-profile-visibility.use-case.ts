import { Injectable } from '@nestjs/common';
import { ProfileVisibilityResponseDto } from '@/application/dto/identity/preferences';

@Injectable()
export class GetProfileVisibilityUseCase {
  constructor() {}

  async execute(userId: string): Promise<ProfileVisibilityResponseDto> {
    return {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showBirthday: true,
      updatedAt: new Date(),
    };
  }
}
