import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SetDefaultViewsDto,
  DefaultViewsResponseDto,
  ViewType,
  CalendarViewType,
} from '@/application/dto/identity/preferences';
import { ICustomizationsRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetDefaultViewsUseCase {
  constructor(
    @Inject('ICustomizationsRepository')
    private readonly customizationsRepository: ICustomizationsRepository,
  ) {}

  async execute(userId: string, dto: SetDefaultViewsDto): Promise<DefaultViewsResponseDto> {
    await this.customizationsRepository.updateCustomizationSettings(userId, {
      defaultViews: {
        dashboardView: dto.dashboardView ?? ViewType.GRID,
        listView: dto.listView ?? ViewType.LIST,
        calendarView: dto.calendarView ?? CalendarViewType.MONTH,
      },
    });

    const settings = await this.customizationsRepository.getCustomizationSettings(userId);

    if (!settings) {
      throw new NotFoundException('Customization settings not found');
    }

    const views = settings.defaultViews as Record<string, string>;

    return {
      dashboardView: (views?.dashboardView as ViewType) ?? ViewType.GRID,
      listView: (views?.listView as ViewType) ?? ViewType.LIST,
      calendarView: (views?.calendarView as CalendarViewType) ?? CalendarViewType.MONTH,
      updatedAt: new Date(),
    };
  }
}
