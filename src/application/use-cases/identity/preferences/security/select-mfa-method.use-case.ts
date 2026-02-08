import { Inject, Injectable } from '@nestjs/common';
import {
  SelectMfaMethodDto,
  SelectMfaMethodResponseDto,
} from '@/application/dto/identity/preferences';
import { ISecurityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SelectMfaMethodUseCase {
  constructor(
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
  ) {}

  async execute(userId: string, dto: SelectMfaMethodDto): Promise<SelectMfaMethodResponseDto> {
    await this.securityRepository.updateSecuritySettings(userId, {
      twoFactorMethod: dto.method,
    });

    return {
      id: userId,
      method: dto.method,
      isActive: false,
      setupCompleted: false,
      setupToken: 'setup-token-abc123',
    };
  }
}
