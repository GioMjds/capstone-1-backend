import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ManageTrustedDevicesDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  deviceId?: string;

  @IsString()
  @ApiProperty()
  action: 'add' | 'remove' | 'verify';

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
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
