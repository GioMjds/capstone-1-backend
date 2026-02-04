import { Injectable } from '@nestjs/common';
import {
  SetSessionExpirationDto,
  SetSessionExpirationResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetSessionExpirationUseCase {
  constructor() {}

  async execute(dto: SetSessionExpirationDto): Promise<SetSessionExpirationResponseDto> {
    return {
      id: 'session-expiration-123',
      expirationMinutes: dto.expirationMinutes,
      warningMinutes: dto.warningMinutes ?? 5,
      appliesImmediately: true,
      updatedAt: new Date(),
    };
  }
}
