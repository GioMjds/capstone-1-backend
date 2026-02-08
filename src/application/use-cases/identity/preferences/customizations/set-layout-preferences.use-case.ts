import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SetLayoutPreferencesDto,
  LayoutPreferencesResponseDto,
  SidebarPosition,
  ContentWidth,
} from '@/application/dto/identity/preferences';
import { ICustomizationsRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetLayoutPreferencesUseCase {
  constructor(
    @Inject('ICustomizationsRepository')
    private readonly customizationsRepository: ICustomizationsRepository,
  ) {}

  async execute(userId: string, dto: SetLayoutPreferencesDto): Promise<LayoutPreferencesResponseDto> {
    await this.customizationsRepository.updateCustomizationSettings(userId, {
      sidebarCollapsed: dto.sidebarCollapsed,
      compactMode: dto.compactMode,
      layoutPreferences: {
        sidebarPosition: dto.sidebarPosition ?? SidebarPosition.LEFT,
        contentWidth: dto.contentWidth ?? ContentWidth.NORMAL,
      },
    });

    const settings = await this.customizationsRepository.getCustomizationSettings(userId);

    if (!settings) {
      throw new NotFoundException('Customization settings not found');
    }

    const layout = settings.layoutPreferences as Record<string, string>;

    return {
      sidebarPosition: (layout?.sidebarPosition as SidebarPosition) ?? SidebarPosition.LEFT,
      sidebarCollapsed: settings.sidebarCollapsed,
      compactMode: settings.compactMode,
      contentWidth: (layout?.contentWidth as ContentWidth) ?? ContentWidth.NORMAL,
      updatedAt: new Date(),
    };
  }
}
