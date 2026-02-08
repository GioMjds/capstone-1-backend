import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ManageBetaFeaturesDto,
  BetaFeaturesResponseDto,
} from '@/application/dto/identity/preferences';
import { ICustomizationsRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class ManageBetaFeaturesOptInUseCase {
  constructor(
    @Inject('ICustomizationsRepository')
    private readonly customizationsRepository: ICustomizationsRepository,
  ) {}

  async execute(userId: string, dto: ManageBetaFeaturesDto): Promise<BetaFeaturesResponseDto> {
    await this.customizationsRepository.updateCustomizationSettings(userId, {
      betaFeaturesOptIn: dto.betaOptIn,
    });

    const settings = await this.customizationsRepository.getCustomizationSettings(userId);

    if (!settings) {
      throw new NotFoundException('Customization settings not found');
    }

    return {
      betaOptIn: settings.betaFeaturesOptIn,
      enrolledFeatures: dto.enrolledFeatures,
      updatedAt: new Date(),
    };
  }
}
