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
      id: 'user-id-placeholder',
      type: dto.type,
      isVerified: dto.action === 'verify' ? true : false,
      updatedAt: new Date(),
    };
  }
}
