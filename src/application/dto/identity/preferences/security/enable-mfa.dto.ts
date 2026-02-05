import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { MfaMethod } from './select-mfa-method.dto';

export class EnableMfaDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  enabled: boolean;

  @IsEnum(MfaMethod)
  @IsOptional()
  @ApiPropertyOptional({ enum: MfaMethod, example: MfaMethod.AUTHENTICATOR })
  method?: MfaMethod;
}

export class MfaResponseDto {
  @ApiProperty()
  enabled: boolean;

  @ApiPropertyOptional({ enum: MfaMethod })
  method?: MfaMethod;

  @ApiProperty()
  backupCodesRemaining: number;

  @ApiProperty()
  updatedAt: Date;
}
