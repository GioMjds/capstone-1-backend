import { Injectable } from '@nestjs/common';
import {
  SelectMfaMethodDto,
  SelectMfaMethodResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SelectMfaMethodUseCase {
  constructor() {}

  async execute(dto: SelectMfaMethodDto): Promise<SelectMfaMethodResponseDto> {
    return {
      id: 'mfa-method-123',
      method: dto.method,
      isActive: false,
      setupCompleted: false,
      setupToken: 'setup-token-abc123',
    };
  }
}
