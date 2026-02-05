import { Injectable } from '@nestjs/common';
import {
  SetContentSensitivityFiltersDto,
  ContentSensitivityFiltersResponseDto,
  SensitivityLevel,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetContentSensitivityFiltersUseCase {
  constructor() {}

  async execute(dto: SetContentSensitivityFiltersDto): Promise<ContentSensitivityFiltersResponseDto> {
    return {
      sensitivityLevel: dto.sensitivityLevel ?? SensitivityLevel.MEDIUM,
      blockedCategories: dto.blockedCategories,
      safeSearchEnabled: dto.safeSearchEnabled ?? true,
      updatedAt: new Date(),
    };
  }
}
