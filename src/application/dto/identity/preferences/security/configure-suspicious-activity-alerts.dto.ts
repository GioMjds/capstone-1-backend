import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { AlertSeverity } from '@/domain/interfaces';

export class ConfigureSuspiciousActivityAlertsDto {
  @IsBoolean()
  @ApiProperty()
  enabled: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  multipleFailedLogins?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  unusualActivity?: boolean;

  @IsEnum(AlertSeverity)
  @IsOptional()
  @ApiPropertyOptional({ enum: AlertSeverity })
  minSeverity?: AlertSeverity;
}

export class ConfigureSuspiciousActivityAlertsResponseDto {
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
