import { Injectable } from '@nestjs/common';
import {
  ManageFeatureTogglesDto,
  FeatureTogglesResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ManageFeatureTogglesUseCase {
  constructor() {}

  async execute(dto: ManageFeatureTogglesDto): Promise<FeatureTogglesResponseDto> {
    return {
      features: dto.features,
      updatedAt: new Date(),
    };
  }
}
