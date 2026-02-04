import { Injectable } from '@nestjs/common';
import {
  SetTimeFormatDto,
  SetTimeFormatResponseDto,
} from '@/application/dto/identity/preferences';
import { TimeFormat } from '@/domain/interfaces';

@Injectable()
export class SetTimeFormatUseCase {
  constructor() {}

  async execute(dto: SetTimeFormatDto): Promise<SetTimeFormatResponseDto> {
    return {
      id: 'time-format-123',
      format: dto.format,
      example: dto.format === TimeFormat.FORMAT_12H ? '12:30 PM' : '12:30',
      updatedAt: new Date(),
    };
  }
}
