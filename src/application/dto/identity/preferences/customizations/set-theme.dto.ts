import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class SetThemeDto {
  @IsString()
  @ApiProperty({ example: 'dark' })
  theme: string;

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
