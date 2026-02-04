import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class ConfigureSmsAlertsDto {
  @IsBoolean()
  @ApiProperty()
  enabled: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  phoneNumber?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  securityAlerts?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  criticalUpdates?: boolean;
}

export class ConfigureSmsAlertsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  enabled: boolean;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  alertTypes: string[];

  @ApiProperty()
  updatedAt: Date;
}
