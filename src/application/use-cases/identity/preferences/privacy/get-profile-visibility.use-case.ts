import { Inject, Injectable } from '@nestjs/common';
import { ProfileVisibilityResponseDto } from '@/application/dto/identity/preferences';
import { ProfileVisibility } from '@/domain/interfaces';
import { IPrivacyRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class GetProfileVisibilityUseCase {
  constructor(
    @Inject('IPrivacyRepository')
    private readonly privacyRepository: IPrivacyRepository,
  ) {}

  async execute(userId: string): Promise<ProfileVisibilityResponseDto> {
    const settings = await this.privacyRepository.getPrivacySettings(userId);

    if (!settings) {
      return {
        profileVisibility: ProfileVisibility.PUBLIC,
        showEmail: false,
        showPhone: false,
        showBirthday: true,
        updatedAt: new Date(),
      };
    }

    const fieldVis = (settings.fieldLevelVisibility ?? {}) as Record<string, unknown>;

    return {
      profileVisibility: (settings.profileVisibility as ProfileVisibility) ?? ProfileVisibility.PUBLIC,
      showEmail: (fieldVis.email as boolean) ?? false,
      showPhone: (fieldVis.phone as boolean) ?? false,
      showBirthday: (fieldVis.birthday as boolean) ?? true,
      updatedAt: settings.updatedAt,
    };
  }
}
