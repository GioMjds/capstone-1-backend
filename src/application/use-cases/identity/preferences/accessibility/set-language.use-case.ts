import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SetLanguageDto,
  SetLanguageResponseDto,
} from '@/application/dto/identity/preferences';
import { IAccessibilityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetLanguageUseCase {
  constructor(
    @Inject('IAccessibilityRepository')
    private readonly accessibilityRepository: IAccessibilityRepository,
  ) {}

  async execute(
    userId: string,
    dto: SetLanguageDto,
  ): Promise<SetLanguageResponseDto> {
    await this.accessibilityRepository.updateAccessibilitySettings(userId, {
      language: dto.language,
    });

    const settings =
      await this.accessibilityRepository.getAccessibilitySettings(userId);

    if (!settings) {
      throw new NotFoundException('Accessibility settings not found');
    }

    return {
      id: settings.id,
      language: settings.language,
      appliesImmediately: true,
      updatedAt: new Date(),
    };
  }
}
