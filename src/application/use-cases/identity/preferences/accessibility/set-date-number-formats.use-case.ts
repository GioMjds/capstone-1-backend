import { Injectable } from '@nestjs/common';
import {
  SetDateNumberFormatsDto,
  SetDateNumberFormatsResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetDateNumberFormatsUseCase {
  constructor() {}

  async execute(dto: SetDateNumberFormatsDto): Promise<SetDateNumberFormatsResponseDto> {
    return {
      id: 'date-format-123',
      dateFormat: dto.dateFormat,
      numberLocale: dto.numberLocale,
      decimalSeparator: dto.decimalSeparator ?? '.',
      thousandsSeparator: dto.thousandsSeparator ?? ',',
      updatedAt: new Date(),
    };
  }
}
