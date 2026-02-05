import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsEnum, ArrayMinSize } from 'class-validator';

export enum ContentSensitivityFilter {
  VIOLENCE = 'violence',
  ADULT_CONTENT = 'adult_content',
  SPOILERS = 'spoilers',
  GRAPHIC_CONTENT = 'graphic_content',
}

export enum StrictnessLevel {
  STRICT = 'strict',
  MODERATE = 'moderate',
  PERMISSIVE = 'permissive',
}

export class SetContentSensitivityFiltersDto {
  @IsArray()
  @ArrayMinSize(0)
  @IsEnum(ContentSensitivityFilter, { each: true })
  @ApiProperty({
    enum: ContentSensitivityFilter,
    example: ['violence', 'adult_content'],
    isArray: true,
  })
  filters: ContentSensitivityFilter[];

  @IsEnum(StrictnessLevel)
  @IsOptional()
  @ApiPropertyOptional({ enum: StrictnessLevel, example: StrictnessLevel.MODERATE })
  strictness?: StrictnessLevel;
}

export class SetContentSensitivityFiltersResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  filters: string[];

  @ApiProperty()
  strictness: string;

  @ApiProperty()
  updatedAt: Date;
}
