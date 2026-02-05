import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsMobilePhone } from 'class-validator';

export enum MfaMethod {
  AUTHENTICATOR = 'authenticator',
  SMS = 'sms',
  EMAIL = 'email',
  PASSKEY = 'passkey',
}

export class SelectMfaMethodDto {
  @IsEnum(MfaMethod)
  @ApiProperty({ enum: MfaMethod, example: MfaMethod.AUTHENTICATOR })
  method: MfaMethod;

  @IsString()
  @IsMobilePhone()
  @IsOptional()
  @ApiPropertyOptional({ example: '+15551234567' })
  phoneNumber?: string;
}

export class SelectMfaMethodResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: MfaMethod })
  method: MfaMethod;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  setupCompleted: boolean;

  @ApiProperty()
  setupToken?: string;
}
