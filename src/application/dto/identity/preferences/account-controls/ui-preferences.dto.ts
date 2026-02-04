import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUiPreferencesDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'dark' })
  theme?: string;

  @IsString()
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
  @ApiProperty({ example: 'dark' })
  theme: string;

  @ApiProperty({ example: 'en' })
  language: string;

  @ApiPropertyOptional({ example: 'America/New_York' })
  timezone?: string;

  @ApiPropertyOptional({ example: 'en-US' })
  locale?: string;
}
