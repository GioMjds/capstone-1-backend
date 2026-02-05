import { ExportFormat } from '@/domain/interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';

export class ExportActivityHistoryDto {
  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ example: '2026-01-01' })
  fromDate?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ example: '2026-02-05' })
  toDate?: string;

  @IsEnum(ExportFormat)
  @IsOptional()
  @ApiPropertyOptional({ enum: ExportFormat, default: ExportFormat.JSON })
  format?: ExportFormat;
}

export class DataExportResponseDto {
  @ApiProperty({ example: 'export-123' })
  exportId: string;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ enum: ExportFormat, example: ExportFormat.JSON })
  format: ExportFormat;

  @ApiProperty()
  requestedAt: Date;

  @ApiProperty()
  estimatedCompletionAt: Date;
}
