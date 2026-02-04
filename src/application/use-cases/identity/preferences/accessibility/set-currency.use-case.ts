import { Injectable } from '@nestjs/common';
import {
  SetCurrencyDto,
  SetCurrencyResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetCurrencyUseCase {
  constructor() {}

  async execute(dto: SetCurrencyDto): Promise<SetCurrencyResponseDto> {
    return {
      id: 'stub-id',
      currency: dto.currency,
      symbol: '$',
      updatedAt: new Date(),
    };
  }
}
