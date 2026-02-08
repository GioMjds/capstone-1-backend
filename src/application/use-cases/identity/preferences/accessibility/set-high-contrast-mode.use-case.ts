import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SetHighContrastModeDto,
  SetHighContrastModeResponseDto,
} from '@/application/dto/identity/preferences';
import { IAccessibilityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetHighContrastModeUseCase {
  constructor(
    @Inject('IAccessibilityRepository')
    private readonly accessibilityRepository: IAccessibilityRepository,
  ) {}

  async execute(
    userId: string,
    dto: SetHighContrastModeDto,
  ): Promise<SetHighContrastModeResponseDto> {
    await this.accessibilityRepository.updateAccessibilitySettings(userId, {
      highContrastMode: dto.enabled,
    });

    const settings =
      await this.accessibilityRepository.getAccessibilitySettings(userId);

    if (!settings) {
      throw new NotFoundException('Accessibility settings not found');
    }

    return {
      id: settings.id,
      enabled: settings.highContrastMode,
      theme: settings.highContrastMode ? 'high-contrast' : 'default',
      updatedAt: new Date(),
    };
  }
}
