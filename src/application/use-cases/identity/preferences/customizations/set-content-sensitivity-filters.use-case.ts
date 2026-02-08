import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SetContentSensitivityFiltersDto,
  ContentSensitivityFiltersResponseDto,
  SensitivityLevel,
} from '@/application/dto/identity/preferences';
import { ICustomizationsRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetContentSensitivityFiltersUseCase {
  constructor(
    @Inject('ICustomizationsRepository')
    private readonly customizationsRepository: ICustomizationsRepository,
  ) {}

  async execute(userId: string, dto: SetContentSensitivityFiltersDto): Promise<ContentSensitivityFiltersResponseDto> {
    await this.customizationsRepository.updateCustomizationSettings(userId, {
      contentSensitivityFilters: {
        sensitivityLevel: dto.sensitivityLevel ?? SensitivityLevel.MEDIUM,
        blockedCategories: dto.blockedCategories ?? [],
        safeSearchEnabled: dto.safeSearchEnabled ?? true,
      },
    });

    const settings = await this.customizationsRepository.getCustomizationSettings(userId);

    if (!settings) {
      throw new NotFoundException('Customization settings not found');
    }

    const filters = settings.contentSensitivityFilters as Record<string, unknown>;

    return {
      sensitivityLevel: (filters?.sensitivityLevel as SensitivityLevel) ?? SensitivityLevel.MEDIUM,
      blockedCategories: filters?.blockedCategories as string[],
      safeSearchEnabled: (filters?.safeSearchEnabled as boolean) ?? true,
      updatedAt: new Date(),
    };
  }
}
