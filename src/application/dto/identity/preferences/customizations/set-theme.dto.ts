import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional } from 'class-validator';

export enum ThemeOption {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum ColorScheme {
  DEFAULT = 'default',
  WARM = 'warm',
  COOL = 'cool',
  HIGH_CONTRAST = 'high_contrast',
}

export class SetThemeDto {
  @IsEnum(ThemeOption)
  @ApiProperty({ enum: ThemeOption, example: ThemeOption.DARK })
  theme: ThemeOption;

  @IsEnum(ColorScheme)
  @IsOptional()
  @ApiPropertyOptional({ enum: ColorScheme, example: ColorScheme.DEFAULT })
  colorScheme?: ColorScheme;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({ example: { primary: '#007bff', secondary: '#6c757d' } })
  customColors?: Record<string, string>;
}

export class ThemeResponseDto {
  @ApiProperty({ enum: ThemeOption, example: ThemeOption.DARK })
  theme: ThemeOption;

  @ApiPropertyOptional({ enum: ColorScheme, example: ColorScheme.DEFAULT })
  colorScheme?: ColorScheme;

  @ApiPropertyOptional({ example: { primary: '#007bff', secondary: '#6c757d' } })
  customColors?: Record<string, string>;

  @ApiProperty()
  updatedAt: Date;
}
