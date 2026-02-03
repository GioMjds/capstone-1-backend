import { IsBoolean, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum TwoFactorMethod {
  AUTHENTICATOR = 'authenticator',
  SMS = 'sms',
  EMAIL = 'email',
}

export class UpdateSecuritySettingsDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  twoFactorEnabled?: boolean;

  @IsEnum(TwoFactorMethod)
  @IsOptional()
  @ApiPropertyOptional({ enum: TwoFactorMethod, description: '2FA method: authenticator, sms, email' })
  twoFactorMethod?: TwoFactorMethod;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  passkeysEnabled?: boolean;
}

export class ActiveSessionDto {
  @ApiPropertyOptional()
  id: string;

  @ApiPropertyOptional()
  ipAddress: string;

  @ApiPropertyOptional()
  userAgent: string;

  @ApiPropertyOptional()
  lastActivity: Date;

  @ApiPropertyOptional()
  createdAt: Date;
}

export class TrustedDeviceDto {
  @ApiPropertyOptional()
  id: string;

  @ApiPropertyOptional()
  deviceName: string;

  @ApiPropertyOptional()
  fingerprint: string;

  @ApiPropertyOptional()
  trustedAt: Date;

  @ApiPropertyOptional()
  lastUsedAt: Date;
}

export class SecuritySettingsResponseDto {
  @ApiPropertyOptional()
  twoFactorEnabled: boolean;

  @ApiPropertyOptional()
  twoFactorMethod?: string;

  @ApiPropertyOptional()
  passkeysEnabled: boolean;

  @ApiPropertyOptional()
  passwordChangedAt?: Date;

  @ApiPropertyOptional({ type: [ActiveSessionDto] })
  activeSessions: ActiveSessionDto[];

  @ApiPropertyOptional({ type: [TrustedDeviceDto] })
  trustedDevices: TrustedDeviceDto[];
}
