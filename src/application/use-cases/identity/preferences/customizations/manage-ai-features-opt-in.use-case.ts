import {
  ManageAiFeaturesOptInDto,
  ManageAiFeaturesOptInResponseDto,
} from '@/application/dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ManageAiFeaturesOptInUseCase {
  constructor() {}

  async execute(
    dto: ManageAiFeaturesOptInDto,
  ): Promise<ManageAiFeaturesOptInResponseDto> {
    return {
      id: 'user-id-placeholder',
      optedInAiFeatures: dto.optIn,
      availableFeatures: [],
      privacyLevel: 'standard',
      updatedAt: new Date(),
    };
  }
}
