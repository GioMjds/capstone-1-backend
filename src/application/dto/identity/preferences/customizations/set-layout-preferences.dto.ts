import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional } from 'class-validator';

export class SetLayoutPreferencesDto {
  @IsString()
  @ApiProperty()
  layout: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  sidebarPosition?: string;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional()
  compactMode?: boolean;
}

export class SetLayoutPreferencesResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  layout: string;

  @ApiProperty()
  preferences: Record<string, any>;

  @ApiProperty()
  updatedAt: Date;
}
