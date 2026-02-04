import { Injectable } from '@nestjs/common';
import {
  SetThemeDto,
  ThemeResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetThemeUseCase {
  constructor() {}

  async execute(dto: SetThemeDto): Promise<ThemeResponseDto> {
    return {
      theme: dto.theme,
      colorScheme: dto.colorScheme,
      customColors: dto.customColors,
      updatedAt: new Date(),
    };
  }
}
