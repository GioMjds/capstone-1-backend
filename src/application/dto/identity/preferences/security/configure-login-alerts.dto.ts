import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ConfigureLoginAlertsDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  emailAlerts: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  smsAlerts?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  pushAlerts?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  alertOnNewDevice?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  alertOnNewLocation?: boolean;
}

export class LoginAlertsResponseDto {
  @ApiProperty()
  emailAlerts: boolean;

  @ApiPropertyOptional()
  smsAlerts?: boolean;

  @ApiPropertyOptional()
  pushAlerts?: boolean;

  @ApiPropertyOptional()
  alertOnNewDevice?: boolean;

  @ApiPropertyOptional()
  alertOnNewLocation?: boolean;

  @ApiProperty()
  updatedAt: Date;
}
