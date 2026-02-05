import { ExportFormat } from '@/domain/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class SetExportFormatDto {
  @IsEnum(ExportFormat)
  @ApiProperty({ enum: ExportFormat, example: ExportFormat.JSON })
  format: ExportFormat;
}

export class ExportFormatResponseDto {
  @ApiProperty({ enum: ExportFormat, example: ExportFormat.JSON })
  defaultFormat: ExportFormat;

  @ApiProperty()
  updatedAt: Date;
}
