import { Injectable } from '@nestjs/common';
import {
  ManageAiFeaturesDto,
  AiFeaturesResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ManageAiFeaturesOptInUseCase {
  constructor() {}

  async execute(dto: ManageAiFeaturesDto): Promise<AiFeaturesResponseDto> {
    return {
      aiOptIn: dto.aiOptIn,
      enabledAiFeatures: dto.enabledAiFeatures,
      updatedAt: new Date(),
    };
  }
}
