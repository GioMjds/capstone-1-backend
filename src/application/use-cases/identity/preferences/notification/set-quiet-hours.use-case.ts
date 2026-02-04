import { Injectable } from '@nestjs/common';
import {
  SetQuietHoursDto,
  QuietHoursResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetQuietHoursUseCase {
  constructor() {}

  async execute(dto: SetQuietHoursDto): Promise<QuietHoursResponseDto> {
    return {
      enabled: dto.enabled,
      startTime: dto.startTime,
      endTime: dto.endTime,
      timezone: dto.timezone,
      daysOfWeek: dto.daysOfWeek,
      updatedAt: new Date(),
    };
  }
}
