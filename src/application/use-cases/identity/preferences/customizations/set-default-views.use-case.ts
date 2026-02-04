import { Injectable } from '@nestjs/common';
import {
  SetDefaultViewsDto,
  DefaultViewsResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetDefaultViewsUseCase {
  constructor() {}

  async execute(dto: SetDefaultViewsDto): Promise<DefaultViewsResponseDto> {
    return {
      dashboardView: dto.dashboardView,
      listView: dto.listView,
      calendarView: dto.calendarView,
      updatedAt: new Date(),
    };
  }
}
