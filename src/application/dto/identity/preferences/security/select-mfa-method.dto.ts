import { MfaMethod } from '@/domain/interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';

export class SelectMfaMethodDto {
  @IsEnum(MfaMethod)
  @ApiProperty({ enum: MfaMethod })
  method: MfaMethod;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
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
