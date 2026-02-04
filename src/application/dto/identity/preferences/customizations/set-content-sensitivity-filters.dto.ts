import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class SetContentSensitivityFiltersDto {
  @IsArray()
  @ApiProperty({
    example: ['violence', 'adult_content', 'spoilers'],
  })
  filters: string[];

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  strictness?: string;
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
