import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetPreferenceAuditLogsDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  page?: number = 1;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ default: 20 })
  @Type(() => Number)
  limit?: number = 20;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'NOTIFICATION' })
  category?: string;
}

export class PreferenceAuditLogDto {
  @ApiProperty({ example: 'audit-123' })
  id: string;

  @ApiProperty({ example: 'user-123' })
  userId: string;

  @ApiProperty({ example: 'NOTIFICATION' })
  category: string;

  @ApiProperty({ example: 'emailNotifications' })
  key: string;

  @ApiPropertyOptional({ example: 'true' })
  oldValue?: string;

  @ApiProperty({ example: 'false' })
  newValue: string;

  @ApiProperty({ example: 'user-123' })
  changedBy: string;

  @ApiPropertyOptional({ example: '192.168.1.1' })
  ipAddress?: string;

  @ApiPropertyOptional({ example: 'Chrome on Windows' })
  userAgent?: string;

  @ApiProperty()
  createdAt: Date;
}

export class AuditLogsResponseDto {
  @ApiProperty({ type: [PreferenceAuditLogDto] })
  logs: PreferenceAuditLogDto[];

  @ApiProperty({ example: 0 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiPropertyOptional({ example: 'NOTIFICATION' })
  category?: string;
}
