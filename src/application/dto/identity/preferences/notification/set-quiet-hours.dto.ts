import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, IsTimeZone, Matches } from 'class-validator';

export class SetQuietHoursDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  enabled: boolean;

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

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ example: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] })
  daysOfWeek?: string[];
}

export class QuietHoursResponseDto {
  @ApiProperty({ example: true })
  enabled: boolean;

  @ApiProperty({ example: '22:00' })
  startTime: string;

  @ApiProperty({ example: '07:00' })
  endTime: string;

  @ApiPropertyOptional({ example: 'America/New_York' })
  timezone?: string;

  @ApiPropertyOptional({ example: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] })
  daysOfWeek?: string[];

  @ApiProperty()
  updatedAt: Date;
}
