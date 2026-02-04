import { Injectable } from '@nestjs/common';
import {
  SetAccessibilityPreferencesDto,
  SetAccessibilityPreferencesResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetAccessibilityPreferencesUseCase {
  constructor() {}

  async execute(
    dto: SetAccessibilityPreferencesDto,
  ): Promise<SetAccessibilityPreferencesResponseDto> {
    return {
      id: 'accessibility-123',
      preferences: {
        fontSize: dto.fontSize,
        lineHeight: dto.lineHeight,
        letterSpacing: dto.letterSpacing,
        reduceMotion: dto.reduceMotion,
        enableFocusIndicators: dto.enableFocusIndicators,
      },
      updatedAt: new Date(),
    };
  }
}
