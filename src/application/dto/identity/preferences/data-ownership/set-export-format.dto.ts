import { ExportFormat } from '@/domain/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class SetExportFormatDto {
  @IsEnum(ExportFormat)
  @ApiProperty({ enum: ExportFormat })
  defaultFormat: ExportFormat;
}

export class SetExportFormatResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  defaultFormat: ExportFormat;

  @ApiProperty()
  updatedAt: Date;
}
