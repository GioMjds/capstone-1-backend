import { ExportFormat } from '@/domain/interfaces';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class ExportPersonalDataDto {
  @IsEnum(ExportFormat)
  @IsOptional()
  @ApiPropertyOptional({ enum: ExportFormat, default: ExportFormat.JSON })
  format?: ExportFormat;
}
