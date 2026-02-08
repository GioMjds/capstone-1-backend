import { Inject, Injectable } from '@nestjs/common';
import { BackupCodesResponseDto } from '@/application/dto/identity/preferences';
import { ISecurityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class RegenerateBackupCodesUseCase {
  constructor(
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
  ) {}

  async execute(userId: string): Promise<BackupCodesResponseDto> {
    const codes = await this.securityRepository.regenerateBackupCodes(userId);

    return {
      codes,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 3600000),
    };
  }
}
