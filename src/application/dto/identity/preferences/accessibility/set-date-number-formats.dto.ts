import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetDateNumberFormatsDto {
  @IsString()
  @ApiProperty({ example: 'MM/DD/YYYY' })
  dateFormat: string;

  @IsString()
  @ApiProperty({ example: 'en-US' })
  numberLocale: string;

  @IsString()
  @ApiProperty({ example: '.' })
  decimalSeparator?: string;

  @IsString()
  @ApiProperty({ example: ',' })
  thousandsSeparator?: string;
}

export class SetDateNumberFormatsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  dateFormat: string;

  @ApiProperty()
  numberLocale: string;

  @ApiProperty()
  decimalSeparator: string;

  @ApiProperty()
  thousandsSeparator: string;

  @ApiProperty()
  updatedAt: Date;
}
