import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export enum TrustedDeviceAction {
  ADD = 'add',
  REMOVE = 'remove',
  VERIFY = 'verify',
}

export class ManageTrustedDevicesDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'device-uuid-123' })
  deviceId?: string;

  @IsEnum(TrustedDeviceAction)
  @ApiProperty({ enum: TrustedDeviceAction, example: TrustedDeviceAction.ADD })
  action: TrustedDeviceAction;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'My iPhone' })
  deviceName?: string;
}

export class ManageTrustedDevicesResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  deviceName: string;

  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  lastUsed: Date;

  @ApiProperty()
  addedAt: Date;
}
