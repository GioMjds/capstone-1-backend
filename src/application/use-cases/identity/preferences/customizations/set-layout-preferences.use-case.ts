import { Injectable } from '@nestjs/common';
import {
  SetLayoutPreferencesDto,
  LayoutPreferencesResponseDto,
  SidebarPosition,
  ContentWidth,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetLayoutPreferencesUseCase {
  constructor() {}

  async execute(dto: SetLayoutPreferencesDto): Promise<LayoutPreferencesResponseDto> {
    return {
      sidebarPosition: dto.sidebarPosition ?? SidebarPosition.LEFT,
      sidebarCollapsed: dto.sidebarCollapsed ?? false,
      compactMode: dto.compactMode ?? false,
      contentWidth: dto.contentWidth ?? ContentWidth.NORMAL,
      updatedAt: new Date(),
    };
  }
}
