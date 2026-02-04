import { AlertSeverity } from '@/domain/interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min, Max, IsEnum } from 'class-validator';

export class GetSecurityEventsDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ default: 20 })
  @Type(() => Number)
  limit?: number = 20;

  @IsEnum(AlertSeverity)
  @IsOptional()
  @ApiPropertyOptional({ enum: AlertSeverity })
  severity?: AlertSeverity;
}

export class SecurityEventDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  eventType: string;

  @ApiProperty({ enum: AlertSeverity })
  severity: AlertSeverity;

  @ApiProperty()
  description: string;

  @ApiProperty()
  ipAddress: string;

  @ApiProperty()
  deviceName?: string;

  @ApiProperty()
  resolved: boolean;
}

export class GetSecurityEventsResponseDto {
  @ApiProperty()
  totalCount: number;

  @ApiProperty({ type: [SecurityEventDto] })
  events: SecurityEventDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
