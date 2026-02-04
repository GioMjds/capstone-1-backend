import { ApiProperty } from '@nestjs/swagger';

export class RegenerateBackupCodesDto {}

export class RegenerateBackupCodesResponseDto {
  @ApiProperty()
  backupCodes: string[];

  @ApiProperty()
  generatedAt: Date;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  usedCount: number;

  @ApiProperty()
  totalCount: number;
}
