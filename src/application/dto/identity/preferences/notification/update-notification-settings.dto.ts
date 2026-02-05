import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export enum DigestFrequency {
  IMMEDIATE = 'immediate',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export class UpdateNotificationSettingsDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Enable email notifications' })
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Enable push notifications' })
  pushNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Enable SMS notifications' })
  smsNotifications?: boolean;

  @IsOptional()
  @IsEnum(DigestFrequency)
  @ApiPropertyOptional({ enum: DigestFrequency, example: DigestFrequency.DAILY })
  digestFrequency?: DigestFrequency;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'quietHoursStart must be in HH:mm format',
  })
  @ApiPropertyOptional({ example: '22:00', description: 'Quiet hours start time in HH:mm format' })
  quietHoursStart?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'quietHoursEnd must be in HH:mm format',
  })
  @ApiPropertyOptional({ example: '07:00', description: 'Quiet hours end time in HH:mm format' })
  quietHoursEnd?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Enable security alerts' })
  securityAlerts?: boolean;
}

export class NotificationSettingsResponseDto {
  @ApiProperty({ description: 'Notification settings ID' })
  id: string;

  @ApiProperty({ description: 'Email notifications enabled status' })
  emailNotifications: boolean;

  @ApiProperty({ description: 'Push notifications enabled status' })
  pushNotifications: boolean;

  @ApiProperty({ description: 'SMS notifications enabled status' })
  smsNotifications: boolean;

  @ApiProperty({ description: 'Digest frequency setting' })
  digestFrequency: string;

  @ApiPropertyOptional({ description: 'Quiet hours start time' })
  quietHoursStart?: string;

  @ApiPropertyOptional({ description: 'Quiet hours end time' })
  quietHoursEnd?: string;

  @ApiProperty({ description: 'Security alerts enabled status' })
  securityAlerts: boolean;

  @ApiProperty({ description: 'Last updated timestamp' })
  updatedAt: Date;
}