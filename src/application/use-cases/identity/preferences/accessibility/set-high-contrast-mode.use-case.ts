import { Injectable } from '@nestjs/common';
import {
  SetHighContrastModeDto,
  SetHighContrastModeResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetHighContrastModeUseCase {
  constructor() {}

  async execute(dto: SetHighContrastModeDto): Promise<SetHighContrastModeResponseDto> {
    return {
      id: 'stub-id',
      enabled: dto.enabled,      theme: dto.enabled ? 'high-contrast' : 'default',      updatedAt: new Date(),
    };
  }
}
