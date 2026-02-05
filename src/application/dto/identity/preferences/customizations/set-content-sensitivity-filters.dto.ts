import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export enum SensitivityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class SetContentSensitivityFiltersDto {
  @IsEnum(SensitivityLevel)
  @IsOptional()
  @ApiPropertyOptional({ enum: SensitivityLevel, example: SensitivityLevel.MEDIUM })
  sensitivityLevel?: SensitivityLevel;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ example: ['violence', 'adult_content'] })
  blockedCategories?: string[];

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  safeSearchEnabled?: boolean;
}

export class ContentSensitivityFiltersResponseDto {
  @ApiProperty({ enum: SensitivityLevel, example: SensitivityLevel.MEDIUM })
  sensitivityLevel: SensitivityLevel;

  @ApiPropertyOptional({ example: ['violence', 'adult_content'] })
  blockedCategories?: string[];

  @ApiProperty({ example: true })
  safeSearchEnabled: boolean;

  @ApiProperty()
  updatedAt: Date;
}
