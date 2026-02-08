import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SecurityActiveSessionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  deviceName: string;

  @ApiProperty()
  ipAddress: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  lastActive: Date;

  @ApiProperty()
  createdAt: Date;
}

export class TrustedDeviceInfoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  deviceName: string;

  @ApiProperty()
  lastUsed: Date;

  @ApiProperty()
  addedAt: Date;
}

export class SecuritySettingsResponseDto {
  @ApiProperty()
  twoFactorEnabled: boolean;

  @ApiPropertyOptional()
  twoFactorMethod: string;

  @ApiProperty()
  passkeysEnabled: boolean;

  @ApiProperty()
  passwordChangedAt: Date;

  @ApiProperty({ type: [SecurityActiveSessionDto] })
  activeSessions: SecurityActiveSessionDto[];

  @ApiProperty({ type: [TrustedDeviceInfoDto] })
  trustedDevices: TrustedDeviceInfoDto[];
}
