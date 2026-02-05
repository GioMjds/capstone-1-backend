import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export enum AuditLogPreference {
  FULL = 'full',
  MINIMAL = 'minimal',
  NONE = 'none',
}

export class UpdateComplianceSettingsDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  dataShareConsent?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional({ example: 12 })
  dataRetentionMonths?: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  allowAccountDeletion?: boolean;

  @IsEnum(AuditLogPreference)
  @IsOptional()
  @ApiPropertyOptional({ enum: AuditLogPreference, example: AuditLogPreference.MINIMAL })
  auditLogPreference?: AuditLogPreference;
}

export class ComplianceSettingsResponseDto {
  @ApiProperty({ example: false })
  dataShareConsent: boolean;

  @ApiProperty({ example: 12 })
  dataRetentionMonths: number;

  @ApiProperty({ example: true })
  allowAccountDeletion: boolean;

  @ApiProperty({ enum: AuditLogPreference, example: AuditLogPreference.MINIMAL })
  auditLogPreference: AuditLogPreference;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
