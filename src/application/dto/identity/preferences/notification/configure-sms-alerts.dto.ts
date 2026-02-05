import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class ConfigureSmsAlertsDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  enabled: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '+1234567890' })
  phoneNumber?: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ example: ['security', 'critical_updates', 'login_alerts'] })
  alertTypes?: string[];
}

export class SmsAlertsResponseDto {
  @ApiProperty({ example: true })
  enabled: boolean;

  @ApiPropertyOptional({ example: '+1234567890' })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: ['security', 'critical_updates', 'login_alerts'] })
  alertTypes?: string[];

  @ApiProperty()
  updatedAt: Date;
}
