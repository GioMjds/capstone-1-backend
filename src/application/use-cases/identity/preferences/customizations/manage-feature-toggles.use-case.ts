import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ManageFeatureTogglesDto,
  ManageFeatureTogglesResponseDto,
} from '@/application/dto/identity/preferences';
import { ICustomizationsRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class ManageFeatureTogglesUseCase {
  constructor(
    @Inject('ICustomizationsRepository')
    private readonly customizationsRepository: ICustomizationsRepository,
  ) {}

  async execute(userId: string, dto: ManageFeatureTogglesDto): Promise<ManageFeatureTogglesResponseDto> {
    await this.customizationsRepository.updateCustomizationSettings(userId, {
      featureToggles: dto.toggles,
    });

    const settings = await this.customizationsRepository.getCustomizationSettings(userId);

    if (!settings) {
      throw new NotFoundException('Customization settings not found');
    }

    return {
      id: settings.id,
      toggles: settings.featureToggles as Record<string, boolean>,
      updatedAt: new Date(),
    };
  }
}
