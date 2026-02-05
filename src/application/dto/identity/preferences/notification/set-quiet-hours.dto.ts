import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Matches, IsTimeZone } from 'class-validator';

export class SetQuietHoursDto {
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Time must be in HH:mm format' })
  @ApiProperty({ pattern: '^([01]\\d|2[0-3]):[0-5]\\d$', example: '22:00' })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Time must be in HH:mm format' })
  @ApiProperty({ pattern: '^([01]\\d|2[0-3]):[0-5]\\d$', example: '07:00' })
  endTime: string;

  @IsString()
  @IsTimeZone()
  @IsOptional()
  @ApiPropertyOptional({ example: 'America/New_York' })
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
