import { ExportFormat } from '@/domain/interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class ExportPersonalDataDto {
  @IsEnum(ExportFormat)
  @IsOptional()
  @ApiPropertyOptional({ enum: ExportFormat, default: ExportFormat.JSON })
  format?: ExportFormat;
}

export class ExportPersonalDataResponseDto {
  @ApiProperty()
  downloadUrl: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  format: ExportFormat;

  @ApiProperty()
  expiresAt: Date;
}
