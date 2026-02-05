import { Injectable } from '@nestjs/common';
import {
  SetDefaultViewsDto,
  DefaultViewsResponseDto,
  ViewType,
  CalendarViewType,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetDefaultViewsUseCase {
  constructor() {}

  async execute(dto: SetDefaultViewsDto): Promise<DefaultViewsResponseDto> {
    return {
      dashboardView: dto.dashboardView ?? ViewType.GRID,
      listView: dto.listView ?? ViewType.LIST,
      calendarView: dto.calendarView ?? CalendarViewType.MONTH,
      updatedAt: new Date(),
    };
  }
}
