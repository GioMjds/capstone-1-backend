import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class SetLayoutPreferencesDto {
  @IsString()
  @ApiProperty({ example: 'default' })
  sidebarPosition: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  sidebarCollapsed?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  compactMode?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'auto' })
  contentWidth?: string;
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
