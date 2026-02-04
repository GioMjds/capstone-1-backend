import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class SetQuietHoursDto {
  @IsString()
  @ApiProperty({ pattern: '^([01]\\d|2[0-3]):[0-5]\\d$', example: '22:00' })
  startTime: string;

  @IsString()
  @ApiProperty({ pattern: '^([01]\\d|2[0-3]):[0-5]\\d$', example: '07:00' })
  endTime: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  timezone?: string;
}

export class SetQuietHoursResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  updatedAt: Date;
}
