import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SetThemeDto,
  ThemeResponseDto,
} from '@/application/dto/identity/preferences';
import { ICustomizationsRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetThemeUseCase {
  constructor(
    @Inject('ICustomizationsRepository')
    private readonly customizationsRepository: ICustomizationsRepository,
  ) {}

  async execute(userId: string, dto: SetThemeDto): Promise<ThemeResponseDto> {
    await this.customizationsRepository.updateCustomizationSettings(userId, {
      theme: dto.theme,
    });

    const settings = await this.customizationsRepository.getCustomizationSettings(userId);

    if (!settings) {
      throw new NotFoundException('Customization settings not found');
    }

    return {
      theme: dto.theme,
      colorScheme: dto.colorScheme,
      customColors: dto.customColors,
      updatedAt: new Date(),
    };
  }
}
