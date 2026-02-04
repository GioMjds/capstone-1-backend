import { AlertSeverity } from '@/domain/interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsEnum } from 'class-validator';

export class ConfigureLoginAlertsDto {
  @IsBoolean()
  @ApiProperty()
  enabled: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  newDevice?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  newLocation?: boolean;

  @IsEnum(AlertSeverity)
  @IsOptional()
  @ApiPropertyOptional({ enum: AlertSeverity })
  minSeverity?: AlertSeverity;
}

export class ConfigureLoginAlertsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  enabled: boolean;

  @ApiProperty()
  alertsFor: string[];

  @ApiProperty()
  minSeverity: AlertSeverity;

  @ApiProperty()
  updatedAt: Date;
}
