import { IsBoolean, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum AuditLogPreference {
  FULL = 'full',
  MINIMAL = 'minimal',
  NONE = 'none',
}

export class UpdateComplianceSettingsDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  dataShareConsent?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 12, description: 'Data retention in months' })
  dataRetentionMonths?: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  allowAccountDeletion?: boolean;

  @IsEnum(AuditLogPreference)
  @IsOptional()
  @ApiPropertyOptional({ enum: AuditLogPreference })
  auditLogPreference?: AuditLogPreference;
}

export class ComplianceSettingsResponseDto {
  @ApiPropertyOptional()
  dataShareConsent: boolean;

  @ApiPropertyOptional()
  dataRetentionMonths: number;

  @ApiPropertyOptional()
  allowAccountDeletion: boolean;

  @ApiPropertyOptional()
  auditLogPreference: string;

  @ApiPropertyOptional()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date;
}
