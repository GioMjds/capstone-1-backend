import { Injectable } from '@nestjs/common';
import {
  ChangeEmailDto,
  ChangeEmailResponseDto,
} from '@/application/dto/identity/preferences';
import { uuidv4 } from '@/shared/utils';

@Injectable()
export class ChangeEmailUseCase {
  constructor() {}

  async execute(dto: ChangeEmailDto): Promise<ChangeEmailResponseDto> {
    return {
      id: uuidv4().slice(0, 12),
      email: dto.newEmail,
      requiresVerification: true,
      verificationSentAt: new Date(),
    };
  }
}
