import { Injectable } from '@nestjs/common';
import {
  SetContentSensitivityFiltersDto,
  ContentSensitivityFiltersResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetContentSensitivityFiltersUseCase {
  constructor() {}

  async execute(dto: SetContentSensitivityFiltersDto): Promise<ContentSensitivityFiltersResponseDto> {
    return {
      sensitivityLevel: dto.sensitivityLevel,
      blockedCategories: dto.blockedCategories,
      safeSearchEnabled: dto.safeSearchEnabled,
      updatedAt: new Date(),
    };
  }
}
