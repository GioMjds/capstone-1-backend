import { IsBoolean, IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum DigestFrequency {
  IMMEDIATE = 'immediate',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export class UpdateNotificationSettingsDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  emailNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  pushNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  smsNotifications?: boolean;

  @IsEnum(DigestFrequency)
  @IsOptional()
  @ApiPropertyOptional({ enum: DigestFrequency })
  digestFrequency?: DigestFrequency;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '22:00', description: 'Quiet hours start time (HH:mm)' })
  quietHoursStart?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '08:00', description: 'Quiet hours end time (HH:mm)' })
  quietHoursEnd?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  securityAlerts?: boolean;
}

export class NotificationSettingsResponseDto {
  @ApiPropertyOptional()
  emailNotifications: boolean;

  @ApiPropertyOptional()
  pushNotifications: boolean;

  @ApiPropertyOptional()
  smsNotifications: boolean;

  @ApiPropertyOptional()
  digestFrequency: string;

  @ApiPropertyOptional()
  quietHoursStart?: string;

  @ApiPropertyOptional()
  quietHoursEnd?: string;

  @ApiPropertyOptional()
  securityAlerts: boolean;
}
