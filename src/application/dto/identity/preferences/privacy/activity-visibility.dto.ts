import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateActivityVisibilityDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  showRecentActivity?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  showLoginHistory?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  showLastSeen?: boolean;
}

export class ActivityVisibilityResponseDto {
  @ApiProperty({ example: true })
  showRecentActivity: boolean;

  @ApiProperty({ example: false })
  showLoginHistory: boolean;

  @ApiProperty({ example: true })
  showLastSeen: boolean;

  @ApiProperty()
  updatedAt: Date;
}
