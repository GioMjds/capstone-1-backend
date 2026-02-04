import { Injectable } from '@nestjs/common';
import {
  ManageRecoveryOptionsDto,
  ManageRecoveryOptionsResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ManageRecoveryOptionsUseCase {
  constructor() {}

  async execute(dto: ManageRecoveryOptionsDto): Promise<ManageRecoveryOptionsResponseDto> {
    return {
      id: 'stub-id',
      recoveryEmail: dto.recoveryEmail,
      recoveryPhone: dto.recoveryPhone,
      securityQuestionsConfigured: false,
      updatedAt: new Date(),
    };
  }
}
