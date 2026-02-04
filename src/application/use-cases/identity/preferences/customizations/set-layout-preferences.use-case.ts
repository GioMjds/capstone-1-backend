import { Injectable } from '@nestjs/common';
import {
  SetLayoutPreferencesDto,
  LayoutPreferencesResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetLayoutPreferencesUseCase {
  constructor() {}

  async execute(dto: SetLayoutPreferencesDto): Promise<LayoutPreferencesResponseDto> {
    return {
      sidebarPosition: dto.sidebarPosition,
      sidebarCollapsed: dto.sidebarCollapsed,
      compactMode: dto.compactMode,
      contentWidth: dto.contentWidth,
      updatedAt: new Date(),
    };
  }
}
