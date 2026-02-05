import { ApiProperty } from '@nestjs/swagger';

export class RegenerateBackupCodesDto {}

export class BackupCodesResponseDto {
  @ApiProperty({ type: [String], example: ['ABCD-EFGH-1234', 'IJKL-MNOP-5678'] })
  codes: string[];

  @ApiProperty()
  generatedAt: Date;

  @ApiProperty()
  expiresAt: Date;
}
