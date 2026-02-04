import { ApiProperty } from '@nestjs/swagger';

export class DownloadAccountArchiveDto {}

export class DownloadAccountArchiveResponseDto {
  @ApiProperty()
  downloadUrl: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  expiresAt: Date;
}
