import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsArray, IsOptional, IsString } from 'class-validator';

export class ConfigureSuspiciousActivityAlertsDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  enabled: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ example: ['failed_login', 'unusual_activity', 'password_change'] })
  alertTypes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ example: ['email', 'sms', 'push'] })
  notificationChannels?: string[];
}

export class SuspiciousActivityAlertsResponseDto {
  @ApiProperty()
  enabled: boolean;

  @ApiPropertyOptional({ type: [String] })
  alertTypes?: string[];

  @ApiPropertyOptional({ type: [String] })
  notificationChannels?: string[];

  @ApiProperty()
  updatedAt: Date;
}
