import { AuditLogFormat } from '@/domain/interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class ExportAuditLogsDto {
  @IsEnum(AuditLogFormat)
  @IsOptional()
  @ApiPropertyOptional({ enum: AuditLogFormat, default: AuditLogFormat.JSON })
  format?: AuditLogFormat = AuditLogFormat.JSON;

  @IsOptional()
  @ApiPropertyOptional()
  includeSecurityEvents?: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  includePermissionChanges?: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  includeAccountChanges?: boolean;
}

export class ExportAuditLogsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  format: AuditLogFormat;

  @ApiProperty()
  downloadUrl: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  totalRecords: number;

  @ApiProperty()
  createdAt: Date;
}
