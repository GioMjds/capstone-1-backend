import { Injectable } from '@nestjs/common';
import {
  ManageBetaFeaturesDto,
  BetaFeaturesResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ManageBetaFeaturesOptInUseCase {
  constructor() {}

  async execute(dto: ManageBetaFeaturesDto): Promise<BetaFeaturesResponseDto> {
    return {
      betaOptIn: dto.betaOptIn,
      enrolledFeatures: dto.enrolledFeatures,
      updatedAt: new Date(),
    };
  }
}
