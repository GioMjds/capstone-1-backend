import { Inject, Injectable } from '@nestjs/common';
import {
  UpdateProfileVisibilityDto,
  ProfileVisibilityResponseDto,
} from '@/application/dto/identity/preferences';
import { ProfileVisibility } from '@/domain/interfaces';
import { IPrivacyRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class UpdateProfileVisibilityUseCase {
  constructor(
    @Inject('IPrivacyRepository')
    private readonly privacyRepository: IPrivacyRepository,
  ) {}

  async execute(
    userId: string,
    dto: UpdateProfileVisibilityDto,
  ): Promise<ProfileVisibilityResponseDto> {
    await this.privacyRepository.updateProfileVisibility(
      userId,
      dto.profileVisibility ?? ProfileVisibility.PUBLIC,
    );

    return {
      profileVisibility: dto.profileVisibility ?? ProfileVisibility.PUBLIC,
      showEmail: dto.showEmail ?? false,
      showPhone: dto.showPhone ?? false,
      showBirthday: dto.showBirthday ?? true,
      updatedAt: new Date(),
    };
  }
}
