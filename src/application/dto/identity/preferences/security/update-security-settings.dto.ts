import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSecuritySettingsDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  twoFactorEnabled?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'authenticator' })
  twoFactorMethod?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  passkeysEnabled?: boolean;
}