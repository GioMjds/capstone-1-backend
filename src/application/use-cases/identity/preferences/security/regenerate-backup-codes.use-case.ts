import { Injectable } from '@nestjs/common';
import { BackupCodesResponseDto } from '@/application/dto/identity/preferences';

@Injectable()
export class RegenerateBackupCodesUseCase {
  constructor() {}

  async execute(userId: string): Promise<BackupCodesResponseDto> {
    return {
      codes: [
        'ABCD-EFGH-1234',
        'IJKL-MNOP-5678',
        'QRST-UVWX-9012',
        'YZAB-CDEF-3456',
        'GHIJ-KLMN-7890',
      ],
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 3600000),
    };
  }
}
