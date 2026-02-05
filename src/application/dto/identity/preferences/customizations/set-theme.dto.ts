import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional } from 'class-validator';

export enum ThemeOption {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export class SetThemeDto {
  @IsEnum(ThemeOption)
  @ApiProperty({ enum: ThemeOption, example: ThemeOption.DARK })
  theme: ThemeOption;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional()
  customizations?: Record<string, any>;
}

export class SetThemeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  theme: string;

  @ApiProperty()
  appliesImmediately: boolean;

  @ApiProperty()
  updatedAt: Date;
}
