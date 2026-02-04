import { Injectable } from '@nestjs/common';
import {
  SetTimezoneDto,
  SetTimezoneResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetTimezoneUseCase {
  constructor() {}

  async execute(dto: SetTimezoneDto): Promise<SetTimezoneResponseDto> {
    return {
      id: 'stub-id',
      timezone: dto.timezone,
      utcOffset: '+00:00',
      updatedAt: new Date(),
    };
  }
}
