import { Injectable } from '@nestjs/common';
import {
  ChangeEmailDto,
  ChangeEmailResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ChangeEmailUseCase {
  constructor() {}

  async execute(dto: ChangeEmailDto): Promise<ChangeEmailResponseDto> {
    return {
      id: 'stub-id',
      email: dto.newEmail,
      requiresVerification: true,
      verificationSentAt: new Date(),
    };
  }
}
