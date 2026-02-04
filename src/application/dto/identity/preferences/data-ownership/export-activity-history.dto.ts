import { ExportFormat } from '@/domain/interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';

export class ExportActivityHistoryDto {
  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  fromDate?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  toDate?: string;

  @IsEnum(ExportFormat)
  @IsOptional()
  @ApiPropertyOptional({ enum: ExportFormat })
  format?: ExportFormat;
}

export class ExportActivityHistoryResponseDto {
  @ApiProperty()
  downloadUrl: string;

  @ApiProperty()
  recordCount: number;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  expiresAt: Date;
}
