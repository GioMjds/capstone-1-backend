import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export enum SidebarPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum ContentWidth {
  NARROW = 'narrow',
  NORMAL = 'normal',
  WIDE = 'wide',
  FULL = 'full',
}

export class SetLayoutPreferencesDto {
  @IsEnum(SidebarPosition)
  @IsOptional()
  @ApiPropertyOptional({ enum: SidebarPosition, example: SidebarPosition.LEFT })
  sidebarPosition?: SidebarPosition;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  sidebarCollapsed?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  compactMode?: boolean;

  @IsEnum(ContentWidth)
  @IsOptional()
  @ApiPropertyOptional({ enum: ContentWidth, example: ContentWidth.NORMAL })
  contentWidth?: ContentWidth;
}

export class LayoutPreferencesResponseDto {
  @ApiProperty({ enum: SidebarPosition, example: SidebarPosition.LEFT })
  sidebarPosition: SidebarPosition;

  @ApiProperty({ example: false })
  sidebarCollapsed: boolean;

  @ApiProperty({ example: false })
  compactMode: boolean;

  @ApiProperty({ enum: ContentWidth, example: ContentWidth.NORMAL })
  contentWidth: ContentWidth;

  @ApiProperty()
  updatedAt: Date;
}
