import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';

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

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 10 })
  maxDevices?: number;
}

export class TrustedDeviceDto {
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

export class TrustedDevicesResponseDto {
  @ApiProperty({ type: [TrustedDeviceDto] })
  devices: TrustedDeviceDto[];

  @ApiPropertyOptional()
  maxDevices?: number;

  @ApiProperty()
  updatedAt: Date;
}
