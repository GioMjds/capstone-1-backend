import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SetAccessibilityPreferencesDto,
  SetAccessibilityPreferencesResponseDto,
} from '@/application/dto/identity/preferences';
import { IAccessibilityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetAccessibilityPreferencesUseCase {
  constructor(
    @Inject('IAccessibilityRepository')
    private readonly accessibilityRepository: IAccessibilityRepository,
  ) {}

  async execute(
    userId: string,
    dto: SetAccessibilityPreferencesDto,
  ): Promise<SetAccessibilityPreferencesResponseDto> {
    await this.accessibilityRepository.updateAccessibilitySettings(userId, {
      fontSize: dto.fontSize,
      reducedMotion: dto.reduceMotion ?? false,
    });

    const settings =
      await this.accessibilityRepository.getAccessibilitySettings(userId);

    if (!settings)
      throw new NotFoundException('Accessibility settings not found');

    return {
      id: settings.id,
      preferences: {
        fontSize: settings.fontSize,
        lineHeight: dto.lineHeight,
        letterSpacing: dto.letterSpacing,
        reduceMotion: settings.reducedMotion,
        enableFocusIndicators: dto.enableFocusIndicators ?? false,
      },
      updatedAt: new Date(),
    };
  }
}
