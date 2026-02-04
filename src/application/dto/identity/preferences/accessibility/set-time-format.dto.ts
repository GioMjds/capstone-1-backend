import { TimeFormat } from '@/domain/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class SetTimeFormatDto {
  @IsEnum(TimeFormat)
  @ApiProperty({ enum: TimeFormat })
  format: TimeFormat;
}

export class SetTimeFormatResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: TimeFormat })
  format: TimeFormat;

  @ApiProperty()
  example: string;

  @ApiProperty()
  updatedAt: Date;
}
