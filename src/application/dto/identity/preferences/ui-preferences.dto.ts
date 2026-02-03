import { IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ThemeEnum {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export class UpdateUiPreferencesDto {
  @IsEnum(ThemeEnum)
  @IsOptional()
  @ApiPropertyOptional({ enum: ThemeEnum })
  theme?: ThemeEnum;

  @IsString()
  @MinLength(2)
  @MaxLength(5)
  @IsOptional()
  @ApiPropertyOptional({ example: 'en' })
  language?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'America/New_York' })
  timezone?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'en-US' })
  locale?: string;
}

export class UiPreferencesResponseDto {
  @ApiPropertyOptional()
  theme: string;

  @ApiPropertyOptional()
  language: string;

  @ApiPropertyOptional()
  timezone?: string;

  @ApiPropertyOptional()
  locale?: string;
}
