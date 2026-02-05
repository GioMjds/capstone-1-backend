import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export enum ArchiveFormat {
  ZIP = 'zip',
  TAR_GZ = 'tar.gz',
}

export class DownloadAccountArchiveDto {
  @IsEnum(ArchiveFormat)
  @IsOptional()
  @ApiPropertyOptional({ enum: ArchiveFormat, default: ArchiveFormat.ZIP })
  format?: ArchiveFormat;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  includeAttachments?: boolean;
}

export class AccountArchiveResponseDto {
  @ApiProperty({ example: 'archive-123' })
  archiveId: string;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ enum: ArchiveFormat, example: ArchiveFormat.ZIP })
  format: ArchiveFormat;

  @ApiProperty({ example: true })
  includeAttachments: boolean;

  @ApiProperty()
  requestedAt: Date;

  @ApiProperty()
  estimatedCompletionAt: Date;
}
