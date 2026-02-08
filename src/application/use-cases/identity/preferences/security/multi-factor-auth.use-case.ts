import { Inject, Injectable } from '@nestjs/common';
import {
  EnableMfaDto,
  MfaResponseDto,
} from '@/application/dto/identity/preferences';
import { ISecurityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class MultiFactorAuthUseCase {
  constructor(
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
  ) {}

  async execute(userId: string, dto: EnableMfaDto): Promise<MfaResponseDto> {
    if (dto.enabled) {
      await this.securityRepository.enableMfa(userId, dto.method);
    } else {
      await this.securityRepository.disableMfa(userId);
    }

    const settings = await this.securityRepository.getSecuritySettings(userId);
    const backupCodes = settings?.backupCodes as string[] | undefined;

    return {
      enabled: dto.enabled,
      method: dto.method,
      backupCodesRemaining: backupCodes?.length ?? 10,
      updatedAt: new Date(),
    };
  }
}