import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ManageAiFeaturesOptInDto,
  ManageAiFeaturesOptInResponseDto,
} from '@/application/dto/identity/preferences';
import { ICustomizationsRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class ManageAiFeaturesOptInUseCase {
  constructor(
    @Inject('ICustomizationsRepository')
    private readonly customizationsRepository: ICustomizationsRepository,
  ) {}

  async execute(
    userId: string,
    dto: ManageAiFeaturesOptInDto,
  ): Promise<ManageAiFeaturesOptInResponseDto> {
    await this.customizationsRepository.updateCustomizationSettings(userId, {
      aiFeaturesOptIn: dto.optIn,
    });

    const settings = await this.customizationsRepository.getCustomizationSettings(userId);

    if (!settings) {
      throw new NotFoundException('Customization settings not found');
    }

    return {
      id: settings.id,
      optedInAiFeatures: settings.aiFeaturesOptIn,
      availableFeatures: [],
      privacyLevel: 'standard',
      updatedAt: new Date(),
    };
  }
}
