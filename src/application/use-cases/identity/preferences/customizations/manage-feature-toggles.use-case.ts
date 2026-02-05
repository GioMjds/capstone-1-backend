import { Injectable } from '@nestjs/common';
import {
  ManageFeatureTogglesDto,
  ManageFeatureTogglesResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ManageFeatureTogglesUseCase {
  constructor() {}

  async execute(dto: ManageFeatureTogglesDto): Promise<ManageFeatureTogglesResponseDto> {
    return {
      id: 'user-id-placeholder',
      toggles: dto.toggles,
      updatedAt: new Date(),
    };
  }
}
