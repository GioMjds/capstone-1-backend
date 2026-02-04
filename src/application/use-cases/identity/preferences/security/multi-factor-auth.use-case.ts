import { Injectable } from '@nestjs/common';
import {
  EnableMfaDto,
  MfaResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class MultiFactorAuthUseCase {
  constructor() {}

  async execute(dto: EnableMfaDto): Promise<MfaResponseDto> {
    return {
      enabled: dto.enabled,
      method: dto.method,
      backupCodesRemaining: 10,
      updatedAt: new Date(),
    };
  }
}